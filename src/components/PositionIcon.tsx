'use client';

import { CardPosition } from '@/types/tarot';
import { History, Zap, Sparkles } from 'lucide-react';

interface PositionIconProps {
  position: CardPosition;
  className?: string;
}

export default function PositionIcon({
  position,
  className = 'w-3.5 h-3.5 text-amber-300',
}: PositionIconProps) {
  switch (position) {
    case 'past':
      return <History className={className} />;
    case 'present':
      return <Zap className={className} />;
    case 'future':
      return <Sparkles className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
