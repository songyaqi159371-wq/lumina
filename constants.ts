import { Suit, TarotCard, Spread, CaseStudy, TarotSymbol } from './types';

export const tarotDeck: TarotCard[] = [
  {
    id: 0, nameCn: "愚者", nameEn: "The Fool", number: 0, suit: Suit.Major,
    keywords: ["新的开始", "冒险", "纯真"],
    meaningUp: "代表新的开始、冒险和无限的潜力。",
    meaningDown: "可能暗示鲁莽、冒险主义。",
    description: "一个年轻人站在悬崖边，仰望天空。",
    element: "Air", symbols: ["feathers", "mountains", "suns"]
  },
  {
    id: 1, nameCn: "魔术师", nameEn: "The Magician", number: 1, suit: Suit.Major,
    keywords: ["创造力", "显化"],
    meaningUp: "掌握资源实现目标。",
    meaningDown: "操纵、欺骗。",
    description: "魔术师一手指天一手指地。",
    element: "Air", symbols: ["roses", "lilies"]
  },
  {
    id: 2, nameCn: "女祭司", nameEn: "The High Priestess", number: 2, suit: Suit.Major,
    keywords: ["直觉", "潜意识"],
    meaningUp: "倾听内在的声音。",
    meaningDown: "忽视直觉。",
    description: "端坐在黑白柱子之间的女性。",
    element: "Water", symbols: ["pillars", "crowns", "moons", "crosses"]
  }
];

// Ensure IDs for UI reference
for(let i = 3; i <= 77; i++) {
    if(!tarotDeck.find(c => c.id === i)) {
        tarotDeck.push({
            id: i, nameCn: `牌卡 ${i}`, nameEn: `Card ${i}`, number: i, suit: Suit.Wands,
            keywords: ["关键词"], meaningUp: "正位", meaningDown: "逆位", description: "描述", element: "Fire"
        });
    }
}

