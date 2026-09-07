import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Palette, Type, Check, RefreshCw, Upload } from 'lucide-react';
import { Proverb, ThemeColor, ArtStyle, CalligraphyFont, SealSymbol } from '../types';
import { COLOR_THEMES } from '../data/colorThemes';
import { ArtworkView } from './ArtworkView';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proverb: Omit<Proverb, 'id' | 'createdAt'> & { id?: string }) => void;
  initialProverb?: Proverb | null;
}

const SEAL_OPTIONS: { symbol: SealSymbol; label: string }[] = [
  { symbol: '福', label: 'Fortuna (Fú)' },
  { symbol: '智', label: 'Saggezza (Zhì)' },
  { symbol: '道', label: 'La Via / Tao (Dào)' },
  { symbol: '和', label: 'Armonia (Hé)' },
  { symbol: '德', label: 'Virtù (Dé)' },
  { symbol: '寿', label: 'Longevità (Shòu)' },
  { symbol: '吉', label: 'Auspicio (Jí)' },
  { symbol: '心', label: 'Cuore / Mente (Xīn)' },
];

const ART_STYLES: { id: ArtStyle; name: string; desc: string }[] = [
  { id: 'mountains', name: 'Montagne & Nebbia', desc: 'Paesaggio Shanshui con gru e vette avvolte dalla nebbia' },
  { id: 'bamboo', name: 'Bosco di Bambù', desc: 'Canne di bambù eleganti e fronde mosse dal vento' },
  { id: 'plum_blossom', name: 'Fiori di Prugno', desc: 'Rami contorti invernali con boccioli e petali' },
  { id: 'rising_sun', name: 'Sole d’Oriente', desc: 'Disco solare vermiglio e onde tradizionali' },
  { id: 'koi_fish', name: 'Carpe Koi & Loto', desc: 'Due carpe armoniose tra increspature e foglie di loto' },
  { id: 'moonlit_night', name: 'Luna Notturna', desc: 'Luna d’argento luminosa e nuvole d’inchiostro' },
  { id: 'zen_circle', name: 'Cerchio Ensō Zen', desc: 'Cerchio tracciato a pennello continuo con schizzi' },
];

