'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard, DrawnCard, CardPosition, CardSuit } from '@/types/tarot';
import { TAROT_DECK } from '@/data/tarotCards';
import TarotCardItem from './TarotCardItem';
import PositionIcon from './PositionIcon';
import { soundManager } from '@/lib/sound';
import {
  Sparkles,
  Shuffle,
  Eye,
  ArrowLeft,
  Search,
  RotateCcw,
  Info,
  X,
  Layers,
  Flame,
  Droplet,
  Wind,
  Mountain,
} from 'lucide-react';

interface TarotDeckSpreadProps {
  question: string;
  birthDate: string;
  zodiacSign?: string;
  onBackToForm: () => void;
  onProceedToReading: (drawnCards: DrawnCard[]) => void;
  isLoading: boolean;
}

type FilterSuit = 'all' | 'major' | 'cups' | 'pentacles' | 'swords' | 'wands';

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

  // Keep track of which card IDs from deck are already selected
  const [drawnCardIds, setDrawnCardIds] = useState<number[]>([]);

  // Filter & Search states
  const [selectedSuit, setSelectedSuit] = useState<FilterSuit>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCardFaces, setShowCardFaces] = useState(false);
  const [previewCard, setPreviewCard] = useState<TarotCard | null>(null);

  const positions: CardPosition[] = ['past', 'present', 'future'];

  // Filtered cards from the full 78 deck
  const filteredCards = useMemo(() => {
    return TAROT_DECK.filter((card) => {
      // Suit filter
      if (selectedSuit !== 'all') {
        if (selectedSuit === 'major' && card.arcana !== 'major') return false;
        if (selectedSuit !== 'major' && card.suit !== selectedSuit) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameEn = card.nameEn.toLowerCase().includes(q);
        const matchNameTh = card.nameTh.toLowerCase().includes(q);
        const matchKeywords = card.keywords.some((k) => k.toLowerCase().includes(q));
        const matchSuit = card.suitTh?.toLowerCase().includes(q);
        return matchNameEn || matchNameTh || matchKeywords || matchSuit;
      }

      return true;
    });
  }, [selectedSuit, searchQuery]);

  // Handle clicking a card in the spread
  const handleSelectCard = (card: TarotCard) => {
    if (drawnCardIds.includes(card.id)) return;

    // Find next empty slot
    const emptyIndex = selectedCards.findIndex((c) => c === null);
    if (emptyIndex === -1) return;

    // 28% chance of reversed
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

  // Instant Intuitive Shuffle & Draw 3 cards from all 78 cards
  const handleAutoDraw = () => {
    soundManager.playCardDraw();

    // Shuffle and pick 3 unique cards from the entire 78-card deck
    const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
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

  // Clear selections to pick again
  const handleResetPicks = () => {
    setSelectedCards([null, null, null]);
    setDrawnCardIds([]);
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

  const suitsList = [
    { id: 'all', label: 'ทั้งหมด (78 ใบ)', count: 78, icon: Layers },
    { id: 'major', label: 'Major Arcana (22 ใบ)', count: 22, icon: Sparkles },
    { id: 'cups', label: 'ถ้วย Cups (14 ใบ)', count: 14, icon: Droplet },
    { id: 'pentacles', label: 'เหรียญ Pentacles (14 ใบ)', count: 14, icon: Mountain },
    { id: 'swords', label: 'ดาบ Swords (14 ใบ)', count: 14, icon: Wind },
    { id: 'wands', label: 'ไม้เท้า Wands (14 ใบ)', count: 14, icon: Flame },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Bar: Question summary & back button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-purple-800/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToForm}
            className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-700/50 text-purple-200 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
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

        {/* Action Buttons: Reset & Auto Draw */}
        <div className="flex items-center gap-2">
          {drawnCardIds.length > 0 && (
            <button
              onClick={handleResetPicks}
              className="px-3 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="เริ่มเลือกไพ่ใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เลือกใหม่</span>
            </button>
          )}

          <button
            onClick={handleAutoDraw}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-850 hover:to-indigo-850 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all hover:border-amber-400 shadow-md cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>สุ่มไพ่ 3 ใบอัตโนมัติ (ครบ 78 ใบ)</span>
          </button>
        </div>
      </div>

      {/* 3 Selected Card Slots Section */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-2">
            <span>✨ สำรับไพ่ทาโรต์เต็มชุด 78 ใบ (Major 22 + Minor 56)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient">
            {isComplete
              ? 'เปิดไพ่เพื่อสดับฟังเสียงสวรรค์'
              : `เลือกไพ่ที่ดึงดูดใจคุณ (${drawnCardIds.length}/3 ใบ)`}
          </h3>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
            {isComplete
              ? 'คลิกที่ใบการ์ดเพื่อพลิกดูชะตา หรือกด "เปิดไพ่ทั้ง 3 ใบ" ได้ทันที'
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
                        คลิกเลือกไพ่จากสำรับ 78 ใบด้านล่าง
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
              className="px-6 py-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-amber-300 text-sm font-semibold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
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

      {/* Interactive Deck Spread & Card Browser (All 78 Cards) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-purple-800/40 relative overflow-hidden space-y-5">
        {/* Section Header with Total Breakdown Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
                <span>สำรับไพ่ทาโรต์ 78 ใบสมบูรณ์</span>
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-600/40 text-purple-200">
                {filteredCards.length} ใบในหมวดนี้
              </span>
            </div>
            <p className="text-xs text-purple-300/70 mt-0.5">
              แบ่งเป็น 2 ส่วน: Major Arcana 22 ใบ และ Minor Arcana 56 ใบ (ถ้วย, เหรียญ, ดาบ, ไม้เท้า)
            </p>
          </div>

          {/* Toggle View: Card Backs vs Authentic Images */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setShowCardFaces(!showCardFaces)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                showCardFaces
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-purple-950/60 border-purple-700/50 text-purple-300 hover:text-amber-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{showCardFaces ? 'แสดงหลังไพ่ (ตั้งจิต)' : 'เปิดดูรูปภาพไพ่ทั้งหมด'}</span>
            </button>
          </div>
        </div>

        {/* Suit Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {suitsList.map((item) => {
            const Icon = item.icon;
            const isActive = selectedSuit === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSuit(item.id as FilterSuit)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 border border-amber-400/60 text-amber-200 shadow-sm'
                    : 'bg-purple-950/40 border border-purple-800/30 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-purple-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อไพ่ (เช่น The Fool, ถ้วย, เหรียญ, ดาบ, ไม้เท้า)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-purple-950/50 border border-purple-800/40 text-purple-100 placeholder-purple-400/50 text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 max-w-5xl mx-auto max-h-[500px] overflow-y-auto pr-1">
          <AnimatePresence>
            {filteredCards.map((card) => {
              const isSelected = drawnCardIds.includes(card.id);

              return (
                <motion.div
                  key={card.id}
                  layout
                  whileHover={!isSelected ? { y: -8, scale: 1.05 } : {}}
                  whileTap={!isSelected ? { scale: 0.95 } : {}}
                  onClick={() => !isSelected && handleSelectCard(card)}
                  className={`relative cursor-pointer transition-all ${
                    isSelected
                      ? 'opacity-20 pointer-events-none filter grayscale'
                      : 'opacity-100'
                  }`}
                  title={`${card.nameTh} (${card.nameEn}) - คลิกเพื่อเลือก`}
                >
                  {showCardFaces ? (
                    /* Display Authentic Card Artwork Image */
                    <div className="w-16 h-28 sm:w-20 sm:h-36 rounded-xl bg-black/60 border border-amber-400/50 p-0.5 flex flex-col items-center justify-between shadow-md hover:border-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] overflow-hidden relative group">
                      <div className="w-full h-full rounded-lg overflow-hidden relative bg-black/40">
                        <img
                          src={card.image}
                          alt={card.nameEn}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                        />
                        {/* Overlay Card Name on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-1 flex flex-col justify-end text-center">
                          <span className="text-[9px] font-bold text-amber-200 truncate">
                            {card.nameEn}
                          </span>
                          <span className="text-[8px] text-purple-200 truncate">
                            {card.nameTh.split('(')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Info preview button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewCard(card);
                        }}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-amber-300 hover:bg-amber-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        title="ดูรายละเอียดไพ่"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    /* Display Mystical Ornate Card Back */
                    <div className="w-14 h-24 sm:w-16 sm:h-28 rounded-xl bg-gradient-to-b from-[#2a1352] to-[#110626] border border-amber-400/50 p-1 flex flex-col items-center justify-between shadow-md hover:border-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] group">
                      <div className="w-full flex items-center justify-between text-[8px] text-amber-400/60 font-serif">
                        <span>✦</span>
                        <span className="text-[7px] text-purple-300/80 font-mono">
                          {card.roman}
                        </span>
                        <span>✦</span>
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400/30 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                        {card.symbol}
                      </div>
                      <div className="text-[8px] text-purple-300/80 font-mono truncate max-w-[55px] text-center">
                        {card.suitTh || 'ชุดหลัก'}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-8 text-purple-300/60 text-xs">
            ไม่พบไพ่ที่ตรงกับคำค้นหา &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>

      {/* Card Detail Preview Modal */}
      <AnimatePresence>
        {previewCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewCard(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full rounded-3xl glass-panel-gold border-2 border-amber-400/50 p-6 bg-gradient-to-b from-[#1b0a38] to-[#0c031a] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setPreviewCard(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-purple-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-semibold">
                  {previewCard.suitTh || 'Major Arcana'} • ธาตุ{previewCard.element}
                </span>
                <h3 className="text-xl font-bold text-amber-200">
                  {previewCard.nameEn}
                </h3>
                <p className="text-xs text-purple-300 font-medium">
                  {previewCard.nameTh}
                </p>
              </div>

              {/* Artwork image */}
              <div className="w-44 h-72 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl bg-black">
                <img
                  src={previewCard.image}
                  alt={previewCard.nameEn}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {previewCard.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-600/40 text-purple-200"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {/* Meanings */}
              <div className="space-y-2 text-xs text-purple-200/90 pt-2 border-t border-purple-800/40">
                <div>
                  <span className="font-bold text-emerald-300">✨ ความหมายตั้งตรง (Upright):</span>{' '}
                  <span>{previewCard.uprightMeaning}</span>
                </div>
                <div>
                  <span className="font-bold text-rose-300">🔄 ความหมายหัวกลับ (Reversed):</span>{' '}
                  <span>{previewCard.reversedMeaning}</span>
                </div>
              </div>

              {/* Select card button inside modal */}
              {!drawnCardIds.includes(previewCard.id) && !isComplete && (
                <button
                  onClick={() => {
                    handleSelectCard(previewCard);
                    setPreviewCard(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-bold text-xs shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-950" />
                  <span>เลือกไพ่ใบนี้ลงสำรับ ({drawnCardIds.length + 1}/3)</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
