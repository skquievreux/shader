import { Search, SlidersHorizontal, Shuffle } from 'lucide-react';
import React from 'react';

export function SearchFilterBar({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    onRandom
}) {
    return (
        <div className="sticky top-20 z-40 bg-slate-950/80 backdrop-blur-md py-4 mb-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto px-6">

                {/* Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Animationen suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-cyan-500/50 hover:bg-slate-800 transition-colors cursor-pointer appearance-none min-w-[160px]"
                    >
                        <option value="">Alle Kategorien</option>
                        <option value="nature">🌿 Natur</option>
                        <option value="cosmic">🌌 Kosmos</option>
                        <option value="physics">⚛️ Physik</option>
                        <option value="geometric">📐 Geometrie</option>
                        <option value="abstract">🎨 Abstrakt</option>
                    </select>

                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-cyan-500/50 hover:bg-slate-800 transition-colors cursor-pointer appearance-none min-w-[160px]"
                    >
                        <option value="">Alle Schwierigkeiten</option>
                        <option value="beginner">🟢 Anfänger</option>
                        <option value="intermediate">🟡 Fortgeschritten</option>
                        <option value="advanced">🔴 Experte</option>
                    </select>

                    <button
                        onClick={onRandom}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-cyan-900/20 whitespace-nowrap"
                    >
                        <Shuffle className="w-5 h-5" />
                        <span className="hidden sm:inline">Zufällig</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
