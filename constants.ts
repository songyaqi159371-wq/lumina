import { Suit, TarotCard, Spread, CaseStudy } from './types';

// Helper to generate IDs
let idCounter = 0;

export const tarotDeck: TarotCard[] = [
  // --- Major Arcana (0-21) ---
  {
    id: 0,
    nameCn: "愚者",
    nameEn: "The Fool",
    number: 0,
    suit: Suit.Major,
    keywords: ["新的开始", "冒险", "纯真", "自发性", "自由"],
    meaningUp: "代表新的开始、冒险和无限的潜力。它鼓励你跟随直觉，迈出信心的一步，即使前路未知。",
    meaningDown: "可能暗示鲁莽、冒险主义或不仅后果的愚蠢行为。提醒你在行动前要三思。",
    description: "一个年轻人站在悬崖边，仰望天空，脚边有一只小白狗。",
    element: "Air"
  },
  {
    id: 1,
    nameCn: "魔术师",
    nameEn: "The Magician",
    number: 1,
    suit: Suit.Major,
    keywords: ["创造力", "能力", "意志力", "显化", "专注"],
    meaningUp: "象征着掌握资源和能力去实现目标。你拥有实现梦想所需的一切工具。",
    meaningDown: "暗示操纵、欺骗或未被充分利用的才能。可能意味着计划不周或意图不纯。",
    description: "魔术师站在桌前，桌上放着象征四元素的圣器，一手指天一手指地。",
    element: "Air"
  },
  {
    id: 2,
    nameCn: "女祭司",
    nameEn: "The High Priestess",
    number: 2,
    suit: Suit.Major,
    keywords: ["直觉", "潜意识", "神秘", "内在智慧", "静默"],
    meaningUp: "呼唤你倾听内在的声音和直觉。代表着未知的奥秘和深层的精神智慧。",
    meaningDown: "可能表示忽视直觉、表面化的判断或被隐藏的秘密所困扰。",
    description: "端坐在黑白柱子之间的神秘女性，手持卷轴，身后是石榴帷幕。",
    element: "Water"
  },
  {
    id: 3,
    nameCn: "皇后",
    nameEn: "The Empress",
    number: 3,
    suit: Suit.Major,
    keywords: ["丰饶", "母性", "自然", "感官享受", "孕育"],
    meaningUp: "代表丰收、创造力和母性的关怀。鼓励你连接自然，享受生活的美好。",
    meaningDown: "可能暗示过度依赖、创造力受阻或家庭关系的紧张。",
    description: "坐在自然丰饶之中的美丽女性，头戴十二星冠冕，象征自然的主宰。",
    element: "Earth"
  },
  {
    id: 4,
    nameCn: "皇帝",
    nameEn: "The Emperor",
    number: 4,
    suit: Suit.Major,
    keywords: ["权威", "结构", "控制", "父性", "秩序"],
    meaningUp: "象征秩序、规则和世俗的权力。代表建立结构和通过纪律实现目标。",
    meaningDown: "可能表示专制、滥用权力、缺乏灵活性或无法控制局势。",
    description: "威严的男性坐在石座上，手持权杖，背景是荒凉的山脉。",
    element: "Fire"
  },
  {
    id: 5,
    nameCn: "教皇",
    nameEn: "The Hierophant",
    number: 5,
    suit: Suit.Major,
    keywords: ["传统", "信仰", "教导", "体制", "精神指引"],
    meaningUp: "代表传统的价值观、宗教信仰或既定的社会规范。寻求精神导师或遵循传统路径。",
    meaningDown: "挑战传统、非正统的信仰或感到被教条束缚。",
    description: "身穿法袍的教皇坐在两根柱子间，脚下有两把交叉的钥匙，面前有信徒。",
    element: "Earth"
  },
  {
    id: 6,
    nameCn: "恋人",
    nameEn: "The Lovers",
    number: 6,
    suit: Suit.Major,
    keywords: ["爱", "和谐", "关系", "价值观", "选择"],
    meaningUp: "象征着爱、和谐的伙伴关系以及重要的人生选择。代表身心的统一。",
    meaningDown: "可能暗示关系的不和谐、分离或做出了错误的选择。",
    description: "亚当和夏娃站在伊甸园中，上方是大天使拉斐尔。",
    element: "Air"
  },
  {
    id: 7,
    nameCn: "战车",
    nameEn: "The Chariot",
    number: 7,
    suit: Suit.Major,
    keywords: ["胜利", "意志力", "决心", "自控", "行动"],
    meaningUp: "通过意志力和自律克服障碍。代表胜利和对对立力量的掌控。",
    meaningDown: "失去控制、方向感缺失或被侵略性所主导。",
    description: "一位战士驾驶着由两只斯芬克斯拉着的战车，背景是星空帷幕。",
    element: "Water"
  },
  {
    id: 8,
    nameCn: "力量",
    nameEn: "Strength",
    number: 8,
    suit: Suit.Major,
    keywords: ["勇气", "耐心", "同情心", "内在力量", "驯服"],
    meaningUp: "代表内在的勇气和通过耐心而非武力来克服困难的能力。以柔克刚。",
    meaningDown: "自我怀疑、软弱或被原始的本能和情绪所控制。",
    description: "一位女性温柔地抚摸并驯服一头狮子，头顶有无限符号。",
    element: "Fire"
  },
  {
    id: 9,
    nameCn: "隐士",
    nameEn: "The Hermit",
    number: 9,
    suit: Suit.Major,
    keywords: ["内省", "独处", "指引", "寻求真理", "智慧"],
    meaningUp: "从喧嚣中退后，寻求内在的智慧和孤独。一段自我反省和精神探索的时期。",
    meaningDown: "过度孤立、孤独或拒绝他人的帮助和建议。",
    description: "一位老者站在雪山顶上，手提一盏发光的灯笼。",
    element: "Earth"
  },
  {
    id: 10,
    nameCn: "命运之轮",
    nameEn: "Wheel of Fortune",
    number: 10,
    suit: Suit.Major,
    keywords: ["改变", "周期", "命运", "转折点", "机遇"],
    meaningUp: "象征生命的周期性变化、命运的转折和不可避免的改变。好运降临。",
    meaningDown: "抵抗改变、坏运气或感到生活失控。",
    description: "一个巨大的轮盘在天空中，周围有四圣兽读书，轮上有斯芬克斯。",
    element: "Fire"
  },
  {
    id: 11,
    nameCn: "正义",
    nameEn: "Justice",
    number: 11,
    suit: Suit.Major,
    keywords: ["公正", "真理", "因果", "法律", "平衡"],
    meaningUp: "代表公正、真理和法律事务。强调因果关系和做出公平的决定。",
    meaningDown: "不公正、偏见、逃避责任或法律上的不顺利。",
    description: "严肃的女性坐在石座上，一手持剑，一手持天平。",
    element: "Air"
  },
  {
    id: 12,
    nameCn: "倒吊人",
    nameEn: "The Hanged Man",
    number: 12,
    suit: Suit.Major,
    keywords: ["牺牲", "放手", "新视角", "暂停", "等待"],
    meaningUp: "通过牺牲获得智慧，换个角度看世界。一段暂停和等待的时期。",
    meaningDown: "无谓的牺牲、停滞不前或拒绝从新的角度看问题。",
    description: "一个男人被倒吊在T形树干上，头带光环，表情平静。",
    element: "Water"
  },
  {
    id: 13,
    nameCn: "死神",
    nameEn: "Death",
    number: 13,
    suit: Suit.Major,
    keywords: ["结束", "转变", "重生", "放手", "过渡"],
    meaningUp: "象征旧事物的结束和新事物的开始。深刻的转变和必要的清理。",
    meaningDown: "抗拒改变、无法放手或停滞在过去的痛苦中。",
    description: "身穿黑甲的骷髅骑着白马，践踏国王，面前有主教和儿童。",
    element: "Water"
  },
  {
    id: 14,
    nameCn: "节制",
    nameEn: "Temperance",
    number: 14,
    suit: Suit.Major,
    keywords: ["平衡", "适度", "耐心", "目的", "融合"],
    meaningUp: "寻找平衡和适度。通过耐心和融合对立面来创造和谐。",
    meaningDown: "失衡、过度、缺乏耐心或冲突。",
    description: "一位天使一只脚在水中一只脚在岸上，将水在两个杯子间倒换。",
    element: "Fire"
  },
  {
    id: 15,
    nameCn: "恶魔",
    nameEn: "The Devil",
    number: 15,
    suit: Suit.Major,
    keywords: ["束缚", "物质主义", "成瘾", "欲望", "阴影"],
    meaningUp: "代表被物质欲望、成瘾或消极思维所束缚。感到无力改变现状。",
    meaningDown: "挣脱束缚、打破枷锁或面对内心的阴影。",
    description: "恶魔蹲在石墩上，前面锁着一男一女，但链条很松。",
    element: "Earth"
  },
  {
    id: 16,
    nameCn: "高塔",
    nameEn: "The Tower",
    number: 16,
    suit: Suit.Major,
    keywords: ["突变", "灾难", "觉醒", "破坏", "启示"],
    meaningUp: "突然的剧变、旧结构的崩塌。虽然痛苦，但带来必要的觉醒和重建机会。",
    meaningDown: "勉强维持现状、避免灾难或对改变的恐惧。",
    description: "一座高塔被闪电击中燃烧，两个人从塔上坠落。",
    element: "Fire"
  },
  {
    id: 17,
    nameCn: "星星",
    nameEn: "The Star",
    number: 17,
    suit: Suit.Major,
    keywords: ["希望", "灵感", "平静", "疗愈", "指引"],
    meaningUp: "灾难后的希望和宁静。代表灵感、精神的更新和对未来的信心。",
    meaningDown: "失去希望、悲观或缺乏灵感。",
    description: "裸体女性在星空下，将两壶水分别倒入池塘和草地。",
    element: "Air"
  },
  {
    id: 18,
    nameCn: "月亮",
    nameEn: "The Moon",
    number: 18,
    suit: Suit.Major,
    keywords: ["幻觉", "恐惧", "潜意识", "不安", "直觉"],
    meaningUp: "代表幻觉、恐惧和潜意识的混乱。事物并非表象那样，需警惕欺骗。",
    meaningDown: "恐惧消散、迷雾散去或直面内心的焦虑。",
    description: "月亮照耀下，一只狼和一只狗在叫，一只龙虾从水中爬出。",
    element: "Water"
  },
  {
    id: 19,
    nameCn: "太阳",
    nameEn: "The Sun",
    number: 19,
    suit: Suit.Major,
    keywords: ["快乐", "成功", "活力", "清晰", "积极"],
    meaningUp: "象征纯粹的快乐、成功和活力。一切都清晰明了，充满正能量。",
    meaningDown: "暂时的消沉、成功延迟或过度乐观。",
    description: "巨大的太阳下，一个小孩骑着白马挥舞旗帜。",
    element: "Fire"
  },
  {
    id: 20,
    nameCn: "审判",
    nameEn: "Judgement",
    number: 20,
    suit: Suit.Major,
    keywords: ["复活", "觉醒", "号召", "宽恕", "更新"],
    meaningUp: "代表觉醒、复活和响应更高层面的召唤。回顾过去，做出重要决定。",
    meaningDown: "自我怀疑、拒绝改变或无法摆脱过去的阴影。",
    description: "天使吹响号角，死者从棺材中复活仰望天空。",
    element: "Fire"
  },
  {
    id: 21,
    nameCn: "世界",
    nameEn: "The World",
    number: 21,
    suit: Suit.Major,
    keywords: ["完成", "整合", "成就", "旅行", "圆满"],
    meaningUp: "象征一个周期的完美结束、目标的达成和整体的和谐。巨大的成就感。",
    meaningDown: "未完成、缺乏闭环或延迟达成目标。",
    description: "一位舞者被月桂花环包围，四角是四圣兽。",
    element: "Earth"
  },

  // --- Wands (Fire) ---
  {
    id: 22,
    nameCn: "权杖一",
    nameEn: "Ace of Wands",
    number: 1,
    suit: Suit.Wands,
    keywords: ["灵感", "新机会", "创造力", "激情"],
    meaningUp: "新的创意、激情或职业机会的萌芽。",
    meaningDown: "创意受阻、缺乏动力或错失良机。",
    description: "云中伸出一只手握着发芽的权杖。",
    element: "Fire"
  },
  {
    id: 23,
    nameCn: "权杖二",
    nameEn: "Two of Wands",
    number: 2,
    suit: Suit.Wands,
    keywords: ["规划", "决定", "发现", "离开舒适区"],
    meaningUp: "制定长期计划，展望未来，准备走出舒适区。",
    meaningDown: "害怕未知，计划不周或犹豫不决。",
    description: "一个人站在城堡上，手持地球仪展望远方。",
    element: "Fire"
  },
  {
    id: 24,
    nameCn: "权杖三",
    nameEn: "Three of Wands",
    number: 3,
    suit: Suit.Wands,
    keywords: ["扩张", "远见", "海外", "初步成功"],
    meaningUp: "扩展视野，等待船只归来，初步的成功和增长。",
    meaningDown: "延误、失望或计划受阻。",
    description: "一个人背对画面，看着海上的船只。",
    element: "Fire"
  },
  {
    id: 25,
    nameCn: "权杖四",
    nameEn: "Four of Wands",
    number: 4,
    suit: Suit.Wands,
    keywords: ["庆祝", "和谐", "回家", "稳定"],
    meaningUp: "家庭的和谐，庆祝里程碑，安全和快乐。",
    meaningDown: "家庭冲突，不稳定或取消庆祝。",
    description: "四根权杖搭成花架，人们在欢庆。",
    element: "Fire"
  },
  {
    id: 26,
    nameCn: "权杖五",
    nameEn: "Five of Wands",
    number: 5,
    suit: Suit.Wands,
    keywords: ["冲突", "竞争", "分歧", "混乱"],
    meaningUp: "竞争激烈的环境，意见不合，需要通过斗争证明自己。",
    meaningDown: "避免冲突，达成和解或内心的矛盾。",
    description: "五个年轻人在挥舞权杖混战。",
    element: "Fire"
  },
  {
    id: 27,
    nameCn: "权杖六",
    nameEn: "Six of Wands",
    number: 6,
    suit: Suit.Wands,
    keywords: ["胜利", "认可", "自信", "进步"],
    meaningUp: "公开的成功，获得认可和赞赏，自信满满。",
    meaningDown: "自负，跌落神坛或缺乏认可。",
    description: "戴着桂冠的骑马者接受人群的欢呼。",
    element: "Fire"
  },
  {
    id: 28,
    nameCn: "权杖七",
    nameEn: "Seven of Wands",
    number: 7,
    suit: Suit.Wands,
    keywords: ["防御", "坚持", "挑战", "保护立场"],
    meaningUp: "在竞争中捍卫自己的立场，坚持到底，不退缩。",
    meaningDown: "放弃，被压垮或过度防御。",
    description: "一个人站在高处，抵挡下面伸来的六根权杖。",
    element: "Fire"
  },
  {
    id: 29,
    nameCn: "权杖八",
    nameEn: "Eight of Wands",
    number: 8,
    suit: Suit.Wands,
    keywords: ["速度", "行动", "消息", "旅行"],
    meaningUp: "事情进展迅速，收到消息，空中旅行或快速行动。",
    meaningDown: "延误，混乱，行动太快导致错误。",
    description: "八根权杖在空中飞过。",
    element: "Fire"
  },
  {
    id: 30,
    nameCn: "权杖九",
    nameEn: "Nine of Wands",
    number: 9,
    suit: Suit.Wands,
    keywords: ["韧性", "毅力", "最后的防守", "疲惫"],
    meaningUp: "虽然疲惫但坚持到底，面对最后的挑战。",
    meaningDown: "放弃，极度疲劳或偏执。",
    description: "一个受伤的人扶着权杖，警惕地看着后方。",
    element: "Fire"
  },
  {
    id: 31,
    nameCn: "权杖十",
    nameEn: "Ten of Wands",
    number: 10,
    suit: Suit.Wands,
    keywords: ["负担", "责任", "压力", "努力"],
    meaningUp: "承担过多的责任，压力巨大，但接近终点。",
    meaningDown: "崩溃，卸下负担或无法承受的压力。",
    description: "一个人吃力地抱着十根权杖走向远处。",
    element: "Fire"
  },
  {
    id: 32,
    nameCn: "权杖侍从",
    nameEn: "Page of Wands",
    number: 11,
    suit: Suit.Wands,
    keywords: ["探索", "新想法", "热情", "消息"],
    meaningUp: "充满好奇心，探索新事物，令人兴奋的消息。",
    meaningDown: "缺乏方向，消极或坏消息。",
    description: "一个年轻人看着手中的权杖，像是在欣赏。",
    element: "Fire"
  },
  {
    id: 33,
    nameCn: "权杖骑士",
    nameEn: "Knight of Wands",
    number: 12,
    suit: Suit.Wands,
    keywords: ["行动", "冒险", "冲动", "激情"],
    meaningUp: "充满活力地追求目标，冒险精神，但也可能冲动。",
    meaningDown: "鲁莽，急躁，分散精力或延误。",
    description: "骑士骑着红马飞奔，充满干劲。",
    element: "Fire"
  },
  {
    id: 34,
    nameCn: "权杖王后",
    nameEn: "Queen of Wands",
    number: 13,
    suit: Suit.Wands,
    keywords: ["自信", "魅力", "独立", "活力"],
    meaningUp: "温暖、自信且充满魅力的女性形象。社交活跃。",
    meaningDown: "嫉妒，情绪化，控制欲强或失去自信。",
    description: "王后坐在饰有狮子的宝座上，手持权杖和向日葵。",
    element: "Fire"
  },
  {
    id: 35,
    nameCn: "权杖国王",
    nameEn: "King of Wands",
    number: 14,
    suit: Suit.Wands,
    keywords: ["领导力", "远见", "企业家", "荣誉"],
    meaningUp: "天生的领导者，有远见，能够激励他人。",
    meaningDown: "专横，冲动，期望过高或无效的领导。",
    description: "国王坐在宝座上，看着远方，脚下有蜥蜴。",
    element: "Fire"
  },

  // --- Cups (Water) ---
  {
    id: 36,
    nameCn: "圣杯一",
    nameEn: "Ace of Cups",
    number: 1,
    suit: Suit.Cups,
    keywords: ["新感情", "直觉", "爱", "情感溢出"],
    meaningUp: "新的恋情或情感开始，直觉敏锐，心灵满足。",
    meaningDown: "情感受阻，空虚或压抑的情感。",
    description: "一只手托着溢出水的圣杯，白鸽衔着十字架飞入。",
    element: "Water"
  },
  {
    id: 37,
    nameCn: "圣杯二",
    nameEn: "Two of Cups",
    number: 2,
    suit: Suit.Cups,
    keywords: ["伙伴", "吸引力", "结合", "平等"],
    meaningUp: "和谐的伙伴关系，互相吸引，恋情或合作。",
    meaningDown: "不平衡，关系破裂或沟通不良。",
    description: "一男一女面对面交换圣杯，中间有赫尔墨斯之杖。",
    element: "Water"
  },
  {
    id: 38,
    nameCn: "圣杯三",
    nameEn: "Three of Cups",
    number: 3,
    suit: Suit.Cups,
    keywords: ["庆祝", "友谊", "团体", "快乐"],
    meaningUp: "与朋友庆祝，社交聚会，快乐的时光。",
    meaningDown: "过度放纵，流言蜚语或被团体排斥。",
    description: "三个女子举杯庆祝，脚下是丰收的果实。",
    element: "Water"
  },
  {
    id: 39,
    nameCn: "圣杯四",
    nameEn: "Four of Cups",
    number: 4,
    suit: Suit.Cups,
    keywords: ["冷漠", "沉思", "错失机会", "厌倦"],
    meaningUp: "对现状感到不满或厌倦，忽视了眼前的新机会。",
    meaningDown: "抓住机会，摆脱冷漠或新的动力。",
    description: "一个人坐在树下，对云中递来的第四个杯子视而不见。",
    element: "Water"
  },
  {
    id: 40,
    nameCn: "圣杯五",
    nameEn: "Five of Cups",
    number: 5,
    suit: Suit.Cups,
    keywords: ["失落", "悲伤", "遗憾", "失望"],
    meaningUp: "专注于失去的东西，悲伤和遗憾。但仍有希望留存。",
    meaningDown: "走出悲伤，接受现实，重新开始。",
    description: "黑衣人看着三个倒下的杯子，身后还有两个立着的。",
    element: "Water"
  },
  {
    id: 41,
    nameCn: "圣杯六",
    nameEn: "Six of Cups",
    number: 6,
    suit: Suit.Cups,
    keywords: ["回忆", "怀旧", "童年", "纯真"],
    meaningUp: "怀念过去，童年的回忆，旧友重逢或纯真的快乐。",
    meaningDown: "沉溺过去，无法前进或成长的痛苦。",
    description: "两个孩子在庭院中分享装满花的圣杯。",
    element: "Water"
  },
  {
    id: 42,
    nameCn: "圣杯七",
    nameEn: "Seven of Cups",
    number: 7,
    suit: Suit.Cups,
    keywords: ["幻想", "选择", "白日梦", "迷惑"],
    meaningUp: "面临多种选择，但也可能是幻觉。需要辨别现实与幻想。",
    meaningDown: "做出选择，幻灭或清晰的目标。",
    description: "一个人面对云雾中的七个杯子，每个杯子里有不同的象征物。",
    element: "Water"
  },
  {
    id: 43,
    nameCn: "圣杯八",
    nameEn: "Eight of Cups",
    number: 8,
    suit: Suit.Cups,
    keywords: ["离开", "寻找", "失望", "放弃"],
    meaningUp: "为了寻找更深层的意义而放弃物质或情感上的现状。踏上旅程。",
    meaningDown: "犹豫不决，害怕改变或漫无目的的流浪。",
    description: "一个人在月夜下背对着排列好的八个杯子，走向远山。",
    element: "Water"
  },
  {
    id: 44,
    nameCn: "圣杯九",
    nameEn: "Nine of Cups",
    number: 9,
    suit: Suit.Cups,
    keywords: ["满足", "愿望达成", "快乐", "享受"],
    meaningUp: "愿望成真，情感和物质上的极大满足。正如你所愿。",
    meaningDown: "贪婪，不满，表面快乐实则空虚。",
    description: "一个富态的男人满意地坐在摆满九个圣杯的桌前。",
    element: "Water"
  },
  {
    id: 45,
    nameCn: "圣杯十",
    nameEn: "Ten of Cups",
    number: 10,
    suit: Suit.Cups,
    keywords: ["幸福", "家庭", "圆满", "和谐"],
    meaningUp: "情感的极致满足，家庭幸福，长久的和谐。",
    meaningDown: "家庭纠纷，破碎的梦或表面和谐。",
    description: "一家人在彩虹下欢庆，彩虹上有十个圣杯。",
    element: "Water"
  },
  {
    id: 46,
    nameCn: "圣杯侍从",
    nameEn: "Page of Cups",
    number: 11,
    suit: Suit.Cups,
    keywords: ["创意", "直觉", "新消息", "敏感"],
    meaningUp: "新的情感体验，艺术灵感，直觉敏锐的年轻人。",
    meaningDown: "情感幼稚，过度敏感或坏消息。",
    description: "一个年轻人看着杯中探出的鱼。",
    element: "Water"
  },
  {
    id: 47,
    nameCn: "圣杯骑士",
    nameEn: "Knight of Cups",
    number: 12,
    suit: Suit.Cups,
    keywords: ["浪漫", "魅力", "想象", "追求"],
    meaningUp: "浪漫的追求者，富有想象力，遵循内心。",
    meaningDown: "不切实际，情绪化，虚假的承诺。",
    description: "骑士骑着慢行的马，手捧圣杯，神态优雅。",
    element: "Water"
  },
  {
    id: 48,
    nameCn: "圣杯王后",
    nameEn: "Queen of Cups",
    number: 13,
    suit: Suit.Cups,
    keywords: ["慈悲", "直觉", "情感深度", "关怀"],
    meaningUp: "富有同情心，直觉极强，情感深邃的女性。",
    meaningDown: "情绪不稳定，依赖，多愁善感。",
    description: "王后注视着极为华丽的圣杯，坐在海边宝座上。",
    element: "Water"
  },
  {
    id: 49,
    nameCn: "圣杯国王",
    nameEn: "King of Cups",
    number: 14,
    suit: Suit.Cups,
    keywords: ["情绪平衡", "宽容", "外交", "控制"],
    meaningUp: "掌控情绪，宽容大度，善于外交和咨询。",
    meaningDown: "情绪操控，喜怒无常或冷酷无情。",
    description: "国王坐在海中浮石上，手持圣杯和权杖，看似平静。",
    element: "Water"
  },

  // --- Swords (Air) ---
  {
    id: 50,
    nameCn: "宝剑一",
    nameEn: "Ace of Swords",
    number: 1,
    suit: Suit.Swords,
    keywords: ["突破", "清晰", "新思想", "真理"],
    meaningUp: "思维的突破，清晰的洞察力，新的理念或真理。",
    meaningDown: "思维混乱，残酷的真相或计划受阻。",
    description: "云中伸出的手握着宝剑，剑尖穿过皇冠。",
    element: "Air"
  },
  {
    id: 51,
    nameCn: "宝剑二",
    nameEn: "Two of Swords",
    number: 2,
    suit: Suit.Swords,
    keywords: ["僵局", "抉择", "逃避", "封闭"],
    meaningUp: "进退两难，拒绝看清真相，需要做出艰难决定。",
    meaningDown: "僵局打破，做出决定或混乱揭示。",
    description: "蒙眼女性双手交叉持剑，坐在海边。",
    element: "Air"
  },
  {
    id: 52,
    nameCn: "宝剑三",
    nameEn: "Three of Swords",
    number: 3,
    suit: Suit.Swords,
    keywords: ["心碎", "悲伤", "痛苦", "分离"],
    meaningUp: "情感上的痛苦，心碎，背叛或分离。",
    meaningDown: "释放痛苦，开始疗愈或拒绝接受悲伤。",
    description: "一颗红心被三把宝剑穿透，背景是雨天。",
    element: "Air"
  },
  {
    id: 53,
    nameCn: "宝剑四",
    nameEn: "Four of Swords",
    number: 4,
    suit: Suit.Swords,
    keywords: ["休息", "恢复", "沉思", "暂停"],
    meaningUp: "由于精疲力竭而休息，恢复精力，暂时退出纷争。",
    meaningDown: "被迫休息，精疲力竭或重新投入行动。",
    description: "骑士躺在教堂的棺木上休息，墙上挂着三把剑。",
    element: "Air"
  },
  {
    id: 54,
    nameCn: "宝剑五",
    nameEn: "Five of Swords",
    number: 5,
    suit: Suit.Swords,
    keywords: ["冲突", "失败", "背叛", "空虚的胜利"],
    meaningUp: "赢得比赛却输了关系，自私的胜利，冲突和敌意。",
    meaningDown: "和解，吸取教训或持续的冲突。",
    description: "一个人带着缴获的宝剑，看着两个失败者离去。",
    element: "Air"
  },
  {
    id: 55,
    nameCn: "宝剑六",
    nameEn: "Six of Swords",
    number: 6,
    suit: Suit.Swords,
    keywords: ["过渡", "疗愈", "离开", "前进"],
    meaningUp: "离开困难的处境，虽然心情沉重但正在好转。过渡期。",
    meaningDown: "无法摆脱过去，旅途受阻或未解决的问题。",
    description: "一艘船载着大人和小孩渡水，船上插着六把剑。",
    element: "Air"
  },
  {
    id: 56,
    nameCn: "宝剑七",
    nameEn: "Seven of Swords",
    number: 7,
    suit: Suit.Swords,
    keywords: ["欺骗", "策略", "偷偷摸摸", "逃避"],
    meaningUp: "使用计谋，可能是欺骗或隐瞒，试图逃避责任。",
    meaningDown: "坦白，被揭穿或改变策略。",
    description: "一个人鬼鬼祟祟地抱着五把剑溜走，留下两把。",
    element: "Air"
  },
  {
    id: 57,
    nameCn: "宝剑八",
    nameEn: "Eight of Swords",
    number: 8,
    suit: Suit.Swords,
    keywords: ["受困", "限制", "无力感", "自我束缚"],
    meaningUp: "感到被束缚和无力，往往是思想上的自我设限。",
    meaningDown: "思想解放，找到出路或新的视角。",
    description: "一个被蒙眼绑住的女人站在八把剑阵中。",
    element: "Air"
  },
  {
    id: 58,
    nameCn: "宝剑九",
    nameEn: "Nine of Swords",
    number: 9,
    suit: Suit.Swords,
    keywords: ["焦虑", "噩梦", "绝望", "恐惧"],
    meaningUp: "极度的焦虑和恐惧，失眠，被负面思想折磨。",
    meaningDown: "焦虑缓解，寻求帮助或绝望的深渊。",
    description: "一个人在床上掩面哭泣/惊醒，墙上挂着九把剑。",
    element: "Air"
  },
  {
    id: 59,
    nameCn: "宝剑十",
    nameEn: "Ten of Swords",
    number: 10,
    suit: Suit.Swords,
    keywords: ["痛苦", "结束", "背叛", "谷底"],
    meaningUp: "痛苦的结束，被背叛，到达谷底但也是黎明前。",
    meaningDown: "缓慢恢复，最坏的已过去或无法释怀。",
    description: "一个人倒在地上，背上插着十把剑。",
    element: "Air"
  },
  {
    id: 60,
    nameCn: "宝剑侍从",
    nameEn: "Page of Swords",
    number: 11,
    suit: Suit.Swords,
    keywords: ["好奇", "机智", "观察", "新想法"],
    meaningUp: "思维敏捷，充满好奇，警惕性高，通过沟通获取信息。",
    meaningDown: "八卦，多嘴，甚至是间谍行为。",
    description: "年轻人举着剑，警惕地看着周围。",
    element: "Air"
  },
  {
    id: 61,
    nameCn: "宝剑骑士",
    nameEn: "Knight of Swords",
    number: 12,
    suit: Suit.Swords,
    keywords: ["野心", "行动", "冲动", "直接"],
    meaningUp: "行动迅速，思维敏捷，为了目标勇往直前。",
    meaningDown: "鲁莽，攻击性强，言语伤人。",
    description: "骑士骑着快马飞奔，剑指前方。",
    element: "Air"
  },
  {
    id: 62,
    nameCn: "宝剑王后",
    nameEn: "Queen of Swords",
    number: 13,
    suit: Suit.Swords,
    keywords: ["独立", "清晰", "直率", "客观"],
    meaningUp: "理智、独立且直率的女性。善于分析，不感情用事。",
    meaningDown: "冷酷，尖酸刻薄，封闭情感。",
    description: "王后侧身坐在宝座上，一手持剑，一手示意。",
    element: "Air"
  },
  {
    id: 63,
    nameCn: "宝剑国王",
    nameEn: "King of Swords",
    number: 14,
    suit: Suit.Swords,
    keywords: ["理智", "权威", "真理", "公正"],
    meaningUp: "极具智慧和权威，公正无私，依靠逻辑和真理行事。",
    meaningDown: "独裁，滥用职权，冷酷无情。",
    description: "国王正面坐在宝座上，手持宝剑，神情严肃。",
    element: "Air"
  },

  // --- Pentacles (Earth) ---
  {
    id: 64,
    nameCn: "星币一",
    nameEn: "Ace of Pentacles",
    number: 1,
    suit: Suit.Pentacles,
    keywords: ["新机会", "繁荣", "稳定", "资源"],
    meaningUp: "新的财务或工作机会，物质丰盛的开始，扎实的基础。",
    meaningDown: "错失机会，财务不稳定或贪婪。",
    description: "云中伸出的手托着巨大的星币，下面是花园。",
    element: "Earth"
  },
  {
    id: 65,
    nameCn: "星币二",
    nameEn: "Two of Pentacles",
    number: 2,
    suit: Suit.Pentacles,
    keywords: ["平衡", "适应", "多任务", "波动"],
    meaningUp: "在多重责任间保持平衡，灵活适应变化，财务周转。",
    meaningDown: "失衡，杂乱无章，财务压力。",
    description: "一个人像杂耍一样摆弄两个星币，背景有起伏的海浪。",
    element: "Earth"
  },
  {
    id: 66,
    nameCn: "星币三",
    nameEn: "Three of Pentacles",
    number: 3,
    suit: Suit.Pentacles,
    keywords: ["团队", "技能", "合作", "实施"],
    meaningUp: "团队合作，展示专业技能，由于合作而获得认可。",
    meaningDown: "缺乏合作，工作质量低劣或各自为政。",
    description: "工匠在教堂里向修士展示他的工作。",
    element: "Earth"
  },
  {
    id: 67,
    nameCn: "星币四",
    nameEn: "Four of Pentacles",
    number: 4,
    suit: Suit.Pentacles,
    keywords: ["控制", "保守", "占有欲", "安全感"],
    meaningUp: "守财，渴望安全感，物质上的稳固但也可能过于吝啬。",
    meaningDown: "贪婪，失去财富或学会慷慨。",
    description: "一个人紧紧抱住四个星币，头顶一个，怀里一个，脚下踩两个。",
    element: "Earth"
  },
  {
    id: 68,
    nameCn: "星币五",
    nameEn: "Five of Pentacles",
    number: 5,
    suit: Suit.Pentacles,
    keywords: ["贫穷", "孤立", "不安全", "困难"],
    meaningUp: "经济困难，被孤立，身体或精神上的贫乏。",
    meaningDown: "困难好转，寻求帮助或精神贫乏。",
    description: "两个衣衫褴褛的人走在雪地里，经过明亮的教堂窗户。",
    element: "Earth"
  },
  {
    id: 69,
    nameCn: "星币六",
    nameEn: "Six of Pentacles",
    number: 6,
    suit: Suit.Pentacles,
    keywords: ["慷慨", "慈善", "分享", "平衡"],
    meaningUp: "施与受的平衡，慷慨解囊或接受帮助，公平分配。",
    meaningDown: "自私，债务，或者带有条件的给予。",
    description: "一个商人拿着天平向乞丐施舍钱财。",
    element: "Earth"
  },
  {
    id: 70,
    nameCn: "星币七",
    nameEn: "Seven of Pentacles",
    number: 7,
    suit: Suit.Pentacles,
    keywords: ["耐心", "投资", "等待", "评估"],
    meaningUp: "长期投资，耐心等待收获，评估目前的进展。",
    meaningDown: "缺乏耐心，投资失败或努力白费。",
    description: "农夫倚着锄头，看着藤上结出的星币。",
    element: "Earth"
  },
  {
    id: 71,
    nameCn: "星币八",
    nameEn: "Eight of Pentacles",
    number: 8,
    suit: Suit.Pentacles,
    keywords: ["工匠精神", "专注", "技能", "细节"],
    meaningUp: "努力工作，磨练技能，注重细节，追求卓越。",
    meaningDown: "完美主义，缺乏激情或工作乏味。",
    description: "工匠专注地在星币上雕刻。",
    element: "Earth"
  },
  {
    id: 72,
    nameCn: "星币九",
    nameEn: "Nine of Pentacles",
    number: 9,
    suit: Suit.Pentacles,
    keywords: ["富足", "独立", "享受", "优雅"],
    meaningUp: "物质富足，享受劳动成果，独立自信的女性。",
    meaningDown: "过度依赖，炫富或财务挫折。",
    description: "一位穿着华丽的女士站在庄园里，手上停着一只鸟。",
    element: "Earth"
  },
  {
    id: 73,
    nameCn: "星币十",
    nameEn: "Ten of Pentacles",
    number: 10,
    suit: Suit.Pentacles,
    keywords: ["财富", "传承", "家庭", "长期成功"],
    meaningUp: "巨大的财富，家族传承，长期的繁荣和稳定。",
    meaningDown: "家庭纷争，财务损失或传统的束缚。",
    description: "一家三代人在拱门下，周围有十个星币。",
    element: "Earth"
  },
  {
    id: 74,
    nameCn: "星币侍从",
    nameEn: "Page of Pentacles",
    number: 11,
    suit: Suit.Pentacles,
    keywords: ["勤奋", "学习", "新计划", "务实"],
    meaningUp: "渴望学习新技能，务实的态度，新的财务机会。",
    meaningDown: "懒惰，缺乏专注或不切实际的计划。",
    description: "年轻人专注地看着手中的星币。",
    element: "Earth"
  },
  {
    id: 75,
    nameCn: "星币骑士",
    nameEn: "Knight of Pentacles",
    number: 12,
    suit: Suit.Pentacles,
    keywords: ["效率", "常规", "保守", "负责"],
    meaningUp: "勤奋工作，负责任，有条不紊地达成目标。",
    meaningDown: "停滞不前，固执，过度保守或无聊。",
    description: "骑士骑着黑马静止不动，注视着手中的星币。",
    element: "Earth"
  },
  {
    id: 76,
    nameCn: "星币王后",
    nameEn: "Queen of Pentacles",
    number: 13,
    suit: Suit.Pentacles,
    keywords: ["滋养", "务实", "富足", "安全"],
    meaningUp: "务实、充满母性关怀的女性。擅长理财和照顾家庭。",
    meaningDown: "过度物质，忽视精神生活或工作狂。",
    description: "王后坐在自然环绕的宝座上，温柔地看着星币。",
    element: "Earth"
  },
  {
    id: 77,
    nameCn: "星币国王",
    nameEn: "King of Pentacles",
    number: 14,
    suit: Suit.Pentacles,
    keywords: ["财富", "商业", "可靠", "成功"],
    meaningUp: "商业上的成功，巨大的财富，可靠且稳重。",
    meaningDown: "贪婪，固执，唯利是图或挥霍无度。",
    description: "国王坐在布满牛头装饰的宝座上，手持权杖和星币。",
    element: "Earth"
  }
];

