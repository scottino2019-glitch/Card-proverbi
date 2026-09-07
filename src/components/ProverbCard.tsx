import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Volume2, Copy, Check, Edit3, Trash2, BookOpen, Sparkles, Loader2, Share2 } from 'lucide-react';
import { Proverb } from '../types';
import { COLOR_THEMES } from '../data/colorThemes';
import { ArtworkView } from './ArtworkView';
import { filterNoExport } from '../utils';

interface ProverbCardProps {
  proverb: Proverb;
  onEdit: (proverb: Proverb) => void;
  onDelete: (id: string) => void;
  onSelect?: (proverb: Proverb) => void;
}

export const ProverbCard: React.FC<ProverbCardProps> = ({
  proverb,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExportingCard, setIsExportingCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const theme = COLOR_THEMES[proverb.themeColor] || COLOR_THEMES.vermilion;

  // Copy characters to clipboard
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${proverb.chinese} (${proverb.pinyin}) - ${proverb.translation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pronunciation via browser SpeechSynthesis
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(proverb.chinese);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Export entire card as high-resolution PNG
  const handleExportCardPNG = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current || isExportingCard) return;

    try {
      setIsExportingCard(true);
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2.5,
        quality: 0.98,
        cacheBust: true,
        skipFonts: true,
        filter: filterNoExport,
      });

      const link = document.createElement('a');
      const safeTitle = (proverb.title || proverb.chinese).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30);
      link.download = `card_${safeTitle}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Errore durante l’esportazione della card PNG:', err);
    } finally {
      setIsExportingCard(false);
    }
  };

  return (
    <div
      ref={cardRef}
      id={`card-${proverb.id}`}
      className={`relative flex flex-col justify-between rounded-[2rem] p-6 md:p-8 text-[#fff4e0] shadow-2xl transition-all duration-300 border-4 overflow-hidden ${theme.cardBg} ${theme.accentBorder} hover:shadow-2xl hover:-translate-y-1`}
    >
      {/* Background Ghost Calligraphy Ideogram */}
      <div className="absolute -right-6 -top-6 opacity-10 text-[14rem] sm:text-[16rem] font-serif select-none pointer-events-none leading-none z-0">
        {proverb.chinese.charAt(0) || '道'}
      </div>

      {/* Top Bar: Category / Reference Code & Actions */}
      <div className="relative z-10 flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {proverb.category && (
            <span
              className={`inline-block px-3 py-0.5 text-[11px] font-serif font-bold tracking-widest uppercase rounded-full border ${theme.badgeBg}`}
            >
              {proverb.category}
            </span>
          )}
          <span className="opacity-50 text-[10px] uppercase font-mono tracking-[0.2em]">
            CN-{(proverb.id || '01').slice(-3)}
          </span>
        </div>

        {/* Quick Toolbar (excluded from exported image) */}
        <div
          data-no-export="true"
          className="no-export flex items-center gap-1 shrink-0 bg-black/20 backdrop-blur-xs p-1 rounded-full border border-white/20"
        >
          <button
            data-no-export="true"
            id={`btn-listen-${proverb.id}`}
            onClick={handleSpeak}
            className={`p-1.5 rounded-full hover:bg-white/20 text-[#fff4e0] transition-colors ${
              isPlayingAudio ? 'animate-pulse text-amber-300 bg-white/25' : ''
            }`}
            title="Ascolta la pronuncia cinese"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            data-no-export="true"
            id={`btn-copy-${proverb.id}`}
            onClick={handleCopy}
            className="p-1.5 rounded-full hover:bg-white/20 text-[#fff4e0] transition-colors"
            title="Copia proverbio e traduzione"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            data-no-export="true"
            id={`btn-edit-${proverb.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(proverb);
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-[#fff4e0] transition-colors"
            title="Modifica card"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            data-no-export="true"
            id={`btn-delete-${proverb.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Vuoi davvero eliminare la card "${proverb.title}"?`)) {
                onDelete(proverb.id);
              }
            }}
            className="p-1.5 rounded-full hover:bg-red-500/40 text-rose-200 transition-colors"
            title="Elimina card"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-4">
        <h3
          id={`proverb-title-${proverb.id}`}
          className="text-2xl md:text-3xl font-extrabold font-serif uppercase tracking-tight underline underline-offset-8 decoration-white/40 text-[#fff4e0] drop-shadow-sm"
        >
          {proverb.title}
        </h3>
      </div>

      {/* 2. Immagine Artistica tipo disegno con Ideogramma corsivo leggibile */}
      <div className="relative z-10 mb-4 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
        <ArtworkView
          chinese={proverb.chinese}
          pinyin={proverb.pinyin}
          artStyle={proverb.artStyle}
          calligraphyFont={proverb.calligraphyFont}
          themeColor={proverb.themeColor}
          sealSymbol={proverb.sealSymbol}
          title={proverb.title}
          customIllustrationUrl={proverb.customIllustrationUrl}
          aspectRatio="wide"
          showExportButton={true}
          onImageClick={() => onSelect && onSelect(proverb)}
        />
      </div>

      {/* 3. Proverbio Cinese e Pinyin (Dettaglio testuale) */}
      <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/20">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-[#fff4e0]/80 font-serif font-bold">
            Caratteri Tradizionali & Pinyin
          </span>
          <span className="text-xs text-[#fff4e0]/60 font-mono">
            {proverb.chinese.length} caratteri
          </span>
        </div>
        <div className="text-2xl md:text-3xl font-hanzi font-bold text-[#fff4e0] tracking-wide mb-1">
          {proverb.chinese}
        </div>
        <div className="text-sm text-[#fff4e0]/90 italic font-serif font-medium">
          {proverb.pinyin}
        </div>
      </div>

      {/* 4. Traduzione */}
      <div className="relative z-10 mb-4">
        <p className="text-xl md:text-2xl font-serif font-medium leading-snug italic text-[#fff4e0] pl-3.5 border-l-3 border-white/50">
          «{proverb.translation}»
        </p>
      </div>

      {/* 5. Spiegazione */}
      <div className="relative z-10 mb-4 grow space-y-1 pt-3.5 border-t border-white/30">
        <strong className="font-serif font-bold uppercase block text-[10px] opacity-80 tracking-widest text-[#fff4e0]">
          Significato & Origine
        </strong>
        <p className="text-xs md:text-sm text-[#fff4e0]/95 font-serif leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
          {proverb.explanation}
        </p>
      </div>

      {/* Bottom Bar: Esportazione in PNG della Card Intera & Dettagli */}
      <div className="relative z-10 mt-auto pt-3.5 border-t border-white/20 flex items-center justify-between gap-2">
        <div className="text-[11px] text-[#fff4e0]/70 font-serif flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: theme.hex }} />
          <span>{theme.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#fff4e0]/60 font-serif italic tracking-wider">
            Saggezza Orientale
          </span>

          <button
            data-no-export="true"
            id={`btn-export-card-${proverb.id}`}
            onClick={handleExportCardPNG}
            disabled={isExportingCard}
            className="no-export flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-[#fff4e0] border border-white/30 rounded-full text-xs font-serif font-bold uppercase tracking-wider backdrop-blur-xs cursor-pointer transition-all shadow-md active:scale-95"
            title="Scarica l'intera card in alta definizione PNG"
          >
            {isExportingCard ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Scarica Card PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
