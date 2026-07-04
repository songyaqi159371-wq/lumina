import React, { useState } from 'react';
import { tarotSymbols, getCardImageUrl } from '../constants';
import { TarotSymbol } from '../types';
import {
    Search, Book, ChevronLeft, Sparkles, Wind, Shield, Cloud,
    Sun, Moon, Mountain, Waves, Crown, Columns,
    Flower2, Heart, EyeOff, Flag, Castle, Trees, Building2, Route,
    Cross, Zap, ChevronDown, ChevronUp, Hash, BookOpen, Globe, Layers
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
    Nature: '自然',
    Artifact: '人造物',
    Divine: '神圣',
};
const CATEGORY_COLOR: Record<string, string> = {
    Nature: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
    Artifact: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
    Divine: 'text-violet-400 bg-violet-900/30 border-violet-700/40',
};

function getSymbolIcon(id: string, sizeClass = 'w-5 h-5') {
    const base = `${sizeClass} transition-transform duration-500 group-hover:scale-110`;
    switch (id) {
        case 'crowns':     return <Crown      className={`${base} text-amber-400`} />;
        case 'pillars':    return <Columns    className={`${base} text-slate-400`} />;
        case 'roses':      return <Heart      className={`${base} text-red-500`} />;
        case 'paths':      return <Route      className={`${base} text-emerald-500`} />;
        case 'mountains':  return <Mountain   className={`${base} text-blue-400`} />;
        case 'crosses':    return <Cross      className={`${base} text-mystic-gold`} />;
        case 'moons':      return <Moon       className={`${base} text-indigo-300`} />;
        case 'stars':      return <Sparkles   className={`${base} text-yellow-200`} />;
        case 'pools':      return <Waves      className={`${base} text-cyan-500`} />;
        case 'rivers':     return <Waves      className={`${base} text-blue-500 rotate-90`} />;
        case 'horses':     return <Wind       className={`${base} text-amber-100`} />;
        case 'suns':       return <Sun        className={`${base} text-orange-400`} />;
        case 'banners':    return <Flag       className={`${base} text-red-400`} />;
        case 'armor':      return <Shield     className={`${base} text-slate-400`} />;
        case 'blindfolds': return <EyeOff     className={`${base} text-slate-600`} />;
        case 'feathers':   return <Wind       className={`${base} text-white opacity-80`} />;
        case 'castles':    return <Castle     className={`${base} text-stone-400`} />;
        case 'clouds':     return <Cloud      className={`${base} text-slate-500`} />;
        case 'gardens':    return <Trees      className={`${base} text-green-500`} />;
        case 'towers':     return <Building2  className={`${base} text-orange-700`} />;
        case 'angels':     return <Zap        className={`${base} text-violet-400 animate-pulse`} />;
        case 'temples':    return <BookOpen   className={`${base} text-cyan-400`} />;
        default:           return <Sparkles   className={base} />;
    }
}

// ─── collapsible section ──────────────────────────────────────────────────────