export const tarotSymbols: TarotSymbol[] = [
  {
    id: "crowns", nameCn: "皇冠", nameEn: "Crowns", category: "Nature", // Category ignored in UI
    generalMeaning: "皇冠象征‘超越一切的重要性’。它作为一种‘头顶的礼物’，标志着世俗成就与超然状态的交汇。源自拉丁语‘corona’和希腊语‘korone’（弯曲或角），代表了光芒围绕的中心。在炼金术中，金冠象征着完美的黄金状态、纯净、以及内外统一的最高层级。它是权力的合法性来源，也是个体与神性连接的‘封印’。",
    details: [], integrationAdvice: "皇冠的出现提示你正处于一个具有‘压倒性意义’的时刻。它要求你放下琐碎，以最高的道德和责任感行事。接受皇冠意味着你承认了自己的潜能并愿意追求完美。"
  },
  {
    id: "pillars", nameCn: "柱子", nameEn: "Pillars", category: "Nature",
    generalMeaning: "柱子主要服务于四个功能：支撑、定义、识别和分离。单根柱子代表男性能量、意志、耐力以及为了公共利益牺牲个性的能力（如同脊柱支撑肉体）。成对的柱子则代表‘女性化’的界限，它们通过创造内外之分，标记出通往‘神圣空间’或‘启动仪式’的门槛。在塔罗中，柱子是进入更高意识层级的必经关口。",
    details: [], integrationAdvice: "如果你在牌面中注意到柱子，说明你正面对一个‘门槛’。要进入内部的‘神秘殿堂’，你不能仅凭一方的论点，而必须理解并融合对立的二元性，方能通过中间的走廊。"
  },
  {
    id: "roses", nameCn: "玫瑰", nameEn: "Roses", category: "Nature",
    generalMeaning: "玫瑰是‘显化路径’的象征，代表热量、激情和对尘世生活的深度参与。它象征着‘微观世界’（Microcosm），即下方的世界。红玫瑰代表感官的愉悦、爱情与牺牲。而在神秘学中，‘Sub Rosa’（在玫瑰之下）意味着秘密和保密。它经历了从爱神维纳斯的肉欲到圣母玛利亚的纯洁，最终成为炼金术中‘太阳’的象征。",
    details: [], integrationAdvice: "玫瑰教导你：生命的热情不是负担。当它出现时，拥抱你的欲望和情感投入，它们是显化你心中愿景的动力源泉。"
  },
  {
    id: "lilies", nameCn: "百合", nameEn: "Lilies", category: "Nature",
    generalMeaning: "百合代表‘回归路径’，象征着冷色调的‘宏观世界’（Macrocosm）。它是纯真、理智、放弃私欲以及臣服于神圣恩典的象征。百合具有六片花瓣，在秘术传说中象征上方的世界。它常与水、月亮、以及基督般的救赎能量相连。百合不劳作、不纺织，它通过完全信任神圣的安排而蓬勃生长。",
    details: [], integrationAdvice: "百合指引你寻求内心的宁静与纯粹。它建议你采取一种‘禁欲’或理智的态度，通过过滤掉世俗的干扰来获得更清晰的视野。"
  },
  {
    id: "paths", nameCn: "路径", nameEn: "Paths", category: "Nature",
    generalMeaning: "路径是促成‘该发生之事’发生的媒介。它与‘道路（Road）’不同：道路是刻意的人工建造，追求速度和公共规则；而路径是自然形成的，由无数拥有相同意图的脚印踩踏而成。它是狭窄的，一次只能容一人通过。路径不强调终点或完成，它更在意旅行者在行走过程中的个人体验和命运选择。",
    details: [], integrationAdvice: "问问你自己：这条路径有‘心’吗？如果是为了目标而强迫自己前行，那只是在赶路；真正的‘路径’允许你在其上漫步，甚至循环，因为它本身就是一种进化的体验。"
  },
  {
    id: "mountains", nameCn: "山脉", nameEn: "Mountains", category: "Nature",
    generalMeaning: "山脉代表了‘卓越与超凡’。它们矗立在地平线上，主宰视野，将意识提升到平凡生活之上。远处的山代表着伟大的目标、挑战和视界的边缘。近处的山则代表了对‘渺小感’的湮灭，将人的高度提升至‘世界之巅’。山巅是荒凉、寒冷但极度清晰的，是神灵与追求孤独者的居所。",
    details: [], integrationAdvice: "山脉是极致的考验。它提醒你，为了达成最高的目标，必须具备非凡的耐力和意志。当你到达顶峰，你就不再只是观察世界，而是成为了世界的一份子。"
  },
  {
    id: "crosses", nameCn: "十字", nameEn: "Crosses", category: "Nature",
    generalMeaning: "十字是蒸馏后的‘人类意识’象征。它代表对立面的绝对对比与创造性互动。水平线代表事物的稳定状态（Things as they are），垂直线代表事物可能变成的动态状态（What they might become）。等臂十字象征稳定性与全知，拉丁十字则象征对现状的不满和追求进步的动力。它是开启新维度、新可能性的神秘之门。",
    details: [], integrationAdvice: "十字标志着关键的决策。它告诉你，现在的困境源于两个无法调和的对立面，但正是这种冲突的交点，孕育了通往更高层次生命体验的种子。"
  },
  {
    id: "moons", nameCn: "月亮", nameEn: "Moons", category: "Nature",
    generalMeaning: "月亮是女性能量、潜意识与循环的统治者。她的光是间接的、反射的，因此也是‘不确定’的。月光下，所有坚硬的现实都会失去其确定的物质性，进入一种‘镜像’状态。月亮统治着灵魂的领域、死亡的阴影、以及所有尚未显化的形式。它是时间的圆形循环（岁时轮）的象征，也是直觉与通灵能力的源泉。",
    details: [], integrationAdvice: "现在不是追求‘客观真相’的时候。你需要像月亮一样，接受事物的阴影面，相信你的感觉，并在‘神圣的黑暗’中等待新生命的孕育。"
  },
  {
    id: "stars", nameCn: "星星", nameEn: "Stars", category: "Nature",
    generalMeaning: "星星是‘不可企及’、‘不可计数’且‘不可接近’的。它们是天堂的灯火，代表人类最远大的志向。作为几何形状（如五角星代表微观的人类、六角星代表宏观的炼金术‘伟业’），星星是魔力的凝聚。它们在最黑暗的时刻提供希望，象征着那份在漫长精神黑夜中始终不灭的内在神圣灵感。",
    details: [], integrationAdvice: "即便目标看起来遥不可及，星星也鼓励你保持仰望。它们是你的导师和保护者。锁定那个闪烁的愿景，它将引导你走出迷茫。"
  },
  {
    id: "pools", nameCn: "水池", nameEn: "Pools", category: "Nature",
    generalMeaning: "水池是纯粹女性化的、大地的容器。它是黑暗、深邃且具有反射性的，象征着人类生命经验的总和。它是个人进化路径上的重要坐标。水池底部沉积着日常琐碎的‘泥浆’，但水面却倒映着上方的星光。它是生命的温床，也是原始意识（如小龙虾）升起并开始精神旅程的地方。",
    details: [], integrationAdvice: "水池象征着阶段性的沉思。你需要暂时停下脚步，沉浸在你的经验之水中，清洗掉业力的尘埃，为下一次跨越式的进化积蓄力量。"
  },
  {
    id: "horses", nameCn: "马", nameEn: "Horses", category: "Nature",
    generalMeaning: "马象征着速度、力量、高贵以及底层的自由感。马与骑手构成了一个不可分割的整体：骑手提供方向，马提供美德与动力。在塔罗的‘阴影景观’中，马往往比骑手更了解道路。马连接着大地与天空，甚至是生者与死者的世界。它们是美德的传递者，将纯净、英雄气概或神圣性赋予其上的骑手。",
    details: [], integrationAdvice: "反思你与你内在动力的关系：你是那个过度控制的骑手，还是愿意信任你的‘坐骑’，让它引导你走向它直觉感知到的目的地？"
  },
  {
    id: "suns", nameCn: "太阳", nameEn: "Suns", category: "Nature",
    generalMeaning: "太阳是一切力量的源头——物理的能量、心理的意识以及灵魂的灵光。没有太阳，所有层级的生命都将熄灭。它是‘大我’（I AM）的绝对宣言。太阳象征着无可置疑的正面力量、热情和持续的意志。它同时也是二元性的一部分：作为白昼的统治者，它与黑夜的统治者（月亮）构成了现实的完整圆环。",
    details: [], integrationAdvice: "太阳代表了绝对的成功与活力。但要注意，未受保护的过度暴露会导致‘枯萎’。在追求强大的影响力的同时，也要学会在夜晚或阴影中休息。"
  },
  {
    id: "banners", nameCn: "旗帜", nameEn: "Banners", category: "Nature",
    generalMeaning: "旗帜是‘投影的身份’。它的本质是将象征符号高举过头顶，使其在风（能量）的作用下展开。旗帜告诉世界：‘我在这里，我代表这些品质。’它是一个图腾，能够收集散乱的能量，激发勇气。在塔罗中，旗帜通常带有特定的秘密符号（如玫瑰或十字），代表所属团体的秘密知识和灵性使命。",
    details: [], integrationAdvice: "现在是公开宣称你的理想和身份的时候了。不要再躲藏，举起你的旗帜，它将为你吸引志同道合的盟友，并聚焦你的意志力。"
  },
  {
    id: "armor", nameCn: "盔甲", nameEn: "Armor", category: "Nature",
    generalMeaning: "盔甲是‘战士的第二层皮肤’，代表对生死斗争的公开接受与公开职责。它既是实用的保护，也是身份的勋章。然而在心理层面，盔甲可能暗示一种‘无意识的防御’——因为害怕受伤害而把自己层层包裹，最终导致无法感知外界。它是意识的盾牌，也可能是情感的牢笼。",
    details: [], integrationAdvice: "检查你现在的状态：你穿上这身盔甲是为了去赢取荣耀的职责，还是因为恐惧而建立的内心隔离？真正的英雄知道何时该全副武装，也知道何时该脱下盔甲去接触灵魂。"
  },
  {
    id: "blindfolds", nameCn: "眼罩", nameEn: "Blindfolds", category: "Nature",
    generalMeaning: "眼罩创造了一种临时的盲目。它的功能有两个：一是阻碍你在物质世界正常行使功能；二是防止你被外界杂乱的景象干扰。这种‘神圣的黑暗’是通往内在视觉的桥梁。它象征着启动仪式中的‘试炼’状态——在失去肉眼视觉后，依靠直觉和信念去感知真相。它是从客观现实向主观真理转化的催化剂。",
    details: [], integrationAdvice: "有时，为了看见，你必须先看不见。不要挣扎着去分析眼前的表象，闭上眼睛，让内在的指引在静默中浮现。黑暗只是光明降临前的序曲。"
  },
  {
    id: "feathers", nameCn: "羽毛", nameEn: "Feathers", category: "Nature",
    generalMeaning: "羽毛是飞翔、轻盈与升华的象征。它们连接着‘空气’（理智）与‘火’（神性能量）。在古代仪式中，羽毛用于引导神圣烟雾，或作为分辨灵魂质量的砝码（如玛特的羽毛）。它是精神力量的‘载体’，能将上方的光带到不完美的世界，也将下方的沉重提升至完美的平衡态。它是‘浮力’和向上渴望的体现。",
    details: [], integrationAdvice: "寻求生活中‘轻盈’的一面。当你感到沉重和压抑时，羽毛提醒你：通过调整频率和心境，你的灵魂可以超越物质的束缚，像火一样向上燃烧。"
  },
  {
    id: "castles", nameCn: "城堡", nameEn: "Castles", category: "Nature",
    generalMeaning: "城堡是私人权力的宝座，是秩序、法律与和平的堡垒。它象征着一个强大的‘内在结构’，用于保护你的隐私和核心资源。城堡的质量取决于它主人的性格——它是仁慈的乐园，还是暴政的囚笼？它代表了那些我们已经‘构建好’并能完全掌控的领域。在塔罗中，城堡通常出现在背景的高处，代表一种稳固的保障。",
    details: [], integrationAdvice: "确认你的堡垒是坚固的。这不仅仅是物质的财富，更是你心理边界的清晰和内在秩序的建立。你是自己王国的主人，你有权拒绝不属于这里的力量。"
  },
  {
    id: "clouds", nameCn: "云", nameEn: "Clouds", category: "Nature",
    generalMeaning: "云是‘天空的情绪’，最接近于‘非物体’的存在。它们象征着万物的‘转瞬即逝’（Transitory）。云作为面纱，遮蔽了神圣的光芒，制造出可见视界的模糊和限制。在瑜伽传统中，思想和情感被视为掠过清澈意识天空的云朵。它们既可以是灾难的预兆（雷雨云），也可以是生命的恩赐（雨云）。",
    details: [], integrationAdvice: "不要被当下的情绪（云朵）所迷惑。它们只是经过你的意识，并不代表你。记住，在那之后，永恒的天空始终清澈。允许变化的发生，不要试图抓紧流动的云。"
  },
  {
    id: "gardens", nameCn: "花园", nameEn: "Gardens", category: "Nature",
    generalMeaning: "花园是‘完美的隐喻’，代表经过人工精心耕耘后的自然美。它是人类在混乱的世界中创造秩序和快乐的努力。花园象征着灵魂的修养、内心的平静、以及通过劳动获得的‘乐园’状态。它是伊甸园的投射，一个没有伤害、只有生机和和谐的封闭空间，是美德结出的果实。",
    details: [], integrationAdvice: "你现在需要耐心。就像照料花园一样，你的目标需要通过持续的细致关怀和对自然规律的尊重来实现。当果实成熟时，它带来的不仅仅是满足，更是灵魂的宁静。"
  },
  {
    id: "rivers", nameCn: "河流", nameEn: "Rivers", category: "Nature",
    generalMeaning: "河流是‘生命之流’在不同层次上的显化。它总是从高处的源头（精神）流向低处的终点（物质显化）。河流具有双重性：它既是维持生命的淡水，也是清理业力、带走废物和罪孽的通道。在塔罗哲学中，顺流而下即是顺应神圣意图。河流汇聚了无数支流，象征着个人意识在人生旅程中不断吸收和整合的过程。",
    details: [], integrationAdvice: "现在不是对抗的时候。停止挣扎，让自己漂浮在世界的意图之上。河流会带你去该去的地方，并在这个过程中洗净你的忧虑。"
  },
  {
    id: "towers", nameCn: "塔", nameEn: "Towers", category: "Nature",
    generalMeaning: "塔是人类对‘限制’的反抗，是追求卓越和权力的雄心壮志。它代表了将物质向上堆叠以抗拒引力（现状）的意志。塔是‘自我（Ego）’的显化，试图在精神上或世俗地位上达到不可思议的高度。然而，由于塔完全基于自我的参照，它往往成为一种‘封闭的自慰状态’，导致最终的剧变和结构的崩塌。",
    details: [], integrationAdvice: "塔的出现预示着一个‘突破’。如果你感觉目前的结构（生活、工作、观念）已经到了极限，不要害怕崩塌。那是为了让你从旧的牢笼中解放出来，去迎接全新的视野。"
  },
  {
    id: "angels", nameCn: "天使", nameEn: "Angels", category: "Nature",
    generalMeaning: "天使是‘天上的官僚机构’，负责执行神圣的指令。它们既非完全神圣也非完全人类，而是连接上与下的‘第三种力量’。天使是‘力量的信使’，它们的出现意味着某种超越个人控制的力量正在干预现实。它们提醒我们，仅有‘上’或‘下’是不够的，必须有某种中介力量使两者能够沟通并协同运作。",
    details: [], integrationAdvice: "留意那些不期而遇的灵感和‘共时性’事件。天使在占卜中告诉：问题已经在更高层面得到了处理，你需要做的就是保持觉察，并响应那份神圣的召唤。"
  }
];

export const spreads: Spread[] = [
  {
    id: 'single', name: '每日一牌 / 单张占卜', description: '适合快速获得指引。',
    positions: [{ id: 1, name: '核心指引', description: '问题的核心答案。' }]
  },
  {
    id: 'three-time', name: '时间之流', description: '过去-现在-未来。',
    positions: [
      { id: 1, name: '过去', description: '导致现状的原因。' },
      { id: 2, name: '现在', description: '当前的挑战。' },
      { id: 3, name: '未来', description: '可能的发展。' }
    ]
  }
];

const CARD_IMAGES: Record<number, string> = {
  0: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  1: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  2: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  3: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  4: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  5: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  13: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  14: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  18: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  19: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  20: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
};

export const getCardImageUrl = (id: number): string => {
  return CARD_IMAGES[id] || `https://placehold.co/400x700?text=Card+${id}`;
};

export const caseStudies: CaseStudy[] = [
    {
      id: 'cs1', category: 'Love', question: '感情陷入僵局？', context: '对方态度暧昧...',
      cardId: 2, isReversed: false,
      interpretation: '女祭司提醒你关注直觉。有些秘密尚待揭开。',
      keyPoints: ['保持静默', '倾听内心']
    }
];