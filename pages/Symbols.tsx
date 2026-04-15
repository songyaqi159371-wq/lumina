import React, { useState } from 'react';
import { tarotSymbols, getCardImageUrl } from '../constants';
import { TarotSymbol } from '../types';
import { 
    Search, Book, ChevronLeft, Sparkles, Wind, Shield, Cloud, 
    Sun, Moon, Mountain, Waves, Crown, Columns, 
    Flower2, Heart, EyeOff, Flag, Castle, Trees, Building2, Route, 
    Cross, Zap
} from 'lucide-react';

const Symbols: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState<TarotSymbol | null>(null);

    const filteredSymbols = tarotSymbols.filter(s => 
        s.nameCn.includes(searchTerm) || s.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSymbolIcon = (id: string, sizeClass = "w-5 h-5") => {
        const props = { className: `${sizeClass} transition-transform duration-500 group-hover:scale-110` };
        switch(id) {
            case 'crowns': return <Crown {...props} className={`${props.className} text-amber-400`} />;
            case 'pillars': return <Columns {...props} className={`${props.className} text-slate-400`} />;
            case 'roses': return <Heart {...props} className={`${props.className} text-red-500`} />;
            case 'paths': return <Route {...props} className={`${props.className} text-emerald-500`} />;
            case 'mountains': return <Mountain {...props} className={`${props.className} text-blue-400`} />;
            case 'crosses': return <Cross {...props} className={`${props.className} text-mystic-gold`} />;
            case 'moons': return <Moon {...props} className={`${props.className} text-indigo-300`} />;
            case 'stars': return <Sparkles {...props} className={`${props.className} text-yellow-200`} />;
            case 'pools': return <Waves {...props} className={`${props.className} text-cyan-500`} />;
            case 'rivers': return <Waves {...props} className={`${props.className} text-blue-500 rotate-90`} />;
            case 'horses': return <Wind {...props} className={`${props.className} text-amber-100`} />;
            case 'suns': return <Sun {...props} className={`${props.className} text-orange-400`} />;
            case 'banners': return <Flag {...props} className={`${props.className} text-red-400`} />;
            case 'armor': return <Shield {...props} className={`${props.className} text-slate-400`} />;
            case 'blindfolds': return <EyeOff {...props} className={`${props.className} text-slate-600`} />;
            case 'feathers': return <Wind {...props} className={`${props.className} text-white opacity-80`} />;
            case 'castles': return <Castle {...props} className={`${props.className} text-stone-400`} />;
            case 'clouds': return <Cloud {...props} className={`${props.className} text-slate-500`} />;
            case 'gardens': return <Trees {...props} className={`${props.className} text-green-500`} />;
            case 'towers': return <Building2 {...props} className={`${props.className} text-orange-700`} />;
            case 'angels': return <Zap {...props} className={`${props.className} text-violet-400 animate-pulse`} />;
            case 'temples': return <Book {...props} className={`${props.className} text-cyan-400`} />;
            default: return <Sparkles {...props} />;
        }
    };

    if (!selectedSymbol) {
        return (
            <div className="h-full animate-flip-in pb-20">
                <header className="mb-12 border-b border-mystic-700 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Book className="text-mystic-gold w-4 h-4" />
                            <span className="text-mystic-gold font-serif tracking-widest uppercase text-[10px]">The Secret Language of Tarot</span>
                        </div>
                        <h1 className="text-3xl font-serif text-white mb-2">塔罗象征百科</h1>
                        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed font-light">
                            解析维特塔罗（RWS）视觉图像中的 22 种核心语法。内容严格依据 Ruth Ann 和 Wald Amberstone 的原著整理，按章节逻辑呈现。
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text"
                            placeholder="检索符号（如：路径、高塔）..."
                            className="w-full pl-10 pr-4 py-2.5 bg-mystic-800/40 border border-mystic-700 rounded-xl text-white text-sm focus:outline-none focus:border-mystic-gold/40 transition shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSymbols.map((symbol, idx) => (
                        <div 
                            key={symbol.id}
                            onClick={() => setSelectedSymbol(symbol)}
                            className="bg-mystic-800/20 border border-mystic-700/50 p-6 rounded-2xl hover:border-mystic-gold/30 cursor-pointer transition-all hover:bg-mystic-800/30 group flex flex-col min-h-[240px] shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-mystic-700/50 group-hover:border-mystic-gold/30 transition-colors shadow-inner">
                                    {getSymbolIcon(symbol.id, "w-6 h-6")}
                                </div>
                                <span className="text-mystic-800 font-serif text-2xl group-hover:text-mystic-gold/10 transition-colors select-none font-bold">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-serif text-white mb-1 group-hover:text-mystic-gold transition-colors">{symbol.nameCn}</h3>
                            <p className="text-mystic-500 text-[10px] font-serif uppercase tracking-[0.2em] mb-4">{symbol.nameEn}</p>
                            
                            <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed flex-1 font-light italic">
                                {symbol.generalMeaning}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full animate-flip-in pb-20 max-w-4xl mx-auto">
            <nav className="mb-8">
                <button 
                    onClick={() => setSelectedSymbol(null)}
                    className="flex items-center gap-2 text-mystic-gold hover:text-white transition group py-2"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-serif">返回百科列表</span>
                </button>
            </nav>

            <article className="bg-mystic-800/30 rounded-3xl border border-mystic-700 p-8 md:p-12 shadow-2xl overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    {getSymbolIcon(selectedSymbol.id, "w-64 h-64")}
                </div>

                <div className="relative z-10">
                    <header className="mb-10 pb-8 border-b border-mystic-700/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center border border-mystic-600 shadow-xl">
                                {getSymbolIcon(selectedSymbol.id, "w-8 h-8")}
                            </div>
                            <div>
                                <h2 className="text-4xl font-serif text-white leading-none">{selectedSymbol.nameCn}</h2>
                                <p className="text-mystic-gold font-serif uppercase tracking-widest text-sm mt-2">{selectedSymbol.nameEn}</p>
                            </div>
                        </div>
                    </header>

                    <section className="space-y-12">
                        <div>
                            <h3 className="text-sm font-bold text-mystic-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-mystic-gold/30"></span> 象征哲学含义
                            </h3>
                            <p className="text-slate-200 text-lg leading-relaxed font-light first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-mystic-gold">
                                {selectedSymbol.generalMeaning}
                            </p>
                        </div>

                        <div className="bg-black/20 rounded-2xl p-8 border border-mystic-700/50">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                <span className="w-8 h-px bg-indigo-400/30"></span> 占卜中的应用逻辑
                            </h3>
                            <div className="text-slate-300 leading-relaxed font-sans text-md italic space-y-4">
                                {selectedSymbol.integrationAdvice}
                            </div>
                        </div>

                        {/* 具体案例解析 (Merged) */}
                        {selectedSymbol.details && selectedSymbol.details.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-sm font-bold text-mystic-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-px bg-mystic-gold/30"></span> 具体案例解析
                                </h3>
                                <div className="grid grid-cols-1 gap-8">
                                    {selectedSymbol.details.map((detail, idx) => {
                                        const cardName = detail.cardName;
                                        const cardId = detail.cardId;
                                        const imageUrl = detail.imageUrl || (cardId !== undefined ? getCardImageUrl(cardId) : '');
                                        
                                        return (
                                            <div key={idx} className="flex flex-col md:flex-row gap-6 bg-black/20 rounded-2xl p-6 border border-mystic-700/30 hover:border-mystic-gold/20 transition-colors group">
                                                <div className="w-full md:w-32 flex-shrink-0">
                                                    <div className="aspect-[2/3.5] rounded-xl overflow-hidden border border-mystic-700 shadow-lg group-hover:border-mystic-gold/40 transition-colors">
                                                        <img 
                                                            src={imageUrl} 
                                                            alt={cardName}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                    <p className="text-center mt-2 text-xs text-mystic-gold font-serif">{cardName}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light text-md">
                                                        {detail.interpretation}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        <footer className="pt-8 border-t border-mystic-800 text-xs text-slate-500 font-light flex justify-between items-center italic">
                            <span>Source: The Secret Language of Tarot</span>
                            <span>✦ Rider-Waite-Smith Edition ✦</span>
                        </footer>
                    </section>
                </div>
            </article>
        </div>
    );
};

export default Symbols;