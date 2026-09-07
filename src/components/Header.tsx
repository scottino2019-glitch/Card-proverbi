import React from 'react';
import { Plus, Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { ThemeColor } from '../types';
import { COLOR_THEMES } from '../data/colorThemes';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedColor: ThemeColor | 'all';
  onColorChange: (color: ThemeColor | 'all') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  totalCards: number;
  onAddNew: () => void;
}

const CATEGORIES = ['Tutti', 'Saggezza', 'Perseveranza', 'Natura & Vita', 'Destino & Tempo', 'Relazioni'];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedColor,
  onColorChange,
  selectedCategory,
  onCategoryChange,
  totalCards,
  onAddNew,
}) => {
  return (
    <header className="relative bg-[#fdf6e3] border-b-2 border-[#8b4513] text-[#2c1810] py-6 px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Top brand row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d32f2f] to-[#8b0000] flex items-center justify-center shadow-lg border-2 border-[#b71c1c] shrink-0 rotate-[-2deg] hover:rotate-0 transition-transform">
              <span className="font-cursive text-3xl sm:text-4xl text-[#fff4e0] select-none">
                语
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#2c1810] tracking-tight uppercase">
                  Carte Proverbi Cinesi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8b4513]/10 text-[#8b4513] text-xs font-bold font-serif border border-[#8b4513]/30 tracking-widest uppercase">
                  {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
                </span>
              </div>
              <p className="text-sm md:text-base text-[#2c1810]/75 font-serif italic mt-0.5">
                Crea ed esporta splendide card colorate con disegni calligrafici, ideogrammi, pinyin, traduzione e spiegazione
              </p>
            </div>
          </div>

          {/* Call to action: Aggiungi Card */}
          <div className="flex items-center gap-3">
            <button
              id="btn-add-new-card"
              onClick={onAddNew}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2c1810] text-[#fdf6e3] hover:bg-[#422215] font-serif font-bold text-xs md:text-sm uppercase tracking-widest shadow-md transition-all cursor-pointer transform active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuovo Proverbio</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pt-4 border-t border-[#8b4513]/25">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b4513]/70" />
            <input
              id="search-proverbs"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cerca proverbio, caratteri (汉字), pinyin, significato..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#fffaf0] border border-[#8b4513]/30 text-[#2c1810] placeholder-[#8b4513]/50 text-xs md:text-sm font-serif focus:border-[#8b4513] focus:ring-1 focus:ring-[#8b4513]/30 outline-none transition-colors"
            />
          </div>

          {/* Color palette selector tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs text-[#2c1810]/70 font-serif font-bold uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>Colori:</span>
            </span>

            <button
              onClick={() => onColorChange('all')}
              className={`px-3 py-1 rounded-full text-xs font-serif font-bold tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedColor === 'all'
                  ? 'bg-[#2c1810] text-[#fdf6e3]'
                  : 'bg-[#fffaf0] text-[#2c1810]/80 border border-[#8b4513]/30 hover:border-[#8b4513]'
              }`}
            >
              TUTTI
            </button>

            {Object.values(COLOR_THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => onColorChange(theme.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-medium border transition-all shrink-0 cursor-pointer ${
                  selectedColor === theme.id
                    ? 'border-[#2c1810] text-[#2c1810] bg-[#fffaf0] font-bold shadow-xs ring-1 ring-[#2c1810]/20'
                    : 'bg-[#fffaf0] text-[#2c1810]/70 border-[#8b4513]/25 hover:text-[#2c1810] hover:border-[#8b4513]'
                }`}
                title={theme.name}
              >
                <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: theme.hex }} />
                <span>{theme.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3">
          <span className="text-xs text-[#2c1810]/70 font-serif font-bold uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-[#8b4513]" />
            <span>Temi:</span>
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-serif tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8b4513] text-[#fff4e0] font-bold shadow-xs'
                  : 'bg-[#fffaf0] text-[#2c1810]/80 border border-[#8b4513]/30 hover:bg-[#f6edd8] hover:text-[#2c1810]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
