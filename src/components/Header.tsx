'use client';

import { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Moon, Info, X } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface HeaderProps {
  onReset?: () => void;
  hasResult?: boolean;
}

export default function Header({ onReset, hasResult }: HeaderProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.enabled = nextState;
    if (nextState) {
      soundManager.playCardDraw();
    }
  };

  return (
    <>
      <header className="relative z-20 w-full border-b border-purple-900/30 bg-[#0c061e]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={onReset}
            className="flex items-center gap-3 cursor-pointer group transition-all"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-600/30 to-indigo-500/20 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-amber-300/30 animate-spin" style={{ animationDuration: '14s' }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-wider text-gold-gradient">
                  MUTELU TAROT
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  แม่หมอ AI
                </span>
              </div>
              <p className="text-xs text-purple-300/70 font-light">
                ไขรหัสชะตาด้วยไพ่ยิปซี 3 ใบ
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/40 text-purple-200 transition-all flex items-center gap-1.5 text-xs hover:border-amber-400/40"
              title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span className="hidden md:inline text-purple-300">เสียงเวทมนตร์</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-purple-400/60" />
                  <span className="hidden md:inline text-purple-400/60">ปิดเสียง</span>
                </>
              )}
            </button>

            {/* Info Button */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-full bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/40 text-purple-200 transition-all hover:border-amber-400/40"
              title="เกี่ยวกับศาสตร์ไพ่ยิปซี"
            >
              <Info className="w-4 h-4 text-purple-300" />
            </button>

            {/* Reset Button (Visible if has result) */}
            {hasResult && (
              <button
                onClick={onReset}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-amber-500/80 to-amber-600/90 text-amber-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] font-semibold flex items-center gap-1.5"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>ดูดวงใหม่</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 rounded-2xl glass-panel-gold border border-amber-500/40 shadow-2xl text-purple-100">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-purple-900/40 text-purple-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔮</span>
              <h2 className="text-xl font-bold text-gold-gradient">
                ศาสตร์การเปิดไพ่ยิปซี 3 ใบ (Three-Card Spread)
              </h2>
            </div>

            <div className="space-y-3 text-sm text-purple-200/90 leading-relaxed">
              <p>
                การทำนายแบบ 3 ใบ เป็นหนึ่งในศาสตร์โบราณที่ทรงพลังที่สุด สะท้อนเส้นเวลาและสายธารพลังงานของจิตวิญญาณ:
              </p>
              <div className="grid grid-cols-1 gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-800/30 text-xs">
                <div>
                  <strong className="text-amber-300">ใบที่ 1 (อดีต / รากฐาน):</strong>{' '}
                  บทเรียน สิ่งที่เคยเกิดขึ้น หรือปมพลังงานที่ส่งผลต่อคำถาม
                </div>
                <div>
                  <strong className="text-amber-300">ใบที่ 2 (ปัจจุบัน / สถานการณ์):</strong>{' '}
                  สภาวะจริงในปัจจุบัน สิ่งที่คุณกำลังเผชิญ หรือบททดสอบเฉพาะหน้า
                </div>
                <div>
                  <strong className="text-amber-300">ใบที่ 3 (อนาคต / แนวโน้ม):</strong>{' '}
                  บทสรุปและผลลัพธ์ที่จะก่อตัวขึ้น หากดำเนินไปตามทิศทางปัจจุบัน
                </div>
              </div>
              <p className="text-xs text-purple-300/70 italic">
                * พลังของไพ่เป็นแนวทางชี้แนะเพื่อเสริมสติปัญญาและการตัดสินใจ ดวงชะตาย่อมเปลี่ยนแปลงได้ตามการกระทำและความตั้งใจจริงของคุณ
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 hover:brightness-110 shadow-md"
              >
                เข้าใจแล้ว น้อมรับพร
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
