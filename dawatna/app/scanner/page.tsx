'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, CheckCircle, ShieldCheck, Camera, ArrowLeft } from 'lucide-react';

export default function GatekeeperScannerPage() {
  const [scanResult, setScanResult] = useState<{
    name: string;
    seats: number;
    event: string;
    status: 'verified' | 'invalid';
  } | null>(null);

  const simulateScan = (guestType: 'tariq' | 'farhan') => {
    if (guestType === 'tariq') {
      setScanResult({
        name: 'Uncle Tariq & Family',
        seats: 4,
        event: 'Baraat Ceremony (Pearl Continental)',
        status: 'verified',
      });
    } else {
      setScanResult({
        name: 'Dr. Farhan & Mrs. Farhan',
        seats: 2,
        event: 'Dawat-e-Walima (Royal Palm)',
        status: 'verified',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070406] text-[#FDFBF7] font-sans p-4 flex flex-col justify-between max-w-md mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <Link href="/dashboard" className="text-white/60 text-xs flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="text-xs font-serif font-bold text-[#D4AF37]">
            GATEKEEPER SCANNER
          </div>
        </div>

        <div className="text-center space-y-2 mb-6">
          <h1 className="text-xl font-serif font-bold text-white">
            Banquet Entrance Verification
          </h1>
          <p className="text-xs text-white/60">
            Scan guest invitation QR passes at the entrance door to verify allocated seats.
          </p>
        </div>

        {/* Viewfinder Mockup */}
        <div className="relative aspect-square w-full bg-black/80 border-2 border-[#D4AF37] rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-2xl p-6">
          {/* Laser scanning line */}
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-red-500 shadow-[0_0_15px_red] animate-pulse" />

          <Camera className="w-16 h-16 text-white/20 mb-2" />
          <span className="text-xs text-white/40 tracking-wider uppercase font-mono">
            Aim Camera at Guest QR Pass
          </span>

          {/* Test Simulation Buttons */}
          <div className="absolute bottom-4 inset-x-4 flex gap-2">
            <button
              onClick={() => simulateScan('tariq')}
              className="flex-1 bg-white/10 hover:bg-white/20 text-[10px] py-1.5 rounded-lg border border-white/20 text-white"
            >
              Simulate Scan: Tariq (4 Seats)
            </button>
            <button
              onClick={() => simulateScan('farhan')}
              className="flex-1 bg-white/10 hover:bg-white/20 text-[10px] py-1.5 rounded-lg border border-white/20 text-white"
            >
              Simulate Scan: Farhan (2 Seats)
            </button>
          </div>
        </div>

        {/* Scan Result Box */}
        {scanResult && (
          <div className="mt-6 p-5 bg-[#25D366]/15 border-2 border-[#25D366] rounded-2xl text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center gap-1.5 text-green-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Authentic Invitation</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {scanResult.name}
            </h3>
            <div className="text-sm font-semibold text-[#D4AF37]">
              Allowed Entry: {scanResult.seats} Persons / افراد
            </div>
            <div className="text-xs text-white/70">
              Valid for: {scanResult.event}
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-[10px] text-white/40 py-4">
        WedInvite.pk Gatekeeper Security Engine · Real-time Headcount Protection
      </footer>
    </div>
  );
}
