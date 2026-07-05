import { TarotSymbol } from '../types';

import angels from './symbols_extracted/angels.json';
import armor from './symbols_extracted/armor.json';
import banners from './symbols_extracted/banners.json';
import blindfolds from './symbols_extracted/blindfolds.json';
import castles from './symbols_extracted/castles.json';
import clouds from './symbols_extracted/clouds.json';
import crosses from './symbols_extracted/crosses.json';
import crowns from './symbols_extracted/crowns.json';
import feathers from './symbols_extracted/feathers.json';
import gardens from './symbols_extracted/gardens.json';
import horses from './symbols_extracted/horses.json';
import moons from './symbols_extracted/moons.json';
import mountains from './symbols_extracted/mountains.json';
import paths from './symbols_extracted/paths.json';
import pillars from './symbols_extracted/pillars.json';
import pools from './symbols_extracted/pools.json';
import rivers from './symbols_extracted/rivers.json';
import roses from './symbols_extracted/roses.json';
import stars from './symbols_extracted/stars.json';
import suns from './symbols_extracted/suns.json';
import temples from './symbols_extracted/temples.json';
import towers from './symbols_extracted/towers.json';

// 按照 The Secret Language of Tarot 原著章节顺序排列
// 这样学习是循序渐进的，从基础象征到复杂象征
export const tarotSymbols: TarotSymbol[] = [
  crowns,     // 1. 王冠 - 权力与成就
  pillars,    // 2. 柱子 - 结构与支撑
  roses,      // 3. 玫瑰 - 爱与欲望
  paths,      // 4. 路径 - 选择与方向
  mountains,  // 5. 山峰 - 挑战与超越
  crosses,    // 6. 十字 - 试炼与信仰
  moons,      // 7. 月亮 - 潜意识与直觉
  stars,      // 8. 星星 - 希望与指引
  pools,      // 9. 池塘 - 反思与深度
  horses,     // 10. 马 - 力量与自由
  suns,       // 11. 太阳 - 生命与觉醒
  banners,    // 12. 旗帜 - 宣示与归属
  armor,      // 13. 盔甲 - 防御与准备
  blindfolds, // 14. 眼罩 - 内视与限制
  feathers,   // 15. 羽毛 - 轻盈与灵性
  castles,    // 16. 城堡 - 安全与防护
  clouds,     // 17. 云 - 思想与变化
  gardens,    // 18. 花园 - 培育与成长
  rivers,     // 19. 河流 - 情感与流动
  towers,     // 20. 高塔 - 崩塌与重建
  angels,     // 21. 天使 - 神圣与启示
  temples,    // 22. 神殿 - 智慧与秘传
] as TarotSymbol[];
