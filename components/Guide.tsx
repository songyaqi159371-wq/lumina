import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, Eye, Feather, X, ArrowRight, HelpCircle, Check } from 'lucide-react';

const GUIDE_STORAGE_KEY = 'lumina_guide_completed';
const GUIDE_DISABLED_KEY = 'lumina_guide_disabled';
const GUIDE_STEP_KEY = 'lumina_guide_current_step';
const GUIDE_ACTIVE_KEY = 'lumina_guide_active';

interface GuideTipConfig {
  step: number;
  page: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'center';
  waitForAction: string; // 等待的用户操作：'navigate' | 'spreadSelect' | 'questionInput' | 'drawComplete' | 'cardsRevealed' | 'aiGenerated' | 'exported'
  nextPage?: string;
  actionText?: string;
}

const GUIDE_TIPS: GuideTipConfig[] = [
  // 图鉴页引导
  {
    step: 1,
    page: '/learn',
    title: '步骤 1/10：认识塔罗牌',
    content: '这里展示了全部78张塔罗牌。你可以点击任意一张牌查看详细含义。浏览后点击"前往象征页"继续。',
    position: 'top',
    waitForAction: 'navigate',
    nextPage: '/symbols',
    actionText: '前往象征页'
  },
  {
    step: 2,
    page: '/symbols',
    title: '步骤 2/10：理解塔罗符号',
    content: '塔罗牌包含丰富的象征符号。这个页面帮你理解四大元素、数字等符号的含义。准备好后点击"开始占卜"。',
    position: 'top',
    waitForAction: 'navigate',
    nextPage: '/divine',
    actionText: '开始占卜'
  },
  {
    step: 3,
    page: '/divine',
    title: '步骤 3/10：阅读占卜须知 ⚠️',
    content: '请点击下方的"塔罗占卜禁忌/须知"展开并仔细阅读。了解规则后点击"我已阅读"继续。',
    position: 'top',
    waitForAction: 'navigate',
    actionText: '我已阅读，继续'
  },
  {
    step: 4,
    page: '/divine',
    title: '步骤 4/10：选择牌阵 🃏',
    content: '根据你的实际情况，选择适合的牌阵开始占卜。点击任意牌阵卡片继续。',
    position: 'top',
    waitForAction: 'spreadSelect'
  },
  {
    step: 5,
    page: '/divine',
    title: '步骤 5/10：提出你的问题 ✍️',
    content: '在文本框中输入你的问题。问题要具体明确，例如："我该如何改善与同事的关系？"输入后点击"开启抽取序列"。',
    position: 'center',
    waitForAction: 'questionInput'
  },
  {
    step: 6,
    page: '/divine',
    title: '步骤 6/10：凭直觉抽牌 🎴',
    content: '深呼吸，平静内心。从灵能矩阵中凭直觉选择卡牌。不要思考太多，相信你的第一感觉。完成抽牌后会自动继续。',
    position: 'top',
    waitForAction: 'drawComplete'
  },
  {
    step: 7,
    page: '/divine',
    title: '步骤 7/10：翻开所有卡牌 🔮',
    content: '点击每张背面朝上的卡牌，将它们全部翻开查看结果。全部翻开后才能继续下一步。',
    position: 'top',
    waitForAction: 'cardsRevealed'
  },
  {
    step: 8,
    page: '/divine',
    title: '步骤 8/10：选择 AI 模型 🤖',
    content: '你可以根据个人偏好选择不同的 AI 模型来解读。选择后点击"生成 AI 深度解读"按钮。',
    position: 'top',
    waitForAction: 'aiGenerated'
  },
  {
    step: 9,
    page: '/divine',
    title: '步骤 9/10：导出保存报告 💾',
    content: '如果希望保存占卜记录，可以点击右上角的"导出报告"按钮，将结果保存为 PDF。这是唯一安全的保存方式！',
    position: 'top',
    waitForAction: 'exported',
    actionText: '已导出，继续'
  },
  {
    step: 10,
    page: '/divine',
    title: '步骤 10/10：完成首次占卜 🎉',
    content: '恭喜！你已完成第一次塔罗占卜。你可以点击"开启新占卜"再次体验，或随时返回探索其他功能。',
    position: 'center',
    waitForAction: 'navigate',
    actionText: '完成引导'
  }
];

// 全局状态：是否在引导模式
let isGuideMode = false;
let currentGuideStep = 0;

