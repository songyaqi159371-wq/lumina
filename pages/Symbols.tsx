import React, { useState } from 'react';
import { tarotSymbols } from '../constants';
import { TarotSymbol } from '../types';
import { Search, X, Book, Quote, ExternalLink, Sparkles, Wind, Shield, Cloud, Ghost, Sun, Moon, Mountain, Waves, Navigation, Crown, Columns, Flower2 } from 'lucide-react';

const Symbols: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState<TarotSymbol | null>(null);

    const filteredSymbols = tarotSymbols.filter(s => 
        s.nameCn.includes(searchTerm) || s.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSymbolIcon = (id: string) => {
        const props = { className: "w-6 h-6" };
        switch(id) {
            case 'crowns': return <Crown {...props} />;
            case 'pillars': return <Columns {...props} />;
            case 'roses': 
            case 'lilies': 
            case 'gardens': return <Flower2 {...props} />;
            case 'paths': return <Navigation {...props} />;
            case 'mountains': return <Mountain {...props} />;
            case 'crosses': return <PlusIcon {...props} />;
            case 'moons': return <Moon {...props} />;
            case 'stars': return <Sparkles {...props} />;
            case 'pools': 
            case 'rivers': return <Waves {...props} />;
            case 'horses': return <Ghost {...props} />;
            case 'suns': return <Sun {...props} />;
            case 'banners': 
            case 'feathers': return <Wind {...props} />;
            case 'armor': return <Shield {...props} />;
            case 'blindfolds': return <X {...props} />;
            case 'castles': 
            case 'clouds': return <Cloud {...props} />;
            case 'towers': return <Columns {...props} />;
            case 'angels': return <Sparkles {...props} />;
            default: return <Sparkles {...props} />;
        }
    };

    const PlusIcon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5v14M5 12h14" /></svg>;

    return (
        <div className="h-full animate-flip-in pb-20">
            <header className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl lg:text-6xl font-serif text-mystic-gold mb-4">秘密语言</h1>
                    <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-light">
                        探索《The Secret Language of Tarot》中定义的 22 类核心象征符号。
                        这些符号不是静止的标记，而是活生生的能量签名，是通往内在神殿的门户。
                    </p>
                </div>
                {/* Search Bar */}
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                        type="text"
                        placeholder="搜索象征符号..."
                        className="w-full pl-14 pr-6 py-4 bg-mystic-800/40 border-2 border-mystic-700 rounded-2xl text-white focus:outline-none focus:border-mystic-gold transition shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-mystic-700 to-transparent mb-16 opacity-50"></div>

            {/* Uncategorized Symbol Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredSymbols.map(symbol => (
                    <div 
                        key={symbol.id}
                        onClick={() => setSelectedSymbol(symbol)}
                        className="bg-mystic-800/20 border border-mystic-700/40 p-8 rounded-[2rem] hover:border-mystic-gold/40 cursor-pointer transition-all hover:-translate-y-2 group relative overflow-hidden flex flex-col min-h-[280px] backdrop-blur-sm"
                    >
                        {/* Decorative background icon */}
                        <div className="absolute -top-6 -right-6 text-mystic-900 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            {getSymbolIcon(symbol.id)}
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-mystic-700/30 flex items-center justify-center mb-6 text-mystic-gold border border-mystic-600/50 group-hover:bg-mystic-gold group-hover:text-mystic-900 transition-all duration-500 shadow-xl">
                            {getSymbolIcon(symbol.id)}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-mystic-gold transition-colors">{symbol.nameCn}</h3>
                        <p className="text-mystic-400 text-xs font-serif uppercase tracking-[0.2em] mb-4">{symbol.nameEn}</p>
                        
                        <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed flex-1 font-light">
                            {symbol.generalMeaning}
                        </p>

                        <div className="mt-8 pt-6 border-t border-mystic-700/30 flex items-center justify-between text-mystic-gold text-xs font-bold uppercase tracking-widest group-hover:pl-2 transition-all">
                            <span>深入研读</span>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Symbol Detail Modal (Enhanced with deep content) */}
            {selectedSymbol && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-flip-in" onClick={() => setSelectedSymbol(null)}>
                    <div 
                        className="bg-mystic-950 border border-mystic-700 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-10 md:p-14 bg-gradient-to-br from-mystic-900 to-black border-b border-mystic-800 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-mystic-gold/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-20 h-20 bg-mystic-gold/10 rounded-[1.5rem] flex items-center justify-center text-mystic-gold border border-mystic-gold/20 shadow-2xl">
                                    {React.cloneElement(getSymbolIcon(selectedSymbol.id) as React.ReactElement, { size: 40, className: "w-10 h-10" })}
                                </div>
                                <div>
                                    <h2 className="text-5xl font-serif text-mystic-gold mb-2">{selectedSymbol.nameCn}</h2>
                                    <p className="text-slate-400 tracking-[0.4em] uppercase text-sm font-light">{selectedSymbol.nameEn}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedSymbol(null)} className="p-4 bg-mystic-800/50 hover:bg-mystic-700 rounded-full text-slate-400 hover:text-white transition shadow-lg relative z-10">
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10 md:p-16 overflow-y-auto custom-scrollbar flex-1 space-y-16">
                            <section className="relative">
                                <h3 className="text-xs font-black text-mystic-gold mb-8 flex items-center gap-4 uppercase tracking-[0.4em]">
                                    <span className="w-12 h-[1px] bg-mystic-gold opacity-30"></span>
                                    核心象征寓意
                                </h3>
                                <p className="text-slate-100 leading-[2.2] text-xl font-light pl-8 border-l-2 border-mystic-700/50 text-justify">
                                    {selectedSymbol.generalMeaning}
                                </p>
                            </section>

                            <section className="bg-gradient-to-br from-mystic-900 to-mystic-950 p-10 md:p-12 rounded-[2.5rem] border border-mystic-800/50 relative overflow-hidden shadow-inner">
                                <div className="absolute top-0 right-0 p-8 text-mystic-gold opacity-5 rotate-12">
                                    <Quote size={180} />
                                </div>
                                <h3 className="text-xs font-black text-mystic-gold mb-6 flex items-center gap-4 uppercase tracking-[0.4em] relative z-10">
                                    <Sparkles size={18} className="animate-pulse"/> 冥想与实践建议
                                </h3>
                                <p className="text-slate-300 text-xl leading-relaxed relative z-10 italic font-light font-serif">
                                    “{selectedSymbol.integrationAdvice}”
                                </p>
                            </section>

                            <section className="pt-8 text-center text-slate-500 text-sm italic font-light">
                                <p>整理自《The Secret Language of Tarot》第七章：Rivers, Towers, Angels, Temples 整合课</p>
                            </section>
                        </div>

                        <div className="p-8 text-center border-t border-mystic-800 bg-black/30">
                            <button 
                                onClick={() => setSelectedSymbol(null)}
                                className="px-16 py-5 bg-gradient-to-r from-mystic-gold to-amber-500 hover:from-amber-400 hover:to-mystic-gold text-mystic-950 rounded-full text-xl transition-all font-black shadow-[0_10px_30px_rgba(251,191,36,0.2)] hover:shadow-mystic-gold/40 hover:-translate-y-1 active:translate-y-0"
                            >
                                我已领悟此中奥秘
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Symbols;