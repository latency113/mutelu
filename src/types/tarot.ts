export type CardPosition = 'past' | 'present' | 'future';
export type ArcanaType = 'major' | 'minor';
export type CardSuit = 'major' | 'cups' | 'pentacles' | 'swords' | 'wands';

export interface TarotCard {
  id: number;
  number: number;
  roman: string;
  nameEn: string;
  nameTh: string;
  arcana: ArcanaType;
  suit: CardSuit;
  suitTh?: string;
  image: string;
  element: 'ไฟ' | 'น้ำ' | 'ลม' | 'ดิน' | 'วิญญาณ';
  zodiacSign?: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  symbol: string;
  colorScheme: {
    primary: string;
    border: string;
    glow: string;
    bgGradient: string;
  };
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: CardPosition;
  revealed: boolean;
}

export interface HoroscopeRequest {
  birthDate: string;
  question: string;
  zodiac?: string;
  cards: {
    id: number;
    nameEn: string;
    nameTh: string;
    isReversed: boolean;
    position: string;
    positionLabel: string;
  }[];
}

export interface HoroscopeResponse {
  reading: string;
  luckyNumbers?: string;
  luckyColor?: string;
  luckyDirection?: string;
  modelUsed?: string;
}
