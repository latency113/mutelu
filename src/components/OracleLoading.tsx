'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  'แม่หมอ AI กำลังเชื่อมต่อกระแสจิตกับดวงดาว...',
  'จัดวางรหัสกรรมและเส้นเวลาของไพ่ทั้ง 3 มิติ...',
  'ผสานพลังแห่งธาตุประจำวันเกิดเข้ากับสัจธรรมไพ่ยิปซี...',
  'ถ่ายทอดคำทำนายและข้อคิดเสริมดวงชะตา...',
];

export default function OracleLoading() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto py-16 px-4 text-center space-y-8 animate-in fade-in duration-300">
      {/* Crystal Ball Animation */}
      <div className="relative flex items-center justify-center mx-auto w-44 h-44 sm:w-52 sm:h-52">
        {/* Outer Pulsing Aura */}
        <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-2xl animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl animate-pulse" />

        {/* Outer Ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-dashed border-amber-400/40 animate-spin"
          style={{ animationDuration: '18s' }}
        />

        {/* Center Glowing Sphere */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#2d1254] via-[#5b21b6] to-[#7c3aed] border-2 border-amber-300/60 shadow-[0_0_50px_rgba(168,85,247,0.6)] flex items-center justify-center overflow-hidden">
          {/* Inner mist */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
          <div className="text-4xl sm:text-5xl animate-bounce filter drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]">
            🔮
          </div>
        </div>

        {/* Floating Sparks */}
        <Sparkles className="absolute top-2 right-4 w-6 h-6 text-amber-300 animate-pulse" />
        <Sparkles className="absolute bottom-4 left-2 w-5 h-5 text-purple-300 animate-pulse" />
      </div>

      {/* Dynamic Loading Text */}
      <div className="space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient tracking-wide">
          กำลังเปิดม่านหมอกแห่งโชคชะตา
        </h3>
        <p className="text-sm text-purple-200/90 font-medium min-h-[24px] transition-all">
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress Line */}
      <div className="w-48 mx-auto h-1 rounded-full bg-purple-950 overflow-hidden border border-purple-800/40">
        <div className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-purple-500 animate-shimmer w-full" />
      </div>
    </div>
  );
}
