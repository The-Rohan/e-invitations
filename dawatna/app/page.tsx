'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Heart,
  Volume2,
  Users,
  QrCode,
  ArrowRight,
  Play,
  Check,
  X,
  CreditCard,
  MessageCircle,
  HelpCircle,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [groomName, setGroomName] = useState('Hamza Mehmood');
  const [brideName, setBrideName] = useState('Ayesha Tariq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Template filtering based on luxury collections
  const filteredTemplates = TEMPLATES.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'cinematic') return t.brand === 'cinematic' || t.openingType === 'curtain' || t.tags.includes('film');
    if (activeFilter === 'atelier') return t.brand === 'atelier' || t.category === 'Atelier' || t.openingType === 'diya' || t.openingType === 'door_knock' || t.openingType === 'scroll';
    if (activeFilter === 'video') return t.isVideo || t.category === 'Film' || t.category === 'Atelier';
    if (activeFilter === 'embroidery') return t.category === 'Embroidery' || t.tags.includes('embroidery');
    if (activeFilter === 'heritage') return t.category === 'Heritage' || t.tags.includes('heritage') || t.category === 'Atelier';
    return t.tags.includes(activeFilter) || t.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const filterTabs = [
    { id: 'all', label: 'All Collections', count: TEMPLATES.length },
    { id: 'cinematic', label: 'Cinematic Drapes & Motion (21)', count: TEMPLATES.filter((t) => t.brand === 'cinematic' || t.openingType === 'curtain' || t.tags.includes('film')).length },
    { id: 'atelier', label: 'Atelier Tactile & Royal (24)', count: TEMPLATES.filter((t) => t.brand === 'atelier' || t.category === 'Atelier' || t.openingType === 'diya' || t.openingType === 'door_knock' || t.openingType === 'scroll').length },
    { id: 'video', label: 'Film & Motion', count: TEMPLATES.filter((t) => t.isVideo || t.category === 'Film' || t.category === 'Atelier').length, isFilm: true },
    { id: 'embroidery', label: 'Hand Embroidery', count: TEMPLATES.filter((t) => t.category === 'Embroidery').length },
    { id: 'heritage', label: 'Heritage & Haveli', count: TEMPLATES.filter((t) => t.category === 'Heritage' || t.category === 'Atelier').length },
    { id: 'signature', label: 'Signature', count: TEMPLATES.filter((t) => t.tags.includes('signature')).length },
    { id: 'islamic', label: 'Islamic', count: TEMPLATES.filter((t) => t.tags.includes('islamic')).length },
    { id: 'birthday', label: 'Birthday', count: TEMPLATES.filter((t) => t.tags.includes('birthday')).length },
  ];

  const faqs = [
    {
      q: '1. What kind of invitations do you offer?',
      a: 'We offer interactive digital web invitations that your guests open directly in WhatsApp or their mobile browser. Each invitation features custom animations (velvet curtains, wax seals, ribbon untying), background music, RSVP collection, countdown timer, and 1-tap Google Maps venue directions.',
    },
    {
      q: '2. Can I customize the invitation details and events?',
      a: 'Yes, absolutely! You can personalize the bride and groom names, parents names, multiple wedding functions (Mehndi, Barat, Walima, Nikkah, Qawwali), venues, dates, dress codes, and background audio.',
    },
    {
      q: '3. Can I have personalized links for each guest family?',
      a: 'Yes! In our Royal Luxury tier, each guest family receives their own private link (e.g. wedinvite.pk/g/ch-aslam) that displays their exact allocated headcount (e.g. "Reserved for 4 guests") and isolated RSVP response.',
    },
    {
      q: '4. How do I pay without a credit card in Pakistan?',
      a: 'We strictly support manual bank transfer, JazzCash, and Easypaisa. Simply copy our account details, transfer the amount in your banking app, upload the screenshot receipt on our website, and we verify and activate within 30 minutes!',
    },
    {
      q: '5. Can my overseas family send Salami digitally?',
      a: 'Yes! Every wedding invitation includes an optional Digital Salami tray featuring your official State Bank Raast ID and IBAN for instant 0-fee digital gifts directly into your bank account.',
    },
    {
      q: '6. How long does the invitation link stay active?',
      a: 'Your invitation link remains active throughout your entire wedding season and is preserved permanently as a digital keepsake for your family to revisit.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F4EE] text-[#2B211D] font-sans selection:bg-[#CFA954] selection:text-[#2B211D]">
      {/* ---------------- 1. NAVBAR ---------------- */}
      <header className="sticky top-0 z-50 bg-[#43362F] text-[#F1EBE4] border-b border-[#5A4B42]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
              <img src="/img/mark.png" alt="WedInvite.pk Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury font-bold text-lg tracking-wider text-[#ECD29A]">
                WEDINVITE.PK
              </span>
              <span className="text-[10px] tracking-widest uppercase text-white/60 -mt-1 font-urdu">
                دعوت نامہ
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-white/80">
            <a href="#features" className="hover:text-[#ECD29A] transition-colors">
              Features
            </a>
            <Link href="/templates" className="text-[#ECD29A] font-semibold hover:text-white transition-colors">
              All Templates ({TEMPLATES.length})
            </Link>
            <a href="#why" className="hover:text-[#ECD29A] transition-colors">
              Why Us
            </a>
            <a href="#reviews" className="hover:text-[#ECD29A] transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="hover:text-[#ECD29A] transition-colors">
              Pricing
            </a>
            <a href="#faqs" className="hover:text-[#ECD29A] transition-colors">
              FAQ’s
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-wider text-white/70 hover:text-white px-2 py-1"
            >
              Host Login
            </Link>
            <a
              href="#templates"
              className="wedinvite-btn bg-[#EBE2D5] text-[#2B211D] px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow hover:bg-white"
            >
              Try Free
              <span className="w-5 h-5 rounded-full bg-[#2B211D] text-white flex items-center justify-center text-[10px]">
                →
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* ---------------- 2. HERO SECTION ---------------- */}
      <section className="relative bg-[#2E231F] text-white overflow-hidden py-16 lg:py-24 border-b border-[#43362F]">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_50%,rgba(207,169,84,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Rating Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15 mb-6">
              <div className="flex text-[#CFA954] text-xs">
                {'★'.repeat(5)}
              </div>
              <span className="text-xs font-medium text-white/90">
                <strong className="text-white">5.0</strong>/5 Ratings (4,900+ Couples)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] text-[#FFFDF9] mb-6">
              Beautiful Digital <br />
              <span className="italic font-normal text-[#ECD29A]">Web Wedding</span> <br />
              Invitations
            </h1>

            {/* Subtitle */}
            <p className="text-white/75 text-base sm:text-lg max-w-xl font-light leading-relaxed mb-8">
              Your wedding card on its own link: every function, venue and Google map, background shehnai music, and a personal invitation for each guest, sent directly on WhatsApp.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#templates"
                className="wedinvite-btn bg-[#EBE2D5] text-[#2B211D] px-6 py-3.5 text-sm font-semibold tracking-wide shadow-xl hover:bg-white transition-transform"
              >
                Select Your Template
                <span className="w-7 h-7 rounded-full bg-[#2B211D] text-white flex items-center justify-center text-xs">
                  →
                </span>
              </a>

              <a
                href="#features"
                className="text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 transition-colors px-2 py-1"
              >
                Explore features
              </a>
            </div>

            {/* Trust Bullet List */}
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 w-full text-xs text-white/70">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CFA954] flex-none" />
                <span>Try free before pay</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CFA954] flex-none" />
                <span>Urdu & English</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CFA954] flex-none" />
                <span>Bank & JazzCash</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CFA954] flex-none" />
                <span>0% Credit card</span>
              </li>
            </ul>
          </div>

          {/* Hero Right: 3 Floating Phone Stack */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] flex items-center justify-center">
              {/* Back Phone Left: Madina Journey 2 */}
              <div className="absolute left-[-20px] top-6 w-[200px] aspect-[9/19] rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#1F1815] -rotate-6 opacity-60 hover:opacity-100 transition-all z-10">
                <img
                  src="/img/home/phones/madina-journey-2.webp"
                  alt="Madina Journey 2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Back Phone Right: Rewind VHS */}
              <div className="absolute right-[-20px] top-6 w-[200px] aspect-[9/19] rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#1F1815] rotate-6 opacity-60 hover:opacity-100 transition-all z-10">
                <img
                  src="/img/home/phones/rewind.webp"
                  alt="Rewind"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Front Center Phone: Everlasting Stitch / Mehru */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-[240px] aspect-[9/19] rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-[6px] border-[#3B2D26] z-20"
              >
                <img
                  src="/img/home/phones/everlasting-stitch.webp"
                  alt="The Everlasting Stitch"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-center">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-[#ECD29A]">
                    Signature Design
                  </span>
                  <p className="text-xs font-serif font-bold text-white">
                    The Everlasting Stitch
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Quick action beneath phone */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs tracking-wider uppercase text-white/60">
                The Everlasting Stitch
              </span>
              <Link
                href="/studio?theme=everlasting-stitch"
                className="wedinvite-btn bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-1.5 text-xs font-medium backdrop-blur-md"
              >
                Make It Yours
                <span className="text-[10px]">✨</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. THREE WAYS (HM-WAYS) ---------------- */}
      <section id="ways" className="py-20 bg-[#F9F4EE] border-b border-[#E6DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
              One invitation, three beautiful ways.
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal tracking-tight">
              Send it, save it, or watch it come alive.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Way 1 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6DCCF] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBE2D5] text-[#2B211D] flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-[#5A1621]" />
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#2B211D] mb-3">
                  A Beautiful Invitation Online
                </h3>
                <p className="text-sm text-[#6E625B] leading-relaxed mb-6">
                  One personal web link your guests open on any phone, with every function, venue, Google map directions, and your names on it.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E6DCCF]/60 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1621]">
                  Opens in WhatsApp
                </span>
                <span className="text-xs text-[#A99D94]">Live Link</span>
              </div>
            </div>

            {/* Way 2 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6DCCF] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBE2D5] text-[#2B211D] flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-[#5A1621]" />
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#2B211D] mb-3">
                  Ready to Download & Share
                </h3>
                <p className="text-sm text-[#6E625B] leading-relaxed mb-6">
                  Save your invitation as a high-resolution WhatsApp Status card photo or PDF document to send to elders or preserve as a memory.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E6DCCF]/60 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1621]">
                  WhatsApp Photo & PDF
                </span>
                <span className="text-xs text-[#A99D94]">9:16 Photo</span>
              </div>
            </div>

            {/* Way 3 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6DCCF] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBE2D5] text-[#2B211D] flex items-center justify-center mb-6">
                  <Play className="w-6 h-6 text-[#5A1621]" />
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#2B211D] mb-3">
                  Bring Your Invitation to Life
                </h3>
                <p className="text-sm text-[#6E625B] leading-relaxed mb-6">
                  Cinematic 9:16 vertical motion video invitation with custom background audio, opening curtains, and animations for Instagram and TikTok.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E6DCCF]/60 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1621]">
                  Film Invitation
                </span>
                <span className="text-xs text-[#A99D94]">9:16 Video</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. LIVE INTERACTIVE MAGIC BAR (A LIL BETTER) ---------------- */}
      <section className="bg-[#2E231F] text-white py-12 border-b border-[#43362F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col text-center md:text-left">
                <span className="text-xs font-serif uppercase tracking-widest text-[#ECD29A] mb-1">
                  Try Your Names Live / لائیو تجربہ
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal">
                  Preview any card with your wedding names right now
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Groom's Name"
                  className="bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#CFA954] w-full sm:w-44"
                />
                <span className="text-[#ECD29A] font-serif italic text-lg">&</span>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Bride's Name"
                  className="bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#CFA954] w-full sm:w-44"
                />
                <Link
                  href={`/w/hamza-ayesha?groom=${encodeURIComponent(groomName)}&bride=${encodeURIComponent(brideName)}`}
                  className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow whitespace-nowrap"
                >
                  Launch Demo Card
                  <span className="w-5 h-5 rounded-full bg-[#2B211D] text-white flex items-center justify-center text-[10px]">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. TEMPLATES CATALOG SECTION (#templates) ---------------- */}
      <section id="templates" className="py-20 bg-[#F9F4EE] border-b border-[#E6DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
              Collection — Every design is personalised for your wedding by our team
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal tracking-tight">
              Digital Web Wedding Invitations Template
            </h2>
          </div>

          {/* Filter Pills Toolbar */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#2B211D] text-white shadow-md'
                    : 'bg-[#EBE2D5] text-[#2B211D] hover:bg-white'
                }`}
              >
                {tab.isFilm && <Play className="w-3 h-3 fill-current" />}
                <span>{tab.label}</span>
                <sup className="text-[10px] opacity-70 ml-0.5">{tab.count}</sup>
              </button>
            ))}
          </div>

          {/* Templates Grid (21 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-[#FFFDFA] rounded-2xl overflow-hidden border border-[#E6DCCF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Featured Preview Area - Zero Cropping for both Square and Phone Formats */}
                <div className="relative aspect-[4/5] bg-gradient-to-b from-[#251B17] via-[#2F231D] to-[#1E1512] overflow-hidden flex items-center justify-center p-6">
                  {/* Subtle palette glow */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${template.palette.accent} 0%, transparent 70%)`,
                    }}
                  />

                  {/* COMPLETE FEATURED IMAGE: Handcrafted for Atelier square vs Cinematic tall mockups */}
                  {template.brand === 'atelier' ? (
                    <div className="relative w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 p-1.5 bg-[#1C140F] group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={template.phoneMockup || `/atelier/thumbs/thumb-${template.id}-480.webp`}
                        alt={template.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full max-w-[190px] h-[280px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={template.phoneMockup || `/img/home/phones/${template.id}.webp`}
                        alt={template.name}
                        className="h-full w-auto max-w-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
                      />
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
                    {template.brand === 'atelier' ? (
                      <span className="bg-[#18382B] text-[#7DA28C] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow border border-[#7DA28C]/30">
                        Atelier Edition
                      </span>
                    ) : (
                      <span className="bg-[#5A1621] text-[#ECD29A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow border border-[#ECD29A]/30">
                        Cinematic Edition
                      </span>
                    )}

                    {template.badge && (
                      <span className="bg-[#CFA954] text-[#2B211D] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                        {template.badge}
                      </span>
                    )}

                    {template.isVideo && (
                      <span className="bg-rose-900 text-rose-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Film
                      </span>
                    )}

                    <span className="bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20">
                      {template.category}
                    </span>
                  </div>

                  {/* Audio Indicator */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white/80 flex items-center justify-center text-xs">
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Info & Meta */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <Link href={`/templates/${template.id}`}>
                        <h3 className="font-serif-luxury text-2xl text-[#2B211D] font-normal group-hover:text-[#5A1621] transition-colors">
                          {template.name}
                        </h3>
                      </Link>
                      <span className="font-urdu text-base text-[#6E625B]">
                        {template.nameUrdu}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#CFA954] mb-2">
                      {template.aesthetic}
                    </div>

                    <p className="text-xs text-[#6E625B] line-clamp-2 mb-4 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Pricing & CTAs */}
                  <div className="pt-4 border-t border-[#E6DCCF]">
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif-luxury font-bold text-lg text-[#2B211D]">
                          Rs. {template.price?.toLocaleString() || '5,000'}
                        </span>
                        <span className="text-xs text-[#A99D94] line-through">
                          Rs. {template.originalPrice?.toLocaleString() || '8,000'}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Save Rs. {((template.originalPrice || 0) - (template.price || 0)).toLocaleString()}
                      </span>
                    </div>

                    {/* CTAs: View Details (Product Page) | Live Preview (Phone Frame) */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Link
                        href={`/templates/${template.id}`}
                        className="wedinvite-btn bg-[#2B211D] hover:bg-[#43362F] text-white py-2 px-2.5 text-xs font-semibold uppercase tracking-wider justify-center shadow text-center"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/preview/${template.id}`}
                        className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] py-2 px-2.5 text-xs font-bold uppercase tracking-wider justify-center text-center shadow"
                      >
                        Live Preview
                      </Link>
                    </div>

                    <div className="text-center pt-1">
                      <Link
                        href={`/studio?theme=${template.id}`}
                        className="text-[11px] text-[#8C6A1E] hover:text-[#5A1621] font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                      >
                        <span>Customize in Studio</span>
                        <span className="text-[10px]">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 6. FEATURES GRID (#features) ---------------- */}
      <section id="features" className="py-20 bg-[#2E231F] text-white border-b border-[#43362F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
              Features
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal tracking-tight">
              Everything you need to invite, in one place.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tile 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:border-[#CFA954]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center text-[#ECD29A] mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-white mb-2">Your own dashboard</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                See real-time guest views, confirmed headcounts, caterer meal choices (Chicken, Mutton, Veg), and download guest lists directly into Excel/CSV.
              </p>
            </div>

            {/* Tile 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:border-[#CFA954]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center text-[#ECD29A] mb-5">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-white mb-2">Film invitations</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Cinematic 9:16 vertical motion video invitation with custom audio, opening curtains, and animations formatted perfectly for Instagram stories.
              </p>
            </div>

            {/* Tile 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:border-[#CFA954]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center text-[#ECD29A] mb-5">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-white mb-2">A link for every guest</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Send private per-guest links (e.g. wedinvite.pk/g/ch-aslam) that show their isolated seat allocation without seeing other families.
              </p>
            </div>

            {/* Tile 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:border-[#CFA954]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center text-[#ECD29A] mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-white mb-2">Your own web address</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                A custom memorable link like wedinvite.pk/w/hamza-ayesha or your own custom domain that your family will treasure forever.
              </p>
            </div>

            {/* Tile 5 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:border-[#CFA954]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center text-[#ECD29A] mb-5">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-white mb-2">Sent on WhatsApp</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Generate 1-click personalized WhatsApp invitations pre-filled in Urdu & English with guest names and instant clickable preview cards.
              </p>
            </div>

            {/* Tile 6 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:border-[#CFA954]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#CFA954]/20 border border-[#CFA954]/40 flex items-center justify-center text-[#ECD29A] mb-5">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-white mb-2">English & Urdu</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Instant bilingual switch between modern English typography and authentic, sacred Noto Nastaliq Urdu calligraphy for elders and overseas relatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 7. WHY WEDINVITE.PK / COMPARISON (HM-WHY) ---------------- */}
      <section id="why" className="py-20 bg-[#F9F4EE] border-b border-[#E6DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-5">
              <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
                Why WedInvite.pk
              </p>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal tracking-tight mb-4">
                Why WedInvite.pk is Better
              </h2>
              <p className="text-sm text-[#6E625B] leading-relaxed mb-8">
                Most Pakistani e-cards are just a flat JPEG picture or static PDF forwarded on WhatsApp. Ours is a complete interactive wedding web experience that stays yours: you can change details, send to each guest by name, track meals, and collect digital blessings.
              </p>

              {/* Score Comparison Bars */}
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#2B211D] mb-1">
                    <span className="flex items-center gap-2">
                      <img src="/img/mark.png" alt="logo" className="w-4 h-4 object-contain" />
                      WedInvite.pk
                    </span>
                    <span className="text-[#5A1621]">9 / 9 Features</span>
                  </div>
                  <div className="h-2 w-full bg-[#EBE2D5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5A1621] w-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-[#6E625B] mb-1">
                    <span>Other e-card websites</span>
                    <span>2 / 9 Features</span>
                  </div>
                  <div className="h-2 w-full bg-[#EBE2D5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#A99D94] w-2/9 rounded-full" />
                  </div>
                </div>
              </div>

              <a
                href="#templates"
                className="wedinvite-btn bg-[#2B211D] hover:bg-[#43362F] text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider shadow"
              >
                Try a design free
                <span className="w-5 h-5 rounded-full bg-white text-[#2B211D] flex items-center justify-center text-[10px]">
                  →
                </span>
              </a>
            </div>

            {/* Right Comparison Table */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFDFA] rounded-2xl border border-[#E6DCCF] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EBE2D5]/50 border-b border-[#E6DCCF] text-[#2B211D] font-serif-luxury text-sm">
                    <tr>
                      <th className="p-4 font-semibold">Features</th>
                      <th className="p-4 font-semibold text-[#5A1621]">WedInvite.pk</th>
                      <th className="p-4 font-normal text-[#6E625B]">Basic PDF / WhatsApp Pic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DCCF]">
                    <tr>
                      <td className="p-4 font-medium text-[#2B211D]">Tactile Opening Gesture (Curtain / Wax / Ribbon)</td>
                      <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (Interactive 3D)</td>
                      <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Flat Image Only</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[#2B211D]">Instant Google Maps Pin Navigation</td>
                      <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (1-tap opens map)</td>
                      <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Guest gets lost</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[#2B211D]">Private Link Per Family with Headcount</td>
                      <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (Seat enforcement)</td>
                      <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Uncontrolled forwarding</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[#2B211D]">Bilingual English & Noto Nastaliq Urdu</td>
                      <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (1-tap toggle)</td>
                      <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Fixed text</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[#2B211D]">Digital Salami (Raast ID & IBAN)</td>
                      <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (0% fees)</td>
                      <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> No</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[#2B211D]">Banquet Gatekeeper QR Entry Scan</td>
                      <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes</td>
                      <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 8. TESTIMONIALS (HM-REVIEWS) ---------------- */}
      <section id="reviews" className="py-20 bg-[#F9F4EE] border-b border-[#E6DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
              Testimonials — 4,900+ Happy couples
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal tracking-tight">
              Kind words from our couples.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-7 border border-[#E6DCCF] shadow-sm flex flex-col justify-between">
              <div className="mb-6">
                <div className="flex text-[#CFA954] text-xs mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-[#2B211D] italic leading-relaxed">
                  “Mera experience bohat acha tha, very smooth! The team was super cooperative, did everything the way I wanted! All our guests in London and Lahore loved the curtain opening and background shehnai music.”
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6DCCF]">
                <div className="w-9 h-9 rounded-full bg-[#5A1621] text-[#ECD29A] font-serif font-bold flex items-center justify-center text-sm">
                  H
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B211D]">Hania & Raqeeb</h4>
                  <span className="text-[11px] text-[#A99D94]">Lahore & London</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-7 border border-[#E6DCCF] shadow-sm flex flex-col justify-between">
              <div className="mb-6">
                <div className="flex text-[#CFA954] text-xs mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-[#2B211D] italic leading-relaxed">
                  “The best part was the RSVP dashboard and the private guest links! We allocated 3 seats to cousins and they couldn't bring 8 people unannounced. It saved our caterer budget tremendously!”
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6DCCF]">
                <div className="w-9 h-9 rounded-full bg-[#2B211D] text-[#ECD29A] font-serif font-bold flex items-center justify-center text-sm">
                  M
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B211D]">Madiha & Hamza</h4>
                  <span className="text-[11px] text-[#A99D94]">Karachi</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-7 border border-[#E6DCCF] shadow-sm flex flex-col justify-between">
              <div className="mb-6">
                <div className="flex text-[#CFA954] text-xs mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-[#2B211D] italic leading-relaxed">
                  “Super easy payment through JazzCash and receipt upload on their website! Activated in 20 minutes and our WhatsApp invitation was sent to 300 guests in one evening.”
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6DCCF]">
                <div className="w-9 h-9 rounded-full bg-[#CFA954] text-[#2B211D] font-serif font-bold flex items-center justify-center text-sm">
                  Z
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B211D]">Zainab & Bilal</h4>
                  <span className="text-[11px] text-[#A99D94]">Islamabad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 9. PRICING & LOCAL PAYMENT WORKFLOW ---------------- */}
      <section id="pricing" className="py-20 bg-[#2E231F] text-white border-b border-[#43362F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
              Transparent Pricing — No Hidden Fees
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal tracking-tight mb-3">
              One price, unlimited guests.
            </h2>
            <p className="text-sm text-white/70">
              Manual Bank Transfer, JazzCash & Easypaisa accepted with instant WhatsApp receipt verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tier 1: Classic Web */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between hover:border-white/30 transition-colors">
              <div>
                <span className="text-xs font-serif uppercase tracking-widest text-[#ECD29A] mb-1 block">
                  Starter Package
                </span>
                <h3 className="font-serif-luxury text-3xl text-white mb-2">
                  Classic Web Invitation
                </h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-serif-luxury text-4xl font-bold text-white">
                    Rs. 4,999
                  </span>
                  <span className="text-sm text-white/50 line-through">
                    Rs. 8,000
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-white/80 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#CFA954] flex-none" />
                    <span>Any web template of your choice</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#CFA954] flex-none" />
                    <span>WhatsApp Status Image Card (9:16)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#CFA954] flex-none" />
                    <span>Google Maps 1-tap venue direction pins</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#CFA954] flex-none" />
                    <span>Add to Google & Apple Calendar buttons</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#CFA954] flex-none" />
                    <span>Standard RSVP collection</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#CFA954] flex-none" />
                    <span>Digital Salami (Raast ID & IBAN tray)</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/studio?plan=standard"
                className="wedinvite-btn bg-[#EBE2D5] hover:bg-white text-[#2B211D] py-3.5 px-6 text-xs font-bold uppercase tracking-wider justify-center text-center shadow-lg"
              >
                Choose Classic (Rs. 4,999)
              </Link>
            </div>

            {/* Tier 2: Royal Luxury Film */}
            <div className="bg-gradient-to-b from-[#5A1621] to-[#3B0711] border-2 border-[#CFA954] rounded-2xl p-8 shadow-2xl flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 bg-[#CFA954] text-[#2B211D] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-serif uppercase tracking-widest text-[#ECD29A] mb-1 block">
                  Complete Wedding Suite
                </span>
                <h3 className="font-serif-luxury text-3xl text-white mb-2">
                  Royal Luxury + Motion Film
                </h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-serif-luxury text-4xl font-bold text-[#ECD29A]">
                    Rs. 7,999
                  </span>
                  <span className="text-sm text-white/50 line-through">
                    Rs. 12,500
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-white/90 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ECD29A] flex-none" />
                    <span><strong>All web templates</strong> + film designs included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ECD29A] flex-none" />
                    <span><strong>9:16 Cinematic Motion Teaser Film</strong> for Reels/Status</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ECD29A] flex-none" />
                    <span><strong>Private link for every guest family</strong> with headcount control</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ECD29A] flex-none" />
                    <span><strong>Live Host Dashboard</strong> (Catering meal choices & headcount)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ECD29A] flex-none" />
                    <span><strong>Gatekeeper QR Entry Pass & Scanner</strong> for hall security</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ECD29A] flex-none" />
                    <span>Priority WhatsApp concierge fulfillment within 24 hours</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/studio?plan=royal"
                className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] py-3.5 px-6 text-xs font-bold uppercase tracking-wider justify-center text-center shadow-xl"
              >
                Choose Royal Luxury (Rs. 7,999)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 10. FAQS ACCORDION (#faqs) ---------------- */}
      <section id="faqs" className="py-20 bg-[#F9F4EE] border-b border-[#E6DCCF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2">
              Help & Answers
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#FFFDFA] rounded-xl border border-[#E6DCCF] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm font-semibold text-[#2B211D] hover:text-[#5A1621] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A99D94] transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#5A1621]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs text-[#6E625B] leading-relaxed border-t border-[#E6DCCF]/50 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 11. FOOTER ---------------- */}
      <footer className="bg-[#2E231F] text-white/80 py-16 border-t border-[#43362F] text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/img/mark.png" alt="logo" className="w-6 h-6 object-contain" />
              <span className="font-serif-luxury font-bold text-base text-[#ECD29A]">
                WEDINVITE.PK
              </span>
            </div>
            <p className="text-white/60 leading-relaxed mb-4">
              The leading digital wedding invitation platform in Pakistan. Custom web cards, motion film invitations, isolated guest seats & RSVP management.
            </p>
            <span className="text-[#CFA954] text-xs font-serif">
              support@wedinvite.pk
            </span>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#ways" className="hover:text-white">What You Get</a></li>
              <li><Link href="/templates" className="hover:text-white font-semibold text-[#ECD29A]">Master Catalog (45)</Link></li>
              <li><a href="#why" className="hover:text-white">Why WedInvite.pk</a></li>
              <li><a href="#reviews" className="hover:text-white">Testimonials</a></li>
              <li><a href="#faqs" className="hover:text-white">FAQ’s</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Invitations & Tools
            </h4>
            <ul className="space-y-2 text-white/60">
              <li><Link href="/studio" className="hover:text-white">Invitation Studio</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Host Guest Dashboard</Link></li>
              <li><Link href="/scanner" className="hover:text-white">Gatekeeper QR Scanner</Link></li>
              <li><Link href="/checkout" className="hover:text-white">Manual Bank Checkout</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Receipt Queue</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Customer Support
            </h4>
            <p className="text-white/60 leading-relaxed mb-4">
              Need assistance personalizing your card or paying via JazzCash? Our Lahore & Karachi concierge is live on WhatsApp.
            </p>
            <a
              href="https://wa.me/923014544411"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-black font-bold px-4 py-2 rounded-full text-xs hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-white/50 text-[11px] gap-4">
          <p>© 2026 WedInvite.pk. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/refunds" className="hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
