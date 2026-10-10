'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard, DrawnCard, CardPosition } from '@/types/tarot';
import { MAJOR_ARCANA } from '@/data/tarotCards';
import TarotCardItem from './TarotCardItem';
import PositionIcon from './PositionIcon';
import { soundManager } from '@/lib/sound';
import { Sparkles, Shuffle, Eye, ArrowLeft } from 'lucide-react';

interface TarotDeckSpreadProps {
  question: string;
  birthDate: string;
  zodiacSign?: string;
  onBackToForm: () => void;
  onProceedToReading: (drawnCards: DrawnCard[]) => void;
  isLoading: boolean;
}

export default function TarotDeckSpread({
  question,
  birthDate,
  zodiacSign,
  onBackToForm,
  onProceedToReading,
  isLoading,
}: TarotDeckSpreadProps) {
  // Slots for 3 cards
  const [selectedCards, setSelectedCards] = useState<(DrawnCard | null)[]>([
    null,
    null,
    null,
  ]);
  const [revealedStates, setRevealedStates] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // Keep track of which card IDs from MAJOR_ARCANA are already selected
  const [drawnCardIds, setDrawnCardIds] = useState<number[]>([]);

  // Total 22 Major Arcana cards in deck
  const deck = MAJOR_ARCANA;

  const positions: CardPosition[] = ['past', 'present', 'future'];

  // Handle clicking a card in the spread
  const handleSelectCard = (card: TarotCard) => {
    if (drawnCardIds.includes(card.id)) return;

    // Find next empty slot
    const emptyIndex = selectedCards.findIndex((c) => c === null);
    if (emptyIndex === -1) return;

    // 25% chance of reversed
    const isReversed = Math.random() < 0.28;

    const newDrawnCard: DrawnCard = {
      card,
      isReversed,
      position: positions[emptyIndex],
      revealed: false,
    };

    const nextSelected = [...selectedCards];
    nextSelected[emptyIndex] = newDrawnCard;
    setSelectedCards(nextSelected);
    setDrawnCardIds((prev) => [...prev, card.id]);

    soundManager.playCardDraw();
  };

  // Instant Intuitive Shuffle & Draw 3 cards
  const handleAutoDraw = () => {
    soundManager.playCardDraw();

    // Shuffle and pick 3 unique cards
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 3);

    const newCards: DrawnCard[] = picked.map((card, idx) => ({
      card,
      isReversed: Math.random() < 0.28,
      position: positions[idx],
      revealed: false,
    }));

    setSelectedCards(newCards);
    setDrawnCardIds(picked.map((c) => c.id));
    setRevealedStates([false, false, false]);
  };

  // Flip a specific card in slot
  const handleFlipCard = (index: number) => {
    if (!selectedCards[index]) return;

    const nextRevealed = [...revealedStates];
    nextRevealed[index] = !nextRevealed[index];
    setRevealedStates(nextRevealed);
    soundManager.playCardFlip();
  };

  // Flip all cards at once
  const handleFlipAll = () => {
    setRevealedStates([true, true, true]);
    soundManager.playCardFlip();
  };

  const isComplete = selectedCards.every((c) => c !== null);
  const isAllRevealed = isComplete && revealedStates.every((r) => r === true);

  const handleSubmit = () => {
    if (!isComplete) return;
    const finalCards = selectedCards as DrawnCard[];
    onProceedToReading(finalCards);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Bar: Question summary & back button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-purple-800/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToForm}
            className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-700/50 text-purple-200 transition-colors flex items-center gap-1.5 text-xs"
            title="แก้ไขข้อมูลวันเกิดหรือคำถาม"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>
          <div>
            <div className="text-xs text-amber-300/80 font-medium flex items-center gap-2">
              <span>คำถามที่ตั้งจิต:</span>
              {zodiacSign && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/40">
                  {zodiacSign} • เกิด {birthDate}
                </span>
              )}
            </div>
            <p className="text-sm text-purple-100 font-medium line-clamp-1">
              &ldquo;{question}&rdquo;
            </p>
          </div>
        </div>

        {/* Quick Shuffle Button */}
        <button
          onClick={handleAutoDraw}
          className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-600/50 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all hover:border-amber-400/50"
        >
          <Shuffle className="w-4 h-4 text-amber-300" />
          <span>สุ่มไพ่ 3 ใบอัตโนมัติ</span>
        </button>
      </div>

      {/* 3 Selected Card Slots Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient">
            {isComplete
              ? 'เปิดไพ่เพื่อสดับฟังเสียงสวรรค์'
              : `เลือกไพ่ที่ดึงดูดใจคุณ (${drawnCardIds.length}/3 ใบ)`}
          </h3>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
            {isComplete
              ? 'คลิกที่ใบการ์ดเพื่อพลิกดูชะตา หรือกด "เปิดไพ่ทั้งหมด" ได้ทันที'
              : 'เพ่งสมาธิไปยังสำรับด้านล่าง แล้วคลิกเลือกไพ่ที่จิตสัมผัสเรียกร้อง'}
          </p>
        </div>

        {/* The 3 Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center py-4">
          {positions.map((pos, idx) => {
            const cardData = selectedCards[idx];
            const isFlipped = revealedStates[idx];

            return (
              <div key={pos} className="flex flex-col items-center">
                {cardData ? (
                  <TarotCardItem
                    drawnCard={cardData}
                    isFlipped={isFlipped}
                    interactive={true}
                    onFlip={() => handleFlipCard(idx)}
                    size="md"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-2.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-800/40 text-purple-300">
                        <PositionIcon position={pos} className="w-3.5 h-3.5 text-purple-300" />
                        <span>{idx === 0 ? 'ใบที่ 1 (อดีต)' : idx === 1 ? 'ใบที่ 2 (ปัจจุบัน)' : 'ใบที่ 3 (อนาคต)'}</span>
                      </span>
                    </div>
                    {/* Empty Slot Placeholder */}
                    <div className="w-52 h-[320px] sm:w-60 sm:h-[370px] rounded-2xl border-2 border-dashed border-purple-700/40 bg-purple-950/20 flex flex-col items-center justify-center p-6 text-center text-purple-400/60">
                      <div className="w-16 h-16 rounded-full border border-purple-700/30 flex items-center justify-center mb-3">
                        <Sparkles className="w-6 h-6 text-purple-500/50" />
                      </div>
                      <p className="text-xs font-medium text-purple-300/60">
                        ตำแหน่ง {idx + 1}
                      </p>
                      <p className="text-[11px] text-purple-400/40 mt-1">
                        คลิกเลือกไพ่จากสำรับด้านล่าง
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls for Revealing / Submitting */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {isComplete && !isAllRevealed && (
            <button
              onClick={handleFlipAll}
              className="px-6 py-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-amber-300 text-sm font-semibold flex items-center gap-2 transition-all shadow-lg"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>พลิกเปิดไพ่ทั้ง 3 ใบ</span>
            </button>
          )}

          {isComplete && (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-purple-950 font-bold text-base tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-purple-950 animate-pulse" />
              <span>{isLoading ? 'แม่หมอกำลังสื่อสารกับดวงดาว...' : 'รับคำทำนายจากแม่หมอ AI'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Interactive Deck Spread (Fan-Out Arc) */}
      {!isComplete && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-800/40 relative overflow-hidden">
          <div className="text-center mb-6">
            <h4 className="text-base sm:text-lg font-bold text-amber-300">
              สำรับไพ่ทาโรต์ 22 ใบ (The Major Arcana)
            </h4>
            <p className="text-xs text-purple-300/70">
              วางใจให้สงบและคลิกเลือกไพ่อีก {3 - drawnCardIds.length} ใบ
            </p>
          </div>

          {/* Cards Spread Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 max-w-4xl mx-auto">
            <AnimatePresence>
              {deck.map((card, index) => {
                const isSelected = drawnCardIds.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    layout
                    whileHover={!isSelected ? { y: -10, scale: 1.08 } : {}}
                    whileTap={!isSelected ? { scale: 0.95 } : {}}
                    onClick={() => !isSelected && handleSelectCard(card)}
                    className={`relative cursor-pointer transition-all ${
                      isSelected
                        ? 'opacity-20 pointer-events-none filter grayscale'
                        : 'opacity-100'
                    }`}
                  >
                    {/* Compact Card Back */}
                    <div className="w-14 h-24 sm:w-16 sm:h-28 rounded-xl bg-gradient-to-b from-[#2a1352] to-[#110626] border border-amber-400/50 p-1 flex flex-col items-center justify-between shadow-md hover:border-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                      <div className="text-[8px] text-amber-400/60 font-serif">✦</div>
                      <div className="w-6 h-6 rounded-full border border-amber-400/30 flex items-center justify-center text-xs">
                        {card.symbol}
                      </div>
                      <div className="text-[8px] text-purple-300/70 font-mono">
                        {card.roman}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
