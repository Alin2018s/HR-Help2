import { useState } from 'react';
import { Users, Users2, Shuffle, Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import { Person } from '../types';

interface GroupingProps {
  names: Person[];
}

export default function Grouping({ names }: GroupingProps) {
  const [groupSize, setGroupSize] = useState(3);
  const [groups, setGroups] = useState<Person[][]>([]);
  const [isGrouping, setIsGrouping] = useState(false);

  const performGrouping = () => {
    if (names.length === 0) return;
    setIsGrouping(true);

    setTimeout(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      const result: Person[][] = [];
      
      for (let i = 0; i < shuffled.length; i += groupSize) {
        result.push(shuffled.slice(i, i + groupSize));
      }

      setGroups(result);
      setIsGrouping(false);
    }, 600);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    const csvData: any[] = [];
    groups.forEach((group, idx) => {
      group.forEach(person => {
        csvData.push({
          'Group Number': idx + 1,
          'Name': person.name
        });
      });
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hr-grouping-result-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">自動分組</h2>
              <p className="text-sm text-gray-500">根據人數自動將名單分組</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">每組人數</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{groupSize}</span>
                <button 
                  onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">預計組數</span>
              <span className="font-mono text-indigo-600 font-bold">{Math.ceil(names.length / groupSize) || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={performGrouping}
            disabled={names.length === 0 || isGrouping}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all ${
              names.length === 0 || isGrouping
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99]'
            }`}
            id="start-grouping-button"
          >
            <Shuffle className={`w-5 h-5 ${isGrouping ? 'animate-spin' : ''}`} />
            {isGrouping ? '計算分組中...' : '隨機分組'}
          </button>

          {groups.length > 0 && (
            <button
              onClick={downloadCSV}
              className="px-6 py-4 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all font-semibold flex items-center gap-2"
              id="download-grouping-csv"
            >
              <FileSpreadsheet className="w-5 h-5" />
              下載結果
            </button>
          )}
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-700">
          {groups.map((group, groupIdx) => (
            <motion.div
              key={`group-${groupIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="bg-gray-50 px-4 py-3 border-bottom border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Group #{groupIdx + 1}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-400 font-mono">
                  {group.length} 人
                </span>
              </div>
              <div className="p-4 space-y-2">
                {group.map((person, personIdx) => (
                  <div 
                    key={person.id}
                    className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-indigo-50/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                      {personIdx + 1}
                    </div>
                    {person.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {groups.length === 0 && names.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl">
          <Users className="w-16 h-16 opacity-10 mb-4" />
          <p>準備就緒，點擊按鈕開始分組</p>
        </div>
      )}
    </div>
  );
}
