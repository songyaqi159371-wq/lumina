import React from 'react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface MobileInputQuestionProps {
  selectedSpread: { name: string; description: string };
  question: string;
  setQuestion: (q: string) => void;
  handleStartDrawing: () => void;
  onBack: () => void;
}

const MobileInputQuestion: React.FC<MobileInputQuestionProps> = ({
  selectedSpread,
  question,
  setQuestion,
  handleStartDrawing,
  onBack,
}) => {
  const isValid = question.trim().length >= 1;

  return (
    <div className="animate-flip-in flex flex-col h-full px-4 py-6 pb-safe">
      {/* 标题区 - 更紧凑 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-mystic-gold/10 border border-mystic-gold/30 rounded-full mb-3">
          <Sparkles size={14} className="text-mystic-gold" />
          <span className="text-xs text-mystic-gold font-serif uppercase tracking-wider">
            {selectedSpread.name}
          </span>
        </div>
        <h1 className="text-2xl font-serif text-white mb-2">
          你想问什么？
        </h1>
        <p className="text-slate-500 text-sm italic">
          请专注于一个具体的问题
        </p>
      </div>

      {/* 问题输入区 - 自适应高度 */}
      <div className="flex-1 mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="在此输入你的问题...&#10;&#10;例如：&#10;• 我应该接受这份新工作吗？&#10;• 我和TA的关系会如何发展？&#10;• 未来三个月我的财务状况？"
          className="w-full h-full min-h-[240px] bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-mystic-gold/50 focus:bg-white/[0.04] transition-all resize-none text-base leading-relaxed touch-manipulation"
          style={{ fontFamily: 'inherit' }}
          maxLength={300}
        />
        <div className="text-right mt-2 text-xs text-slate-600">
          {question.length}/300
        </div>
      </div>

      {/* 提示文字 - 精简 */}
      <div className="mb-4 px-4 py-3 bg-mystic-gold/5 border border-mystic-gold/20 rounded-2xl">
        <p className="text-slate-400 text-xs leading-relaxed">
          💡 <span className="text-mystic-gold">提示：</span>问题越具体，解读越清晰。尝试"如何"、"为什么"类开放性问题。
        </p>
      </div>

      {/* 底部按钮 - 优化触控 */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">返回</span>
        </button>
        <button
          onClick={handleStartDrawing}
          disabled={!isValid}
          className="flex-1 bg-mystic-gold hover:bg-mystic-gold/90 disabled:bg-slate-800 disabled:text-slate-600 text-mystic-950 font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-base disabled:cursor-not-allowed active:scale-98 touch-manipulation shadow-lg shadow-mystic-gold/20 disabled:shadow-none"
        >
          <span>开始抽牌</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default MobileInputQuestion;
