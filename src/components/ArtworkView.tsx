import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Loader2, Sparkles, ZoomIn } from 'lucide-react';
import { ArtStyle, CalligraphyFont, SealSymbol, ThemeColor } from '../types';
import { COLOR_THEMES } from '../data/colorThemes';
import { filterNoExport } from '../utils';

interface ArtworkViewProps {
  chinese: string;
  pinyin?: string;
  artStyle: ArtStyle;
  calligraphyFont: CalligraphyFont;
  themeColor: ThemeColor;
  sealSymbol: SealSymbol;
  title: string;
  customIllustrationUrl?: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
  showExportButton?: boolean;
  onImageClick?: () => void;
  className?: string;
}

export const ArtworkView: React.FC<ArtworkViewProps> = ({
  chinese,
  pinyin,
  artStyle,
  calligraphyFont,
  themeColor,
  sealSymbol,
  title,
  customIllustrationUrl,
  aspectRatio = 'wide',
  showExportButton = true,
  onImageClick,
  className = '',
}) => {
  const artworkRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const theme = COLOR_THEMES[themeColor] || COLOR_THEMES.vermilion;

  // Font family mapping
  const getFontFamily = (font: CalligraphyFont) => {
    switch (font) {
      case 'cursive':
        return "'Zhi Mang Xing', cursive";
      case 'brush':
        return "'Ma Shan Zheng', cursive";
      case 'wild':
        return "'Liu Jian Mao Cao', cursive";
      case 'serif':
        return "'Noto Serif SC', serif";
      default:
        return "'Zhi Mang Xing', cursive";
    }
  };

  const handleExportPNG = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!artworkRef.current || isExporting) return;

    try {
      setIsExporting(true);
      const dataUrl = await toPng(artworkRef.current, {
        pixelRatio: 3,
        quality: 0.98,
        cacheBust: true,
        skipFonts: true,
        filter: filterNoExport,
      });

      const link = document.createElement('a');
      const safeTitle = (title || chinese).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30);
      link.download = `disegno_${safeTitle}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Errore durante l’esportazione del disegno PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Render artistic vector oriental motifs based on artStyle
  const renderBackgroundMotif = () => {
    switch (artStyle) {
      case 'mountains':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 400 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mist1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            {/* Distant mountains */}
            <path d="M-20,160 Q60,70 140,150 T300,100 T420,170 L420,240 L-20,240 Z" fill="currentColor" className="text-stone-900/40" />
            {/* Mid misty peak */}
            <path d="M40,240 L160,80 L280,240 Z" fill="currentColor" className="text-stone-800/35" />
            <path d="M120,240 L210,110 L300,240 Z" fill="currentColor" className="text-stone-900/30" />
            {/* Soft mist ribbons */}
            <path d="M0,130 Q100,110 200,135 T400,120 L400,180 L0,180 Z" fill="url(#mist1)" />
            {/* Flying Cranes */}
            <g className="text-amber-200/50" transform="translate(60, 40) scale(0.6)">
              <path d="M0,8 Q8,0 16,6 Q24,0 32,8 Q20,10 16,14 Q12,10 0,8 Z" fill="currentColor" />
            </g>
            <g className="text-amber-200/40" transform="translate(95, 30) scale(0.45)">
              <path d="M0,8 Q8,0 16,6 Q24,0 32,8 Q20,10 16,14 Q12,10 0,8 Z" fill="currentColor" />
            </g>
          </svg>
        );

      case 'bamboo':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-65 pointer-events-none" viewBox="0 0 400 240">
            {/* Bamboo stalks */}
            <line x1="45" y1="0" x2="45" y2="240" stroke="currentColor" strokeWidth="9" strokeDasharray="38 4" className="text-emerald-950/70" />
            <line x1="75" y1="0" x2="75" y2="240" stroke="currentColor" strokeWidth="6" strokeDasharray="30 3" className="text-emerald-900/60" />
            <line x1="360" y1="0" x2="360" y2="240" stroke="currentColor" strokeWidth="8" strokeDasharray="35 3" className="text-emerald-950/60" />
            {/* Bamboo leaves */}
            <path d="M45,60 Q70,55 90,75 Q65,70 45,60 Z" fill="currentColor" className="text-emerald-800/80" />
            <path d="M45,60 Q65,40 85,45 Q65,55 45,60 Z" fill="currentColor" className="text-teal-700/70" />
            <path d="M75,110 Q105,100 125,120 Q100,115 75,110 Z" fill="currentColor" className="text-emerald-800/80" />
            <path d="M75,110 Q95,90 120,95 Q95,105 75,110 Z" fill="currentColor" className="text-teal-700/70" />
            <path d="M360,80 Q330,70 310,90 Q335,85 360,80 Z" fill="currentColor" className="text-emerald-800/80" />
            <path d="M360,130 Q325,125 305,145 Q330,140 360,130 Z" fill="currentColor" className="text-emerald-800/80" />
          </svg>
        );

      case 'plum_blossom':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" viewBox="0 0 400 240">
            {/* Twisted gnarled branch */}
            <path d="M0,20 Q60,40 110,30 T200,60 T310,40 T400,80" fill="none" stroke="currentColor" strokeWidth="4" className="text-stone-900/80" strokeLinecap="round" />
            <path d="M110,30 Q130,80 150,110" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-stone-900/80" strokeLinecap="round" />
            <path d="M200,60 Q220,10 240,0" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-900/80" strokeLinecap="round" />
            {/* Blossoms */}
            {[
              { cx: 70, cy: 35, r: 8 },
              { cx: 130, cy: 30, r: 10 },
              { cx: 150, cy: 110, r: 7 },
              { cx: 210, cy: 55, r: 9 },
              { cx: 270, cy: 45, r: 11 },
              { cx: 330, cy: 50, r: 8 },
              { cx: 380, cy: 75, r: 9 },
            ].map((blossom, idx) => (
              <g key={idx}>
                <circle cx={blossom.cx} cy={blossom.cy} r={blossom.r} className="fill-rose-500/80" />
                <circle cx={blossom.cx} cy={blossom.cy} r={blossom.r * 0.4} className="fill-amber-300" />
              </g>
            ))}
            {/* Drifting petals */}
            <circle cx="90" cy="90" r="3.5" className="fill-rose-400/60" />
            <circle cx="180" cy="140" r="3" className="fill-rose-400/60" />
            <circle cx="280" cy="120" r="4" className="fill-rose-400/60" />
            <circle cx="340" cy="160" r="3" className="fill-rose-400/50" />
          </svg>
        );

      case 'rising_sun':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-65 pointer-events-none" viewBox="0 0 400 240">
            {/* Sun Disk */}
            <circle cx="200" cy="100" r="65" className="fill-red-500/50" />
            <circle cx="200" cy="100" r="85" className="fill-amber-400/20" />
            {/* Wave patterns at bottom */}
            <path d="M0,190 Q50,170 100,190 T200,190 T300,190 T400,190 L400,240 L0,240 Z" fill="currentColor" className="text-amber-950/40" />
            <path d="M0,205 Q50,195 100,205 T200,205 T300,205 T400,205 L400,240 L0,240 Z" fill="currentColor" className="text-stone-900/60" />
          </svg>
        );

      case 'koi_fish':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-65 pointer-events-none" viewBox="0 0 400 240">
            {/* Ripples */}
            <circle cx="140" cy="120" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300/30" />
            <circle cx="140" cy="120" r="70" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300/20" />
            <circle cx="260" cy="130" r="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300/25" />
            {/* Stylized Koi 1 */}
            <path d="M110,95 Q140,80 160,110 Q145,135 120,115 Z" fill="currentColor" className="text-amber-500/70" />
            <path d="M160,110 Q180,115 175,130 Q160,125 160,110 Z" fill="currentColor" className="text-rose-500/70" />
            {/* Stylized Koi 2 */}
            <path d="M260,150 Q285,120 270,100 Q240,115 250,140 Z" fill="currentColor" className="text-rose-400/70" />
            {/* Lotus leaf */}
            <circle cx="330" cy="60" r="30" className="fill-emerald-800/40" />
          </svg>
        );

      case 'moonlit_night':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-65 pointer-events-none" viewBox="0 0 400 240">
            {/* Glowing moon */}
            <circle cx="310" cy="65" r="38" className="fill-indigo-100/70" />
            <circle cx="310" cy="65" r="50" className="fill-indigo-200/20" />
            {/* Drifting ink clouds */}
            <path d="M220,70 Q270,55 310,75 T380,65 Q390,75 350,85 T240,80 Z" fill="currentColor" className="text-slate-900/60" />
            {/* Distant mountain silhouette */}
            <path d="M0,240 L80,180 L180,240 L260,195 L340,240 L400,210 L400,240 Z" fill="currentColor" className="text-slate-950/70" />
          </svg>
        );

      case 'zen_circle':
      default:
        return (
          <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 400 240">
            {/* Brushed Enso Circle */}
            <circle
              cx="200"
              cy="120"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray="400 60"
              strokeLinecap="round"
              className="text-amber-200/30"
              transform="rotate(-25 200 120)"
            />
          </svg>
        );
    }
  };

  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-[16/10]',
    tall: 'aspect-[4/5]',
  }[aspectRatio];

  return (
    <div className={`relative group rounded-xl overflow-hidden shadow-inner select-none ${className}`}>
      {/* Container node captured for PNG export */}
      <div
        ref={artworkRef}
        onClick={onImageClick}
        className={`w-full ${aspectClasses} relative flex flex-col items-center justify-center p-5 bg-gradient-to-br ${theme.artGradient} overflow-hidden border border-white/10`}
      >
        {/* Oriental decorative background motifs or custom image */}
        {customIllustrationUrl ? (
          <img
            src={customIllustrationUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
          />
        ) : (
          renderBackgroundMotif()
        )}

        {/* Subtle decorative corner frames (Traditional Chinese pattern) */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-300/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-300/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-300/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-300/40 pointer-events-none" />

        {/* Traditional Red Seal Stamp (印章 - Yìnzhāng) in upper right or bottom right */}
        <div
          id={`seal-${sealSymbol}`}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-sm bg-red-600/90 border border-red-400 shadow-md flex items-center justify-center rotate-3 transform transition-transform group-hover:rotate-0"
          title={`Sigillo di Auspicio: ${sealSymbol}`}
        >
          <span className="font-hanzi font-bold text-amber-100 text-sm leading-none drop-shadow">
            {sealSymbol}
          </span>
        </div>

        {/* Small subtle Pinyin badge above or below characters */}
        {pinyin && (
          <div className="z-10 mb-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/10 text-amber-200/90 text-xs tracking-wider font-medium text-center shadow-xs">
            {pinyin}
          </div>
        )}

        {/* The Cursive Yet Legible Chinese Calligraphy Characters with Artistic Medallion */}
        <div className="z-10 text-center px-2 my-auto relative flex items-center justify-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/25 shadow-inner p-2 transform -rotate-1 group-hover:rotate-0 transition-transform">
            <div
              style={{
                fontFamily: getFontFamily(calligraphyFont),
                textShadow: '0 2px 14px rgba(0,0,0,0.6), 0 0 30px rgba(255, 244, 224, 0.3)',
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#fff4e0] tracking-wider transition-all duration-300 transform group-hover:scale-105 select-none"
            >
              {chinese}
            </div>
          </div>
        </div>

        {/* Aesthetic bottom signature/title watermark */}
        <div className="z-10 mt-auto flex items-center justify-between w-full text-[11px] text-[#fff4e0]/75 font-serif tracking-widest uppercase border-t border-white/15 pt-1.5 px-1">
          <span className="truncate max-w-[70%]">{title}</span>
          <span className="text-[10px] opacity-75">中華成語</span>
        </div>
      </div>

      {/* Floating Action Bar: Export drawing as PNG & Fullscreen preview */}
      {showExportButton && (
        <div
          data-no-export="true"
          className="no-export absolute top-2.5 left-2.5 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 z-20"
        >
          <button
            data-no-export="true"
            id="btn-export-drawing-png"
            onClick={handleExportPNG}
            disabled={isExporting}
            className="flex items-center gap-1 px-3 py-1 bg-[#2c1810]/85 hover:bg-[#2c1810] text-[#fff4e0] rounded-full text-xs font-serif font-bold uppercase tracking-wider backdrop-blur-sm border border-white/30 shadow-md cursor-pointer transition-colors"
            title="Esporta questa illustrazione con ideogramma in PNG"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>PNG Disegno</span>
          </button>

          {onImageClick && (
            <button
              data-no-export="true"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick();
              }}
              className="p-1.5 bg-[#2c1810]/85 hover:bg-[#2c1810] text-[#fff4e0] rounded-full backdrop-blur-sm border border-white/30 shadow-md cursor-pointer transition-colors"
              title="Ingrandisci disegno"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