function Collapsible({ title, icon, children, defaultOpen = false }: {
    title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-mystic-700/50 rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-mystic-800/40 transition-colors"
            >
                <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                    {icon}
                    {title}
                </span>
                {open
                    ? <ChevronUp size={16} className="text-mystic-500 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-mystic-500 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-6 pb-6 pt-2 border-t border-mystic-700/30">
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── list view ────────────────────────────────────────────────────────────────

function SymbolCard({ symbol, idx, onClick }: {
    symbol: TarotSymbol; idx: number; onClick: () => void;
}) {
    const catColor = CATEGORY_COLOR[symbol.category] ?? 'text-slate-400 bg-slate-800/30 border-slate-700/40';
    const cardCount = symbol.cardsContainingSymbol?.length ?? 0;

    return (
        <div
            onClick={onClick}
            className="bg-mystic-800/20 border border-mystic-700/50 p-6 rounded-2xl hover:border-mystic-gold/30 cursor-pointer transition-all hover:bg-mystic-800/30 group flex flex-col min-h-[220px] shadow-lg"
        >
            {/* top row */}
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-mystic-700/50 group-hover:border-mystic-gold/30 transition-colors shadow-inner">
                    {getSymbolIcon(symbol.id, 'w-6 h-6')}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <span className="text-mystic-800 font-serif text-xl group-hover:text-mystic-gold/20 transition-colors select-none font-bold">
                        {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium tracking-wide ${catColor}`}>
                        {CATEGORY_LABEL[symbol.category] ?? symbol.category}
                    </span>
                </div>
            </div>

            {/* name */}
            <h3 className="text-xl font-serif text-white mb-0.5 group-hover:text-mystic-gold transition-colors">{symbol.nameCn}</h3>
            <p className="text-mystic-500 text-[10px] font-serif uppercase tracking-[0.2em] mb-3">{symbol.nameEn}</p>

            {/* core symbolism preview */}
            {symbol.coreSymbolism && symbol.coreSymbolism.length > 0 ? (
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed flex-1 font-light">
                    {symbol.coreSymbolism[0]}
                </p>
            ) : (
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed flex-1 font-light italic">
                    {symbol.generalMeaning}
                </p>
            )}

            {/* footer: card count */}
            {cardCount > 0 && (
                <div className="mt-4 flex items-center gap-1.5 text-mystic-600 text-[11px]">
                    <Hash size={11} />
                    <span>出现于 {cardCount} 张牌</span>
                </div>
            )}
        </div>
    );
}

// ─── detail view ──────────────────────────────────────────────────────────────

function SymbolDetail({ symbol, onBack }: { symbol: TarotSymbol; onBack: () => void }) {
    return (
        <div className="h-full animate-flip-in pb-20 max-w-4xl mx-auto">
            <nav className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-mystic-gold hover:text-white transition group py-2"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-serif">返回百科列表</span>
                </button>
            </nav>

            <article className="bg-mystic-800/30 rounded-3xl border border-mystic-700 p-8 md:p-12 shadow-2xl overflow-hidden relative">
                {/* bg icon */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    {getSymbolIcon(symbol.id, 'w-64 h-64')}
                </div>

                <div className="relative z-10 space-y-10">

                    {/* ── header ── */}
                    <header className="pb-8 border-b border-mystic-700/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center border border-mystic-600 shadow-xl">
                                {getSymbolIcon(symbol.id, 'w-8 h-8')}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-4xl font-serif text-white leading-none">{symbol.nameCn}</h2>
                                    <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ml-1 ${CATEGORY_COLOR[symbol.category] ?? ''}`}>
                                        {CATEGORY_LABEL[symbol.category] ?? symbol.category}
                                    </span>
                                </div>
                                <p className="text-mystic-gold font-serif uppercase tracking-widest text-sm">{symbol.nameEn}</p>
                                {symbol.etymology && (
                                    <p className="text-slate-500 text-xs mt-1.5 italic">
                                        <span className="text-mystic-600 not-italic font-medium mr-1">词源：</span>
                                        {symbol.etymology}
                                    </p>
                                )}
                            </div>
                        </div>
                        {symbol.cardsContainingSymbol && symbol.cardsContainingSymbol.length > 0 && (
                            <div className="flex items-center gap-2 text-mystic-600 text-xs mt-2">
                                <Hash size={12} />
                                <span>出现于 {symbol.cardsContainingSymbol.length} 张牌</span>
                            </div>
                        )}
                    </header>

                    {/* ── core symbolism ── */}
                    {symbol.coreSymbolism && symbol.coreSymbolism.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-mystic-gold uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="w-8 h-px bg-mystic-gold/30" /> 核心象征意义
                            </h3>
                            <ol className="space-y-3">
                                {symbol.coreSymbolism.map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-mystic-gold/10 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold text-xs font-bold">
                                            {i + 1}
                                        </span>
                                        <p className="text-slate-200 leading-relaxed font-light text-sm">{item}</p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {/* ── general meaning ── */}
                    <section>
                        <h3 className="text-sm font-bold text-mystic-gold uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                            <span className="w-8 h-px bg-mystic-gold/30" /> 象征哲学含义
                        </h3>
                        <p className="text-slate-200 text-base leading-relaxed font-light first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-mystic-gold">
                            {symbol.generalMeaning}
                        </p>
                    </section>

                    {/* ── variations ── */}
                    {symbol.variations && symbol.variations.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="w-8 h-px bg-amber-400/30" /> 象征变体类型
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {symbol.variations.map((v, i) => (
                                    <div key={i} className="bg-black/20 rounded-xl p-4 border border-mystic-700/40">
                                        <p className="text-amber-300 text-sm font-semibold mb-2">{v.name}</p>
                                        <p className="text-slate-400 text-sm leading-relaxed font-light">{v.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── forms in RWS ── */}
                    {symbol.formsInRWS && symbol.formsInRWS.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="w-8 h-px bg-cyan-400/30" /> 在 RWS 牌组中的呈现形式
                            </h3>
                            <ul className="space-y-2">
                                {symbol.formsInRWS.map((form, i) => (
                                    <li key={i} className="flex gap-3 items-start text-slate-300 text-sm leading-relaxed">
                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400/60 mt-1.5" />
                                        {form}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* ── cultural context (collapsible) ── */}
                    {symbol.culturalContext && (
                        <Collapsible
                            title="文化与历史背景"
                            icon={<Globe size={14} className="text-indigo-400" />}
                        >
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light">
                                {symbol.culturalContext}
                            </p>
                        </Collapsible>
                    )}

                    {/* ── book intro (collapsible) ── */}
                    {symbol.bookIntro && (
                        <Collapsible
                            title="原著课程引言"
                            icon={<Layers size={14} className="text-rose-400" />}
                        >
                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line font-light italic">
                                {symbol.bookIntro}
                            </p>
                        </Collapsible>
                    )}

                    {/* ── per-card analysis ── */}
                    {symbol.details && symbol.details.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-mystic-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-mystic-gold/30" /> 逐牌象征解析
                            </h3>
                            <div className="space-y-6">
                                {symbol.details.map((detail, i) => {
                                    const imageUrl = detail.imageUrl || getCardImageUrl(detail.cardId);
                                    return (
                                        <div key={i} className="flex flex-col md:flex-row gap-6 bg-black/20 rounded-2xl p-6 border border-mystic-700/30 hover:border-mystic-gold/20 transition-colors group">
                                            <div className="w-full md:w-28 flex-shrink-0">
                                                <div className="aspect-[2/3.5] rounded-xl overflow-hidden border border-mystic-700 shadow-lg group-hover:border-mystic-gold/40 transition-colors">
                                                    <img
                                                        src={imageUrl}
                                                        alt={detail.cardName}
                                                        className="w-full h-full object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </div>
                                                <p className="text-center mt-2 text-xs text-mystic-gold font-serif">{detail.cardName}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light text-sm">
                                                    {detail.interpretation}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* ── footer ── */}
                    <footer className="pt-8 border-t border-mystic-800 text-xs text-slate-500 font-light flex justify-between items-center italic">
                        <span>Source: The Secret Language of Tarot · Amberstone</span>
                        <span>✦ Rider-Waite-Smith Edition ✦</span>
                    </footer>

                </div>
            </article>
        </div>
    );
}

// ─── main page ────────────────────────────────────────────────────────────────

const CATEGORIES = ['全部', 'Nature', 'Artifact', 'Divine'] as const;
type CategoryFilter = typeof CATEGORIES[number];

const Symbols: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('全部');
    const [selectedSymbol, setSelectedSymbol] = useState<TarotSymbol | null>(null);

    const filteredSymbols = tarotSymbols.filter(s => {
        const matchSearch = s.nameCn.includes(searchTerm) || s.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = categoryFilter === '全部' || s.category === categoryFilter;
        return matchSearch && matchCat;
    });

    if (selectedSymbol) {
        return <SymbolDetail symbol={selectedSymbol} onBack={() => setSelectedSymbol(null)} />;
    }

    return (
        <div className="h-full animate-flip-in pb-20">
            {/* ── page header ── */}
            <header className="mb-10 border-b border-mystic-700 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Book className="text-mystic-gold w-4 h-4" />
                            <span className="text-mystic-gold font-serif tracking-widest uppercase text-[10px]">The Secret Language of Tarot</span>
                        </div>
                        <h1 className="text-3xl font-serif text-white mb-2">塔罗象征百科</h1>
                        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed font-light">
                            解析维特塔罗（RWS）视觉图像中的 22 种核心象征语法。内容依据 Ruth Ann & Wald Amberstone 原著整理，涵盖词源、变体、文化背景与逐牌解析。
                        </p>
                    </div>
                    <div className="relative w-full md:w-80 flex-shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="检索符号（如：路径、高塔）..."
                            className="w-full pl-10 pr-4 py-2.5 bg-mystic-800/40 border border-mystic-700 rounded-xl text-white text-sm focus:outline-none focus:border-mystic-gold/40 transition shadow-inner"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* category filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                categoryFilter === cat
                                    ? 'bg-mystic-gold/20 border-mystic-gold/50 text-mystic-gold'
                                    : 'bg-transparent border-mystic-700/50 text-slate-400 hover:border-mystic-600 hover:text-slate-300'
                            }`}
                        >
                            {cat === '全部' ? '全部 · All' :
                             cat === 'Nature' ? '🌿 自然' :
                             cat === 'Artifact' ? '🏛️ 人造物' : '✨ 神圣'}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-mystic-700">
                        {filteredSymbols.length} / {tarotSymbols.length} 种象征
                    </span>
                </div>
            </header>

            {/* ── symbol grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSymbols.map((symbol, idx) => (
                    <SymbolCard
                        key={symbol.id}
                        symbol={symbol}
                        idx={idx}
                        onClick={() => setSelectedSymbol(symbol)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Symbols;