// Completely Revised Image Map using verified Wikimedia Commons filenames
const CARD_IMAGES: Record<number, string> = {
  // Major Arcana (Verified)
  0: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  1: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  2: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  3: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  4: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  5: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  6: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg",
  7: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  8: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  9: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  10: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  11: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
  12: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  13: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  14: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  15: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  16: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  17: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  18: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  19: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  20: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  21: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",

  // Wands
  22: "https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg",
  23: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Wands02.jpg",
  24: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg",
  25: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Wands04.jpg",
  26: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Wands05.jpg",
  27: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Wands06.jpg",
  28: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg",
  29: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg",
  30: "https://www.sacred-texts.com/tarot/pkt/img/wa09.jpg", // Fixed source for Nine of Wands
  31: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands10.jpg",
  32: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands11.jpg",
  33: "https://upload.wikimedia.org/wikipedia/commons/1/16/Wands12.jpg",
  34: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands13.jpg",
  35: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Wands14.jpg",

  // Cups
  36: "https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg",
  37: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg",
  38: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups03.jpg",
  39: "https://upload.wikimedia.org/wikipedia/commons/3/35/Cups04.jpg",
  40: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cups05.jpg",
  41: "https://upload.wikimedia.org/wikipedia/commons/1/17/Cups06.jpg",
  42: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cups07.jpg",
  43: "https://upload.wikimedia.org/wikipedia/commons/6/60/Cups08.jpg",
  44: "https://upload.wikimedia.org/wikipedia/commons/2/24/Cups09.jpg",
  45: "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg",
  46: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Cups11.jpg",
  47: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Cups12.jpg",
  48: "https://upload.wikimedia.org/wikipedia/commons/6/62/Cups13.jpg",
  49: "https://upload.wikimedia.org/wikipedia/commons/0/04/Cups14.jpg",

  // Swords
  50: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg",
  51: "https://www.sacred-texts.com/tarot/pkt/img/sw02.jpg", // Fixed source for Two of Swords
  52: "https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg", 
  53: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Swords04.jpg",
  54: "https://upload.wikimedia.org/wikipedia/commons/2/23/Swords05.jpg",
  55: "https://upload.wikimedia.org/wikipedia/commons/2/29/Swords06.jpg",
  56: "https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg",
  57: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Swords08.jpg",
  58: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Swords09.jpg", 
  59: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords10.jpg",
  60: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Swords11.jpg",
  61: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Swords12.jpg",
  62: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords13.jpg",
  63: "https://upload.wikimedia.org/wikipedia/commons/3/33/Swords14.jpg",

  // Pentacles
  64: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg",
  65: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents02.jpg",
  66: "https://upload.wikimedia.org/wikipedia/commons/4/42/Pents03.jpg",
  67: "https://upload.wikimedia.org/wikipedia/commons/3/35/Pents04.jpg",
  68: "https://upload.wikimedia.org/wikipedia/commons/9/96/Pents05.jpg",
  69: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Pents06.jpg",
  70: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents07.jpg",
  71: "https://upload.wikimedia.org/wikipedia/commons/4/49/Pents08.jpg",
  72: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Pents09.jpg",
  73: "https://upload.wikimedia.org/wikipedia/commons/4/42/Pents10.jpg",
  74: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Pents11.jpg",
  75: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Pents12.jpg",
  76: "https://upload.wikimedia.org/wikipedia/commons/8/88/Pents13.jpg", 
  77: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Pents14.jpg"  
};

