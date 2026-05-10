import { useState, useCallback, useMemo } from 'react';
import { Upload, X, ClipboardList, Beaker, AlertCircle, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { Person } from '../types';

interface NameSourceProps {
  onNamesChange: (names: Person[]) => void;
  people: Person[];
}

const MOCK_NAMES = `王大明
李美玲
張小華
林俊傑
陳雅婷
黃小中
周杰倫
蔡依林
郭大力
蕭小敬
林志玲
金城武
梁朝偉
劉德華
張曼玉
舒淇
彭于晏
桂綸鎂
張孝全
許光漢`;

export default function NameSource({ onNamesChange, people }: NameSourceProps) {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const processText = (text: string) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    const peopleData = lines.map((name, index) => ({
      id: `manual-${index}-${Date.now()}`,
      name
    }));
    onNamesChange(peopleData);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    processText(text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    Papa.parse(file, {
      complete: (results) => {
        const names: string[] = [];
        results.data.forEach((row: any) => {
          const values = Object.values(row);
          const name = values.find(v => typeof v === 'string' && v.trim() !== '');
          if (name) names.push(String(name).trim());
        });

        const peopleData = names.map((name, index) => ({
          id: `csv-${index}-${Date.now()}`,
          name
        }));
        onNamesChange(peopleData);
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const loadMockData = () => {
    setInputText(MOCK_NAMES);
    processText(MOCK_NAMES);
  };

  const clearFile = () => {
    setFileName(null);
    processText(inputText);
  };

  // Duplicate detection logic
  const duplicates = useMemo(() => {
    const nameCounts: Record<string, number> = {};
    people.forEach(p => {
      nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
    });
    return Object.keys(nameCounts).filter(name => nameCounts[name] > 1);
  }, [people]);

  const removeDuplicates = () => {
    const uniqueNames = new Set<string>();
    const filteredPeople: Person[] = [];
    
    people.forEach(p => {
      if (!uniqueNames.has(p.name)) {
        uniqueNames.add(p.name);
        filteredPeople.push(p);
      }
    });

    onNamesChange(filteredPeople);
    
    // Update textarea if that's where names came from
    const newText = filteredPeople.map(p => p.name).join('\n');
    setInputText(newText);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={loadMockData}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <Beaker className="w-4 h-4" />
            載入模擬名單
          </button>
        </div>

        {duplicates.length > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
              <AlertCircle className="w-3.5 h-3.5" />
              發現 {duplicates.length} 個重複姓名
            </div>
            <button
              onClick={removeDuplicates}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              一鍵移除重複
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            貼上姓名 (每行一個)
          </label>
          <textarea
            className="w-full h-40 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white font-sans"
            placeholder="王小明&#10;李小華&#10;張大同"
            value={inputText}
            onChange={handleTextChange}
            id="name-input-textarea"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            上傳 CSV 檔案
          </label>
          <div 
            className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative group"
            id="csv-upload-dropzone"
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 truncate max-w-[150px]">
                    {fileName}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-blue-600">
                  點擊或拖放 CSV 檔案
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
