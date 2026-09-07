import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Plus, BookOpen, Sparkles, Download, RotateCcw } from 'lucide-react';
import { Proverb, ThemeColor } from './types';
import { INITIAL_PROVERBS } from './data/sampleProverbs';
import { Header } from './components/Header';
import { ProverbCard } from './components/ProverbCard';
import { CardModal } from './components/CardModal';
import { CardDetailModal } from './components/CardDetailModal';

const STORAGE_KEY = 'chinese_proverb_cards_v1';

export default function App() {
  const [proverbs, setProverbs] = useState<Proverb[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Errore lettura localStorage:', e);
    }
    return INITIAL_PROVERBS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<ThemeColor | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProverb, setEditingProverb] = useState<Proverb | null>(null);
  const [inspectProverb, setInspectProverb] = useState<Proverb | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proverbs));
    } catch (e) {
      console.error('Errore salvataggio localStorage:', e);
    }
  }, [proverbs]);

  // Handle Save (Create or Update)
  const handleSaveProverb = (
    item: Omit<Proverb, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (item.id) {
      // Update existing
      setProverbs((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, ...item } : p))
      );
    } else {
      // Create new
      const newProverb: Proverb = {
        ...item,
        id: `proverb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      setProverbs((prev) => [newProverb, ...prev]);

      // Confetti celebratory burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // ignore
      }
    }
  };

  // Handle Delete
  const handleDeleteProverb = (id: string) => {
    setProverbs((prev) => prev.filter((p) => p.id !== id));
  };

  // Reset to initial authentic set
  const handleResetToDefault = () => {
    if (window.confirm('Vuoi ripristinare la raccolta originale dei proverbi classici?')) {
      setProverbs(INITIAL_PROVERBS);
    }
  };

  // Filter proverbs
  const filteredProverbs = proverbs.filter((p) => {
    // Color filter
    if (selectedColor !== 'all' && p.themeColor !== selectedColor) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'Tutti' && p.category !== selectedCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchChinese = p.chinese.includes(searchQuery.trim());
      const matchPinyin = p.pinyin.toLowerCase().includes(q);
      const matchTranslation = p.translation.toLowerCase().includes(q);
      const matchExplanation = p.explanation.toLowerCase().includes(q);
      return matchTitle || matchChinese || matchPinyin || matchTranslation || matchExplanation;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#2c1810] font-serif flex flex-col selection:bg-[#8b4513] selection:text-[#fdf6e3]">
      {/* App Header with Filters & Search */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalCards={proverbs.length}
        onAddNew={() => {
          setEditingProverb(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Grid Content */}
      <main className="grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {/* Banner with brief instructions */}
        <div className="mb-8 p-5 md:p-6 rounded-[2rem] bg-[#fffaf0] border-2 border-[#8b4513]/25 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold font-serif text-[#2c1810] uppercase tracking-wide">
                Card Colorate di Proverbi Cinesi (成语 & 谚语)
              </h2>
              <p className="text-xs md:text-sm text-[#2c1810]/75 font-serif italic mt-0.5">
                Ogni card include titolo, disegno artistico con ideogrammi corsivi leggibili, proverbio, pinyin, traduzione e spiegazione. Puoi scaricare l'illustrazione o la card intera in PNG ad alta risoluzione.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider text-[#2c1810] hover:text-[#2c1810] bg-[#fdf6e3] hover:bg-[#f6edd8] border border-[#8b4513]/30 rounded-full transition-colors cursor-pointer shadow-xs"
              title="Ripristina la raccolta di proverbi iniziale"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ripristina Esempi</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredProverbs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProverbs.map((proverb) => (
              <ProverbCard
                key={proverb.id}
                proverb={proverb}
                onEdit={(p) => {
                  setEditingProverb(p);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteProverb}
                onSelect={(p) => setInspectProverb(p)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-[#fffaf0] rounded-[2rem] border-2 border-[#8b4513]/25 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2c1810] mb-2 uppercase tracking-wide">
              Nessuna card trovata
            </h3>
            <p className="text-sm font-serif italic text-[#2c1810]/75 mb-6">
              Nessun proverbio corrisponde ai filtri selezionati. Prova a modificare la ricerca o inserisci una nuova card.
            </p>
            <div className="flex items-center justify-center gap-3">
              {(searchQuery || selectedColor !== 'all' || selectedCategory !== 'Tutti') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedColor('all');
                    setSelectedCategory('Tutti');
                  }}
                  className="px-5 py-2 rounded-full border border-[#8b4513]/40 text-[#2c1810] hover:bg-[#f6edd8] text-xs font-serif font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Azzera Filtri
                </button>
              )}
              <button
                onClick={() => {
                  setEditingProverb(null);
                  setIsModalOpen(true);
                }}
                className="px-5 py-2 rounded-full bg-[#2c1810] hover:bg-[#422215] text-[#fdf6e3] text-xs font-serif font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                + Crea Nuova Card
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => {
          setEditingProverb(null);
          setIsModalOpen(true);
        }}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#2c1810] text-[#fdf6e3] shadow-2xl flex items-center justify-center border-2 border-[#8b4513] z-40 cursor-pointer active:scale-95 transition-transform"
        title="Aggiungi Nuovo Proverbio"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t-2 border-[#8b4513]/25 bg-[#f5ecda] text-center text-xs text-[#2c1810]/70 font-serif">
        <p className="font-serif font-bold text-[#2c1810] uppercase tracking-widest text-xs">
          Proverbi Cinesi & Calligrafia Artistica • Esportazione PNG ad alta fedeltà
        </p>
        <p className="text-xs mt-1 text-[#2c1810]/65 italic">
          Caratteri cinesi tradizionali con trascrizione pinyin, saggezza millenaria e disegni Shanshui
        </p>
      </footer>

      {/* Modal: Create or Edit Card */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProverb(null);
        }}
        onSave={handleSaveProverb}
        initialProverb={editingProverb}
      />

      {/* Modal: Full inspection detail */}
      <CardDetailModal
        proverb={inspectProverb}
        onClose={() => setInspectProverb(null)}
        onEdit={(p) => {
          setInspectProverb(null);
          setEditingProverb(p);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
