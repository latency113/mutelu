'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CosmicBackground from '@/components/CosmicBackground';
import ConsultationForm from '@/components/ConsultationForm';
import TarotDeckSpread from '@/components/TarotDeckSpread';
import HoroscopeResult from '@/components/HoroscopeResult';
import OracleLoading from '@/components/OracleLoading';
import { DrawnCard, HoroscopeResponse } from '@/types/tarot';
import { ZodiacInfo, getZodiacFromDate } from '@/lib/astrology';

type Step = 'form' | 'spread' | 'reading';

export default function Home() {
  const [step, setStep] = useState<Step>('form');
  const [birthDate, setBirthDate] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [zodiac, setZodiac] = useState<ZodiacInfo>(getZodiacFromDate(''));
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [result, setResult] = useState<HoroscopeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Transition from form to deck spread
  const handleProceedFromForm = (calculatedZodiac: ZodiacInfo) => {
    setZodiac(calculatedZodiac);
    setStep('spread');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to form
  const handleBackToForm = () => {
    setStep('form');
  };

  // Request reading from AI Backend
  const handleProceedToReading = async (cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        birthDate,
        question,
        zodiac: zodiac.signTh,
        cards: cards.map((c) => ({
          id: c.card.id,
          nameEn: c.card.nameEn,
          nameTh: c.card.nameTh,
          isReversed: c.isReversed,
          position: c.position,
          positionLabel:
            c.position === 'past'
              ? 'อดีต/รากฐาน'
              : c.position === 'present'
              ? 'ปัจจุบัน/สถานการณ์'
              : 'อนาคต/แนวโน้ม',
        })),
      };

      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'ไม่สามารถรับคำทำนายได้ กรุณาลองใหม่อีกครั้ง');
      }

      const data: HoroscopeResponse = await res.json();
      setResult(data);
      setStep('reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Reading error:', err);
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการขอคำทำนาย';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start a new reading
  const handleReset = () => {
    setStep('form');
    setDrawnCards([]);
    setResult(null);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-amber-400 selection:text-purple-950 font-sans">
      {/* Dynamic Cosmic Background */}
      <CosmicBackground />

      {/* Navigation Header */}
      <Header onReset={handleReset} hasResult={step === 'reading'} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 relative z-10 flex flex-col items-center justify-center">
        {/* Error notification if any */}
        {errorMsg && (
          <div className="w-full max-w-xl mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs sm:text-sm text-center shadow-lg">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Loading View */}
        {isLoading ? (
          <OracleLoading />
        ) : (
          <>
            {/* Step 1: Consultation Setup Form */}
            {step === 'form' && (
              <ConsultationForm
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                question={question}
                setQuestion={setQuestion}
                onProceed={handleProceedFromForm}
              />
            )}

            {/* Step 2: Tarot Deck Spread & 3D Interactive Draw */}
            {step === 'spread' && (
              <TarotDeckSpread
                question={question}
                birthDate={birthDate}
                zodiacSign={zodiac.signTh}
                onBackToForm={handleBackToForm}
                onProceedToReading={handleProceedToReading}
                isLoading={isLoading}
              />
            )}

            {/* Step 3: Result & AI Horoscope Reading */}
            {step === 'reading' && result && (
              <HoroscopeResult
                cards={drawnCards}
                result={result}
                question={question}
                birthDate={birthDate}
                zodiac={zodiac}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Sacred Footer */}
      <footer className="relative z-10 w-full border-t border-purple-900/30 py-6 text-center text-xs text-purple-300/60 bg-[#090417]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <span>🔮 MUTELU TAROT</span>
            <span>•</span>
            <span>ศาสตร์ไพ่ยิปซีโบราณผสานพลัง Gemini 3.1 Flash Lite</span>
          </p>
          <p className="text-[11px] text-purple-400/50">
            โปรดใช้วิจารณญาณในการรับคำทำนาย • ลิขสิทธิ์ความมงคลสำหรับสายมูทุกคน ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
