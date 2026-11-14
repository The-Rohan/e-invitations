'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, VolumeX, Hand } from 'lucide-react';
import { OpeningType } from '@/lib/types';

interface OpeningWrapperProps {
  openingType: OpeningType;
  themeTitle: string;
  coupleNames: string;
  onOpenComplete?: () => void;
  children: React.ReactNode;
}

export function InvitationOpeningWrapper({
  openingType = 'wax_seal',
  themeTitle,
  coupleNames,
  onOpenComplete,
  children,
}: OpeningWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#7A0016', '#F59E0B', '#FDFBF7'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }

    if (onOpenComplete) {
      onOpenComplete();
    }
  };

  // Diya Press & Hold handler
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && !isOpen) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleOpen();
            return 100;
          }
          return prev + 10;
        });
      }, 80);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, isOpen]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden select-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#180004] via-[#2A0007] to-[#0D0002] text-[#FDFBF7]"
          >
            {/* Skip animation button */}
            <button
              onClick={handleOpen}
              className="absolute top-6 right-6 text-xs tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity bg-white/10 px-3 py-1.5 rounded-full border border-white/20"
            >
              Skip / آگے بڑھیں →
            </button>

            {/* Couple names subtle header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2 font-serif">
                You Are Cordially Invited
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#FFFDF9] tracking-wide">
                {coupleNames || 'The Wedding Celebration'}
              </h2>
            </motion.div>

            {/* 1. RIBBON OPENING */}
            {openingType === 'ribbon' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Decorative glowing backplate */}
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-xl group-hover:bg-[#D4AF37]/40 transition-all animate-pulse" />
                  
                  {/* 3D Ribbon Graphic SVG */}
                  <svg className="w-36 h-36 drop-shadow-[0_10px_25px_rgba(212,175,55,0.4)]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#7A0016" stroke="#D4AF37" strokeWidth="3" />
                    {/* Ribbon loops */}
                    <path d="M50 50 C30 20 15 40 40 50 C15 60 30 80 50 50" fill="#99001C" stroke="#F59E0B" strokeWidth="1.5" />
                    <path d="M50 50 C70 20 85 40 60 50 C85 60 70 80 50 50" fill="#99001C" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="10" fill="#D4AF37" />
                    <circle cx="50" cy="50" r="6" fill="#7A0016" />
                  </svg>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#D4AF37] tracking-wider animate-bounce">
                  <Hand className="w-4 h-4" />
                  <span>Tap to Untie Ribbon / ربن کھولیں</span>
                </div>
              </motion.div>
            )}

            {/* 2. WAX SEAL OPENING */}
            {openingType === 'wax_seal' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-xl group-hover:bg-[#D4AF37]/40 transition-all" />
                  
                  {/* 3D Wax Seal Stamp */}
                  <svg className="w-32 h-32 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]" viewBox="0 0 100 100">
                    <path
                      d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5"
                      fill="#7A0016"
                      stroke="#4A000D"
                      strokeWidth="4"
                    />
                    <circle cx="50" cy="50" r="32" fill="#5C0010" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 2" />
                    <text x="50" y="56" textAnchor="middle" fill="#D4AF37" fontSize="22" fontFamily="serif" fontWeight="bold">
                      بِسْمِ
                    </text>
                  </svg>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#D4AF37] tracking-wider animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <span>Break Wax Seal to Open / مہر کھولیں</span>
                </div>
              </motion.div>
            )}

            {/* 3. DIYA PRESS AND HOLD */}
            {openingType === 'diya' && (
              <div
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className="cursor-pointer flex flex-col items-center select-none"
              >
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Circular progress SVG */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="5"
                      strokeDasharray="402"
                      strokeDashoffset={402 - (402 * holdProgress) / 100}
                      className="transition-all duration-75"
                    />
                  </svg>

                  {/* Brass Diya Lamp */}
                  <div className="relative flex flex-col items-center">
                    {/* Diya Flame */}
                    <motion.div
                      animate={{ scale: isHolding ? [1, 1.4, 1.2] : [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-6 h-10 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full blur-[1px] mb-[-4px]"
                    />
                    {/* Brass Base */}
                    <div className="w-16 h-8 bg-gradient-to-r from-[#B45309] via-[#FBBF24] to-[#78350F] rounded-b-full shadow-lg" />
                  </div>
                </div>

                <div className="mt-6 text-sm text-[#FBBF24] tracking-wider font-serif">
                  {isHolding ? 'Igniting...' : 'Press & Hold to Light the Diya / دیا روشن کریں'}
                </div>
              </div>
            )}

            {/* 4. CARVED PALACE DOORS */}
            {openingType === 'door_knock' && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="w-48 h-56 rounded-t-full border-4 border-[#D4AF37] bg-gradient-to-b from-[#291307] to-[#120703] relative flex items-center justify-center shadow-2xl overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1/2 border-b-2 border-[#D4AF37]/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                      <div className="w-4 h-4 bg-[#D4AF37] rounded-full" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 text-[#D4AF37] text-xs font-serif tracking-widest uppercase">
                    Knock to Enter
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#D4AF37] tracking-wider animate-bounce">
                  <span>Knock on Palace Gates / دروازہ کھولیں</span>
                </div>
              </motion.div>
            )}

            {/* 5. ORIGAMI FOLD */}
            {openingType === 'origami' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-36 h-36 bg-gradient-to-br from-[#EA580C] to-[#9A3412] rotate-45 border-4 border-[#FDE047] shadow-2xl flex items-center justify-center">
                  <div className="-rotate-45 text-[#FFF] font-serif text-center font-bold text-lg">
                    افتتاح
                  </div>
                </div>
                <div className="mt-8 text-sm text-[#FDE047] tracking-wider">
                  Tap to Unfold / خط کھولیں
                </div>
              </motion.div>
            )}

            {/* 6. WEDINVITE SIGNATURE VELVET CURTAIN OPENING */}
            {openingType === 'curtain' && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group relative w-full max-w-sm"
              >
                {/* Visual Representation of Rich Velvet Drapes with Gold Tassels */}
                <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#3B0711] via-[#240309] to-[#120104] flex items-center justify-center">
                  {/* Top Pelmet / Valance */}
                  <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#5C0A1A] to-[#3B0711] border-b-2 border-[#D4AF37] flex items-center justify-around z-20 shadow-md">
                    <span className="w-3 h-6 bg-[#D4AF37] rounded-b-full shadow" />
                    <span className="w-3 h-8 bg-[#D4AF37] rounded-b-full shadow" />
                    <span className="w-4 h-10 bg-[#E5C677] rounded-b-full shadow" />
                    <span className="w-3 h-8 bg-[#D4AF37] rounded-b-full shadow" />
                    <span className="w-3 h-6 bg-[#D4AF37] rounded-b-full shadow" />
                  </div>

                  {/* Left Curtain Drape */}
                  <div className="absolute top-16 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#4A0815] via-[#35050E] to-[#200208] border-r border-[#D4AF37]/30 shadow-inner flex items-center justify-end pr-2">
                    <div className="w-2 h-16 bg-[#D4AF37] rounded-full opacity-60" />
                  </div>

                  {/* Right Curtain Drape */}
                  <div className="absolute top-16 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#4A0815] via-[#35050E] to-[#200208] border-l border-[#D4AF37]/30 shadow-inner flex items-center justify-start pl-2">
                    <div className="w-2 h-16 bg-[#D4AF37] rounded-full opacity-60" />
                  </div>

                  {/* Center Monogram Crest */}
                  <div className="relative z-30 w-24 h-24 rounded-full border-2 border-[#D4AF37] bg-[#1A0206]/90 backdrop-blur-sm flex flex-col items-center justify-center p-2 shadow-2xl group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-[#E5C677] animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="text-[10px] uppercase font-serif tracking-widest text-[#E5C677] mt-1 text-center">
                      پر دہ کُشائی
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#E5C677] tracking-wider animate-bounce font-serif">
                  <Hand className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tap to Part Curtains / پردہ کشائی کریں</span>
                </div>
              </motion.div>
            )}

            {/* 7. WEDINVITE ATELIER: SWING THE BRASS LANTERN (HAVELI) */}
            {openingType === 'lantern' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="relative w-44 h-56 flex flex-col items-center">
                  {/* Iron Chain */}
                  <div className="w-1 h-20 bg-gradient-to-b from-[#855938] to-[#D4AF37] opacity-80" />
                  {/* Lantern Frame */}
                  <motion.div
                    animate={{ rotate: [-6, 6, -6] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="relative w-28 h-36 bg-gradient-to-b from-[#78350F] via-[#D4AF37] to-[#451A03] p-1 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center border border-[#FDE68A]"
                  >
                    <div className="w-full h-full bg-[#180A04]/90 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="w-12 h-16 bg-gradient-to-t from-amber-600 via-yellow-400 to-yellow-100 rounded-full blur-[2px] animate-pulse" />
                    </div>
                  </motion.div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[#FDE68A] tracking-wider font-serif animate-bounce">
                  <Hand className="w-4 h-4 text-[#D4AF37]" />
                  <span>Swing the Lantern to Enter / لالٹین جھولائیں</span>
                </div>
              </motion.div>
            )}

            {/* 8. WEDINVITE ATELIER: TOUCH THE WATER (CHANDNI) */}
            {openingType === 'water_ripple' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="relative w-44 h-44 rounded-full border-2 border-white/30 bg-gradient-to-b from-[#0A101D] to-[#03060C] flex items-center justify-center shadow-2xl overflow-hidden">
                  {/* Concentric Ripples */}
                  <div className="absolute w-32 h-32 rounded-full border border-cyan-400/30 animate-ping" />
                  <div className="absolute w-20 h-20 rounded-full border border-cyan-300/50" />
                  {/* Moon reflection */}
                  <div className="w-8 h-8 rounded-full bg-white/90 blur-[2px] shadow-[0_0_20px_#fff]" />
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-cyan-200 tracking-wider font-serif animate-pulse">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Touch the Water to Ripple / پانی کو چھوئیں</span>
                </div>
              </motion.div>
            )}

            {/* 9. WEDINVITE ATELIER: ROYAL DECREE SCROLL (FARMAAN) */}
            {openingType === 'scroll' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="w-52 h-40 bg-gradient-to-b from-[#D4AF37] via-[#FEF08A] to-[#CA8A04] rounded-lg p-2 shadow-2xl flex flex-col justify-between border-2 border-[#854D0E]">
                  <div className="h-4 bg-[#713F12] rounded-full shadow" />
                  <div className="text-center font-serif text-[#713F12] font-bold text-sm tracking-widest uppercase">
                    بِاسْمِهِ تَعَالَىٰ
                    <div className="text-[11px] font-normal tracking-wide text-[#854D0E] mt-1">
                      شاہی فرمانِ نکاح
                    </div>
                  </div>
                  <div className="h-4 bg-[#713F12] rounded-full shadow" />
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-[#FDE047] tracking-wider font-serif animate-bounce">
                  <span>Touch to Unroll Royal Decree / فرمان کھولیں</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The actual revealed invitation content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
