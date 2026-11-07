'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Smartphone,
  Maximize2,
  ArrowLeft,
  MessageCircle,
  Share2,
  Check,
  Lock,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { SAMPLE_WEDDING } from '@/lib/store';
import { TemplateRenderer } from '@/components/invitation/TemplateRenderer';

function PreviewContent() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || 'shahi-mehru';

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewMode, setViewMode] = useState<'iframe' | 'customizer'>('iframe');

  // Find matching template by ID, original slug, or partial match
  const template =
    TEMPLATES.find((t) => t.id === rawSlug) ||
    TEMPLATES.find((t) => t.id.includes(rawSlug)) ||
    TEMPLATES.find((t) => t.phoneMockup?.includes(rawSlug)) ||
    TEMPLATES[0];

  const weddingData = {
    ...SAMPLE_WEDDING,
    theme_id: template.id,
    opening_type: template.openingType,
    music_url: template.audioTrack,
  };

  const copyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const iframeSrc = `/templates/${template.id}.html`;

  return (
    <div className="min-h-screen bg-[#1A1412] text-[#FDFBF7] flex flex-col font-sans select-none">
      {/* 1. TOP PREVIEW TOOLBAR */}
      <header className="sticky top-0 z-50 bg-[#2B211D]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-[#CFA954] transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Templates</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-white/20 pl-3">
              <span className="font-serif font-bold text-sm text-white">
                {template.name}
              </span>
              <span className="font-urdu text-xs text-[#CFA954]">
                {template.nameUrdu}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#CFA954] text-[#2B211D] ml-1">
                {template.category}
              </span>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher: Live Master vs Interactive React Studio */}
            <div className="hidden lg:inline-flex bg-white/10 p-0.5 rounded-full border border-white/15 text-[11px]">
              <button
                onClick={() => setViewMode('iframe')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  viewMode === 'iframe'
                    ? 'bg-[#CFA954] text-[#2B211D] font-bold shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Live Master
              </button>
              <button
                onClick={() => setViewMode('customizer')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  viewMode === 'customizer'
                    ? 'bg-[#CFA954] text-[#2B211D] font-bold shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Studio Edit
              </button>
            </div>

            {/* Toggle Phone Mockup frame vs Full screen */}
            <button
              onClick={() => setIsPhoneFrame((f) => !f)}
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/15 transition-all"
            >
              {isPhoneFrame ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone Frame</span>
                </>
              )}
            </button>

            <button
              onClick={copyShare}
              className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/15"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <Link
              href={`/templates/${template.id}`}
              className="hidden sm:inline-flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/15"
            >
              <span>Features & Pricing</span>
            </Link>

            <Link
              href={`/studio?theme=${template.id}`}
              className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow"
            >
              Customize Design
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN PREVIEW CANVAS */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 overflow-y-auto">
        {isPhoneFrame ? (
          /* Realistic Apple iPhone 16 Pro Mockup Frame */
          <div className="relative w-full max-w-[420px] aspect-[9/19] md:h-[820px] md:max-h-[88vh] rounded-none md:rounded-[48px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] border-0 md:border-[10px] md:border-[#382D26] bg-black flex flex-col">
            {/* iPhone Dynamic Island & Speaker */}
            <div className="hidden md:flex absolute top-3 inset-x-0 z-50 justify-center pointer-events-none">
              <div className="w-28 h-5 bg-black rounded-full shadow-inner flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10" />
              </div>
            </div>

            {/* Simulated Safari URL bar */}
            <div className="hidden md:flex items-center justify-between px-6 pt-9 pb-2 bg-[#1C1613] text-white/60 text-[11px] border-b border-white/10 z-40">
              <div className="flex items-center gap-1.5 text-white/80">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[10px] tracking-wide">
                  wedinvite.pk/w/{template.id}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#CFA954]">
                Verified Live
              </span>
            </div>

            {/* The Actual Functional Interactive Invitation */}
            <div className="flex-1 overflow-y-auto relative scrollbar-none bg-[#110D0B]">
              {viewMode === 'iframe' ? (
                <iframe
                  src={iframeSrc}
                  className="w-full h-full border-0 bg-transparent"
                  title={template.name}
                  allow="autoplay"
                />
              ) : (
                <TemplateRenderer wedding={weddingData} isPreview={true} />
              )}
            </div>
          </div>
        ) : (
          /* Full screen view */
          <div className="w-full max-w-2xl min-h-screen bg-black">
            {viewMode === 'iframe' ? (
              <iframe
                src={iframeSrc}
                className="w-full min-h-screen border-0 bg-transparent"
                title={template.name}
                allow="autoplay"
              />
            ) : (
              <TemplateRenderer wedding={weddingData} isPreview={true} />
            )}
          </div>
        )}
      </main>

      {/* 3. STICKY BOTTOM ORDER BAR */}
      <footer className="sticky bottom-0 z-50 bg-[#2E231F] border-t border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-serif tracking-widest text-[#CFA954]">
              {template.name} ({template.category})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-white">
                Rs. {template.price?.toLocaleString()}
              </span>
              <span className="text-xs text-white/40 line-through">
                Rs. {template.originalPrice?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/923014544411?text=${encodeURIComponent(
                `Salam! I am interested in ordering the "${template.name}" invitation on WedInvite.pk.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] text-black font-bold px-3.5 py-2 rounded-full text-xs hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </a>

            <Link
              href={`/checkout?theme=${template.id}&tier=${template.price === 7999 ? 'luxury' : 'essential'}`}
              className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] px-5 py-2 text-xs font-bold uppercase tracking-wider shadow"
            >
              Order This Design →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1A1412] text-white flex items-center justify-center font-serif text-sm">
          Loading Luxury Invitation Preview...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
