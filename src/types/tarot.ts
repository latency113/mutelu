export type CardPosition = 'past' | 'present' | 'future';

export interface TarotCard {
  id: number;
  number: number;
  roman: string;
  nameEn: string;
  nameTh: string;
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
