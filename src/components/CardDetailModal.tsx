import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Volume2, Copy, Check, Sparkles, BookOpen, Share2, Loader2 } from 'lucide-react';
import { Proverb } from '../types';
import { COLOR_THEMES } from '../data/colorThemes';
import { ArtworkView } from './ArtworkView';
import { filterNoExport } from '../utils';

interface CardDetailModalProps {
  proverb: Proverb | null;
  onClose: () => void;
  onEdit: (proverb: Proverb) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  proverb,
  onClose,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExportingFull, setIsExportingFull] = useState(false);
  const fullDetailRef = useRef<HTMLDivElement>(null);

  if (!proverb) return null;

  const theme = COLOR_THEMES[proverb.themeColor] || COLOR_THEMES.vermilion;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${proverb.title}\n${proverb.chinese} (${proverb.pinyin})\n«${proverb.translation}»\n\nSpiegazione:\n${proverb.explanation}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
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

  const handleExportFullModal = async () => {
    if (!fullDetailRef.current || isExportingFull) return;
    try {
      setIsExportingFull(true);
      const dataUrl = await toPng(fullDetailRef.current, {
        pixelRatio: 2.5,
        quality: 0.98,
        cacheBust: true,
        skipFonts: true,
        filter: filterNoExport,
      });

      const link = document.createElement('a');
      const safeTitle = (proverb.title || proverb.chinese).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30);
      link.download = `proverbio_dettaglio_${safeTitle}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Errore durante l’esportazione PNG:', err);
    } finally {
      setIsExportingFull(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fdf6e3] border-2 border-[#8b4513] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8b4513]/25 bg-[#fffaf0]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full border border-[#8b4513]/40"
              style={{ backgroundColor: theme.hex }}
            />
            <span className="text-xs font-serif font-bold text-[#2c1810] uppercase tracking-widest">
              {theme.name} • {proverb.category || 'Saggezza'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(proverb);
              }}
              className="px-3.5 py-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#2c1810] bg-[#fdf6e3] hover:bg-[#f6edd8] border border-[#8b4513]/30 rounded-full transition-colors cursor-pointer"
            >
              Modifica
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#2c1810]/70 hover:text-[#2c1810] rounded-full hover:bg-[#8b4513]/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Capture container */}
        <div
          ref={fullDetailRef}
          className={`relative p-6 sm:p-8 overflow-y-auto ${theme.cardBg} border-4 ${theme.accentBorder} rounded-[1.8rem] m-3 sm:m-4 text-[#fff4e0] shadow-2xl overflow-hidden`}
        >
          {/* Background Ghost Calligraphy Ideogram */}
          <div className="absolute -right-8 -top-8 opacity-10 text-[18rem] font-serif select-none pointer-events-none leading-none z-0">
            {proverb.chinese.charAt(0) || '道'}
          </div>

          {/* Header */}
          <div className="relative z-10 text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight text-[#fff4e0] underline underline-offset-8 decoration-white/40 mb-3">
              {proverb.title}
            </h2>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/25 border border-white/20 backdrop-blur-xs">
              <span className="text-sm text-[#fff4e0]/90 font-serif italic font-medium">
                {proverb.pinyin}
              </span>
              <button
                data-no-export="true"
                onClick={handleSpeak}
                className="no-export p-1 hover:text-amber-200 transition-colors cursor-pointer"
                title="Ascolta la pronuncia"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-amber-300' : ''}`} />
              </button>
            </div>
          </div>

          {/* Big Artwork View */}
          <div className="relative z-10 max-w-xl mx-auto mb-6 shadow-2xl rounded-2xl overflow-hidden border-2 border-white/20">
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
              showExportButton={false}
            />
          </div>

          {/* Traduzione Card */}
          <div className="relative z-10 max-w-xl mx-auto mb-4 p-4 rounded-2xl bg-black/25 border border-white/20 backdrop-blur-xs">
            <div className="text-xs uppercase tracking-widest text-[#fff4e0]/80 font-serif font-bold mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-200" />
              <span>Traduzione</span>
            </div>
            <p className="text-lg sm:text-xl font-serif italic text-[#fff4e0] leading-relaxed pl-3 border-l-2 border-white/40">
              «{proverb.translation}»
            </p>
          </div>

          {/* Spiegazione Approfondita */}
          <div className="relative z-10 max-w-xl mx-auto p-4 rounded-2xl bg-black/20 border border-white/20 backdrop-blur-xs">
            <div className="text-xs uppercase tracking-widest text-[#fff4e0]/80 font-serif font-bold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Significato & Storia del Proverbio</span>
            </div>
            <p className="text-sm sm:text-base text-[#fff4e0]/95 leading-relaxed font-serif">
              {proverb.explanation}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#fffaf0] border-t border-[#8b4513]/25 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider text-[#2c1810] hover:bg-[#f6edd8] border border-[#8b4513]/30 rounded-full transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiato!' : 'Copia Testo'}</span>
          </button>

          <button
            onClick={handleExportFullModal}
            disabled={isExportingFull}
            className="flex items-center gap-2 px-5 py-2 text-xs font-serif font-bold uppercase tracking-wider text-[#fdf6e3] bg-[#2c1810] hover:bg-[#422215] rounded-full transition-all shadow-md cursor-pointer"
          >
            {isExportingFull ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Scarica Vista Completa PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
