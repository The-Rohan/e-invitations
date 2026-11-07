'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { OpeningType, PackageTier } from '@/lib/types';
import { TemplateRenderer } from '@/components/invitation/TemplateRenderer';

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [groomName, setGroomName] = useState(searchParams.get('groom') || 'Hamza Mehmood');
  const [brideName, setBrideName] = useState(searchParams.get('bride') || 'Ayesha Tariq');
  const [groomFamily, setGroomFamily] = useState('Son of Mr. & Mrs. Khalid Mehmood');
  const [brideFamily, setBrideFamily] = useState('Daughter of Mr. & Mrs. Tariq Jamil');
  const [themeId, setThemeId] = useState(searchParams.get('theme') || 'shahi-mehru');
  const [openingType, setOpeningType] = useState<OpeningType>('curtain');
  const [tier, setTier] = useState<PackageTier>(
    (searchParams.get('tier') as PackageTier) || 'royal'
  );
  const [studioFilter, setStudioFilter] = useState<string>('all');

  // Events configuration
  const [events, setEvents] = useState([
    {
      id: 'ev-1',
      wedding_id: 'temp',
      event_type: 'mehndi' as const,
      event_title_en: 'Mehndi Ceremony',
      event_title_ur: 'محفلِ مہندی',
      date: 'Thursday, 26 November 2026',
      start_time: '7:30 PM',
      venue_name: 'Mughal-e-Azam Banquet',
      venue_address: 'Main Boulevard, Gulberg, Lahore',
      google_maps_url: 'https://maps.google.com/?q=Lahore',
      enabled: true,
    },
    {
      id: 'ev-2',
      wedding_id: 'temp',
      event_type: 'barat' as const,
      event_title_en: 'Baraat & Rukhsati',
      event_title_ur: 'تقریبِ برات',
      date: 'Friday, 27 November 2026',
      start_time: '8:00 PM',
      venue_name: 'Pearl Continental Crystal Ballroom',
      venue_address: 'Mall Road, Lahore',
      google_maps_url: 'https://maps.google.com/?q=Pearl+Continental+Lahore',
      enabled: true,
    },
    {
      id: 'ev-3',
      wedding_id: 'temp',
      event_type: 'walima' as const,
      event_title_en: 'Dawat-e-Walima Reception',
      event_title_ur: 'دعوتِ ولیمہ',
      date: 'Sunday, 29 November 2026',
      start_time: '8:30 PM',
      venue_name: 'Royal Palm Golf & Country Club',
      venue_address: 'Canal Bank Road, Lahore',
      google_maps_url: 'https://maps.google.com/?q=Royal+Palm+Lahore',
      enabled: true,
    },
  ]);

  const toggleEvent = (index: number) => {
    setEvents((prev) =>
      prev.map((ev, i) => (i === index ? { ...ev, enabled: !ev.enabled } : ev))
    );
  };

  const updateEvent = (index: number, field: string, value: string) => {
    setEvents((prev) =>
      prev.map((ev, i) => (i === index ? { ...ev, [field]: value } : ev))
    );
  };

  const selectedTemplate = TEMPLATES.find((t) => t.id === themeId) || TEMPLATES[0];

  const constructedWedding = {
    id: 'preview-id',
    slug: 'preview',
    groom_name: groomName,
    bride_name: brideName,
    groom_family: groomFamily,
    bride_family: brideFamily,
    theme_id: themeId,
    opening_type: openingType,
    package_tier: tier,
    status: 'draft' as const,
    events: events.filter((e) => e.enabled),
  };

  const handleProceedToCheckout = () => {
    // Navigate to checkout with configured options
    const query = new URLSearchParams({
      groom: groomName,
      bride: brideName,
      theme: themeId,
      tier: tier,
      opening: openingType,
    }).toString();
    router.push(`/checkout?${query}`);
  };

  const handleInstantPublish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedinvite_custom_wedding', JSON.stringify(constructedWedding));
      localStorage.setItem('wedinvite_test_mode', 'true');
      localStorage.setItem('wedinvite_order_status', 'approved');
    }
    router.push(`/preview/${themeId}?custom=1`);
  };

  return (
    <div className="min-h-screen bg-[#0D0709] text-[#FDFBF7] font-sans">
      {/* Studio Top Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-black tracking-wider text-[#D4AF37]">
            WEDINVITE.PK
          </span>
          <span className="text-xs font-serif text-white/50 border-l border-white/20 pl-2">
            Studio
          </span>
        </Link>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 text-xs">
          {[
            { step: 1, label: 'Couple & Theme' },
            { step: 2, label: 'Functions & Venues' },
            { step: 3, label: 'Preview & Plan' },
          ].map((s) => (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step as any)}
              className={`cursor-pointer flex items-center gap-1.5 transition-colors ${
                currentStep === s.step
                  ? 'text-[#D4AF37] font-bold'
                  : currentStep > s.step
                  ? 'text-white'
                  : 'text-white/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === s.step
                    ? 'bg-[#D4AF37] text-black'
                    : currentStep > s.step
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {s.step}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        <div>
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((s) => ((s + 1) as any))}
              className="bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleProceedToCheckout}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-extrabold text-xs px-5 py-2 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Checkout →
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* STEP 1: COUPLE & THEME */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Step 1 of 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                The Couple & Invitation Theme
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-semibold">
                  Groom’s Name / دولہا کا نام
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="e.g. Hamza Mehmood"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-semibold">
                  Bride’s Name / دلہن کا نام
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="e.g. Ayesha Tariq"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-semibold">
                  Groom’s Parents / منجانب دولہا
                </label>
                <input
                  type="text"
                  value={groomFamily}
                  onChange={(e) => setGroomFamily(e.target.value)}
                  placeholder="e.g. Son of Mr. & Mrs. Khalid Mehmood"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-semibold">
                  Bride’s Parents / منجانب دلہن
                </label>
                <input
                  type="text"
                  value={brideFamily}
                  onChange={(e) => setBrideFamily(e.target.value)}
                  placeholder="e.g. Daughter of Mr. & Mrs. Tariq Jamil"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Choose 3D Opening Interaction */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-white">
                Choose 3D Opening Interaction (Touch Gesture)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'curtain', label: 'Velvet Curtains', desc: 'Part velvet drapes (Mehru)' },
                  { id: 'wax_seal', label: '3D Wax Seal', desc: 'Break seal to open' },
                  { id: 'ribbon', label: '3D Silk Ribbon', desc: 'Untie silk bow' },
                  { id: 'diya', label: 'Brass Diya', desc: 'Hold to light flame' },
                  { id: 'door_knock', label: 'Palace Gates', desc: 'Knock 3 times' },
                  { id: 'origami', label: 'Origami Fold', desc: 'Tap to unfold' },
                ].map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setOpeningType(op.id as OpeningType)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      openingType === op.id
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#D4AF37]">{op.label}</div>
                    <div className="text-[11px] text-white/60 mt-1">{op.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Theme Carousel */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-serif font-bold text-white">
                  Select Design Theme ({TEMPLATES.length} Cultural Themes)
                </h3>

                {/* Studio Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: `All (${TEMPLATES.length})` },
                    { id: 'cinematic', label: 'Cinematic Drapes (21)' },
                    { id: 'atelier', label: 'Atelier Tactile (24)' },
                    { id: 'embroidery', label: 'Embroidery' },
                    { id: 'heritage', label: 'Heritage' },
                    { id: 'video', label: 'Film' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setStudioFilter(f.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        studioFilter === f.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {TEMPLATES.filter((t) => {
                  if (studioFilter === 'all') return true;
                  if (studioFilter === 'cinematic') return t.brand === 'cinematic';
                  if (studioFilter === 'atelier') return t.brand === 'atelier';
                  if (studioFilter === 'embroidery') return t.category === 'Embroidery';
                  if (studioFilter === 'heritage') return t.category === 'Heritage' || t.category === 'Atelier';
                  if (studioFilter === 'video') return t.isVideo || t.category === 'Film';
                  return true;
                }).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setThemeId(t.id);
                      setOpeningType(t.openingType);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                      themeId === t.id
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: t.palette.background }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37] text-black">
                        {t.brand === 'atelier' ? 'Atelier Collection' : 'Cinematic Collection'} · {t.category}
                      </span>
                      {themeId === t.id && (
                        <span className="bg-[#D4AF37] text-black p-1 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 items-center mt-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/20 p-0.5 flex items-center justify-center">
                        <img
                          src={t.phoneMockup || `/atelier/thumbs/thumb-${t.id}-480.webp`}
                          alt={t.name}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif font-bold text-sm text-white truncate">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-white/70 truncate">
                          {t.aesthetic}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FUNCTIONS & VENUES */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Step 2 of 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Wedding Functions & Venue Locations
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Select the events you are hosting. Guests will get 1-tap Google Maps directions to the exact hall.
              </p>
            </div>

            <div className="space-y-6">
              {events.map((ev, i) => (
                <div
                  key={ev.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    ev.enabled
                      ? 'bg-white/5 border-[#D4AF37]/40 shadow-lg'
                      : 'bg-white/[0.02] border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ev.enabled}
                        onChange={() => toggleEvent(i)}
                        className="w-5 h-5 accent-[#D4AF37] rounded"
                      />
                      <span className="text-lg font-serif font-bold text-white capitalize">
                        {ev.event_title_en}
                      </span>
                    </label>
                    <span className="text-xs text-[#D4AF37] font-serif">{ev.event_title_ur}</span>
                  </div>

                  {ev.enabled && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <label className="block text-xs uppercase text-white/60 mb-1">
                          Date & Day
                        </label>
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => updateEvent(i, 'date', e.target.value)}
                          placeholder="e.g. Friday, 27 November 2026"
                          className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-white/60 mb-1">
                          Timing
                        </label>
                        <input
                          type="text"
                          value={ev.start_time}
                          onChange={(e) => updateEvent(i, 'start_time', e.target.value)}
                          placeholder="e.g. 8:00 PM"
                          className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-white/60 mb-1">
                          Banquet / Hall Name
                        </label>
                        <input
                          type="text"
                          value={ev.venue_name}
                          onChange={(e) => updateEvent(i, 'venue_name', e.target.value)}
                          placeholder="e.g. Pearl Continental Ballroom"
                          className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-white/60 mb-1">
                          Address & City
                        </label>
                        <input
                          type="text"
                          value={ev.venue_address}
                          onChange={(e) => updateEvent(i, 'venue_address', e.target.value)}
                          placeholder="e.g. Mall Road, Lahore"
                          className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW & PACKAGE SELECTION */}
        {currentStep === 3 && (
          <div className="space-y-10">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Step 3 of 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Review Your Card & Choose Package
              </h2>
            </div>

            {/* Choose Package Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Standard */}
              <div
                onClick={() => setTier('standard')}
                className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                  tier === 'standard'
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Standard Edition
                  </span>
                  {tier === 'standard' && <Check className="w-5 h-5 text-[#D4AF37]" />}
                </div>
                <div className="text-3xl font-serif font-bold text-white">Rs. 4,999</div>
                <p className="text-xs text-white/70 mt-1 mb-4">
                  Web Invitation Link + High-Res WhatsApp Status Photo (PNG).
                </p>
                <ul className="text-xs text-white/70 space-y-1.5 border-t border-white/10 pt-3">
                  <li>✓ 1 General Web Invitation Link</li>
                  <li>✓ WhatsApp Status Photo (PNG)</li>
                  <li>✓ Google Maps + Calendar Sync</li>
                  <li>✓ WhatsApp 1-Tap RSVP Button</li>
                  <li>✓ 6 Months Active Hosting</li>
                </ul>
              </div>

              {/* Royal */}
              <div
                onClick={() => setTier('royal')}
                className={`cursor-pointer p-6 rounded-2xl border transition-all relative ${
                  tier === 'royal'
                    ? 'bg-[#2B0007] border-[#D4AF37] ring-2 ring-[#D4AF37]/60 shadow-[0_15px_40px_rgba(212,175,55,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="absolute -top-3 right-6 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Recommended
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Royal All-Inclusive
                  </span>
                  {tier === 'royal' && <Check className="w-5 h-5 text-[#D4AF37]" />}
                </div>
                <div className="text-3xl font-serif font-bold text-[#D4AF37]">Rs. 7,999</div>
                <p className="text-xs text-white/70 mt-1 mb-4">
                  Full experience: 9:16 Status Video + Guest Dashboard + Private Guest Links + VIP Setup.
                </p>
                <ul className="text-xs text-white/80 space-y-1.5 border-t border-white/10 pt-3">
                  <li>✓ Everything in Standard</li>
                  <li>✓ 9:16 WhatsApp Status Animated Video (MP4)</li>
                  <li>✓ Unlimited Private Guest Links with Name & Seats</li>
                  <li>✓ Web RSVP Form + Meal Preferences (Chicken/Mutton)</li>
                  <li>✓ Digital Salami Raast QR Tray & Gatekeeper Pass</li>
                  <li>✓ 1 Year Hosting + Free VIP WhatsApp Setup</li>
                </ul>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="border border-white/20 rounded-3xl overflow-hidden shadow-2xl bg-black">
              <div className="bg-white/10 px-4 py-2 flex items-center justify-between text-xs text-white/60 border-b border-white/10">
                <span>Live Interactive Mobile Preview</span>
                <span className="text-[#D4AF37]">Interact with the card below ↓</span>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                <TemplateRenderer wedding={constructedWedding as any} isPreview={true} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleInstantPublish}
                className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-extrabold text-sm px-8 py-4 rounded-full shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>⚡ Instant VIP Test & Publish (Free)</span>
                <span>→</span>
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-8 py-4 rounded-full border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Bank Checkout ({tier === 'standard' ? 'Rs. 4,999' : 'Rs. 7,999'})</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-10">Loading Studio...</div>}>
      <StudioContent />
    </Suspense>
  );
}