export const getCardImageUrl = (id: number): string => {
  return CARD_IMAGES[id] || `https://placehold.co/400x700?text=Card+${id}`;
};

export const spreads: Spread[] = [
  {
    id: 'single',
    name: '每日一牌 / 单张占卜',
    description: '最简单的牌阵，适合快速获得指引或回答简单的是非题。',
    positions: [
      { id: 1, name: '核心指引', description: '问题的核心答案或当下的建议' }
    ]
  },
  {
    id: 'three-time',
    name: '时间之流 (过去-现在-未来)',
    description: '经典的线性牌阵，解读事情的发展脉络。',
    positions: [
      { id: 1, name: '过去', description: '导致当前局面的过去原因' },
      { id: 2, name: '现在', description: '当前的状况和挑战' },
      { id: 3, name: '未来', description: '如果保持现状，可能的发展方向' }
    ]
  },
  {
    id: 'choice',
    name: '二选一牌阵',
    description: '当你面临两个选择犹豫不决时使用。',
    positions: [
      { id: 1, name: '现状', description: '你现在的状态' },
      { id: 2, name: '选择A的结果', description: '如果选择选项A可能会发生什么' },
      { id: 3, name: '选择B的结果', description: '如果选择选项B可能会发生什么' },
      { id: 4, name: '建议', description: '综合建议' }
    ]
  },
  {
    id: 'love',
    name: '爱情关系牌阵',
    description: '分析两人关系的状态和未来发展。',
    positions: [
      { id: 1, name: '你的态度', description: '你对这段关系的看法' },
      { id: 2, name: '对方的态度', description: '对方对这段关系的看法' },
      { id: 3, name: '关系现状', description: '目前两人的互动状态' },
      { id: 4, name: '阻碍/挑战', description: '关系中存在的问题' },
      { id: 5, name: '未来结果', description: '这段关系可能的发展' }
    ]
  },
  {
    id: 'celtic',
    name: '凯尔特十字',
    description: '最古老、最完整的牌阵，用于深入分析复杂问题。',
    positions: [
      { id: 1, name: '现状', description: '目前的核心状况' },
      { id: 2, name: '阻碍', description: '阻碍或帮助你的力量' },
      { id: 3, name: '潜意识', description: '你内心的深层动机' },
      { id: 4, name: '过去', description: '刚刚发生的过去' },
      { id: 5, name: '意识', description: '你所知道的显性影响' },
      { id: 6, name: '未来', description: '即将发生的未来' },
      { id: 7, name: '自我', description: '你对自己的看法' },
      { id: 8, name: '环境', description: '周遭环境的影响' },
      { id: 9, name: '愿望/恐惧', description: '你内心的希望或担忧' },
      { id: 10, name: '结果', description: '最终的预测结果' }
    ]
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'cs1',
    category: 'Love',
    question: '我最近和伴侣争吵不断，这段关系还能继续吗？',
    context: '求问者感到疲惫，觉得双方沟通无效，考虑分手但又舍不得。',
    cardId: 52, // Three of Swords
    isReversed: false,
    interpretation: '宝剑三正位通常代表心碎、痛苦和分离。在这个情境下，它并不一定意味着关系的终结，但它明确指出了现在的痛苦是真实的，无法被忽视。它建议你们目前正处于情感的低谷，必须先承认并处理这份痛苦（无论是通过坦诚的沟通还是暂时的分开冷静），才能有疗愈的可能。这张牌提醒你，不要为了维持表面的和平而压抑内心的伤痛。',
    keyPoints: ['承认痛苦的存在', '沟通中的伤害', '暂时的分离或冷静期']
  },
  {
    id: 'cs2',
    category: 'Career',
    question: '我应该辞职去创业吗？',
    context: '求问者目前有一份稳定的工作，但感到枯燥，一直梦想开一家咖啡店。',
    cardId: 0, // The Fool
    isReversed: false,
    interpretation: '愚者牌代表着新的开始、冒险和无限的可能性。在这张牌的指引下，宇宙鼓励你迈出那一跳。虽然创业充满未知（就像愚者脚下的悬崖），但现在是你追随内心热情、不计后果去尝试的最佳时机。保持开放的心态，不要被过多的恐惧束缚。',
    keyPoints: ['大胆尝试', '初学者的心态', '相信直觉']
  },
  {
    id: 'cs3',
    category: 'Growth',
    question: '为什么我最近总是感到焦虑和失眠？',
    context: '求问者身体检查无大碍，但总是担心未来，脑子里停不下来。',
    cardId: 58, // Nine of Swords
    isReversed: false,
    interpretation: '宝剑九是典型的“焦虑牌”。画面中的人从噩梦中惊醒，象征着精神上的折磨。这张牌指出，你的焦虑很大程度上来源于你自己的思维模式，而非外界真实的威胁。你可能在脑海中把事情灾难化了。牌义建议你尝试冥想、书写或寻求心理咨询，将这些无形的恐惧具象化，你会发现它们并没有你想象中那么可怕。',
    keyPoints: ['精神内耗', '过度担忧', '需要释放压力']
  },
  {
    id: 'cs4',
    category: 'Career',
    question: '这个新项目能成功吗？',
    context: '团队刚开始一个高风险高回报的项目，大家都很兴奋。',
    cardId: 22, // Ace of Wands
    isReversed: false,
    interpretation: '权杖一正位是一个非常积极的信号！它象征着火元素的爆发力、灵感和行动力。这预示着项目有一个完美的开端，充满了激情和创造力。然而，Ace只是“开始”，它保证了爆发力，但长期的成功还需要后续的努力（火需要燃料维持）。目前的能量是非常有利于推进的。',
    keyPoints: ['强劲的开端', '激情与动力', '把握机会']
  },
  {
    id: 'cs5',
    category: 'Love',
    question: '单身很久了，近期会有桃花吗？',
    context: '求问者渴望爱情，但社交圈很小。',
    cardId: 33, // Knight of Wands
    isReversed: false,
    interpretation: '权杖骑士代表着一位充满魅力、热情但可能比较冲动的人。这暗示近期可能会遇到一个让你心跳加速的人，或者你需要像骑士一样主动出击，去拓展社交圈。这段关系可能来得快，充满了激情和冒险感，但也要注意它可能缺乏稳定性。总之，行动起来，不要等待！',
    keyPoints: ['积极主动', '充满激情的邂逅', '快速发展']
  },
  {
    id: 'cs6',
    category: 'General',
    question: '目前的财务状况如何改善？',
    context: '收支平衡但存不下钱，感到焦虑。',
    cardId: 67, // Four of Pentacles
    isReversed: true,
    interpretation: '星币四正位通常代表守财和吝啬，而逆位时，可能暗示你之前太过于执着于“存钱”或“安全感”，反而导致了财务能量的停滞；或者反过来，暗示你现在的开销失去了控制。结合语境，建议你重新审视你的理财观念：是为了省钱而降低了生活质量和赚钱的动力吗？适当的流动（投资自己或理财）可能比死守更有效。',
    keyPoints: ['放开控制', '资金流动', '重新评估安全感']
  }
];