const CALLIGRAPHY_OPTIONS: { id: CalligraphyFont; name: string; desc: string }[] = [
  { id: 'cursive', name: 'Zhi Mang Xing (Corsivo Fluido)', desc: 'Elegante, dinamico e perfettamente leggibile' },
  { id: 'brush', name: 'Ma Shan Zheng (Pennello Tradizionale)', desc: 'Tratto forte e vigoroso tipico della pittura' },
  { id: 'wild', name: 'Liu Jian Mao Cao (Corsivo d’Erba)', desc: 'Scorrevole, artistico ed espressivo' },
  { id: 'serif', name: 'Noto Serif (Classico Imperiale)', desc: 'Stile scultoreo e solenne delle stele' },
];

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProverb,
}) => {
  const [title, setTitle] = useState('');
  const [chinese, setChinese] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [translation, setTranslation] = useState('');
  const [explanation, setExplanation] = useState('');
  const [themeColor, setThemeColor] = useState<ThemeColor>('vermilion');
  const [artStyle, setArtStyle] = useState<ArtStyle>('mountains');
  const [calligraphyFont, setCalligraphyFont] = useState<CalligraphyFont>('cursive');
  const [sealSymbol, setSealSymbol] = useState<SealSymbol>('福');
  const [category, setCategory] = useState<Proverb['category']>('Saggezza');
  const [customIllustrationUrl, setCustomIllustrationUrl] = useState<string>('');

  useEffect(() => {
    if (initialProverb) {
      setTitle(initialProverb.title);
      setChinese(initialProverb.chinese);
      setPinyin(initialProverb.pinyin);
      setTranslation(initialProverb.translation);
      setExplanation(initialProverb.explanation);
      setThemeColor(initialProverb.themeColor);
      setArtStyle(initialProverb.artStyle);
      setCalligraphyFont(initialProverb.calligraphyFont);
      setSealSymbol(initialProverb.sealSymbol);
      setCategory(initialProverb.category || 'Saggezza');
      setCustomIllustrationUrl(initialProverb.customIllustrationUrl || '');
    } else {
      // Reset defaults for a new card
      setTitle('');
      setChinese('');
      setPinyin('');
      setTranslation('');
      setExplanation('');
      setThemeColor('vermilion');
      setArtStyle('rising_sun');
      setCalligraphyFont('cursive');
      setSealSymbol('福');
      setCategory('Saggezza');
      setCustomIllustrationUrl('');
    }
  }, [initialProverb, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomIllustrationUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickTemplate = () => {
    // Quick inspirational helper
    const samples = [
      {
        title: 'La Goccia che Scava la Pietra',
        chinese: '水滴石穿',
        pinyin: 'Shuǐ dī shí chuān',
        translation: 'L’acqua che gocciola costante fora la pietra.',
        explanation: 'Dagli annali storici della dinastia Han: non è la forza della singola goccia a perforare la roccia, ma la sua perseveranza incessante nel tempo. Simboleggia il potere della costanza di fronte a ostacoli apparentemente insormontabili.',
        themeColor: 'teal' as ThemeColor,
        artStyle: 'koi_fish' as ArtStyle,
        sealSymbol: '德' as SealSymbol,
        category: 'Perseveranza' as const,
      },
      {
        title: 'Tornare alla Natura delle Cose',
        chinese: '返璞归真',
        pinyin: 'Fǎn pú guī zhēn',
        translation: 'Ritornare alla purezza originaria e alla genuinità interiore.',
        explanation: 'Dal pensiero taoista di Zhuangzi: spogliarsi delle artificiosità esteriori, delle maschere sociali e delle complicazioni inutili per riscoprire la purezza e l’armonia spontanea della propria natura originaria.',
        themeColor: 'jade' as ThemeColor,
        artStyle: 'bamboo' as ArtStyle,
        sealSymbol: '道' as SealSymbol,
        category: 'Natura & Vita' as const,
      },
      {
        title: 'La Tigre con le Ali',
        chinese: '如虎添翼',
        pinyin: 'Rú hǔ tiān yì',
        translation: 'Come una tigre a cui spuntano le ali.',
        explanation: 'Dal testo classico Hanfeizi: descrive quando a una persona o una causa già forte e capace viene aggiunto un ulteriore talento o alleato formidabile, rendendola invincibile e straordinaria.',
        themeColor: 'gold' as ThemeColor,
        artStyle: 'rising_sun' as ArtStyle,
        sealSymbol: '吉' as SealSymbol,
        category: 'Perseveranza' as const,
      },
    ];

    const pick = samples[Math.floor(Math.random() * samples.length)];
    setTitle(pick.title);
    setChinese(pick.chinese);
    setPinyin(pick.pinyin);
    setTranslation(pick.translation);
    setExplanation(pick.explanation);
    setThemeColor(pick.themeColor);
    setArtStyle(pick.artStyle);
    setSealSymbol(pick.sealSymbol);
    setCategory(pick.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chinese.trim()) {
      alert('Per favore inserisci almeno il titolo e gli ideogrammi cinesi!');
      return;
    }

    onSave({
      id: initialProverb?.id,
      title: title.trim(),
      chinese: chinese.trim(),
      pinyin: pinyin.trim() || chinese.trim(),
      translation: translation.trim() || 'Nessuna traduzione specificata',
      explanation: explanation.trim() || 'Nessuna spiegazione specificata',
      themeColor,
      artStyle,
      calligraphyFont,
      sealSymbol,
      category,
      customIllustrationUrl: customIllustrationUrl || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#fdf6e3] border-2 border-[#8b4513] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#2c1810]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8b4513]/25 bg-[#fffaf0]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif uppercase tracking-wide text-[#2c1810]">
                {initialProverb ? 'Modifica Card Proverbio' : 'Nuova Card Proverbio Cinese'}
              </h2>
              <p className="text-xs text-[#2c1810]/70 font-serif italic">
                Inserisci titolo, ideogrammi, traduzione, spiegazione e personalizza il disegno
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickTemplate}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#2c1810] bg-[#fdf6e3] hover:bg-[#f6edd8] border border-[#8b4513]/30 rounded-full transition-colors cursor-pointer"
              title="Carica un esempio per iniziare velocemente"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Esempio d’ispirazione</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#2c1810]/70 hover:text-[#2c1810] rounded-full hover:bg-[#8b4513]/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form & Live Preview split view */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 font-serif">
          {/* Left Column: Form inputs */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Titolo */}
            <div>
              <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                1. Titolo della Card *
              </label>
              <input
                id="input-card-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es: Il Vecchio alla Frontiera / La Goccia e la Roccia"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fffaf0] border border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] placeholder-[#8b4513]/40 text-sm outline-none transition-colors"
              />
            </div>

            {/* 2. Ideogrammi Cinesi (Proverbi) & Pinyin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                  2. Proverbio in Cinese (Hanzi) *
                </label>
                <input
                  id="input-card-chinese"
                  type="text"
                  required
                  value={chinese}
                  onChange={(e) => setChinese(e.target.value)}
                  placeholder="Es: 塞翁失马 焉知非福"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fffaf0] border border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] placeholder-[#8b4513]/40 font-hanzi text-base font-bold outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                  Pinyin (Pronuncia con toni)
                </label>
                <input
                  id="input-card-pinyin"
                  type="text"
                  value={pinyin}
                  onChange={(e) => setPinyin(e.target.value)}
                  placeholder="Es: Sài wēng shī mǎ, yān zhī fēi fú"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fffaf0] border border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] placeholder-[#8b4513]/40 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* 3. Traduzione */}
            <div>
              <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                3. Traduzione in Italiano *
              </label>
              <textarea
                id="input-card-translation"
                rows={2}
                required
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="Es: Il vecchio della frontiera perde il suo cavallo: chi sa se non sia una fortuna?"
                className="w-full px-4 py-2 rounded-xl bg-[#fffaf0] border border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] placeholder-[#8b4513]/40 text-sm italic outline-none transition-colors resize-none"
              />
            </div>

            {/* 4. Spiegazione */}
            <div>
              <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                4. Spiegazione Culturale & Significato *
              </label>
              <textarea
                id="input-card-explanation"
                rows={3}
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Racconta la storia di origine del proverbio (Chengyu), la riflessione filosofica taoista/confuciana o come applicarlo nella vita di tutti i giorni..."
                className="w-full px-4 py-2 rounded-xl bg-[#fffaf0] border border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] placeholder-[#8b4513]/40 text-sm outline-none transition-colors"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                Categoria Tematica
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Saggezza', 'Perseveranza', 'Natura & Vita', 'Destino & Tempo', 'Relazioni'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-serif tracking-wider border transition-colors cursor-pointer ${
                      category === cat
                        ? 'bg-[#8b4513] text-[#fff4e0] font-bold border-[#8b4513]'
                        : 'bg-[#fffaf0] text-[#2c1810]/75 border-[#8b4513]/25 hover:border-[#8b4513]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Palette Colore della Card */}
            <div>
              <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#8b4513]" />
                <span>Colore Caratteristico della Card</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.values(COLOR_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeColor(theme.id)}
                    className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      themeColor === theme.id
                        ? 'border-[#2c1810] ring-2 ring-[#2c1810]/20 bg-[#fffaf0] font-bold'
                        : 'border-[#8b4513]/25 hover:border-[#8b4513] bg-[#fffaf0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: theme.hex }} />
                      {themeColor === theme.id && <Check className="w-3.5 h-3.5 text-[#2c1810]" />}
                    </div>
                    <span className="text-[11px] font-medium text-[#2c1810] truncate leading-tight">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Stile del Disegno Artistico */}
            <div>
              <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#8b4513]" />
                <span>Stile del Disegno Tradizionale</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ART_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setArtStyle(style.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      artStyle === style.id
                        ? 'border-[#8b4513] bg-[#8b4513]/10 text-[#8b4513] font-bold'
                        : 'border-[#8b4513]/25 bg-[#fffaf0] text-[#2c1810]/80 hover:border-[#8b4513]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{style.name}</div>
                    <div className="text-[10px] text-[#2c1810]/60 truncate">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Calligrafia Corsiva e Sigillo Rosso */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#8b4513]" />
                  <span>Calligrafia Corsiva Ideogrammi</span>
                </label>
                <select
                  value={calligraphyFont}
                  onChange={(e) => setCalligraphyFont(e.target.value as CalligraphyFont)}
                  className="w-full px-3 py-2 rounded-xl bg-[#fffaf0] border border-[#8b4513]/30 text-[#2c1810] text-xs outline-none focus:border-[#8b4513]"
                >
                  {CALLIGRAPHY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8b4513] uppercase tracking-wider mb-1.5">
                  Sigillo Rosso (Yìnzhāng 印章)
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {SEAL_OPTIONS.map((seal) => (
                    <button
                      key={seal.symbol}
                      type="button"
                      onClick={() => setSealSymbol(seal.symbol)}
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-hanzi font-bold text-sm transition-all cursor-pointer ${
                        sealSymbol === seal.symbol
                          ? 'bg-red-600 text-[#fff4e0] ring-2 ring-[#2c1810]'
                          : 'bg-[#fffaf0] text-[#2c1810]/70 border border-[#8b4513]/30 hover:border-[#8b4513]'
                      }`}
                      title={seal.label}
                    >
                      {seal.symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Immagine personalizzata opzionale */}
            <div>
              <label className="block text-xs font-medium text-[#2c1810]/70 mb-1 flex items-center justify-between">
                <span>Immagine / Disegno personalizzato (Opzionale)</span>
                {customIllustrationUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomIllustrationUrl('')}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Rimuovi immagine caricata
                  </button>
                )}
              </label>
              <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#fffaf0] border border-dashed border-[#8b4513]/40 hover:border-[#8b4513] cursor-pointer transition-colors text-xs text-[#2c1810]">
                <Upload className="w-4 h-4 text-[#8b4513]" />
                <span>Carica un tuo disegno o dipinto dal computer (PNG / JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Right Column: Live Card & Artwork Preview */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="sticky top-0 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#8b4513] uppercase tracking-wider">
                <span>Anteprima in Tempo Reale</span>
                <span className="text-[11px] text-[#2c1810]/60 lowercase">esportabile in PNG</span>
              </div>

              {/* Artwork preview box */}
              <div className="p-3 bg-[#fffaf0] rounded-2xl border border-[#8b4513]/25 shadow-sm">
                <div className="text-[11px] text-[#2c1810]/70 mb-2 font-serif font-bold uppercase tracking-wider">
                  Disegno Artistico con Ideogramma:
                </div>
                <div className="rounded-xl overflow-hidden border border-white/20">
                  <ArtworkView
                    chinese={chinese || '千里之行 始于足下'}
                    pinyin={pinyin || 'Qiān lǐ zhī xíng, shǐ yú zú xià'}
                    artStyle={artStyle}
                    calligraphyFont={calligraphyFont}
                    themeColor={themeColor}
                    sealSymbol={sealSymbol}
                    title={title || 'Titolo del Proverbio'}
                    customIllustrationUrl={customIllustrationUrl}
                    aspectRatio="wide"
                    showExportButton={true}
                  />
                </div>
              </div>

              {/* Mini Card Preview */}
              <div className={`p-5 rounded-[1.8rem] border-4 text-[#fff4e0] shadow-xl ${COLOR_THEMES[themeColor].cardBg} ${COLOR_THEMES[themeColor].accentBorder}`}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold tracking-wider uppercase border ${COLOR_THEMES[themeColor].badgeBg}`}>
                    {category}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">CN-{(initialProverb?.id || '01').slice(-3)}</span>
                </div>
                <h4 className="font-serif font-bold text-xl text-[#fff4e0] uppercase underline underline-offset-4 decoration-white/40 truncate">
                  {title || 'Titolo del Proverbio'}
                </h4>
                <p className="text-sm italic text-[#fff4e0] line-clamp-2 mt-2 pl-3 border-l-2 border-white/40">
                  «{translation || 'Inserisci qui la traduzione in italiano...'}»
                </p>
              </div>

              <div className="text-xs text-[#2c1810]/75 leading-relaxed bg-[#fffaf0] p-3.5 rounded-xl border border-[#8b4513]/25 font-serif">
                💡 <strong className="text-[#2c1810]">Esportazione PNG:</strong> Potrai scaricare con un solo clic sia l'illustrazione artistica del proverbio, sia l'intera card a colori in alta definizione!
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="lg:col-span-12 flex items-center justify-end gap-3 pt-4 border-t border-[#8b4513]/25 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider text-[#2c1810] hover:bg-[#f6edd8] border border-[#8b4513]/30 transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              id="btn-save-proverb-card"
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2c1810] hover:bg-[#422215] text-[#fdf6e3] font-serif font-bold uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialProverb ? 'Salva Modifiche' : 'Crea Card Proverbio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
