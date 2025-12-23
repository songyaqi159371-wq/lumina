import { Suit, TarotCard, TarotSymbol, Spread, CaseStudy } from './types';

export const tarotDeck: TarotCard[] = [
  // Major Arcana (0-21)
  { id: 0, nameCn: "愚者", nameEn: "The Fool", number: 0, suit: Suit.Major, keywords: ["新开始", "冒险", "纯真"], meaningUp: "代表无限的可能性、自发性和纯真。", meaningDown: "鲁莽、冒险主义、愚蠢的行为。", description: "背景中白色的太阳象征着万物的绝对开端，即‘闪烁的理智’。他帽上那根鲜红的羽毛是‘火之羽’，作为连接精神世界与物质界的导管，象征着灵魂向上提升的纯粹动力。他华丽外衣上点缀的十二颗星星，预示着完美的八角星力量正注入黄道十二宫的循环。", element: "Air" },
  { id: 1, nameCn: "魔术师", nameEn: "The Magician", number: 1, suit: Suit.Major, keywords: ["显化", "意志力", "创造力"], meaningUp: "有能力将愿景转化为现实。", meaningDown: "操纵、未开发的潜能、欺骗。", description: "桌下繁茂的红玫瑰与白百合构成了‘显化与消融’的复合象征：玫瑰代表物质世界的渴望与激情，百合代表精神的觉醒与纯洁。他桌上的五角星币是微观世界的标志，而他头顶的无穷大符号（Lemniscate）则与太阳能量呼应，提示其作为权力的终极本质。", element: "Air" },
  { id: 2, nameCn: "女祭司", nameEn: "The High Priestess", number: 2, suit: Suit.Major, keywords: ["直觉", "潜意识", "神秘"], meaningUp: "倾听内在声音，神圣的女性能量。", meaningDown: "忽视直觉、隐藏的动机、表浅。", description: "身后的黑白双柱定义了圣洁空间的入口，象征着潜意识与显意识的二元对立。她头戴的伊斯兰/哈索尔王冠象征着神圣女性的原始权威。脚下的新月是‘Stella Maris’（海之星）的象征，提示在模糊的月光下观察潜意识真实脉动的重要性。", element: "Water" },
  { id: 3, nameCn: "皇后", nameEn: "The Empress", number: 3, suit: Suit.Major, keywords: ["丰饶", "自然", "母性"], meaningUp: "创造力、美丽、感官的愉悦。", meaningDown: "创造力受阻、依赖、缺乏平衡。", description: "她头戴由十二颗六角星组成的王冠，代表了整个黄道十二宫，这是她从天界显化到地上的证明。她身处繁茂的花园，象征着伊甸园在物质界的丰饶。背景中流动的河流是显化的引擎，象征能量从潜力到现实的必然流动。", element: "Earth" },
  { id: 4, nameCn: "皇帝", nameEn: "The Emperor", number: 4, suit: Suit.Major, keywords: ["权威", "结构", "父性"], meaningUp: "控制、组织、坚定的领导。", meaningDown: "暴政、刚愎自用、缺乏纪律。", description: "他手持的安卡十字架代表阳性的垂直线穿过阴性的地平线，化作永恒升起的太阳。他长袍下露出的钢靴是盔甲的暗示，提醒人们皇帝本质上是一位战士。背景中险峻的高山（Mountains）象征地平线的极限，代表卓越的挑战。", element: "Fire" },
  { id: 5, nameCn: "教皇", nameEn: "The Hierophant", number: 5, suit: Suit.Major, keywords: ["传统", "精神指引", "仪式"], meaningUp: "社会准则、宗教信仰、寻求真理。", meaningDown: "反叛、挑战传统、个人信仰。", description: "他头戴的三叠冠对应人类意识的三种层级。他脚下的红白信徒分别穿着绘有玫瑰（心之路径）与百合（灵之路径）的服饰。身后的石柱作为进入圣殿的门户，其中心的三层十字架掌握着三个世界，确保灵魂有序地提升。", element: "Earth" },
  { id: 6, nameCn: "恋人", nameEn: "The Lovers", number: 6, suit: Suit.Major, keywords: ["选择", "和谐", "关系"], meaningUp: "爱、价值观的统一、重要决策。", meaningDown: "失调、逃避责任、不合时宜的选择。", description: "背景中的巨大太阳是统合的天使，它身后的山脉象征着灵性提升后的顶峰视角。天使拉斐尔的双翼是羽毛的极致，提供神圣保护。在这里，山峰代表了二元对立在‘合一’中得到的最终治愈，即‘回家’的体验。", element: "Air" },
  { id: 7, nameCn: "战车", nameEn: "The Chariot", number: 7, suit: Suit.Major, keywords: ["胜利", "意志", "自律"], meaningUp: "克服障碍、坚定的目标、控制对立面。", meaningDown: "失控、缺乏动力、咄咄逼人。", description: "车轮上方的双翼太阳圆盘是荷鲁斯的猎鹰之翼，象征着理智能够盘旋在深渊之上。他的盔甲是仪式性的，胸前的方块象征理性的规则。背后坚固的城堡墙壁表明，他的力量源泉来自于稳固的世俗权力支撑。", element: "Water" },
  { id: 8, nameCn: "力量", nameEn: "Strength", number: 8, suit: Suit.Major, keywords: ["勇气", "耐力", "柔性"], meaningUp: "内在力量、慈悲、驯服本能。", meaningDown: "软弱、自我怀疑、原始冲动。", description: "女性头顶的无限大符号与背景中温和的金色天空呼应。她身处平缓的旷野，背景远方的高山（Mountains）暗示着虽然此刻是柔性的互动，但其内在蕴含着能跨越最高挑战的刚毅。这是一种将狮子的原始本能转化为灵性耐力的过程。", element: "Fire" },
  { id: 10, nameCn: "命运之轮", nameEn: "Wheel of Fortune", number: 10, suit: Suit.Major, keywords: ["周期", "命运", "转机"], meaningUp: "好运、不可控的改变、因果报应。", meaningDown: "厄运、阻力、拒绝接受改变。", description: "轮盘四周漂浮在云朵中的生物拥有羽毛翅膀，代表通过精神智慧超越物质循环。云朵划定了普通生活与神圣秩序的分界。中间的轮盘象征时间如圆环般转动，象征进入真实光亮之前的过渡。", element: "Fire" },
  { id: 11, nameCn: "正义", nameEn: "Justice", number: 11, suit: Suit.Major, keywords: ["公平", "真理", "法律"], meaningUp: "正义、客观、责任感。", meaningDown: "不公、推卸责任、法律问题。", description: "她端坐在平滑的石柱之间，意味着法律的答案不容分心。她头上的金色王冠中心有一颗小方块，代表‘理性的规则’。她手中的天平是十字架的一种变体，代表着对立面互动后的绝对平衡点。", element: "Air" },
  { id: 12, nameCn: "吊人", nameEn: "The Hanged Man", number: 12, suit: Suit.Major, keywords: ["牺牲", "暂停", "新视角"], meaningUp: "放手、牺牲、等待。", meaningDown: "优柔寡断、停滞。", description: "他悬挂在‘Tau型十字架’上。这是一种具有‘反转’特质的象征，代表通过彻底的视角转换来实现救赎。他头部的光晕是内在视觉苏醒的标志，这种‘特殊的黑暗’是进入启蒙之前的滤网。", element: "Water" },
  { id: 13, nameCn: "死神", nameEn: "Death", number: 13, suit: Suit.Major, keywords: ["结束", "转变", "放下"], meaningUp: "彻底改变、新生。", meaningDown: "抗拒改变、恐惧死亡。", description: "苍白的骏马作为死亡的向导，在黄昏与黎明之间的地平线上行进。他黑色的盔甲是完美的公共服务。旗帜上的白色玫瑰在黑暗中绽放，预示着死亡并非终结，而是生命能量在更高层级的重生契约。", element: "Water" },
  { id: 14, nameCn: "节制", nameEn: "Temperance", number: 14, suit: Suit.Major, keywords: ["平衡", "融合", "耐心"], meaningUp: "适度、和谐、炼金术式的混合。", meaningDown: "失衡、极端、缺乏目标。", description: "天使头上的太阳圆盘与远方路径末端呼应，代表智慧的顶峰。他脚下一只踏入潜意识的水池（Pools），一只踩在大地上，实现水与火的‘神圣婚姻’。天使火红的双翼是羽毛的极致，作为神圣能量的载体。", element: "Fire" },
  { id: 15, nameCn: "恶魔", nameEn: "The Devil", number: 15, suit: Suit.Major, keywords: ["束缚", "物质主义", "成瘾"], meaningUp: "被欲望控制、恐惧、自作自受。", meaningDown: "解脱、克服成瘾、觉醒。", description: "恶魔额头上的倒置五角星象征着肉欲对灵魂的绝对压制。背景的黑暗意味着缺乏‘太阳’光照。他蝙蝠般的黑色翅膀是羽毛的病态变体，暗示了被重力（欲望）紧紧锁死在地面上的僵化状态。", element: "Earth" },
  { id: 16, nameCn: "高塔", nameEn: "The Tower", number: 16, suit: Suit.Major, keywords: ["巨变", "觉醒", "释放"], meaningUp: "突发的变故、剧变。", meaningDown: "逃过一劫、持续危机。", description: "塔顶坠落的金冠意味着错误的权威在突发的天雷下彻底崩塌。高塔本身是人类反抗重力（现状）的雄心壮志，它在云端之上被击碎，象征着虚假信念结构的解体。这是一次通过崩溃来寻求真理的‘高峰体验’。", element: "Fire" },
  { id: 17, nameCn: "星星", nameEn: "The Star", number: 17, suit: Suit.Major, keywords: ["希望", "灵感", "宁静"], meaningUp: "信心、疗愈、宇宙的祝福。", meaningDown: "失望、缺乏信仰、迷茫。", description: "中心巨大的八角星代表了自然的完美智慧。她将水倒入水池（Pools）与大地，代表将灵性的甘露注入潜意识。背景中长着朱鹭（Thoth之鸟）的树，是伊甸园中留存的‘知识之树’。这幅景观是‘堕落之前的乐园’。", element: "Air" },
  { id: 18, nameCn: "月亮", nameEn: "The Moon", number: 18, suit: Suit.Major, keywords: ["幻觉", "焦虑", "潜意识"], meaningUp: "隐秘、不安、直觉的指引。", meaningDown: "真相大白、理智回归。", description: "水池（Pools）中的小龙虾象征原始意识。月亮的反射光让远方通往高山的路径显得模糊且充满迷惑。两座石塔是文明的边界，路径穿过它们进入未知的荒野。这是一个通过阴影磨练内在视觉的旅程。", element: "Water" },
  { id: 19, nameCn: "太阳", nameEn: "The Sun", number: 19, suit: Suit.Major, keywords: ["成功", "活力", "喜悦"], meaningUp: "成就、活力、清晰的真相。", meaningDown: "挫折、过度乐观。", description: "巨大的红橙色旗帜由Resh形状演变而来，象征生命源头的显现。骑在白马上的孩子代表无垢的精神，马儿作为高贵的工具载着他走向圆满。背景的向日葵提醒我们面对这股无私光照，生命便能时刻获得重生。", element: "Fire" },
  { id: 20, nameCn: "审判", nameEn: "Judgement", number: 20, suit: Suit.Major, keywords: ["重生", "呼唤", "赦免"], meaningUp: "觉醒、重大的转型。", meaningDown: "自我怀疑、错过时机。", description: "天使加百列火红的双翼覆盖天空，吹响的号角宣示着从梦境到觉醒的跃迁。背景中冰封的高山（Mountains）是‘冰冷的理智世界’，唯有火热的号角声能让死者苏醒。这是一个超越地平线、重归圣殿深处的契约。", element: "Fire" },
  { id: 21, nameCn: "世界", nameEn: "The World", number: 21, suit: Suit.Major, keywords: ["圆满", "集成", "旅行"], meaningUp: "阶段性成功、圆满结束。", meaningDown: "未竟事业、阻碍。", description: "舞者周围的椭圆花环是圣殿入口的隐喻，象征着旅程的闭环与圆满。四角的云朵中包裹着四个神圣生物，意味着通过显化之路回到宇宙源头。法杖在这一刻达成了完美的垂直与水平的‘十字交点’。", element: "Earth" },

  // Wands (22-35)
  { id: 22, nameCn: "权杖首牌", nameEn: "Ace of Wands", number: 1, suit: Suit.Wands, keywords: ["灵感", "潜力", "行动"], meaningUp: "创造力的火花。", meaningDown: "能量匮乏。", description: "云中伸出的手握住长满绿叶的权杖，象征着‘火之河流’的初始脉动。背景中远方的白色城堡代表着雄心壮志的成果已经可以预见，这是一种对‘生殖能力’和‘行动之适切性’的神圣馈赠。", element: "Fire" },
  { id: 23, nameCn: "权杖二", nameEn: "Two of Wands", number: 2, suit: Suit.Wands, keywords: ["规划", "决策", "远见"], meaningUp: "站在高处进行远眺与规划。", meaningDown: "由于变动产生的恐惧。", description: "男子手中的地球仪象征着他正试图主宰宏观世界。他站在城堡的灰色围墙上，这堵墙作为‘火元素智慧’的一部分，代表他在迈出第一步之前必须建立的稳固基础。", element: "Fire" },
  { id: 24, nameCn: "权杖三", nameEn: "Three of Wands", number: 3, suit: Suit.Wands, keywords: ["展望", "扩张", "期待"], meaningUp: "成功的初步显现。", meaningDown: "受挫的野心。", description: "男子望着远方的船只，脚下的金黄色大地显示了‘太阳’般的成就潜能。远方的群山意味着这条路径已经越过了最初的阻碍，正向着更广阔的海平面扩张。", element: "Fire" },
  { id: 25, nameCn: "权杖四", nameEn: "Four of Wands", number: 4, suit: Suit.Wands, keywords: ["庆祝", "稳固", "社区"], meaningUp: "和谐与欢庆。", meaningDown: "基础不稳。", description: "作为背景的城堡围墙点缀着喜悦的鲜红色，意味着成功与高尚动机相连。四根权杖组成的门廊是一个临时的‘圣殿’，在其中，人类与自然的合作达成了完美的阶段性和谐。", element: "Fire" },
  { id: 26, nameCn: "权杖五", nameEn: "Five of Wands", number: 5, suit: Suit.Wands, keywords: ["竞争", "冲突", "混乱"], meaningUp: "良性竞争。", meaningDown: "逃避冲突。", description: "五个男子手持权杖在乱斗。虽然混乱，但他们所踩的土地预示这是一条通过冲突来实现显化的路径。这里没有真正的盔甲或旗帜，暗示这是一场原始意志的互动博弈。", element: "Fire" },
  { id: 27, nameCn: "权杖六", nameEn: "Six of Wands", number: 6, suit: Suit.Wands, keywords: ["胜利", "荣誉", "认可"], meaningUp: "公众赞赏。", meaningDown: "自命不凡。", description: "骑在白色骏马上的胜利者。马作为高贵的‘本能工具’载着他的理想，骑士头顶的花环与马头上的羽毛装饰共同宣示了他在世俗战场上的显赫身份。", element: "Fire" },
  { id: 28, nameCn: "权杖七", nameEn: "Seven of Wands", number: 7, suit: Suit.Wands, keywords: ["防御", "坚持", "勇气"], meaningUp: "捍卫立场。", meaningDown: "精疲力竭。", description: "男子在高处抵御下方的攻击。背景中隆起的山脉象征他已经到达了精神的更高维度，但他必须在此展示出对抗‘重力’（下方威胁）的绝对意志力。", element: "Fire" },
  { id: 29, nameCn: "权杖八", nameEn: "Eight of Wands", number: 8, suit: Suit.Wands, keywords: ["迅速", "行动", "信息"], meaningUp: "极速进展。", meaningDown: "延误阻碍。", description: "八根权杖在天空中飞驰，如同‘火之羽毛’。下方平缓流动的河流象征着显化过程正在以势头推进。没有高山阻挡，意味着阻力已被消除，一切处于完美的流向中。", element: "Fire" },
  { id: 30, nameCn: "权杖九", nameEn: "Nine of Wands", number: 9, suit: Suit.Wands, keywords: ["韧性", "防备", "坚持"], meaningUp: "最后的考验。", meaningDown: "偏执疲惫。", description: "受伤的战士靠在权杖上，头上的绷带暗示了一种‘被迫的盲目’或精神创伤。他身后的权杖构成了一道类似柱子的防御网，象征他在跨入最后圣殿之前必须经受住考验。", element: "Fire" },
  { id: 31, nameCn: "权杖十", nameEn: "Ten of Wands", number: 10, suit: Suit.Wands, keywords: ["重担", "责任", "压力"], meaningUp: "重压与终点。", meaningDown: "崩溃逃避。", description: "男子弯腰背着沉重的权杖走向城镇。远方的城镇中有隐约可见的城堡。这条路径对他来说过于沉重，暗示了过度承诺会导致灵魂的轻盈度（羽毛）丧失。", element: "Fire" },
  { id: 32, nameCn: "权杖侍从", nameEn: "Page of Wands", number: 11, suit: Suit.Wands, keywords: ["热情", "探索", "消息"], meaningUp: "探索精神。", meaningDown: "幼稚冲动。", description: "他在沙漠中注视着发芽的权杖。他帽上那根鲜红的羽毛是‘火元素’最直接的显现，代表着灵魂最初始的、渴望向上飞翔的灵感。背景的高山预示着即将开启的冒险。", element: "Fire" },
  { id: 33, nameCn: "权杖骑士", nameEn: "Knight of Wands", number: 12, suit: Suit.Wands, keywords: ["冲动", "激情", "行动"], meaningUp: "勇往直前。", meaningDown: "鲁莽傲慢。", description: "红色的马是一匹‘太阳之马’，火热且极速。骑士穿着绘有火蜥蜴图案的盔甲（Armor），代表他完全臣服于火元素的原始动力。他头盔上的红色羽毛如同火焰本身。", element: "Fire" },
  { id: 34, nameCn: "权杖皇后", nameEn: "Queen of Wands", number: 13, suit: Suit.Wands, keywords: ["自信", "热情", "慷慨"], meaningUp: "成熟且自信。", meaningDown: "暴躁好胜。", description: "她坐在绘有狮子图案的王座上。王冠下的黑猫是她野性本能的温驯化。她身后的挂毯中隐含着花园的意象，代表她已在荒原中培育出了秩序。手中的向日葵是与太阳能量连接的标记。", element: "Fire" },
  { id: 35, nameCn: "权杖国王", nameEn: "King of Wands", number: 14, suit: Suit.Wands, keywords: ["远见", "权力", "领导力"], meaningUp: "极具远见。", meaningDown: "独裁自负。", description: "国王穿着完全武装的盔甲（Armor），坐在石座上，表明他的权力基于‘已实现的防御’。头上的王冠顶部像火焰一样跳动，象征他是火元素圣殿的终极主宰。", element: "Fire" },

  // Cups (36-49)
  { id: 36, nameCn: "圣杯首牌", nameEn: "Ace of Cups", number: 1, suit: Suit.Cups, keywords: ["爱", "新感情", "直觉"], meaningUp: "情感的爆发。", meaningDown: "情感枯竭。", description: "云中伸出的手托着圣杯，象征着‘水之河流’的原始喷涌。下方的水池（Pools）中长满了莲花，意味着在沉静的潜意识深处，神圣的爱已经开始显化其完美的生命形态。", element: "Water" },
  { id: 37, nameCn: "圣杯二", nameEn: "Two of Cups", number: 2, suit: Suit.Cups, keywords: ["伴侣", "统一", "互惠"], meaningUp: "平等伙伴关系。", meaningDown: "沟通不畅。", description: "一对男女交换杯子，上方的双蛇杖带有一对红色羽毛翅膀，象征着沟通的灵性提升。背景远方的花园建筑代表了世俗安全感（城堡）的微型化，意味着情感关系的统合。", element: "Water" },
  { id: 38, nameCn: "圣杯三", nameEn: "Three of Cups", number: 3, suit: Suit.Cups, keywords: ["庆典", "友谊", "协作"], meaningUp: "欢乐社交。", meaningDown: "过度放纵。", description: "三个女子举杯欢庆。她们身处于丰收的花园之中，这代表社交情感的协作达成了人工培育后的完美状态。这里的‘花园’是由人类的喜悦与分享所共同‘显化’出的圣地。", element: "Water" },
  { id: 39, nameCn: "圣杯四", nameEn: "Four of Cups", number: 4, suit: Suit.Cups, keywords: ["厌倦", "沉思", "冷漠"], meaningUp: "对现状不满。", meaningDown: "重新投入。", description: "男子坐在树下，对云端伸出的圣杯不闻不问。这云朵带来的是带有‘遮蔽性’的情绪，让他陷入了内省。虽然身处自然的草地，但他内在的河流已经干涸，无法感知外界指引。", element: "Water" },
  { id: 40, nameCn: "圣杯五", nameEn: "Five of Cups", number: 5, suit: Suit.Cups, keywords: ["悲伤", "失去", "后悔"], meaningUp: "关注损失。", meaningDown: "逐渐疗愈。", description: "黑袍男子对着三个倒下的杯子叹息。身后的河流象征生命的必然显化，虽然此刻流经‘悲伤之谷’，但远方的桥梁意味着路径并未中断。建筑背景暗示这是一道关于失去的门槛。", element: "Water" },
  { id: 41, nameCn: "圣杯六", nameEn: "Six of Cups", number: 6, suit: Suit.Cups, keywords: ["怀旧", "天真", "重逢"], meaningUp: "回忆往事。", meaningDown: "沉溺过去。", description: "孩子们身处于受保护的花园中，这是‘伊甸园’在记忆中的投影。杯中的白百合象征纯净愿望。背景中坚固的灰色石墙表明，这种童年纯真所带来的安全感如同城堡一般稳固。", element: "Water" },
  { id: 42, nameCn: "圣杯七", nameEn: "Seven of Cups", number: 7, suit: Suit.Cups, keywords: ["幻想", "选择", "诱惑"], meaningUp: "眼花缭乱的选择。", meaningDown: "现实感回归。", description: "男子面对云中浮现的杯子。云朵在此不仅是变幻莫测的镜像，更是迷茫的遮蔽物。杯中的城堡、蛇等内容都是‘反射的幻影’。代表意识在进入真实圣殿之前必然经历的考验。", element: "Water" },
  { id: 43, nameCn: "圣杯八", nameEn: "Eight of Cups", number: 8, suit: Suit.Cups, keywords: ["离去", "寻找", "放手"], meaningUp: "追寻更高真理。", meaningDown: "恐惧未知。", description: "男子在夜晚穿行山岭，上方是交蚀的月亮。月亮在此作为‘反射的导师’，提示他必须离开物质的圆满。他拄着的长杖划出一条向上的路径，直指那座‘冰冷智慧’的高山。", element: "Water" },
  { id: 44, nameCn: "圣杯九", nameEn: "Nine of Cups", number: 9, suit: Suit.Cups, keywords: ["满足", "心愿达成", "享受"], meaningUp: "情感的愉悦。", meaningDown: "空虚的满足。", description: "男子双臂交叉坐在九个金杯前，这被书中戏称为‘情感的城堡’。他稳固的坐姿和背后的幕帘形成了一个半封闭空间，宣示着他对当下的绝对掌控。他的整个人格就是一面身份旗帜。", element: "Water" },
  { id: 45, nameCn: "圣杯十", nameEn: "Ten of Cups", number: 10, suit: Suit.Cups, keywords: ["和谐", "幸福", "家庭"], meaningUp: "情感圆满。", meaningDown: "家庭纠纷。", description: "彩虹下的幸福家庭，远方的绿草地构成了花园。彩虹作为‘天空的神迹’，预示着情感河流已经流向了汇合点。背景中的小房子是宁静城堡的象征，代表秩序、法律与爱的统合。", element: "Water" },
  { id: 46, nameCn: "圣杯侍从", nameEn: "Page of Cups", number: 11, suit: Suit.Cups, keywords: ["敏感", "直觉", "消息"], meaningUp: "感性沟通。", meaningDown: "逃避现实。", description: "少年看着杯中探出头的小鱼。他帽檐下的蓝色羽毛是‘水之气’的象征，代表灵敏直觉。身后的波浪暗示情感能量正在产生最初的涟漪，这种‘反射力量’正诱惑着他潜入深度。", element: "Water" },
  { id: 47, nameCn: "圣杯骑士", nameEn: "Knight of Cups", number: 12, suit: Suit.Cups, keywords: ["浪漫", "邀约", "理想"], meaningUp: "追求梦想。", meaningDown: "不切实际。", description: "骑士策动他的骏马优雅前行。骑士头盔和脚踝上的蓝色羽毛翅膀代表他正通过‘心之路径’飞翔。他正试图越过画面中的小河，寻找将情感潜力转化为神圣显化的祭坛。", element: "Water" },
  { id: 48, nameCn: "圣杯皇后", nameEn: "Queen of Cups", number: 13, suit: Suit.Cups, keywords: ["同理心", "慈悲", "母性"], meaningUp: "温柔照顾者。", meaningDown: "情感依赖。", description: "她端坐在水边，王座刻有贝壳。她手中的圣杯是整副牌中最华丽的，顶部如同一个小圆顶圣殿。她统治着水池，主宰着‘反射法则’，能洞察潜伏在阴影中的真实情感。", element: "Water" },
  { id: 49, nameCn: "圣杯国王", nameEn: "King of Cups", number: 14, suit: Suit.Cups, keywords: ["成熟", "掌控情感", "睿智"], meaningUp: "情绪管控专家。", meaningDown: "情感操纵。", description: "坐在海中王座上的国王。尽管波浪汹涌，他依然稳如泰山，象征他已通过意志建立了内在城堡。他脖子上的圣杯挂饰代表他完全掌控了‘水之力量’，并将情感转化为稳固权威。", element: "Water" },

  // Swords (50-63)
  { id: 50, nameCn: "宝剑首牌", nameEn: "Ace of Swords", number: 1, suit: Suit.Swords, keywords: ["理智", "突破", "清晰"], meaningUp: "理性的胜利。", meaningDown: "误解混乱。", description: "云中伸出的手握住宝剑，剑顶悬挂着缀有玫瑰与百合的王冠。象征着‘理智的河流’切割开云层后获得神圣认可。这种突破伴随着绝对清晰，即‘宏观世界的宁静’注入了思想。", element: "Air" },
  { id: 51, nameCn: "宝剑二", nameEn: "Two of Swords", number: 2, suit: Suit.Swords, keywords: ["僵局", "对峙", "抉择"], meaningUp: "选择性的盲目。", meaningDown: "被迫决定。", description: "蒙眼女子交叉双剑。眼罩在此是为了寻找‘内在视觉’的平衡。背后的月亮与水面构成了极强的‘反射性’环境，暗示在理智停滞时，必须通过直觉的十字交点来寻获平静。", element: "Air" },
  { id: 52, nameCn: "宝剑三", nameEn: "Three of Swords", number: 3, suit: Suit.Swords, keywords: ["心碎", "悲伤", "离别"], meaningUp: "情感痛苦。", meaningDown: "疗愈阶段。", description: "三把剑穿透红心，背景是雨云。云朵在此不仅反映‘内心天气’，更构成遮蔽真理的迷雾。雨水作为‘自净河流’，暗示痛苦是为了洗涤灵魂中由于欲望产生的残渣。", element: "Air" },
  { id: 53, nameCn: "宝剑四", nameEn: "Four of Swords", number: 4, suit: Suit.Swords, keywords: ["休息", "疗愈", "沉思"], meaningUp: "精神撤退。", meaningDown: "精疲力竭。", description: "骑士雕像静卧在教堂内。这是一个典型的‘石之殿’环境。这里的‘静止’是为了在稳固结构内部寻求精神的‘再次飞行’，剑的挂起意味着暂时放下了斗争的盔甲。", element: "Air" },
  { id: 54, nameCn: "宝剑五", nameEn: "Five of Swords", number: 5, suit: Suit.Swords, keywords: ["损失", "冲突", "虚假胜利"], meaningUp: "赢了面子输了里子。", meaningDown: "寻求妥协。", description: "男子收缴败者的剑，背景是锯齿状云朵。这种扭曲的云反映了‘被云雾遮蔽的判断力’。由于缺乏圣殿保护和高山远景，这种胜利注定会带来灵魂的沉重（重力）。", element: "Air" },
  { id: 55, nameCn: "宝剑六", nameEn: "Six of Swords", number: 6, suit: Suit.Swords, keywords: ["过渡", "疗愈", "离开"], meaningUp: "渡过难关。", meaningDown: "被困原地。", description: "男子划船渡向平静水域。河流作为‘显化的必然路径’，正载着他们从波折走向宁静。远方的树木暗示陆地上的‘新花园’。这是一条理性逃生之路，通过顺应时势实现自净。", element: "Air" },
  { id: 56, nameCn: "宝剑七", nameEn: "Seven of Swords", number: 7, suit: Suit.Swords, keywords: ["欺骗", "逃避", "秘密"], meaningUp: "狡猾手段。", meaningDown: "良心发现。", description: "男子偷走宝剑。虽然没有披甲，但他狡猾的路径在云朵下穿行，象征利用信息的‘非可见性’达成目的。远方露出的城堡顶端意味着他正试图在别人权威边缘窃取权力碎片。", element: "Air" },
  { id: 57, nameCn: "宝剑八", nameEn: "Eight of Swords", number: 8, suit: Suit.Swords, keywords: ["束缚", "困境", "限制"], meaningUp: "自我设限。", meaningDown: "重获自由。", description: "她被捆绑且蒙眼。眼罩（Blindfolds）在此是强加的黑暗。地面的泥沼和宝剑构成屏障。只有当她开启‘内在视觉’并挣脱虚假的‘重力’时，通往圣殿的路径才会显现。", element: "Air" },
  { id: 58, nameCn: "宝剑九", nameEn: "Nine of Swords", number: 9, suit: Suit.Swords, keywords: ["焦虑", "噩梦", "折磨"], meaningUp: "极度担忧。", meaningDown: "认清幻觉。", description: "人在床上掩面痛哭。黑暗环境意味着这是月亮的负面反射区。被子上的玫瑰暗示世俗欲望正受到宿命周期的折磨。这是一种精神上的‘眼罩状态’，因恐惧无法看到理智太阳。", element: "Air" },
  { id: 59, nameCn: "宝剑十", nameEn: "Ten of Swords", number: 10, suit: Suit.Swords, keywords: ["终结", "失败", "最低点"], meaningUp: "彻底瓦解。", meaningDown: "绝处逢生。", description: "背部插满十把剑的男子卧在岸边。晨曦已现，远方的高山预示地平线极限已被触达，‘重力’完成了毁灭任务。接下来是灵魂在太阳下的重生，这也是‘必然显化’的一部分。", element: "Air" },
  { id: 60, nameCn: "宝剑侍从", nameEn: "Page of Swords", number: 11, suit: Suit.Swords, keywords: ["警觉", "敏锐", "好奇"], meaningUp: "理智年轻。", meaningDown: "流言蜚语。", description: "少年在多风高地。头顶群鸟作为羽毛（Feathers）的生体表达，象征思想极速飞行。波动的云朵与他的发辫相应，预示一种敏锐的、准备切割遮蔽物的纯粹理智正在形成。", element: "Air" },
  { id: 61, nameCn: "宝剑骑士", nameEn: "Knight of Swords", number: 12, suit: Suit.Swords, keywords: ["智慧", "迅速", "直率"], meaningUp: "追求真相。", meaningDown: "鲁莽失败。", description: "骑士冲入狂风。他的白马是象征‘意志力’的骏马，奋力前冲代表对‘重力’的摆脱。盔甲上的披风如同羽毛飘扬，标志他在通过‘理智路径’切割开遮天蔽日的云朵。", element: "Air" },
  { id: 62, nameCn: "宝剑皇后", nameEn: "Queen of Swords", number: 13, suit: Suit.Swords, keywords: ["客观", "独立", "清晰"], meaningUp: "客观独立。", meaningDown: "挑剔冷酷。", description: "她端坐在云端之上的王座。王冠由蝴蝶点缀。身后的云海象征她超越了普通气象，到达了纯净理智的‘高层圣殿’。伸出的左手仿佛拨开云朵直视真相。这是灵魂轻盈后的结果。", element: "Air" },
  { id: 63, nameCn: "宝剑国王", nameEn: "King of Swords", number: 14, suit: Suit.Swords, keywords: ["权威", "秩序", "逻辑"], meaningUp: "绝对理智。", meaningDown: "暴政残忍。", description: "正面端坐国王。王座蝴蝶浮雕与肩膀天使意象呼应，象征他是‘理智河流’的最高裁决者。他手中的剑直指天空，意味着法律是基于‘宏观世界’的绝对秩序。", element: "Air" },

  // Pentacles (64-77)
  { id: 64, nameCn: "星币首牌", nameEn: "Ace of Pentacles", number: 1, suit: Suit.Pentacles, keywords: ["繁荣", "机遇", "显化"], meaningUp: "财务机会。", meaningDown: "不切实际开销。", description: "这不仅是手的礼物，更是一座繁茂的‘伊甸园’。百合长在草地，玫瑰生在绿篱。穿过绿篱的拱门（门框），远方的高山预示物质成功最终会转化为灵性顶峰。这是大地之河的始端。", element: "Earth" },
  { id: 65, nameCn: "星币二", nameEn: "Two of Pentacles", number: 2, suit: Suit.Pentacles, keywords: ["平衡", "适应", "多变"], meaningUp: "灵活处理。", meaningDown: "财务混乱。", description: "男子转动星币，其间的无穷大符号象征时间循环。背景动荡的海洋与颠簸船只代表‘反射的动荡’。这是一种在流动的‘物质河流’中寻找等臂十字般内在平衡的过程。", element: "Earth" },
  { id: 66, nameCn: "星币三", nameEn: "Three of Pentacles", number: 3, suit: Suit.Pentacles, keywords: ["合作", "技艺", "认可"], meaningUp: "专业协作。", meaningDown: "质量低劣。", description: "工匠在石之殿中工作。这代表‘垂直力量’（灵感）与‘水平实施’（技术）的十字交叉点。那三颗星币放置在圣殿拱门上方，意味着人类技艺是构建灵魂圣殿的基石。", element: "Earth" },
  { id: 67, nameCn: "星币四", nameEn: "Four of Pentacles", number: 4, suit: Suit.Pentacles, keywords: ["吝啬", "稳固", "固守"], meaningUp: "保守稳健。", meaningDown: "变动恐惧。", description: "男子死死踩住和抱住星币，背景远方是灰色的城堡。他由于对‘重力’（物质安全感）的极度执着，导致无法走向显化河流，也失去了灵魂的轻盈度（羽毛）。", element: "Earth" },
  { id: 68, nameCn: "星币五", nameEn: "Five of Pentacles", number: 5, suit: Suit.Pentacles, keywords: ["困境", "逆境", "排斥"], meaningUp: "经济危机。", meaningDown: "危机好转。", description: "两个乞丐在雪夜走过。背景彩色玻璃窗代表‘由于眼罩（贫乏）无法进入的圣殿’。地面的积雪意味着‘冰封的河流’。这是一条在逆境中寻找灵性高山的苦修路径。", element: "Earth" },
  { id: 69, nameCn: "星币六", nameEn: "Six of Pentacles", number: 6, suit: Suit.Pentacles, keywords: ["慷慨", "平衡", "共享"], meaningUp: "施予与平衡。", meaningDown: "财务纠纷。", description: "富人给穷人分发硬币。天平是‘十字架’的延伸，代表物质资源在世俗圣殿中的公平流向。这是一次关于‘权力的恩慈表达’，代表通过分享打通阻塞的情感河流。", element: "Earth" },
  { id: 70, nameCn: "星币七", nameEn: "Seven of Pentacles", number: 7, suit: Suit.Pentacles, keywords: ["收获", "评估", "耐心"], meaningUp: "等待成熟。", meaningDown: "缺乏耐心。", description: "男子靠在工具上。面对的是一座‘正在发育的花园’。这里的静止并非停滞，而是为了等待显化的必然周期。远方的灰蓝色山丘意味着背后承载着灵魂进化的宏远任务。", element: "Earth" },
  { id: 71, nameCn: "星币八", nameEn: "Eight of Pentacles", number: 8, suit: Suit.Pentacles, keywords: ["勤奋", "专精", "细节"], meaningUp: "工匠精神。", meaningDown: "平庸乏味。", description: "他在通往城镇的路径上工作。这条‘共济会之路’代表通过有序劳动构建灵魂城堡。背景房屋显示通过坚持不懈的‘心之路径’，一个人可以从孤独劳作显化为稳固堡垒。", element: "Earth" },
  { id: 72, nameCn: "星币九", nameEn: "Nine of Pentacles", number: 9, suit: Suit.Pentacles, keywords: ["独立", "富足", "享受"], meaningUp: "自给自足。", meaningDown: "虚荣负债。", description: "华丽女子在她的秘密花园。手上的猎鹰带着眼罩，象征‘受控制的意志’，也意味着在享受花园繁荣时，必须屏蔽外界干扰。这是在物质界获得的最高自律与完美的显化结果。", element: "Earth" },
  { id: 73, nameCn: "星币十", nameEn: "Ten of Pentacles", number: 10, suit: Suit.Pentacles, keywords: ["遗产", "家族", "积累"], meaningUp: "长久成功。", meaningDown: "家族纠纷。", description: "三代同堂场景发生在城堡拱门下。这不仅是财富积累，更是‘血脉圣殿’。背景旗帜投射荣耀身份。星币排列构成了卡巴拉形状，意味着丰硕最终指向了上天与大地的联姻。", element: "Earth" },
  { id: 74, nameCn: "星币侍从", nameEn: "Page of Pentacles", number: 11, suit: Suit.Pentacles, keywords: ["务实", "机会", "学习"], meaningUp: "脚踏实地。", meaningDown: "贪婪小聪明。", description: "少年在田野注视星币。帽檐上的羽毛是‘大地的呼吸’，代表深思熟虑后的灵感。背景茂密的林木花园意味着他正处于将一个伟大理念转化为‘石之殿’的最初阶段。", element: "Earth" },
  { id: 75, nameCn: "星币骑士", nameEn: "Knight of Pentacles", number: 12, suit: Suit.Pentacles, keywords: ["可靠", "责任", "规律"], meaningUp: "稳扎稳打。", meaningDown: "保守错失。", description: "骑士坐在静止黑马上。马是‘大地之马’，象征绝对稳固与止息。盔甲是实战型的，代表对任务忠诚。马头上的红色羽毛装饰暗示沉稳大地元素中潜伏着火一般的进取心。", element: "Earth" },
  { id: 76, nameCn: "星币皇后", nameEn: "Queen of Pentacles", number: 13, suit: Suit.Pentacles, keywords: ["繁荣", "慈爱", "务实"], meaningUp: "高明管家。", meaningDown: "金钱焦虑。", description: "皇后坐在繁花盛开的山谷。周围的花园是她德行的显化。她手中的星币作为‘大地的王冠’被细心呵护，意味着她已在物质界建立了一个既安全又丰盈的生命祭坛。", element: "Earth" },
  { id: 77, nameCn: "星币国王", nameEn: "King of Pentacles", number: 14, suit: Suit.Pentacles, keywords: ["富庶", "稳健", "商业巨头"], meaningUp: "物质顶峰。", meaningDown: "贪得无厌。", description: "国王坐在公牛王座。长袍下的盔甲钢靴显示他不仅富豪，更是战士。王座被繁荣的花园包围，远方的城堡宣示他是显化之道的执行者。他的权威如同高山般不可撼动。", element: "Earth" }
];

