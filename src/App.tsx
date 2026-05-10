/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Trophy, Users2, LayoutGrid, Info } from 'lucide-react';
import NameSource from './components/NameSource';
import LuckyDraw from './components/LuckyDraw';
import Grouping from './components/Grouping';
import { Person, View } from './types';

export default function App() {
  const [names, setNames] = useState<Person[]>([]);
  const [activeView, setActiveView] = useState<View>('lucky-draw');

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <LayoutGrid className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-gray-900">HR Pro Toolkit</h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">Smart HR Assistant</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 mr-2">
              <div className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                <span>目前清單人數: </span>
                <span className="font-mono text-blue-600 font-bold">{names.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        
        {/* Source Section */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">1. 設定名單來源</h2>
            <p className="text-gray-500 text-sm">輸入姓名或上傳 CSV 檔案來建立名單</p>
          </div>
          <NameSource onNamesChange={setNames} people={names} />
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full" />

        {/* Operations Section */}
        <section className="space-y-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">2. 選擇功能</h2>
            <p className="text-gray-500 text-sm">點擊下方切換抽籤或分組功能</p>
          </div>

          <div className="flex items-center p-1 bg-gray-200 rounded-2xl w-fit">
            <button
              onClick={() => setActiveView('lucky-draw')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'lucky-draw'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              獎品抽籤
            </button>
            <button
              onClick={() => setActiveView('grouping')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'grouping'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users2 className="w-4 h-4" />
              自動分組
            </button>
          </div>

          <div className="relative">
            {names.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                <div className="p-4 bg-gray-50 rounded-full">
                  <LayoutGrid className="w-8 h-8 opacity-20" />
                </div>
                <p>請先在上方輸入或上傳名單，才能開始進行抽籤或分組</p>
              </div>
            ) : (
              activeView === 'lucky-draw' ? (
                <LuckyDraw names={names} />
              ) : (
                <Grouping names={names} />
              )
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
          HR Pro Toolkit • Built with Purpose
        </p>
      </footer>
    </div>
  );
}
