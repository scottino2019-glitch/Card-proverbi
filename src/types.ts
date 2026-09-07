export type ThemeColor = 
  | 'vermilion' // Rosso Cinabro / Lacca Cinese
  | 'jade'      // Verde Giada
  | 'cobalt'    // Blu Porcellana Ming
  | 'gold'      // Oro Imperiale
  | 'plum'      // Viola Fiore di Prugna
  | 'teal'      // Verde Acqua & Bambù
  | 'lotus'     // Rosa Loto
  | 'indigo'    // Indaco Notturno
  | 'amber';    // Ambra d'Autunno

export type ArtStyle = 
  | 'mountains'     // Montagne e Nebbia (Shan Shui)
  | 'bamboo'        // Canne di Bambù nell'Inchiostro
  | 'plum_blossom'  // Fiori di Prugna invernali
  | 'rising_sun'    // Sole Rosso e Orizzonte
  | 'koi_fish'      // Carpe Koi e Crespature d'Acqua
  | 'moonlit_night' // Luna Piena e Nuvole
  | 'zen_circle'    // Cerchio Enso & Essenzialità;

export type CalligraphyFont = 
  | 'cursive'  // Zhi Mang Xing (Corsivo fluido e leggibile)
  | 'brush'    // Ma Shan Zheng (Pennello dinamico)
  | 'wild'     // Liu Jian Mao Cao (Corsivo d'erba espressivo)
  | 'serif';   // Noto Serif SC (Classico imperiale)

export type SealSymbol = '福' | '智' | '道' | '和' | '德' | '寿' | '吉' | '心';

export interface Proverb {
  id: string;
  title: string;                 // Titolo in italiano (es: "Il Vecchio alla Frontiera")
  chinese: string;               // Ideogrammi cinesi (es: "塞翁失马，焉知非福")
  pinyin: string;                // Trascrizione fonetica (es: "Sài wēng shī mǎ, yān zhī fēi fú")
  translation: string;           // Traduzione letterale e figurata in italiano
  explanation: string;           // Spiegazione filosofica, aneddoto storico o significato pratico
  themeColor: ThemeColor;        // Colore caratteristico della card
  artStyle: ArtStyle;            // Motivo artistico del disegno
  calligraphyFont: CalligraphyFont; // Tipo di grafia per gli ideogrammi
  sealSymbol: SealSymbol;        // Ideogramma del sigillo rosso
  category?: 'Saggezza' | 'Perseveranza' | 'Natura & Vita' | 'Destino & Tempo' | 'Relazioni';
  createdAt: number;
  customIllustrationUrl?: string; // Optional custom image if uploaded
}

export interface ColorScheme {
  id: ThemeColor;
  name: string;
  bgGradient: string;
  cardBg: string;
  headerBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  artGradient: string;
  hex: string;
}
