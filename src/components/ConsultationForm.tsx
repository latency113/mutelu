'use client';

import { useState, useId } from 'react';
import {
  Calendar,
  Sparkles,
  Compass,
  HelpCircle,
  Heart,
  Briefcase,
  Coins,
  AlertCircle,
} from 'lucide-react';
import { getZodiacFromDate, SUGGESTED_QUESTIONS, ZodiacInfo } from '@/lib/astrology';
import { soundManager } from '@/lib/sound';

interface ConsultationFormProps {
  birthDate: string;
  setBirthDate: (date: string) => void;
  question: string;
  setQuestion: (q: string) => void;
  onProceed: (zodiac: ZodiacInfo) => void;
}

const THAI_MONTHS = [
  { value: '01', label: 'มกราคม' },
  { value: '02', label: 'กุมภาพันธ์' },
  { value: '03', label: 'มีนาคม' },
  { value: '04', label: 'เมษายน' },
  { value: '05', label: 'พฤษภาคม' },
  { value: '06', label: 'มิถุนายน' },
  { value: '07', label: 'กรกฎาคม' },
  { value: '08', label: 'สิงหาคม' },
  { value: '09', label: 'กันยายน' },
  { value: '10', label: 'ตุลาคม' },
  { value: '11', label: 'พฤศจิกายน' },
  { value: '12', label: 'ธันวาคม' },
];