export const Guide: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentTip, setCurrentTip] = useState<GuideTipConfig | null>(null);
  const [guideStep, setGuideStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // 同步全局状态
  useEffect(() => {
    isGuideMode = guideStep > 0;
    currentGuideStep = guideStep;
    // 暴露给全局
    (window as any).isGuideMode = isGuideMode;
    (window as any).currentGuideStep = currentGuideStep;
  }, [guideStep]);

  useEffect(() => {
    const completed = localStorage.getItem(GUIDE_STORAGE_KEY);
    const disabled = localStorage.getItem(GUIDE_DISABLED_KEY);
    const savedStep = localStorage.getItem(GUIDE_STEP_KEY);
    const isActive = localStorage.getItem(GUIDE_ACTIVE_KEY);

    if (!completed && !disabled) {
      if (savedStep && isActive) {
        // 恢复引导进度
        setGuideStep(parseInt(savedStep));
      } else {
        // 首次访问，显示欢迎弹窗
        setTimeout(() => setShowWelcome(true), 500);
      }
    }
  }, []);

  // 监听页面变化，显示对应的引导提示
  useEffect(() => {
    if (guideStep > 0 && !showWelcome) {
      const tip = GUIDE_TIPS.find(t => t.page === location.pathname && t.step === guideStep);
      if (tip) {
        setTimeout(() => {
          setCurrentTip(tip);
        }, 500);
      } else {
        setCurrentTip(null);
      }
    }
  }, [location.pathname, guideStep, showWelcome]);

  // 保存引导进度
  useEffect(() => {
    if (guideStep > 0) {
      localStorage.setItem(GUIDE_STEP_KEY, guideStep.toString());
      localStorage.setItem(GUIDE_ACTIVE_KEY, 'true');
    } else {
      localStorage.removeItem(GUIDE_STEP_KEY);
      localStorage.removeItem(GUIDE_ACTIVE_KEY);
    }
  }, [guideStep]);

  const handleStartGuide = () => {
    setShowWelcome(false);
    setGuideStep(1);
    navigate('/learn');
  };

  const handleSkip = () => {
    setShowWelcome(false);
    localStorage.setItem(GUIDE_STORAGE_KEY, 'true');
  };

  const handleDisable = () => {
    setShowWelcome(false);
    localStorage.setItem(GUIDE_DISABLED_KEY, 'true');
  };

  const handleManualNext = () => {
    // 手动点击"下一步"按钮（仅用于需要手动确认的步骤）
    const nextStep = guideStep + 1;
    const nextTip = GUIDE_TIPS.find(t => t.step === nextStep);

    setCurrentTip(null);

    if (nextTip) {
      setGuideStep(nextStep);
      // 如果需要跳转页面
      if (currentTip?.nextPage) {
        navigate(currentTip.nextPage);
      }
    } else {
      // 引导完成
      handleFinishGuide();
    }
  };

  const handleFinishGuide = () => {
    setCurrentTip(null);
    setGuideStep(0);
    localStorage.setItem(GUIDE_STORAGE_KEY, 'true');
    localStorage.removeItem(GUIDE_STEP_KEY);
    localStorage.removeItem(GUIDE_ACTIVE_KEY);
  };

  // 供外部调用：当用户完成某个操作时推进引导
  const notifyAction = useCallback((action: string) => {
    if (guideStep > 0 && currentTip?.waitForAction === action) {
      handleManualNext();
    }
  }, [guideStep, currentTip]);

  // 暴露给全局
  useEffect(() => {
    (window as any).notifyGuideAction = notifyAction;
    return () => {
      delete (window as any).notifyGuideAction;
    };
  }, [notifyAction]);

  return (
    <>
      {/* 欢迎弹窗 */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={handleSkip}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-mystic-950 to-mystic-900 border border-mystic-gold/20 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl my-4 max-h-[90vh] overflow-y-auto"
            >
              {/* 装饰元素 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-mystic-gold to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
                  <Sparkles className="text-mystic-950 w-7 h-7 sm:w-10 sm:h-10" />
                </div>
              </div>

              <div className="text-center mt-6 sm:mt-8 mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-4xl font-serif text-white mb-2 sm:mb-4 tracking-wide">欢迎来到 Lumina Tarot</h2>
                <p className="text-slate-400 text-sm sm:text-lg font-light leading-relaxed px-2">
                  探索神秘的塔罗世界，开启自我觉察之旅
                </p>
              </div>

              {/* 功能介绍 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-mystic-gold/30 transition">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 border border-indigo-500/30">
                    <BookOpen className="text-indigo-400 w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-white font-serif text-base sm:text-lg mb-1 sm:mb-2">图鉴</h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-light">认识78张塔罗牌</p>
                </div>

                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-mystic-gold/30 transition">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 border border-purple-500/30">
                    <Feather className="text-purple-400 w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-white font-serif text-base sm:text-lg mb-1 sm:mb-2">象征</h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-light">理解塔罗符号体系</p>
                </div>

                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-mystic-gold/30 transition">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-mystic-gold/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 border border-mystic-gold/30">
                    <Eye className="text-mystic-gold w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-white font-serif text-base sm:text-lg mb-1 sm:mb-2">占卜</h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-light">开始你的第一次占卜</p>
                </div>
              </div>

              {/* 提示 */}
              <div className="bg-mystic-gold/10 border border-mystic-gold/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <HelpCircle className="text-mystic-gold w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    <span className="text-mystic-gold font-bold">建议：</span>
                    如果你是第一次接触塔罗，建议先浏览"图鉴"和"象征"板块了解基础知识，再开启占卜。我们也准备了简短的引导帮助你快速上手。
                  </p>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={handleDisable}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-slate-400 hover:text-white text-xs sm:text-sm transition"
                >
                  不再显示
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-slate-300 hover:text-white text-xs sm:text-sm transition"
                >
                  自由探索
                </button>
                <button
                  onClick={handleStartGuide}
                  className="sm:flex-[2] px-6 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-mystic-gold to-yellow-600 hover:from-mystic-gold/90 hover:to-yellow-600/90 rounded-xl sm:rounded-2xl text-mystic-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-mystic-gold/20 flex items-center justify-center gap-2 group"
                >
                  开始完整引导
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 浮动提示气泡 */}
      <AnimatePresence>
        {currentTip && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{
              top: -9999,
              left: -9999,
              right: 9999,
              bottom: 9999
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed z-[150] cursor-move left-0 right-0 mx-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:mx-0"
            style={{
              top: currentTip.position === 'top' ? '70px' :
                   currentTip.position === 'bottom' ? 'auto' : '50%',
              bottom: currentTip.position === 'bottom' ? '70px' : 'auto',
              transform: currentTip.position === 'center'
                ? 'translate(-50%, -50%)'
                : typeof window !== 'undefined' && window.innerWidth < 640 ? 'none' : 'translateX(-50%)',
              maxWidth: 'calc(100vw - 16px)',
              width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100vw - 16px)' : 'auto'
            }}
          >
            <div className="bg-gradient-to-br from-mystic-900 to-mystic-950 border-2 border-mystic-gold/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl w-full sm:max-w-md relative">
              {/* 拖拽提示 */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-mystic-gold/30 rounded-full cursor-grab active:cursor-grabbing" />

              {/* 装饰光晕 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-mystic-gold/20 to-yellow-600/20 rounded-2xl sm:rounded-3xl blur-xl -z-10"></div>

              {/* 步骤指示 */}
              <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-mystic-gold rounded-full flex items-center justify-center text-mystic-950 font-bold text-xs sm:text-sm shadow-lg">
                {currentTip.step}/10
              </div>

              <button
                onClick={handleFinishGuide}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-slate-500 hover:text-white transition"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6 mt-3 sm:mt-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-mystic-gold/20 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border border-mystic-gold/30">
                  <Sparkles className="text-mystic-gold w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-serif text-sm sm:text-xl mb-1 sm:mb-2 leading-tight">{currentTip.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{currentTip.content}</p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleFinishGuide}
                  className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-slate-400 hover:text-white text-xs sm:text-sm transition"
                >
                  退出
                </button>
                {currentTip.waitForAction === 'navigate' && (
                  <button
                    onClick={handleManualNext}
                    className="flex-[2] px-3 sm:px-6 py-1.5 sm:py-2 bg-mystic-gold hover:bg-mystic-gold/90 rounded-lg sm:rounded-xl text-mystic-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2 group"
                  >
                    <span className="truncate">{currentTip.actionText || '下一步'}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                )}
                {currentTip.waitForAction !== 'navigate' && (
                  <div className="flex-[2] px-3 sm:px-6 py-1.5 sm:py-2 bg-mystic-gold/20 border-2 border-mystic-gold rounded-lg sm:rounded-xl text-mystic-gold font-bold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2">
                    <div className="animate-pulse">等待操作...</div>
                  </div>
                )}
              </div>

              {/* 拖拽提示文字 - 移动端隐藏 */}
              <div className="hidden sm:block mt-3 text-center text-slate-600 text-[10px] uppercase tracking-widest">
                提示框可拖拽移动
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 帮助按钮组件（可以放在导航栏）
export const GuideHelpButton: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleResetGuide = () => {
    localStorage.removeItem(GUIDE_STORAGE_KEY);
    localStorage.removeItem(GUIDE_DISABLED_KEY);
    localStorage.removeItem(GUIDE_ACTIVE_KEY);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
        title="新手指引"
      >
        <HelpCircle size={18} className="text-slate-500 group-hover:text-mystic-gold transition-colors" />
        <span className="text-[11px] text-slate-500 group-hover:text-mystic-gold font-medium tracking-wider transition-colors hidden lg:inline">
          新手指引
        </span>
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-56 bg-mystic-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
            >
              <button
                onClick={handleResetGuide}
                className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition flex items-center gap-3"
              >
                <Sparkles size={16} className="text-mystic-gold" />
                <div>
                  <div className="font-medium">重新查看引导</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">从头开始新手教程</div>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
