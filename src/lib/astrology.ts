export interface ZodiacInfo {
  signTh: string;
  signEn: string;
  symbol: string;
  element: 'ไฟ' | 'น้ำ' | 'ลม' | 'ดิน';
  dates: string;
  auspiciousStone: string;
}

export function getZodiacFromDate(birthDateStr: string): ZodiacInfo {
  if (!birthDateStr) {
    return {
      signTh: 'จักรราศี',
      signEn: 'Zodiac',
      symbol: '✨',
      element: 'ลม',
      dates: 'ทุกช่วงเวลา',
      auspiciousStone: 'อเมทิสต์ (Amethyst)',
    };
  }

  const date = new Date(birthDateStr);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      signTh: 'ราศีเมษ',
      signEn: 'Aries',
      symbol: '♈',
      element: 'ไฟ',
      dates: '21 มี.ค. - 19 เม.ย.',
      auspiciousStone: 'ทับทิม, แจสเปอร์แดง',
    };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      signTh: 'ราศีพฤษภ',
      signEn: 'Taurus',
      symbol: '♉',
      element: 'ดิน',
      dates: '20 เม.ย. - 20 พ.ค.',
      auspiciousStone: 'มรกต, หยกเขียว',
    };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      signTh: 'ราศีเมถุน',
      signEn: 'Gemini',
      symbol: '♊',
      element: 'ลม',
      dates: '21 พ.ค. - 20 มิ.ย.',
      auspiciousStone: 'อาเกต, มุกดาหาร',
    };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      signTh: 'ราศีกรกฎ',
      signEn: 'Cancer',
      symbol: '♋',
      element: 'น้ำ',
      dates: '21 มิ.ย. - 22 ก.ค.',
      auspiciousStone: 'ไข่มุก, มูนสโตน',
    };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      signTh: 'ราศีสิงห์',
      signEn: 'Leo',
      symbol: '♌',
      element: 'ไฟ',
      dates: '23 ก.ค. - 22 ส.ค.',
      auspiciousStone: 'เพริดอต, อำพันทอง',
    };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      signTh: 'ราศีกันย์',
      signEn: 'Virgo',
      symbol: '♍',
      element: 'ดิน',
      dates: '23 ส.ค. - 22 ก.ย.',
      auspiciousStone: 'ไพลิน, คาร์เนเลียน',
    };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      signTh: 'ราศีดุล',
      signEn: 'Libra',
      symbol: '♎',
      element: 'ลม',
      dates: '23 ก.ย. - 22 ต.ค.',
      auspiciousStone: 'โอปอล, โรสควอตซ์',
    };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      signTh: 'ราศีพิจิก',
      signEn: 'Scorpio',
      symbol: '♏',
      element: 'น้ำ',
      dates: '23 ต.ค. - 21 พ.ย.',
      auspiciousStone: 'โทแพซสีเหลือง, โกเมน',
    };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      signTh: 'ราศีธนู',
      signEn: 'Sagittarius',
      symbol: '♐',
      element: 'ไฟ',
      dates: '22 พ.ย. - 21 ธ.ค.',
      auspiciousStone: 'เทอร์ควอยซ์, ลาพิส ลาซูลี',
    };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return {
      signTh: 'ราศีมังกร',
      signEn: 'Capricorn',
      symbol: '♑',
      element: 'ดิน',
      dates: '22 ธ.ค. - 19 ม.ค.',
      auspiciousStone: 'โกเมนดำ, ออนิกซ์',
    };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      signTh: 'ราศีกุมภ์',
      signEn: 'Aquarius',
      symbol: '♒',
      element: 'ลม',
      dates: '20 ม.ค. - 18 ก.พ.',
      auspiciousStone: 'อเมทิสต์, อความารีน',
    };
  } else {
    return {
      signTh: 'ราศีมีน',
      signEn: 'Pisces',
      symbol: '♓',
      element: 'น้ำ',
      dates: '19 ก.พ. - 20 มี.ค.',
      auspiciousStone: 'อความารีน, มูนสโตน',
    };
  }
}

export interface SuggestedQuestion {
  category: string;
  iconType: 'heart' | 'briefcase' | 'coins' | 'sparkles';
  question: string;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    category: 'ความรักและความสัมพันธ์',
    iconType: 'heart',
    question: 'ความสัมพันธ์กับคนที่กำลังคุยอยู่ มีเกณฑ์จะพัฒนาไปในทิศทางไหน?',
  },
  {
    category: 'การงานและอาชีพ',
    iconType: 'briefcase',
    question: 'ในช่วง 3 เดือนข้างหน้านี้ การงานหรือโปรเจกต์ที่ทำจะประสบความสำเร็จหรือไม่ มีเกณฑ์ก้าวหน้าอย่างไร?',
  },
  {
    category: 'การเงินและโชคลาภ',
    iconType: 'coins',
    question: 'สภาพคล่องทางการเงินและโอกาสรับทรัพย์ใหม่ๆ ในช่วงนี้เป็นอย่างไร ควรระวังอะไรบ้าง?',
  },
  {
    category: 'ภาพรวมชีวิตและข้อควรระวัง',
    iconType: 'sparkles',
    question: 'ช่วงนี้จักรวาลต้องการเตือนหรือแนะนำสิ่งใดเป็นพิเศษเพื่อเสริมดวงชะตาให้ราบรื่น?',
  },
];
