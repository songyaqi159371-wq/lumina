import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Book, Star, Activity, RefreshCcw, Save, CheckCircle, Copy, Sparkle } from 'lucide-react';
import { getProgress, saveProgress, getBackupString, restoreFromBackupString } from '../services/storage';
import { tarotDeck } from '../constants';
import CardFlip from '../components/CardFlip';
import { UserProgress } from '../types';

const Home: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Backup Modal State
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupString, setBackupString] = useState('');
  const [restoreInput, setRestoreInput] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle'|'copied'>('idle');

  useEffect(() => {
    const data = getProgress();
    const today = new Date().toISOString().split('T')[0];
    if (data.dailyDraw.date !== today) {
        setIsRevealed(false);
    } else {
        setIsRevealed(true);
    }
    setProgress(data);
  }, []);

  const handleDailyDraw = () => {
    if (!progress) return;
    const today = new Date().toISOString().split('T')[0];
    if (progress.dailyDraw.date === today && progress.dailyDraw.cardId !== null) {
        setIsRevealed(true);
        return;
    }
    const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    const isReversed = Math.random() > 0.5;
    const newProgress = {
        ...progress,
        dailyDraw: {
            date: today,
            cardId: randomCard.id,
            isReversed,
            note: ''
        },
        learnedCards: Array.from(new Set([...progress.learnedCards, randomCard.id]))
    };
    saveProgress(newProgress);
    setProgress(newProgress);
    setTimeout(() => setIsRevealed(true), 100);
  };

  const openBackupModal = () => {
      setBackupString(getBackupString());
      setRestoreInput('');
      setShowBackupModal(true);
      setCopyStatus('idle');
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(backupString);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleRestore = () => {
      if (!restoreInput.trim()) return;
      if (window.confirm("⚠️ 恢复数据将覆盖当前进度，确定继续吗？")) {
          if (restoreFromBackupString(restoreInput)) {
              alert("✅ 数据已恢复！");
              window.location.reload();
          } else {
              alert("❌ 无效的备份代码。");
          }
      }
  };

  if (!progress) return <div>Loading...</div>;

  const dailyCard = progress.dailyDraw.cardId !== null 
    ? tarotDeck.find(c => c.id === progress.dailyDraw.cardId) 
    : null;
  const learnedCount = progress.learnedCards.length;
  const totalCards = tarotDeck.length;
  const percent = Math.round((learnedCount / totalCards) * 100);

  return (
    <div className="space-y-8 animate-flip-in pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
            <h1 className="text-3xl lg:text-4xl font-serif text-mystic-100 mb-2">欢迎回来, 探索者</h1>
            <p className="text-slate-400">今天的宇宙有什么启示给你？</p>
        </div>
        <button 
            onClick={openBackupModal}
            className="flex items-center gap-2 px-4 py-2 bg-mystic-800 border border-mystic-600 rounded-lg text-sm hover:from-mystic-700 transition text-mystic-gold font-bold shadow-lg"
        >
            <RefreshCcw size={16} /> 数据同步 / 备份
        </button>
      </header>

      {showBackupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowBackupModal(false)}>
              <div className="bg-mystic-900 border border-mystic-600 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <Save size={20} className="text-mystic-gold"/> 数据同步中心
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">防止更新导致数据丢失，请定期备份同步码。</p>
                  
                  <div className="mb-6 bg-mystic-800/50 p-4 rounded-xl border border-mystic-700">
                      <label className="block text-xs text-green-400 uppercase font-bold mb-2">1. 导出备份码</label>
                      <div className="flex gap-2">
                          <input readOnly value={backupString} className="flex-1 bg-black/50 border border-mystic-700 rounded-lg px-3 py-2 text-xs text-slate-300 truncate focus:outline-none" />
                          <button onClick={copyToClipboard} className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${copyStatus === 'copied' ? 'bg-green-600' : 'bg-mystic-600'}`}>
                              {copyStatus === 'copied' ? <CheckCircle size={14}/> : <Copy size={14}/>}
                              {copyStatus === 'copied' ? '已复制' : '复制'}
                          </button>
                      </div>
                  </div>

                  <div className="mb-6 bg-mystic-800/50 p-4 rounded-xl border border-mystic-700">
                       <label className="block text-xs text-blue-400 uppercase font-bold mb-2">2. 填入代码恢复</label>
                       <div className="flex gap-2">
                           <input value={restoreInput} onChange={(e) => setRestoreInput(e.target.value)} placeholder="粘贴备份码..." className="flex-1 bg-black/50 border border-mystic-700 rounded-lg px-3 py-2 text-xs text-white" />
                           <button onClick={handleRestore} disabled={!restoreInput} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">恢复</button>
                       </div>
                  </div>
                  <div className="text-right"><button onClick={() => setShowBackupModal(false)} className="text-slate-400 text-sm">关闭</button></div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-mystic-800/50 p-6 rounded-2xl border border-mystic-700 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-mystic-gold flex items-center gap-2">
                    <Star className="w-5 h-5" /> 每日一卡
                </h2>
                <span className="text-sm text-slate-400">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <CardFlip card={dailyCard || null} isReversed={progress.dailyDraw.isReversed} isRevealed={isRevealed} onClick={handleDailyDraw} />
                {isRevealed && dailyCard && (
                    <div className="flex-1 space-y-4 animate-flip-in">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{dailyCard.nameCn} <span className="text-sm font-normal text-slate-400">({progress.dailyDraw.isReversed ? '逆位' : '正位'})</span></h3>
                            <p className="text-mystic-400 text-sm font-serif italic">{dailyCard.nameEn}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">{dailyCard.keywords.map(k => (<span key={k} className="px-2 py-1 bg-mystic-700 rounded text-xs text-mystic-100">{k}</span>))}</div>
                        <p className="text-slate-300 leading-relaxed text-sm">{progress.dailyDraw.isReversed ? dailyCard.meaningDown : dailyCard.meaningUp}</p>
                        <div className="pt-4 border-t border-mystic-700">
                             <Link to={`/learn?id=${dailyCard.id}`} className="text-mystic-gold text-sm hover:underline flex items-center gap-1">查看详细图鉴 <Sparkle size={12}/></Link>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-mystic-800/50 p-6 rounded-2xl border border-mystic-700">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-green-400" /> 学习进度</h2>
                <div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">已收集牌灵</span><span className="text-white font-bold">{learnedCount} / {totalCards}</span></div>
                <div className="w-full bg-mystic-900 rounded-full h-2.5 mb-4"><div className="bg-mystic-500 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div></div>
                <Link to="/learn" className="block w-full text-center py-2 rounded-lg bg-mystic-700 hover:bg-mystic-600 transition text-sm">卡牌馆</Link>
            </div>
            
            <Link to="/symbols" className="block p-6 rounded-2xl border border-mystic-700 bg-gradient-to-br from-indigo-900/50 to-mystic-900 hover:border-mystic-gold transition group">
                <div className="flex items-center gap-3 mb-2 text-mystic-gold">
                    <Sparkle size={24} className="group-hover:rotate-45 transition-transform" />
                    <h3 className="font-bold text-lg">象征图鉴</h3>
                </div>
                <p className="text-sm text-slate-400">探索书籍中皇冠、柱子与玫瑰的深层奥秘。</p>
            </Link>

            <div className="grid grid-cols-2 gap-4">
                <Link to="/divination" className="bg-mystic-800 p-4 rounded-xl border border-mystic-700 hover:border-mystic-500 transition"><Play className="w-5 h-5 text-mystic-gold mb-2" /><h3 className="font-bold text-white text-sm">开始占卜</h3></Link>
                <Link to="/practice" className="bg-mystic-800 p-4 rounded-xl border border-mystic-700 hover:border-mystic-500 transition"><Book className="w-5 h-5 text-blue-400 mb-2" /><h3 className="font-bold text-white text-sm">记忆练习</h3></Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;