export default function ConsultationForm({
  birthDate,
  setBirthDate,
  question,
  setQuestion,
  onProceed,
}: ConsultationFormProps) {
  const [error, setError] = useState<string | null>(null);
  const questionInputId = useId();

  // Parse existing birthDate (YYYY-MM-DD) if available
  const initialParts = birthDate ? birthDate.split('-') : [];
  const [selectedYear, setSelectedYear] = useState<string>(initialParts[0] || '');
  const [selectedMonth, setSelectedMonth] = useState<string>(initialParts[1] || '');
  const [selectedDay, setSelectedDay] = useState<string>(initialParts[2] || '');

  // Generate Year options: 2026 down to 1940
  const currentYear = 2026;
  const years = Array.from({ length: 87 }, (_, i) => currentYear - i);

  // Generate Days depending on selected month & year
  const getDaysInMonth = (y: string, m: string) => {
    if (!m) return 31;
    const yearNum = y ? parseInt(y, 10) : 2024;
    const monthNum = parseInt(m, 10);
    return new Date(yearNum, monthNum, 0).getDate();
  };

  const daysCount = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysCount }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  const handleDateChange = (
    newDay: string,
    newMonth: string,
    newYear: string
  ) => {
    setSelectedDay(newDay);
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);

    if (newDay && newMonth && newYear) {
      const formatted = `${newYear}-${newMonth}-${newDay}`;
      setBirthDate(formatted);
      if (error) setError(null);
    }
  };

  const currentZodiac = getZodiacFromDate(birthDate);

  const handleSelectSuggestedQuestion = (q: string) => {
    setQuestion(q);
    setError(null);
    soundManager.playCardDraw();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedMonth || !selectedYear || !birthDate) {
      setError('กรุณาระบุวัน เดือน และปีเกิด ให้ครบถ้วนเพื่อคำนวณพื้นดวงชะตา');
      return;
    }
    if (!question.trim()) {
      setError('กรุณาระบุเรื่องที่ต้องการถาม หรือเลือกคำถามแนะนำด้านล่าง');
      return;
    }

    setError(null);
    soundManager.playCardDraw();
    onProceed(currentZodiac);
  };

  const renderQuestionIcon = (iconType: string) => {
    switch (iconType) {
      case 'heart':
        return <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'briefcase':
        return <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'coins':
        return <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Intro Banner */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-xs text-amber-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>พิธีกรรมพยากรณ์ชะตาชีวิต 3 มิติ</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gold-gradient">
          ตั้งจิตอธิษฐาน & สื่อสารกับดวงดาว
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 max-w-lg mx-auto">
          ระบุวันเกิดและตั้งจิตแน่วแน่ต่อคำถามที่ติดค้างในใจ เพื่อให้พลังแห่งไพ่สะท้อนความจริงอย่างแม่นยำ
        </p>
      </div>

      {/* Main Form Box */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-amber-500/30">
        {/* Glow corners */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Birth Date Section: Custom Thai Date Selector */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-purple-200 mb-2.5">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                วัน / เดือน / ปีเกิด
              </span>
              {birthDate && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-normal">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  คำนวณราศีอัตโนมัติ
                </span>
              )}
            </div>

            {/* 3 Select dropdowns for Day, Month, Year */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Day Select */}
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) =>
                    handleDateChange(e.target.value, selectedMonth, selectedYear)
                  }
                  className="w-full px-3 py-3.5 rounded-xl bg-purple-950/70 border border-purple-700/50 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-xs sm:text-sm font-medium [color-scheme:dark] cursor-pointer appearance-none text-center"
                >
                  <option value="" disabled className="bg-[#120726] text-purple-400">
                    วัน
                  </option>
                  {days.map((d) => (
                    <option key={d} value={d} className="bg-[#120726] text-white">
                      วันที่ {parseInt(d, 10)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Month Select */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    handleDateChange(selectedDay, e.target.value, selectedYear)
                  }
                  className="w-full px-3 py-3.5 rounded-xl bg-purple-950/70 border border-purple-700/50 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-xs sm:text-sm font-medium [color-scheme:dark] cursor-pointer appearance-none text-center"
                >
                  <option value="" disabled className="bg-[#120726] text-purple-400">
                    เดือน
                  </option>
                  {THAI_MONTHS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-[#120726] text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Year Select (พ.ศ. / ค.ศ.) */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    handleDateChange(selectedDay, selectedMonth, e.target.value)
                  }
                  className="w-full px-3 py-3.5 rounded-xl bg-purple-950/70 border border-purple-700/50 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-xs sm:text-sm font-medium [color-scheme:dark] cursor-pointer appearance-none text-center"
                >
                  <option value="" disabled className="bg-[#120726] text-purple-400">
                    ปี พ.ศ.
                  </option>
                  {years.map((y) => (
                    <option key={y} value={String(y)} className="bg-[#120726] text-white">
                      พ.ศ. {y + 543} ({y})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Zodiac Preview Card */}
            {birthDate && (
              <div className="mt-3 p-3.5 rounded-xl bg-purple-950/80 border border-amber-500/30 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg">
                    {currentZodiac.symbol}
                  </div>
                  <div>
                    <div className="font-semibold text-amber-300 text-sm flex items-center gap-1.5">
                      {currentZodiac.signTh} ({currentZodiac.signEn})
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/40 text-purple-200">
                        ธาตุ{currentZodiac.element}
                      </span>
                    </div>
                    <div className="text-purple-300/70 text-[11px] mt-0.5">
                      หินมงคลคู่บารมี: {currentZodiac.auspiciousStone}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-amber-200/80 hidden sm:block">
                  {currentZodiac.dates}
                </div>
              </div>
            )}
          </div>

          {/* Question Section */}
          <div>
            <label htmlFor={questionInputId} className="flex items-center justify-between text-sm font-semibold text-purple-200 mb-2">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                คำถามเฉพาะตัวที่คุณต้องการคำตอบ
              </span>
              <span className="text-xs text-purple-400">
                {question.length}/200 ตัวอักษร
              </span>
            </label>
            <textarea
              id={questionInputId}
              rows={3}
              value={question}
              maxLength={200}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (error) setError(null);
              }}
              placeholder="ตัวอย่าง: ความรักช่วงนี้กับคนที่คุยอยู่จะเป็นอย่างไร? / การงานจะมีโอกาสก้าวหน้าหรือย้ายงานสำเร็จไหม?"
              className="w-full px-4 py-3.5 rounded-xl bg-purple-950/60 border border-purple-700/50 text-white placeholder-purple-400/60 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm leading-relaxed resize-none"
            />
          </div>

          {/* Quick Preset Questions with Lucide icons */}
          <div>
            <p className="text-xs font-medium text-purple-300/80 mb-2.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              หรือเลือกหัวข้อคำถามยอดฮิตสายมู:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestedQuestion(item.question)}
                  className={`p-2.5 text-left rounded-xl text-xs transition-all border ${
                    question === item.question
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-800/40 text-purple-200/90 hover:border-purple-600/60'
                  }`}
                >
                  <div className="font-semibold text-amber-300 text-[11px] mb-0.5 flex items-center gap-1.5">
                    {renderQuestionIcon(item.iconType)}
                    <span>{item.category}</span>
                  </div>
                  <div className="line-clamp-2 text-purple-300/80 text-[11px]">
                    {item.question}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit / Proceed Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-purple-950 font-bold text-base tracking-wide hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>ก้าวเข้าสู่พิธีเปิดสำรับไพ่</span>
            <Sparkles className="w-5 h-5 text-purple-950 group-hover:rotate-45 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
