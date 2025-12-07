import React, { useEffect, useState, useRef } from 'react';
import { getHistory, exportData, importData, deleteHistoryItem } from '../services/storage';
import { DivinationResult } from '../types';
import { tarotDeck } from '../constants';
import { Calendar, ChevronRight, Download, Upload, FileText, Trash2 } from 'lucide-react';

const Journal: React.FC = () => {
  const [history, setHistory] = useState<DivinationResult[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DivinationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
      setHistory(getHistory());
  };

  const handleDelete = (id: string) => {
      if (window.confirm("确定要删除这条占卜记录吗？此操作无法撤销。")) {
          deleteHistoryItem(id);
          refreshData();
          if (selectedEntry?.id === id) {
              setSelectedEntry(null);
          }
      }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (window.confirm("⚠️ 导入数据将覆盖当前的记录和笔记，确定要继续吗？")) {
          try {
              await importData(file);
              alert("✅ 数据导入成功！");
              refreshData();
          } catch (error) {
              alert("❌ 导入失败，文件格式可能不正确。");
          }
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-serif text-mystic-gold">占卜日记</h1>
          
          <div className="flex gap-3">
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-mystic-800 border border-mystic-600 rounded-lg text-sm hover:bg-mystic-700 transition text-slate-200"
                title="导出数据备份"
              >
                  <Download size={16} /> 备份数据
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-mystic-800 border border-mystic-600 rounded-lg text-sm hover:bg-mystic-700 transition text-slate-200"
                title="导入数据恢复"
              >
                  <Upload size={16} /> 导入恢复
              </button>
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImport}
              />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* List */}
        <div className="md:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 && (
                <div className="text-center py-10 text-slate-500 border-2 border-dashed border-mystic-800 rounded-xl">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>暂无记录</p>
                </div>
            )}
            {history.map(entry => (
                <div 
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 rounded-xl border cursor-pointer transition group relative
                        ${selectedEntry?.id === entry.id 
                            ? 'bg-mystic-800 border-mystic-500 shadow-lg' 
                            : 'bg-mystic-900 border-mystic-800 hover:border-mystic-600'}
                    `}
                >
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar size={12}/>
                        {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <h3 className={`font-bold line-clamp-2 text-sm ${selectedEntry?.id === entry.id ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {entry.question}
                    </h3>
                </div>
            ))}
        </div>

        {/* Detail */}
        <div className="md:col-span-2">
            {selectedEntry ? (
                <div className="bg-mystic-800/80 backdrop-blur-sm rounded-2xl p-6 border border-mystic-600 shadow-2xl animate-flip-in relative">
                    
                    {/* Delete Button */}
                    <button 
                        onClick={() => handleDelete(selectedEntry.id)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-400 transition hover:bg-mystic-900 rounded-lg"
                        title="删除此记录"
                    >
                        <Trash2 size={20} />
                    </button>

                    <div className="border-b border-mystic-700 pb-4 mb-6 pr-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs bg-mystic-600 text-white px-2 py-1 rounded inline-block">
                                {new Date(selectedEntry.date).toLocaleString()}
                            </span>
                            <span className="text-xs text-mystic-400 font-serif">ID: {selectedEntry.id.slice(-6)}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white leading-relaxed">{selectedEntry.question}</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {selectedEntry.cards.map((draw, i) => {
                             const card = tarotDeck.find(c => c.id === draw.cardId);
                             return (
                                 <div key={i} className="bg-mystic-900/50 p-3 rounded-lg border border-mystic-700/50 text-center">
                                     <div className="text-xs text-mystic-400 mb-1 uppercase tracking-wider">位置 {draw.positionId}</div>
                                     <div className="font-serif text-white font-bold text-sm mb-1">{card?.nameCn}</div>
                                     <div className={`text-xs font-bold ${draw.isReversed ? 'text-red-400' : 'text-green-400'}`}>
                                         {draw.isReversed ? '逆位' : '正位'}
                                     </div>
                                 </div>
                             )
                        })}
                    </div>

                    {selectedEntry.aiInterpretation ? (
                         <div className="bg-mystic-900/80 p-5 rounded-xl border border-mystic-700">
                             <h4 className="text-sm font-bold text-mystic-gold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-mystic-gold"></span> AI 解读记录
                             </h4>
                             <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                 {selectedEntry.aiInterpretation}
                             </p>
                         </div>
                    ) : (
                        <div className="p-4 rounded-lg bg-mystic-900/30 text-center text-slate-500 text-sm border border-dashed border-mystic-800">
                            本次占卜未生成 AI 解读
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-mystic-800 rounded-2xl min-h-[400px] bg-mystic-900/20">
                    <ChevronRight className="mb-4 w-8 h-8 opacity-50" />
                    <p>点击左侧列表查看详细记录</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Journal;