export const tarotSymbols: TarotSymbol[] = [
  {
    id: "crowns", nameCn: "王冠", nameEn: "Crowns", category: "Divine",
    generalMeaning: "王冠位于头顶（身体的顶峰），在维特塔罗中象征‘压倒性的重要性’。它是一枚佩戴在头上的戒指，标志着个人意志与神圣认可的联姻。金质王冠关联炼金术中黄金的纯度，代表进化的最高境界。王冠不仅是权力的奖赏，更是一种卓越的职责（如救赎、领导）。",
    details: [], integrationAdvice: "在解读中，它提示当前事项具有核心地位。接受它意味着承认你对完美的追求。记住：真正的权威源于内在的平衡。"
  },
  {
    id: "pillars", nameCn: "柱子", nameEn: "Pillars", category: "Artifact",
    generalMeaning: "柱子是垂直的阳性能量，代表对现状的超越与抵抗。通常成对出现，定义了一个‘内/外’的分界。外部是平凡世界，内部是隐藏的智慧圣所。著名的黑白双柱代表了二元极性的平衡，只有通过它们之间的路径，灵魂才能进入真理圣殿。",
    details: [], integrationAdvice: "它暗示你需要跨越某个认知门槛。在对立的冲突中寻找那个静止的中心点。准备好放弃部分表象的自我，去探索深层的真实。"
  },
  {
    id: "roses", nameCn: "玫瑰与百合", nameEn: "The Rose and The Lily", category: "Nature",
    generalMeaning: "这是一组复合象征。红玫瑰（五瓣）象征物质世界的渴望、激情与肉体经验（微观世界）；白百合（六瓣）象征灵性的觉醒、理性的纯洁与宏观秩序。百合从不孤立出现，预示着灵与肉、显化与回归的‘神圣婚姻’。这种结合是解决生命不和谐的终极方案。",
    details: [], integrationAdvice: "审视你的动机：你是受热情的玫瑰驱使，还是受清醒的百合指引？现在的任务是将两者统合，在物质界中创造出具有灵性高度的作品。"
  },
  {
    id: "paths", nameCn: "路径", nameEn: "Paths", category: "Nature",
    generalMeaning: "路径在现实中普通，但在塔罗中是‘促进必然结果发生的渠道’。它通常狭窄、自然，强调体验而非终点。路径连接了脚下的当下与远方的未知。书中的核心智慧是：‘心之路径’是一条由纯粹意图踩踏出来的活路，而非社会强制修筑的死道。",
    details: [], integrationAdvice: "专注于当下脚下的那一小步。不要被遥远目标的虚无感吞噬。如果这一步让你感到生命力的流动，那么这就是你现在该走的道路。"
  },
  {
    id: "mountains", nameCn: "高山", nameEn: "Mountains", category: "Nature",
    generalMeaning: "高山象征地平线的极限、极端的考验与顶峰视角。远看是宏大的愿景，近看则是危险的荒芜。山峰湮灭了平庸的自尊心，迫使人接触‘神圣事物’。它是意志力的阶梯，也是精神力从平凡迈向非凡的必经挑战。",
    details: [], integrationAdvice: "即便攀登之路孤独、寒冷且严酷，也要保持远大的视野。目前的阻碍正是提升你生命维度的炼金炉。山顶代表了灵魂的‘回家’状态。"
  },
  {
    id: "crosses", nameCn: "十字架", nameEn: "Crosses", category: "Artifact",
    generalMeaning: "十字架是纯粹意识的标志，代表对立面互动的创造性火花。水平线象征现状与稳定，垂直线象征动态与变革。十字的交汇点是一个‘永生喷泉’。X型十字代表抉择与牺牲的喜悦，拉丁十字象征对现状的不满，等臂十字则象征整体的宁静。",
    details: [], integrationAdvice: "你正处于生命不同维度的交汇点。接受这种张力，而非逃避冲突。利用对立能量的碰撞来开启全新的可能性。X标记了宝藏，也标记了选择。"
  },
  {
    id: "moons", nameCn: "月亮", nameEn: "Moons", category: "Nature",
    generalMeaning: "月亮是内在的女性面，主宰夜晚、周期与潜意识阴影。由于它的光是反射的，一切在月光下都显得模糊、多变且不确定。它象征着幻觉、直觉的力量以及时间如圆环般转动的循环逻辑。它是进入真实光亮之前的‘过渡地带’。",
    details: [], integrationAdvice: "信任你的直觉，即便环境看起来充满迷惑。在阴影中观察你潜意识的真实脉动。不要被表象的扭曲吓倒，那只是为了磨练你的‘内在视觉’。"
  },
  {
    id: "stars", nameCn: "星星", nameEn: "Stars", category: "Nature",
    generalMeaning: "星星具有‘无法触及、无法计数、无法靠近’的崇高属性。它们是希望与宇宙祝福的标志。在最黑暗的灵魂夜晚，星星是宏观世界的指引灯火。八角星（Venus）代表自然的完美契合，提醒我们凡人可以通过灵性的阶梯回到永恒的星空。",
    details: [], integrationAdvice: "保持信心。当前的愿景虽然遥不可及，但整个宇宙系统正在背后支持你。这是灵感迸发、感知自我与宇宙整体性契合的时刻。抬起头，光就在远方。"
  },
  {
    id: "pools", nameCn: "水池", nameEn: "Pools", category: "Nature",
    generalMeaning: "水池是静止的阴性能量，代表潜意识的蓄积与沉浸式洞察。不同于流动的河流，水池提供的是一种‘深度的反射’。它是意识苏醒前的原始状态，是冥想的深潭，也是灵魂显化生命奇迹的启动基盆。水面反射天界，深度隐藏秘密。",
    details: [], integrationAdvice: "停止外在的奔波。潜入你内心的平静水池，去探索那些隐藏在表面下的原始材料和潜力。现在的关键不是‘行动’，而是‘深度的沉浸’。"
  },
  {
    id: "horses", nameCn: "骏马", nameEn: "Horses", category: "Nature",
    generalMeaning: "马象征着驱动力、美德与高贵的工具。在塔罗中，马提供本能的推进力，而骑手提供理性的方向，两者是 inseparable（不可分割）的单元。马代表了灵魂在显化路径上的载体。不同颜色代表了从火（红）到大地（黑）再到超越（白）的能量转换。",
    details: [], integrationAdvice: "检视你的前进动力。你是被本能盲目牵引，还是在有意识地引导这股力量？马是忠诚的，给你的本能赋予一个清晰的目标，你们将无往不利。"
  },
  {
    id: "suns", nameCn: "太阳", nameEn: "Suns", category: "Nature",
    generalMeaning: "太阳是所有能量与权力的终极源头。它象征意识的彻底清晰、绝对的真理和不朽的生命力。太阳既是繁荣的保护，也包含着由于过度曝晒而导致的枯竭。它是生命的本质——有能力‘在场’并产生‘行动’。它是白昼的绝对主宰。",
    details: [], integrationAdvice: "现在是展示自我、公然显化的时刻。走出阴影，享受当下的成就。能量是无限的，只要你保持正直和透明，你就能点燃周围。blazing inside and outside."
  },
  {
    id: "banners", nameCn: "旗帜", nameEn: "Banners", category: "Artifact",
    generalMeaning: "旗帜由垂直杆（意志）与水平面（意义）构成，核心功能是‘投射身份’。它是图腾般的符号，在风中飘动时收集并聚焦能量。旗帜宣布了‘我在这里’，它是使命感的集结号。旗帜上的符号通常是理解一牌隐藏逻辑的最后钥匙。",
    details: [], integrationAdvice: "你需要明确表达立场。不要隐藏真实的理念，用一种无法被忽视的方式宣示你的身份或目标。当旗帜高举时，周围的人将依此对齐。信念将是你的防御。"
  },
  {
    id: "armor", nameCn: "盔甲", nameEn: "Armor", category: "Artifact",
    generalMeaning: "盔甲是‘战士的第二层皮肤’，象征防御、职业职责以及面对冲突时的公共形象。它代表为达成伟大目标必须承担的牺牲保护。在心理学上，它暗示了因恐惧而建立的‘隔离墙’。它既是力量的标志，也隐藏了内心的脆弱。",
    details: [], integrationAdvice: "询问自己：我的防御是出于职责（如骑士），还是出于不愿示弱的恐惧？适时的卸下或穿上盔甲都是必要的智慧。在这个阶段，你需要那份‘披甲上阵’的果敢。"
  },
  {
    id: "blindfolds", nameCn: "眼罩", nameEn: "Blindfolds", category: "Artifact",
    generalMeaning: "眼罩代表暂时的视觉限制。其正面作用是屏蔽外界干扰，以专注内部视觉和智慧（Insight）；负面则代表无知与拒绝现实。它象征通过限制感官来增强直觉的转化。眼罩是内在光芒显化之前的滤网，标志着一种‘特殊的黑暗’。",
    details: [], integrationAdvice: "停止用肉眼观察。真相现在不在嘈杂的外部。关闭逻辑分析，等待直觉在内心的‘黑暗’中自动浮现。当你不再被表象误导，真正的‘第三眼’才会睁开。"
  },
  {
    id: "feathers", nameCn: "羽毛", nameEn: "Feathers", category: "Nature",
    generalMeaning: "羽毛连接了风（自由）与火（精神能量）。它象征灵魂的轻盈、灵感以及从物质界向上提升的‘飞行能力’。红羽毛多见于火元素的热烈，白羽毛则代表精神的纯洁。它是神圣使者的标志，反映了灵魂当前所处的进化高度。",
    details: [], integrationAdvice: "让精神保持‘羽毛般轻盈’。不要被沉重的生活枷锁或逻辑死角拖累。尝试用更灵活、更具灵感的方式看待困境。当你足够轻盈时，神圣的‘火之风’会将你托起。"
  },
  {
    id: "castles", nameCn: "城堡", nameEn: "Castles", category: "Artifact",
    generalMeaning: "城堡是世俗权力的中心，是秩序、法律与隐私的堡垒。它代表了稳固的物理或社会基础，是来自‘高层’的恩惠流向个人的港湾。白色城堡关联神圣根基，灰色城堡强调沉稳的智慧积淀。它是显化成果的坚固见证。",
    details: [], integrationAdvice: "评估你的安全感源头。你是否已建立了足够稳固的个人主场？现在是巩固防线、利用成熟资源的时刻。向那个代表你内在力量的‘城堡’靠拢，那是你权力的基石。"
  },
  {
    id: "clouds", nameCn: "云朵", nameEn: "Clouds", category: "Nature",
    generalMeaning: "云是‘天空的情绪’，象征变幻莫测的思想与暂时的遮蔽。它们处于‘非物体’状态，反映了意识天空的阴晴不定。云朵既能带来迷茫，也能承载‘神之手’的馈赠。它是天与地的分界线，提醒我们现实之上存在着稀薄的理智带。",
    details: [], integrationAdvice: "意识到当前的困惑只是暂时的。就像云朵穿过天空，它们并不真正改变‘天空本身’的澄明。保持耐心，不要给一闪而过的念头过大权重，等待云影散去后的恒常真相。"
  },
  {
    id: "gardens", nameCn: "花园", nameEn: "Gardens", category: "Nature",
    generalMeaning: "花园是‘伊甸园’在塔罗中的投影，象征人工培育后的自然完美。它是德行耕耘后的外在奖赏，代表幸福、安全、繁荣与和谐。花园是灵魂回归真理途中的甜美停靠站，是显化成功的实验室。在其中，生命得到滋养而非掠夺。",
    details: [], integrationAdvice: "享受辛勤工作的成果。这是一个平和且生机勃勃的阶段。专注于‘培育’你的计划而非‘强求’，保持感恩的心。 harvest what you sowed. 你的微观环境正处于巅峰。"
  },
  {
    id: "rivers", nameCn: "河流", nameEn: "Rivers", category: "Nature",
    generalMeaning: "河流象征‘显化’的引擎（Manifestation）。水从源头降下，顺势流向大海，代表能量从潜力变为现实的必然流动。河流具有自净功能，代表在流动中洗涤业力（Karma）。它强调在不懈变动中依然保持和谐流向的智慧。",
    details: [], integrationAdvice: "停止抵抗。顺应事物的自然规律，像河流一样‘顺势而流’。你的难题会随着流程推进而自然解开或被‘洗去’。信任水流，它掌握着通往圆满的捷径。 float, don't swim."
  },
  {
    id: "towers", nameCn: "高塔", nameEn: "Towers", category: "Artifact",
    generalMeaning: "高塔象征人类对‘垂直权力’与‘主宰’的渴求，是对重力（限制）的反抗。它是野心与智力的最高结晶，但也包含自负的危险。如果‘塔’脱离了真实的基石，‘觉醒之雷’会将其击碎，让人重归真实。它是为了超越而进行的单向度努力。",
    details: [], integrationAdvice: "审视你的野心和信念。你的事业是否脱离了真实的根基？目前的努力需要极致的投入，但也要警惕过于自我中心带来的倾覆风险。Plan well, don't give up. 废墟之上才能建立真实。"
  },
  {
    id: "angels", nameCn: "天使", nameEn: "Angels", category: "Divine",
    generalMeaning: "天使是神圣意志的执行官僚，介于天与地之间。他们不产生命令，只负责‘送达’。天使的出现标志着某个宏大的宇宙章节正在开启或终结，是超自然干预的信号。他们是沟通、启示与催化剂，将神圣意图转化为凡人能理解的戏剧。",
    details: [], integrationAdvice: "保持对‘特殊启示’的开放。意识到一股更高级别的能量正在介入你的处境。通过专注和内心的呼唤来接收指引。天使的存在保证了：有些事情无需你亲力亲为，‘天职’正在运作中。"
  },
  {
    id: "temples", nameCn: "圣殿", nameEn: "Temples", category: "Artifact",
    generalMeaning: "书中第一个秘密是：塔罗中没有圣殿，因为‘塔罗本身就是圣殿’。它是用象征而非砖石构建的灵魂栖息地，是神圣存在的锚点。进入圣殿意味着你准备好面对终极奥秘，而它的围墙旨在保护弱小的心灵不被原始真理湮灭。它是知识的统一。",
    details: [], integrationAdvice: "意识到你当前所学的每一张牌都是你灵魂圣殿的基石。当你彻底看懂画面时，你就已置身于圣殿内部。不要向外寻找圣地，你自己就是承载神性的神圣器皿。真理就在光中。"
  }
];

