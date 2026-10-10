'use client';

import { motion } from 'framer-motion';
import { DrawnCard } from '@/types/tarot';
import { POSITION_INFO } from '@/data/tarotCards';
import { Sparkles, RotateCw } from 'lucide-react';
import PositionIcon from './PositionIcon';

interface TarotCardItemProps {
  drawnCard: DrawnCard;
  isFlipped: boolean;
  onFlip?: () => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TarotCardItem({
  drawnCard,
  isFlipped,
  onFlip,
  interactive = false,
  size = 'md',
}: TarotCardItemProps) {
  const { card, isReversed, position } = drawnCard;
  const posInfo = POSITION_INFO[position];

  // Dimension classes
  const dimensions =
    size === 'lg'
      ? 'w-64 h-[390px] sm:w-72 sm:h-[430px]'
      : size === 'sm'
      ? 'w-36 h-[220px] sm:w-44 sm:h-[270px]'
      : 'w-52 h-[320px] sm:w-60 sm:h-[370px]';

  return (
    <div className="flex flex-col items-center">
      {/* Position Header Label */}
      <div className="mb-2.5 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-amber-500/30 text-amber-300 shadow-sm">
          <PositionIcon position={position} />
          <span>{posInfo.titleTh}</span>
        </span>
      </div>

      {/* 3D Flip Container */}
      <div
        className={`relative ${dimensions} perspective-1000 cursor-pointer select-none`}
        onClick={interactive ? onFlip : undefined}
      >
        <motion.div
          className="w-full h-full relative transform-style-preserve-3d"
          initial={false}
          animate={{
            rotateY: isFlipped ? 180 : 0,
            scale: isFlipped ? 1 : 0.98,
          }}
          transition={{
            duration: 0.85,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-2.5 backface-hidden shadow-2xl bg-gradient-to-br from-[#1b0d36] via-[#120726] to-[#0a0316] border-2 border-amber-500/50 flex flex-col items-center justify-between overflow-hidden">
            {/* Outer ornate border */}
            <div className="w-full h-full rounded-xl border border-amber-400/30 p-2 flex flex-col items-center justify-between relative bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)]">
              {/* Corner Ornaments */}
              <div className="absolute top-1.5 left-1.5 text-amber-400/60 text-[10px]">✦</div>
              <div className="absolute top-1.5 right-1.5 text-amber-400/60 text-[10px]">✦</div>
              <div className="absolute bottom-1.5 left-1.5 text-amber-400/60 text-[10px]">✦</div>
              <div className="absolute bottom-1.5 right-1.5 text-amber-400/60 text-[10px]">✦</div>

              <div className="text-amber-300/60 text-[10px] tracking-widest uppercase font-serif">
                MUTELU TAROT
              </div>

              {/* Center Sacred Mandala */}
              <div className="relative flex items-center justify-center my-auto">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-400/40 flex items-center justify-center bg-purple-950/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-purple-400/30 flex items-center justify-center animate-spin" style={{ animationDuration: '30s' }}>
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
                  </div>
                </div>
                <div className="absolute -inset-2 rounded-full border border-dashed border-amber-400/20" />
              </div>

              <div className="text-center">
                <p className="text-[10px] text-purple-300/70 font-light">
                  {interactive && !isFlipped ? 'แตะเพื่อเปิดไพ่' : 'จิตสัมผัสชะตา'}
                </p>
                <div className="text-amber-400/80 text-[11px] mt-0.5">
                  ✦ ✧ ✦
                </div>
              </div>
            </div>

            {/* Glowing border highlight */}
            <div className="absolute inset-0 rounded-2xl border border-amber-300/20 pointer-events-none" />
          </div>

          {/* ================= CARD FRONT ================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-2 backface-hidden rotate-y-180 shadow-2xl bg-gradient-to-br ${card.colorScheme.bgGradient} border-2 ${card.colorScheme.border} flex flex-col items-center justify-between overflow-hidden`}
          >
            {/* Inner Border Frame */}
            <div className="w-full h-full rounded-xl border border-amber-300/40 p-2 flex flex-col justify-between relative bg-black/40 backdrop-blur-sm overflow-hidden">
              {/* Card Top: Roman Numeral & Element */}
              <div className="flex items-center justify-between text-xs font-serif text-amber-300 border-b border-amber-500/20 pb-1 z-10">
                <span className="font-bold tracking-widest text-xs sm:text-sm">
                  {card.roman}
                </span>
                <div className="flex items-center gap-1">
                  {card.suitTh && (
                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950/80 border border-amber-500/30 text-amber-200">
                      {card.suitTh}
                    </span>
                  )}
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200">
                    ธาตุ{card.element}
                  </span>
                </div>
              </div>

              {/* Card Illustration Artwork Image */}
              <div className="relative flex-1 my-1.5 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-amber-500/20 shadow-inner">
                {card.image ? (
                  <div
                    className={`relative w-full h-full flex items-center justify-center p-1 transition-transform duration-500 ${
                      isReversed ? 'rotate-180' : ''
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.nameEn}
                      className="w-full h-full object-contain drop-shadow-md rounded"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border border-amber-300/40 shadow-inner"
                    style={{
                      boxShadow: `0 0 25px ${card.colorScheme.glow}`,
                    }}
                  >
                    <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                      {card.symbol}
                    </span>
                  </div>
                )}

                {/* Subtle vignette */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              </div>

              {/* Card Bottom: Titles & Keywords */}
              <div className="text-center pt-1 border-t border-amber-500/20 z-10 pb-4">
                <div className="text-xs sm:text-sm font-bold text-amber-200 tracking-wide font-serif truncate">
                  {card.nameEn}
                </div>
                <div className="text-[10px] sm:text-[11px] text-purple-200 font-medium truncate">
                  {card.nameTh.split('(')[0]}
                </div>
              </div>
            </div>

            {/* Status Badge: Upright or Reversed */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-lg ${
                  isReversed
                    ? 'bg-rose-950/95 border border-rose-500/70 text-rose-300'
                    : 'bg-emerald-950/95 border border-emerald-500/70 text-emerald-300'
                }`}
              >
                {isReversed ? (
                  <>
                    <RotateCw className="w-2.5 h-2.5 rotate-180 text-rose-400" />
                    ไพ่หัวกลับ
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    ไพ่ตั้งตรง
                  </>
                )}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
