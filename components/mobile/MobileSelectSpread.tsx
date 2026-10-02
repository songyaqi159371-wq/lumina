import React from 'react';
import { Spread } from '../types';
import { Layers, ShieldAlert, ChevronDown } from 'lucide-react';

interface MobileSelectSpreadProps {
  spreads: Spread[];
  isProtocolsOpen: boolean;
  setIsProtocolsOpen: (open: boolean) => void;
  handleSpreadSelect: (spread: Spread) => void;
}

const MobileSelectSpread: React.FC<MobileSelectSpreadProps> = ({
  spreads,
  isProtocolsOpen,
  setIsProtocolsOpen,
  handleSpreadSelect,
}) => {
  return (
    <div className="animate-flip-in pb-safe space-y-6">
      {/* 标题区 - 更简洁 */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-2xl font-serif text-white mb-2 tracking-wide">
          选择神圣牌阵
        </h1>
        <p className="text-slate-500 text-sm italic">
          开启与潜意识的对话
        </p>
      </div>

      {/* 禁忌须知 - 保持紧凑 */}
      <div className="px-4">
        <button
          onClick={() => setIsProtocolsOpen(!isProtocolsOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl transition-all active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={16} className={`${isProtocolsOpen ? 'text-mystic-gold' : 'text-slate-500'}`} />
            <span className="text-sm text-slate-300 font-serif">
              🔮 占卜禁忌与须知
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform duration-300 ${isProtocolsOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* 展开的禁忌内容 - 完整版 */}
        <div className={`overflow-hidden transition-all duration-300 ${isProtocolsOpen ? 'max-h-[70vh] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="bg-mystic-950/60 border border-white/5 rounded-2xl overflow-y-auto max-h-[70vh]">
            <div className="p-5 space-y-6">
              {/* 一、占卜过程中的禁忌 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-mystic-gold border-l-2 border-mystic-gold/60 pl-3">
                  <span className="text-xs font-serif font-bold uppercase tracking-wider">
                    一、占卜过程中的禁忌
                  </span>
                </div>
                <div className="space-y-2.5 pl-5 text-xs text-slate-300 leading-relaxed">
                  <p><span className="text-mystic-gold">1. 不可重复占卜相同问题</span><br/>
                  24小时内不可重复占卜完全相同的问题；同一问题建议间隔1-3个月再次占卜。</p>
                  <p><span className="text-mystic-gold">2. 一次只问一个问题</span><br/>
                  不可在一次洗牌中询问多个问题。如有第二个问题，必须重新洗牌。</p>
                  <p><span className="text-mystic-gold">3. 占卜的时间限制</span><br/>
                  塔罗牌最多只能占卜未来12个月的事。短期预测最为准确。</p>
                </div>
              </section>

              {/* 二、不能问的问题类型 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-red-400 border-l-2 border-red-500/60 pl-3">
                  <span className="text-xs font-serif font-bold uppercase tracking-wider">
                    二、不能问的问题类型
                  </span>
                </div>
                <div className="space-y-2.5 pl-5 text-xs text-slate-300 leading-relaxed">
                  <p><span className="text-red-400">1. 健康与生死</span><br/>
                  严禁询问具体的疾病诊断及寿命终点。</p>
                  <p><span className="text-red-400">2. 偏财与博彩</span><br/>
                  不可询问彩票中奖、赌博或高度投机性的偏财运势。</p>
                  <p><span className="text-red-400">3. 法律与道德</span><br/>
                  严禁询问任何违反法律、危害他人或违背道德伦理的问题。</p>
                </div>
              </section>

              {/* 三、占卜环境要求 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 border-l-2 border-indigo-500/60 pl-3">
                  <span className="text-xs font-serif font-bold uppercase tracking-wider">
                    三、占卜环境要求
                  </span>
                </div>
                <div className="space-y-2.5 pl-5 text-xs text-slate-300 leading-relaxed">
                  <p><span className="text-indigo-400">1. 安静舒适的空间</span><br/>
                  避免吵杂环境，选择一个能让你感到安全且不被打扰的私人空间。</p>
                  <p><span className="text-indigo-400">2. 良好的精神状态</span><br/>
                  不要在情绪极端不稳定、精神疲惫或醉酒的状态下开启占卜。</p>
                </div>
              </section>

              {/* 四、使用注意事项 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 border-l-2 border-emerald-500/60 pl-3">
                  <span className="text-xs font-serif font-bold uppercase tracking-wider">
                    四、使用注意事项
                  </span>
                </div>
                <div className="space-y-2.5 pl-5 text-xs text-slate-300 leading-relaxed">
                  <p><span className="text-emerald-400">1. 不要过度依赖</span><br/>
                  塔罗牌是引路工具，不是唯一决策依据。请始终保留你的自主行动力和理性判断力。</p>
                  <p><span className="text-emerald-400">2. 保持尊重与诚实</span><br/>
                  不要占卜纯粹出于戏谑、挑战或无聊的问题。</p>
                </div>
              </section>
            </div>

            <div className="px-5 py-3 border-t border-white/5 bg-black/40 sticky bottom-0">
              <button
                onClick={() => setIsProtocolsOpen(false)}
                className="text-xs text-mystic-gold hover:text-white transition w-full text-center py-1 touch-manipulation"
              >
                收起占卜守则 ↑
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 牌阵列表 - 优化触控反馈 */}
      <div className="px-4 space-y-3 pb-6">
        {spreads.map((spread) => (
          <button
            key={spread.id}
            onClick={() => handleSpreadSelect(spread)}
            className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl cursor-pointer hover:bg-white/[0.05] hover:border-mystic-gold/30 transition-all active:scale-[0.98] active:bg-mystic-gold/5 touch-manipulation text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-mystic-900 rounded-xl border border-white/5 flex-shrink-0">
                  <Layers className="text-mystic-gold w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-white">
                  {spread.name}
                </h3>
              </div>
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 font-serif uppercase tracking-wide flex-shrink-0">
                {spread.positions.length} 张
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pl-11">
              {spread.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSelectSpread;
