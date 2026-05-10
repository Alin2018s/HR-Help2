import { useState, useRef, useEffect } from 'react';
import { Trophy, RefreshCcw, Settings, Play, CheckCircle2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Person } from '../types';

interface LuckyDrawProps {
  names: Person[];
}

export default function LuckyDraw({ names }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [drawnIds, setDrawnIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<Person[]>([]);
  
  const timerRef = useRef<number | null>(null);

  const availableNames = allowRepeat 
    ? names 
    : names.filter(p => !drawnIds.has(p.id));

  const startDraw = () => {
    if (availableNames.length === 0) return;
    
    setIsDrawing(true);
    setWinner(null);

    let startTime = Date.now();
    const duration = 2000; // 2 seconds spin

    const tick = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < duration) {
        setCurrentIndex(Math.floor(Math.random() * availableNames.length));
        timerRef.current = requestAnimationFrame(tick);
      } else {
        const finalIndex = Math.floor(Math.random() * availableNames.length);
        const selected = availableNames[finalIndex];
        finishDraw(selected);
      }
    };

    tick();
  };

  const finishDraw = (selected: Person) => {
    setIsDrawing(false);
    setWinner(selected);
    setDrawnIds(prev => new Set([...prev, selected.id]));
    setHistory(prev => [selected, ...prev]);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE']
    });
  };

  const reset = () => {
    setWinner(null);
    setDrawnIds(new Set());
    setHistory([]);
    setIsDrawing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Control Panel */}
        <div className="flex-1 w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">獎品抽籤</h2>
                <p className="text-sm text-gray-500">從目前清單中隨機抽取一位幸運兒</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allowRepeat}
                  onChange={(e) => setAllowRepeat(e.target.checked)}
                />
                <span className="text-xs font-medium text-gray-600">可重複中獎</span>
              </label>
              <div className="w-px h-4 bg-gray-200" />
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                剩餘抽取: {availableNames.length}
              </span>
            </div>
          </div>

          <div className="relative h-64 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="text-4xl md:text-6xl font-bold text-blue-600 tracking-tight"
                >
                  {availableNames[currentIndex]?.name}
                </motion.div>
              ) : winner ? (
                <motion.div
                  key="winner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <span className="text-sm font-semibold text-blue-500 uppercase tracking-[0.2em]">中獎者</span>
                  <span className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter">
                    {winner.name}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-300 text-lg flex flex-col items-center gap-2"
                >
                  <Play className="w-12 h-12 opacity-20" />
                  <span>準備就緒，點擊開始抽獎</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startDraw}
              disabled={isDrawing || availableNames.length === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all ${
                isDrawing || availableNames.length === 0
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
              }`}
              id="start-draw-button"
            >
              <RefreshCcw className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
              {isDrawing ? '抽籤中...' : '開始抽籤'}
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-4 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all font-medium"
              id="reset-draw-button"
            >
              清除紀錄
            </button>
          </div>
        </div>

        {/* History Panel */}
        <div className="w-full md:w-64 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              中獎紀錄 ({history.length})
            </h3>
            {history.length > 0 && (
              <button 
                onClick={() => {
                  const csvData = history.map((p, i) => ({
                    '抽獎序號': history.length - i,
                    '姓名': p.name
                  }));
                  const csv = Papa.unparse(csvData);
                  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `抽獎紀錄_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  setTimeout(() => URL.revokeObjectURL(url), 100);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="下載紀錄"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {history.length > 0 ? (
              history.map((person, idx) => (
                <motion.div
                  key={`${person.id}-${history.length - idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-between"
                >
                  <span>{person.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">#{history.length - idx}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-xs text-gray-400 italic text-center py-8">
                尚無中獎紀錄
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