export const spreads: Spread[] = [
  {
    id: 'one-card',
    name: '单牌排阵',
    description: '快速获得当日启示或问题的核心答案。',
    positions: [{ id: 1, name: '核心', description: '问题的核心或当前的能量。' }]
  },
  {
    id: 'time-stream',
    name: '时间之流',
    description: '揭示事物发展的脉络，适合看长期走向。',
    positions: [
      { id: 1, name: '过去', description: '导致现状的基础或历史原因。' },
      { id: 2, name: '现在', description: '当前正在发生的情况或挑战。' },
      { id: 3, name: '未来', description: '基于现状可能导致的结果。' }
    ]
  },
  {
    id: 'no-spread',
    name: '无牌阵',
    description: '随性抽取三张牌，通常第一张是主线，后两张是补充。',
    positions: [
      { id: 1, name: '主旨', description: '当前状况的核心基调。' },
      { id: 2, name: '影响 A', description: '第一个重要影响因素。' },
      { id: 3, name: '影响 B', description: '第二个重要影响因素。' }
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
      { id: 4, name: '他人的助力', description: '外部资源或贵人。' },
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

export const caseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    category: 'Love',
    question: '我和伴侣的未来会怎样？',
    context: '我们最近经常吵架，感觉沟通不畅。',
    cardId: 6,
    isReversed: false,
    interpretation: "恋人牌正位代表着和谐与选择。这张牌建议你们坐下来进行真诚的沟通，重新确立彼此的承诺。在天使的祝福下，你们的分歧可以被统合。",
    keyPoints: ['沟通', '承诺', '价值观统一']
  }
];

export const getCardImageUrl = (id: number): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  // Helper to map 1-14 to Sacred Texts codes (ac, 02-10, pa, kn, qu, ki)
  const getSuffix = (n: number) => {
    if (n === 1) return 'ac';
    if (n === 11) return 'pa';
    if (n === 12) return 'kn';
    if (n === 13) return 'qu';
    if (n === 14) return 'ki';
    return pad(n);
  };

  if (id <= 21) {
    return `https://www.sacred-texts.com/tarot/pkt/img/ar${pad(id)}.jpg`;
  } else if (id >= 22 && id <= 35) {
    // Wands: id 22 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/wa${getSuffix(id - 21)}.jpg`;
  } else if (id >= 36 && id <= 49) {
    // Cups: id 36 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/cu${getSuffix(id - 35)}.jpg`;
  } else if (id >= 50 && id <= 63) {
    // Swords: id 50 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/sw${getSuffix(id - 49)}.jpg`;
  } else if (id >= 64 && id <= 77) {
    // Pentacles: id 64 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/pe${getSuffix(id - 63)}.jpg`;
  }
  return `https://placehold.co/400x700?text=Card+${id}`;
};
