import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/storage';
import { DivinationResult } from '../types';
import { tarotDeck } from '../constants';
import { Calendar, ChevronRight } from 'lucide-react';

const Journal: React.FC = () => {
  const [history, setHistory] = useState<DivinationResult[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DivinationResult | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif text-mystic-gold mb-8">占卜日记</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* List */}
        <div className="md:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 && <p className="text-slate-500">暂无记录</p>}
            {history.map(entry => (
                <div 
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 rounded-xl border cursor-pointer transition
                        ${selectedEntry?.id === entry.id 
                            ? 'bg-mystic-800 border-mystic-500' 
                            : 'bg-mystic-900 border-mystic-800 hover:border-mystic-600'}
                    `}
                >
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar size={12}/>
                        {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <h3 className="font-bold text-white line-clamp-2 text-sm">{entry.question}</h3>
                </div>
            ))}
        </div>

        {/* Detail */}
        <div className="md:col-span-2">
            {selectedEntry ? (
                <div className="bg-mystic-800 rounded-2xl p-6 border border-mystic-700 animate-flip-in">
                    <div className="border-b border-mystic-700 pb-4 mb-6">
                        <span className="text-xs bg-mystic-600 text-white px-2 py-1 rounded mb-2 inline-block">
                             {new Date(selectedEntry.date).toLocaleString()}
                        </span>
                        <h2 className="text-xl font-bold text-white">{selectedEntry.question}</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {selectedEntry.cards.map((draw, i) => {
                             const card = tarotDeck.find(c => c.id === draw.cardId);
                             return (
                                 <div key={i} className="bg-mystic-900 p-3 rounded text-center">
                                     <div className="text-xs text-mystic-400 mb-1">位置 {draw.positionId}</div>
                                     <div className="font-serif text-white font-bold text-sm mb-1">{card?.nameCn}</div>
                                     <div className={`text-xs ${draw.isReversed ? 'text-red-400' : 'text-green-400'}`}>
                                         {draw.isReversed ? '逆位' : '正位'}
                                     </div>
                                 </div>
                             )
                        })}
                    </div>

                    {selectedEntry.aiInterpretation && (
                         <div className="bg-mystic-900/50 p-4 rounded-lg border border-mystic-800">
                             <h4 className="text-sm font-bold text-mystic-gold mb-2">AI 解读记录</h4>
                             <p className="text-sm text-slate-300 whitespace-pre-wrap">{selectedEntry.aiInterpretation}</p>
                         </div>
                    )}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-mystic-800 rounded-2xl min-h-[300px]">
                    <ChevronRight className="mb-2" />
                    <p>选择左侧记录查看详情</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Journal;