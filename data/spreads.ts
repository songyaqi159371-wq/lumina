import { Spread } from '../types';

export const spreads: Spread[] = [
  {
    id: 'single-card',
    name: '单牌排阵',
    description: '快速获得当日启示或问题的核心答案。',
    positions: [
      { id: 1, name: '核心答案', description: '问题的直接回答或今日的核心启示。' }
    ]
  },
  {
    id: 'time-flow',
    name: '时间之流',
    description: '揭示事物发展的脉络，适合看长期走向。',
    positions: [
      { id: 1, name: '过去', description: '导致现状的原因。' },
      { id: 2, name: '现在', description: '当下的处境。' },
      { id: 3, name: '未来', description: '可能的发展方向。' }
    ]
  },
  {
    id: 'no-spread',
    name: '无牌阵',
    description: '随性抽取三张牌，通常第一张是主线，后两张是补充。',
    positions: [
      { id: 1, name: '主线', description: '问题的核心现状或主要趋势。' },
      { id: 2, name: '补充一', description: '对主线的进一步解释或潜在影响。' },
      { id: 3, name: '补充二', description: '另一个维度的补充信息或建议。' }
    ]
  },
  {
    id: 'lovers-cross',
    name: '恋人十字排阵',
    description: '深入分析两人关系，揭示双方想法。',
    positions: [
      { id: 1, name: '你的现状', description: '你在段关系中的立场。' },
      { id: 2, name: '对方现状', description: '对方在关系中的态度。' },
      { id: 3, name: '关系障碍', description: '阻碍两人发展的客观因素。' },
      { id: 4, name: '关系的基石', description: '两人维系的基础。' },
      { id: 5, name: '最终结果', description: '这段关系的未来走向。' }
    ]
  },
  {
    id: 'two-choice',
    name: '二选一排阵',
    description: '面临两个截然不同的选项时，分析各自的利弊。',
    positions: [
      { id: 1, name: '你的现状', description: '你现在的心理倾向。' },
      { id: 2, name: '选项 A 的过程', description: '选择 A 后的发展情况。' },
      { id: 3, name: '选项 A 的结果', description: '选择 A 后的最终收获。' },
      { id: 4, name: '选项 B 的过程', description: '选择 B 后的发展情况。' },
      { id: 5, name: '选项 B 的结果', description: '选择 B 后的最终收获。' }
    ]
  },
  {
    id: 'lovers-tree',
    name: '恋人之树排阵',
    description: '详细剖析情感根源、沟通、性与未来。',
    positions: [
      { id: 1, name: '根源', description: '关系的深层起源。' },
      { id: 2, name: '沟通', description: '双方的思想交流现状。' },
      { id: 3, name: '性与吸引', description: '肉体与魅力的连接。' },
      { id: 4, name: '你的期望', description: '你希望达成的目标。' },
      { id: 5, name: '对方的期望', description: '对方心中所求。' },
      { id: 6, name: '潜意识阻碍', description: '不可见的心理障碍。' },
      { id: 7, name: '灵性结合点', description: '未来的最终归宿。' }
    ]
  },
  {
    id: 'wealth-tree',
    name: '财富之树排阵',
    description: '分析财务状况、收入来源与开支建议。',
    positions: [
      { id: 1, name: '当前的根基', description: '目前的财务安全感现状。' },
      { id: 2, name: '收入潜力', description: '赚钱的机会在哪里。' },
      { id: 3, name: '开支陷阱', description: '可能的损耗或风险。' },
      { id: 4, name: '他人的助力', description: '外部资源 or 贵人。' },
      { id: 5, name: '财富结局', description: '财务目标的最终达成度。' }
    ]
  },
  {
    id: 'reincarnation',
    name: '轮回排阵',
    description: '复杂的九宫格排阵，分析因果、课题与天职。',
    positions: [
      { id: 1, name: '前世残余', description: '带入当下的因果习气。' },
      { id: 2, name: '灵魂课题', description: '本阶段必须学习的。' },
      { id: 3, name: '当前自我', description: '显意识中的状态。' },
      { id: 4, name: '内在挑战', description: '性格中的短板。' },
      { id: 5, name: '外在诱惑', description: '阻碍你成长的世俗干扰。' },
      { id: 6, name: '神圣天赋', description: '你与生俱来的资源。' },
      { id: 7, name: '天职/使命', description: '你应该奋斗的方向。' },
      { id: 8, name: '导师/指引', description: '谁会来帮助你。' },
      { id: 9, name: '最终觉醒', description: '灵魂进化的终极状态。' }
    ]
  },
  {
    id: 'seasons',
    name: '四季排阵',
    description: '分析一年四个季度的运势。',
    positions: [
      { id: 1, name: '春季', description: '萌芽与计划。' },
      { id: 2, name: '夏季', description: '行动与热烈。' },
      { id: 3, name: '秋季', description: '收获与结算。' },
      { id: 4, name: '冬季', description: '反思与蛰伏。' },
      { id: 5, name: '年度总结', description: '全年的核心基调。' }
    ]
  },
  {
    id: 'hexagram',
    name: '六芒星排阵',
    description: '经典的高级排阵，用于全方位剖析复杂问题。',
    positions: [
      { id: 1, name: '过去', description: '已发生的。' },
      { id: 2, name: '现在', description: '正在发生的。' },
      { id: 3, name: '未来', description: '即将发生的。' },
      { id: 4, name: '解决方案', description: '应对建议。' },
      { id: 5, name: '周围环境', description: '他人的态度或外界局势。' },
      { id: 6, name: '你的愿望', description: '内心深处的期待。' },
      { id: 7, name: '最终结果', description: '事情的最终定论。' }
    ]
  },
  {
    id: 'x-spread',
    name: 'X排阵',
    description: '专注于两股力量的冲突与中庸之道。',
    positions: [
      { id: 1, name: '向上的力量', description: '积极的推动力。' },
      { id: 2, name: '向下的力量', description: '阻碍与限制。' },
      { id: 3, name: '过去的阴影', description: '旧债与旧事。' },
      { id: 4, name: '未来的诱惑', description: '尚未确定的变量。' },
      { id: 5, name: '平衡中心', description: '现在的交点。' }
    ]
  },
  {
    id: 'four-elements',
    name: '四要素排阵',
    description: '通过风火水地四元素分析生活的平衡度。',
    positions: [
      { id: 1, name: '火 (精神/意志)', description: '你的热情与动力。' },
      { id: 2, name: '风 (思维/言语)', description: '你的逻辑与计划。' },
      { id: 3, name: '水 (情感/潜意识)', description: '你的内心与关系。' },
      { id: 4, name: '地 (物质/身体)', description: '你的财务与健康。' }
    ]
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字排阵',
    description: '最著名的复杂排阵，全面深入探索问题的所有维度。',
    positions: [
      { id: 1, name: '核心', description: '问题的现状。' },
      { id: 2, name: '挑战', description: '阻碍你的障碍。' },
      { id: 3, name: '根基', description: '潜意识或远因。' },
      { id: 4, name: '过去', description: '已经离开的能量。' },
      { id: 5, name: '皇冠', description: '意识到的目标或顶点。' },
      { id: 6, name: '未来', description: '即将到来的影响。' },
      { id: 7, name: '自我状态', description: '你的内在心理。' },
      { id: 8, name: '外部因素', description: '环境与他人的影响。' },
      { id: 9, name: '希望与恐惧', description: '你内心的期待或担忧。' },
      { id: 10, name: '最终结果', description: '全方位的最终定论。' }
    ]
  },
  {
    id: 'year-ahead',
    name: '年运排阵',
    description: '预测未来12个月的每月运势。',
    positions: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `${i + 1}月`,
      description: `该月的运势走向。`
    }))
  }
];
