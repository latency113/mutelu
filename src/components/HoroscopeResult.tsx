'use client';

import { useRef, useState, useEffect } from 'react';
import { DrawnCard, HoroscopeResponse } from '@/types/tarot';
import { ZodiacInfo } from '@/lib/astrology';
import { POSITION_INFO } from '@/data/tarotCards';
import { soundManager } from '@/lib/sound';
import PositionIcon from './PositionIcon';
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Compass,
  Palette,
  Hash,
  ShieldCheck,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface HoroscopeResultProps {
  cards: DrawnCard[];
  result: HoroscopeResponse;
  question: string;
  birthDate: string;
  zodiac: ZodiacInfo;
  onReset: () => void;
}

export default function HoroscopeResult({
  cards,
  result,
  question,
  birthDate,
  zodiac,
  onReset,
}: HoroscopeResultProps) {
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Play sound and trigger mystic stars confetti
    soundManager.playOracleSuccess();

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#c084fc', '#e9d5ff', '#38bdf8'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  // Format reading text for display with highlighted headings
  const formattedReading = result.reading.split('\n').filter((l) => l.trim().length > 0);

  // Copy reading to clipboard
  const handleCopyText = async () => {
    const textToCopy = `🔮 ผลดูดวงไพ่ยิปซี 3 ใบ (Mutelu Tarot)\nคำถาม: ${question}\nวันเกิด: ${birthDate} (${zodiac.signTh})\n\nไพ่ที่เปิดได้:\n${cards
      .map(
        (c) =>
          `• ${POSITION_INFO[c.position].titleTh}: ${c.card.nameTh} (${
            c.isReversed ? 'หัวกลับ' : 'ตั้งตรง'
          })`
      )
      .join('\n')}\n\nคำทำนาย:\n${result.reading}\n\n🌟 เลขมงคล: ${
      result.luckyNumbers
    } | สีมงคล: ${result.luckyColor} | ทิศมงคล: ${result.luckyDirection}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // Save as high-res PNG image
  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0c061e',
      });

      const link = document.createElement('a');
      link.download = `mutelu-tarot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-amber-500/30">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-amber-300">
            คำทำนายจากแม่หมอ AI พร้อมแล้ว
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'กำลังสร้างรูปภาพ...' : 'บันทึกเป็นรูปภาพ'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-900/80 border border-purple-600/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกข้อความ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Exportable Container */}
      <div
        ref={shareCardRef}
        className="glass-panel-gold rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#180a33] via-[#0f0621] to-[#080212]"
      >
        {/* Mystic Aura Accents */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Stamp */}
        <div className="relative text-center pb-6 border-b border-amber-500/30">
          <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs tracking-widest font-serif uppercase mb-2">
            <span>✦ MUTELU TAROT READING ✦</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient tracking-wide">
            ดวงชะตาและพลังงานแห่งไพ่ 3 มิติ
          </h2>
          <div className="mt-2 text-xs sm:text-sm text-purple-200/90 font-medium">
            คำถาม: &ldquo;{question}&rdquo;
          </div>
          <div className="mt-1 text-xs text-purple-300/70">
            เจ้าชะตา: เกิด {birthDate} ({zodiac.signTh} ธาตุ{zodiac.element})
          </div>
        </div>

        {/* The 3 Cards Visual Presentation */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 justify-items-center">
            {cards.map((drawn, idx) => {
              const posInfo = POSITION_INFO[drawn.position];
              const { card, isReversed } = drawn;

              return (
                <div
                  key={idx}
                  className="w-full max-w-[240px] rounded-2xl p-4 bg-purple-950/50 border border-amber-500/30 flex flex-col items-center justify-between shadow-xl text-center"
                >
                  {/* Position Tag */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 mb-3">
                    <PositionIcon position={drawn.position} />
                    <span>{posInfo.titleTh.split('/')[0]}</span>
                  </span>

                  {/* Card Icon & Roman */}
                  <div
                    className={`w-20 h-28 rounded-xl bg-gradient-to-br ${card.colorScheme.bgGradient} border border-amber-300/50 flex flex-col items-center justify-between p-2 shadow-inner my-2 ${
                      isReversed ? 'rotate-180' : ''
                    }`}
                  >
                    <span className="text-[10px] text-amber-300 font-mono">
                      {card.roman}
                    </span>
                    <span className="text-3xl">{card.symbol}</span>
                    <span className="text-[9px] text-purple-200">
                      ธาตุ{card.element}
                    </span>
                  </div>

                  {/* Card Title & Orientation Badge */}
                  <div className="mt-2">
                    <h4 className="text-sm font-bold text-amber-200 truncate">
                      {card.nameEn}
                    </h4>
                    <p className="text-xs text-purple-300 truncate">
                      {card.nameTh.split('(')[0]}
                    </p>

                    <span
                      className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isReversed
                          ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                          : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                      }`}
                    >
                      {isReversed ? 'ไพ่หัวกลับ (Reversed)' : 'ไพ่ตั้งตรง (Upright)'}
                    </span>
                  </div>

                  {/* Keywords */}
                  <div className="mt-3 text-[11px] text-purple-300/80 italic leading-snug">
                    {isReversed ? card.reversedMeaning : card.uprightMeaning}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Reading Content Section */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-purple-950/70 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm border-b border-purple-800/50 pb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>คำทำนายจาก แม่หมอ AI</span>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-purple-100 leading-relaxed font-normal">
            {formattedReading.map((paragraph, index) => {
              const isHeading =
                paragraph.startsWith('🌟') ||
                paragraph.startsWith('🔮') ||
                paragraph.startsWith('💡');

              if (isHeading) {
                return (
                  <div
                    key={index}
                    className="pt-2 font-bold text-amber-300 text-sm sm:text-base border-t border-purple-800/30 first:border-t-0 first:pt-0"
                  >
                    {paragraph}
                  </div>
                );
              }

              return (
                <p key={index} className="text-purple-200/90 leading-relaxed pl-1">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Auspicious Daily Highlights Grid */}
        <div className="mt-8 pt-6 border-t border-amber-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Lucky Number */}
          <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-purple-300/80 mb-1">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              <span>เลขนำโชค</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-amber-300 font-mono">
              {result.luckyNumbers || '8, 9'}
            </div>
          </div>

          {/* Lucky Color */}
          <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-purple-300/80 mb-1">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>สีมงคลเสริมดวง</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-purple-200 truncate">
              {result.luckyColor || 'ม่วงอเมทิสต์'}
            </div>
          </div>

          {/* Lucky Direction */}
          <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-purple-300/80 mb-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>ทิศมงคลรับทรัพย์</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-purple-200 truncate">
              {result.luckyDirection ? result.luckyDirection.split('(')[0] : 'ทิศเหนือ'}
            </div>
          </div>

          {/* Lucky Gemstone */}
          <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-purple-300/80 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>อัญมณีคู่บารมี</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-purple-200 truncate">
              {zodiac.auspiciousStone.split(',')[0]}
            </div>
          </div>
        </div>

        {/* Footer Watermark */}
        <div className="mt-8 text-center text-[11px] text-purple-400/60 font-serif tracking-widest uppercase">
          MUTELU TAROT • AI HOROSCOPE ORACLE
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'กำลังสร้างรูปภาพ...' : 'บันทึกเป็นรูปภาพการ์ดคำทำนาย'}</span>
        </button>

        <button
          onClick={handleCopyText}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-900/50 hover:bg-purple-900/80 border border-purple-600/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">คัดลอกข้อความแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>คัดลอกคำทำนาย</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-bold text-xs transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ดูดวงใหม่อีกครั้ง</span>
        </button>
      </div>
    </div>
  );
}
