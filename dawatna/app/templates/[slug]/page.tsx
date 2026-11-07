'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Play,
  Volume2,
  Check,
  X,
  Share2,
  MessageCircle,
  Smartphone,
  ChevronDown,
  MapPin,
  Calendar,
  Gift,
  ShieldCheck,
  Clock,
  Flame,
  DoorOpen,
  Scroll,
  HelpCircle,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { TemplateDefinition } from '@/lib/types';

function TemplateProductContent() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || 'shahi-mehru';

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Match template by id, or originalSlug, or partial match
  const template =
    TEMPLATES.find((t) => t.id === rawSlug) ||
    TEMPLATES.find((t) => t.originalSlug === rawSlug) ||
    TEMPLATES.find((t) => t.id.includes(rawSlug)) ||
    TEMPLATES[0];

  const isAtelier = template.brand === 'atelier';
  const savings = (template.originalPrice || 0) - (template.price || 0);

  const copyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedTemplates = TEMPLATES.filter(
    (t) => t.id !== template.id && (t.brand === template.brand || t.category === template.category)
  ).slice(0, 3);

  const getGestureInfo = (t: TemplateDefinition) => {
    switch (t.openingType) {
      case 'curtain':
        return {
          title: 'Royal Velvet Drapes (پردہ کشائی)',
          desc: 'Heavy, realistic velvet drapes tied with gold cords part gracefully with authentic physics, revealing illuminated chandeliers and couple names.',
        };
      case 'diya':
        return {
          title: 'Press & Hold Brass Diya (روشنی دیا)',
          desc: 'Guests press and hold an antique brass diya on screen. The flame intensifies and casts a warm radiant glow across the card before opening.',
        };
      case 'door_knock':
        return {
          title: 'Knock Haveli Gates 3 Times (دہلیزِ خاص)',
          desc: 'Carved solid oak haveli double doors with a heavy brass knocker. Guests tap three times with sound effects to swing the gates open.',
        };
      case 'wax_seal':
        return {
          title: 'Break the Royal Wax Seal (مہرِ شاہی)',
          desc: 'An embossed gold wax seal medallion stamps the envelope flap. Touching it cracks the seal open with ceremonial elegance.',
        };
      case 'scroll':
        return {
          title: 'Unroll Royal Farmaan (شاہی فرمان)',
          desc: 'A gold-finialled Mughal proclamation lying on aged vellum paper that unrolls smoothly in two stages upon touch.',
        };
      case 'lantern':
        return {
          title: 'Swing Brass Lantern (پرانی حویلی)',
          desc: 'A swinging hanging brass lantern that sways to illuminate the night courtyard terrace.',
        };
      case 'water_ripple':
        return {
          title: 'Touch Starlit Lotus Pool (چاندنی جھیل)',
          desc: 'Touching the dark tranquil lotus pond sends realistic shimmering ripples through the starlit water.',
        };
      default:
        return {
          title: 'Tactile Physical Entrance',
          desc: 'An interactive physical motion experience designed to captivate your guests the instant they open your WhatsApp link.',
        };
    }
  };

  const gestureInfo = getGestureInfo(template);

  const faqs = [
    {
      q: `How long does it take to get my customized ${template.name} invitation?`,
      a: 'Your first live preview link is delivered within 24 to 48 hours via WhatsApp. Once you review and request any revisions, we finalize it immediately.',
    },
    {
      q: 'How do I pay without a credit card in Pakistan?',
      a: 'We strictly support manual bank transfer (Meezan Bank, Faysal, HBL), State Bank Raast ID, JazzCash, and Easypaisa. You only pay after selecting your design and uploading your screenshot receipt.',
    },
    {
      q: 'Can each guest family receive their own private link with their exact headcount?',
      a: 'Yes! In our Royal Luxury tier, we generate isolated links for each guest family (e.g. wedinvite.pk/g/ch-aslam). The link displays "Reserved for 4 guests" and ensures they cannot RSVP for uninvited plus-ones.',
    },
    {
      q: 'Can I add or remove wedding functions (e.g. Mehndi, Mayun, Qawwali, Barat, Walima)?',
      a: 'Yes! You can include any combination of functions. Each function features its own date, time, venue address, and 1-tap Google Maps directions.',
    },
    {
      q: 'How many revisions do I get?',
      a: 'We provide unlimited revision rounds until your card is inch-perfect. Our creative concierge team in Lahore and Karachi is live on WhatsApp to assist you.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F4EE] text-[#2B211D] font-sans selection:bg-[#CFA954] selection:text-[#2B211D]">
      {/* ---------------- 1. NAVBAR ---------------- */}
      <header className="sticky top-0 z-50 bg-[#43362F] text-[#F1EBE4] border-b border-[#5A4B42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
            <Link href="/templates" className="text-[#ECD29A] font-semibold flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Templates Catalog</span>
            </Link>
            <Link href="/studio" className="hover:text-[#ECD29A] transition-colors">
              Studio
            </Link>
            <Link href="/#pricing" className="hover:text-[#ECD29A] transition-colors">
              Pricing
            </Link>
            <Link href="/#why" className="hover:text-[#ECD29A] transition-colors">
              Why Us
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShare}
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/15"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <Link
              href={`/studio?theme=${template.id}`}
              className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow"
            >
              Customize Free
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- 2. BREADCRUMBS ---------------- */}
      <div className="bg-[#EFE8DF] border-b border-[#E0D5C7] py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[#6E625B]">
          <Link href="/" className="hover:text-[#2B211D]">Home</Link>
          <span>/</span>
          <Link href="/templates" className="hover:text-[#2B211D]">Templates</Link>
          <span>/</span>
          <span className="font-semibold text-[#2B211D]">{template.name}</span>
        </div>
      </div>

      {/* ---------------- 3. HIGH-CONVERSION HERO SECTION ---------------- */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Copy & High-Converting Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5A1621] text-[#ECD29A] border border-[#ECD29A]/30 shadow-sm">
                {isAtelier ? 'Atelier Collection' : 'Cinematic Motion Collection'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CFA954]/20 text-[#8C6A1E] border border-[#CFA954]/40">
                {template.category}
              </span>
              {template.isVideo && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-900 text-rose-100 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" />
                  Film Motion
                </span>
              )}
            </div>

            {/* Titles */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#2B211D] font-normal tracking-tight mb-2">
              {template.name}
            </h1>
            <div className="font-urdu text-2xl sm:text-3xl text-[#8C6A1E] mb-6">
              {template.nameUrdu}
            </div>

            {/* Narrative description */}
            <p className="text-base text-[#52453E] leading-relaxed mb-6 font-serif">
              {template.description}
            </p>

            {/* Aesthetic Tagline */}
            <div className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E6DCCF] shadow-sm mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6A1E]">
                  Aesthetic Palette
                </span>
                <div className="text-sm font-serif font-bold text-[#2B211D]">
                  {template.aesthetic}
                </div>
              </div>

              {/* Color swatches */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shadow-inner"
                  style={{ backgroundColor: template.palette.primary }}
                  title="Primary Color"
                />
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shadow-inner"
                  style={{ backgroundColor: template.palette.accent }}
                  title="Accent Gold"
                />
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shadow-inner"
                  style={{ backgroundColor: template.palette.background }}
                  title="Card Background"
                />
              </div>
            </div>

            {/* Tactile Gesture Feature Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#2E231F] to-[#43362F] text-white shadow-md mb-8 flex items-start gap-3.5 border border-[#CFA954]/30">
              <div className="w-9 h-9 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/50 flex items-center justify-center shrink-0 text-[#CFA954] mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#ECD29A] mb-1">
                  Signature Entrance: {gestureInfo.title}
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-serif">
                  {gestureInfo.desc}
                </p>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-6 rounded-2xl bg-[#FFFDFA] border-2 border-[#CFA954] shadow-lg mb-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#8C6A1E] block mb-1">
                    Complete Wedding Edition Package
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif-luxury font-bold text-3xl sm:text-4xl text-[#2B211D]">
                      Rs. {template.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-[#A99D94] line-through font-serif">
                      Rs. {template.originalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Save Rs. {savings.toLocaleString()} Today
                </span>
              </div>

              <p className="text-xs text-[#6E625B] leading-relaxed mb-6">
                Price includes full customization with your wedding functions, bride & groom details, background shehnai audio, venue Google Maps, and 1 full year of hosting.
              </p>

              {/* Conversion Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <Link
                  href={`/studio?theme=${template.id}`}
                  className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] py-3.5 px-6 text-xs font-bold uppercase tracking-wider justify-center text-center shadow-xl transition-all"
                >
                  Customize in Studio Free →
                </Link>

                <Link
                  href={`/preview/${template.id}`}
                  className="wedinvite-btn bg-[#2B211D] hover:bg-[#43362F] text-white py-3.5 px-6 text-xs font-bold uppercase tracking-wider justify-center text-center shadow-md transition-all"
                >
                  <Smartphone className="w-4 h-4 mr-1 inline" />
                  Test on Phone Frame
                </Link>
              </div>

              {/* WhatsApp Quick Order */}
              <a
                href={`https://wa.me/923014544411?text=${encodeURIComponent(
                  `Salam! I want to order the "${template.name}" invitation (Rs. ${template.price}) on WedInvite.pk.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold py-3 px-4 rounded-full text-xs uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Order on WhatsApp Concierge</span>
              </a>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-3 text-xs text-[#6E625B]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Risk — Pay manually after preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live within 24–48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited revision rounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Tap Google Maps navigation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Featured Artwork / Device Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] bg-gradient-to-b from-[#2E231F] via-[#3B2D26] to-[#1F1714] rounded-[36px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-4 border-[#CFA954]/30 flex flex-col items-center">
              {/* Top notch detail */}
              <div className="w-24 h-4 bg-black/60 rounded-full mb-6 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>

              {/* Complete Featured Image (Zero Cropping) */}
              {isAtelier ? (
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 p-1.5 bg-[#1C140F]">
                  <img
                    src={template.phoneMockup || `/atelier/thumbs/thumb-${template.id}-480.webp`}
                    alt={template.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : (
                <div className="relative w-full h-[460px] flex items-center justify-center">
                  <img
                    src={template.phoneMockup || `/img/home/phones/${template.id}.webp`}
                    alt={template.name}
                    className="h-full w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                  />
                </div>
              )}

              {/* Action Buttons below device */}
              <div className="mt-6 w-full flex flex-col gap-2.5">
                <Link
                  href={`/preview/${template.id}`}
                  className="w-full wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] py-3 text-xs font-bold uppercase tracking-wider justify-center text-center shadow-lg"
                >
                  <Eye className="w-4 h-4 mr-1.5 inline" />
                  Launch Interactive Demo
                </Link>

                <Link
                  href={`/studio?theme=${template.id}`}
                  className="w-full text-center text-xs text-white/70 hover:text-white py-1 uppercase tracking-wider font-semibold transition-colors"
                >
                  Personalize with Couple Names →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. THE SAME CARD SENT TWO WAYS ---------------- */}
      <section className="py-20 bg-[#F1EAE0] border-y border-[#E6DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2 block">
              Unique Feature
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal mb-3">
              The Same Card, Sent Two Ways
            </h2>
            <p className="text-sm text-[#6E625B] font-serif leading-relaxed">
              Every card has two modes: one open link for family broadcast groups, and private personalized links for individual guest families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. General Link */}
            <div className="bg-[#FFFDFA] p-8 rounded-2xl border border-[#E6DCCF] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6A1E] block mb-2">
                  1. The Public Announcement Link
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#2B211D] mb-3">
                  For WhatsApp Family Groups
                </h3>
                <p className="text-xs text-[#6E625B] leading-relaxed mb-6">
                  One memorable link like <strong className="text-[#2B211D]">wedinvite.pk/w/hamza-ayesha</strong>. Perfect for sharing with distant cousins, college friends, and broad family circles with open RSVP.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F4EE] border border-[#E6DCCF] text-xs font-mono text-[#6E625B] break-all">
                wedinvite.pk/w/{template.id}
              </div>
            </div>

            {/* 2. Private Guest Link */}
            <div className="bg-[#FFFDFA] p-8 rounded-2xl border-2 border-[#CFA954] shadow-md flex flex-col justify-between relative overflow-hidden">
              <span className="absolute top-4 right-4 bg-[#CFA954] text-[#2B211D] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Host Favorite
              </span>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6A1E] block mb-2">
                  2. Private Per-Family Links
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#2B211D] mb-3">
                  With Headcount Allocation
                </h3>
                <p className="text-xs text-[#6E625B] leading-relaxed mb-6">
                  Send private links like <strong className="text-[#2B211D]">wedinvite.pk/g/ch-aslam</strong>. Each family sees only their own invitation with: <em className="text-[#5A1621]">&ldquo;Reserved for 4 guests&rdquo;</em>, preventing uninvited plus-ones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F4EE] border border-[#CFA954]/40 text-xs font-mono text-[#2B211D] break-all">
                wedinvite.pk/g/ch-aslam-sample
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. WHAT MAKES THIS DESIGN SPECIAL ---------------- */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2 block">
            Crafted for Pakistani Weddings
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2B211D] font-normal mb-3">
            Everything Included in {template.name}
          </h2>
          <p className="text-sm text-[#6E625B] font-serif leading-relaxed">
            Engineered to remove all wedding logistics friction for your family and guests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFFDFA] p-6 rounded-2xl border border-[#E6DCCF] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/50 flex items-center justify-center text-[#8C6A1E] mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-lg text-[#2B211D] mb-2">{gestureInfo.title}</h4>
            <p className="text-xs text-[#6E625B] leading-relaxed">
              {gestureInfo.desc}
            </p>
          </div>

          <div className="bg-[#FFFDFA] p-6 rounded-2xl border border-[#E6DCCF] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/50 flex items-center justify-center text-[#8C6A1E] mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-lg text-[#2B211D] mb-2">1-Tap Google Maps</h4>
            <p className="text-xs text-[#6E625B] leading-relaxed">
              No more guests calling the groom’s father asking for hall directions. 1-tap opens turn-by-turn navigation directly to the hall entrance.
            </p>
          </div>

          <div className="bg-[#FFFDFA] p-6 rounded-2xl border border-[#E6DCCF] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/50 flex items-center justify-center text-[#8C6A1E] mb-4">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-lg text-[#2B211D] mb-2">Curated Shehnai Audio</h4>
            <p className="text-xs text-[#6E625B] leading-relaxed">
              Traditional shehnai, sitar or acoustic instrumental raag playing gracefully in the background with a floating mute toggle.
            </p>
          </div>

          <div className="bg-[#FFFDFA] p-6 rounded-2xl border border-[#E6DCCF] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/50 flex items-center justify-center text-[#8C6A1E] mb-4">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-lg text-[#2B211D] mb-2">Raast Digital Salami</h4>
            <p className="text-xs text-[#6E625B] leading-relaxed">
              Includes an optional Digital Salami tray featuring your official State Bank Raast ID and IBAN for instant 0-fee digital gifts.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 6. COMPARISON TABLE ---------------- */}
      <section className="py-16 bg-[#F1EAE0] border-t border-[#E6DCCF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2B211D] mb-2">
              Why WedInvite.pk Beats a Flat PDF or Video
            </h3>
            <p className="text-xs text-[#6E625B] font-serif">
              Three ways to invite in Pakistan. Only one your guests remember.
            </p>
          </div>

          <div className="bg-[#FFFDFA] rounded-2xl border border-[#E6DCCF] shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EBE2D5]/50 border-b border-[#E6DCCF] text-[#2B211D] font-serif-luxury text-sm">
                <tr>
                  <th className="p-4 font-semibold">Features</th>
                  <th className="p-4 font-semibold text-[#5A1621]">WedInvite.pk ({template.name})</th>
                  <th className="p-4 font-normal text-[#6E625B]">Flat PDF / WhatsApp JPEG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DCCF]">
                <tr>
                  <td className="p-4 font-medium text-[#2B211D]">Tactile Opening Gesture</td>
                  <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (Interactive 3D)</td>
                  <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Flat Image Only</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#2B211D]">1-Tap Google Maps Directions</td>
                  <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (Pins the hall entrance)</td>
                  <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Guests get lost</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#2B211D]">Isolated Per-Family Seat Allocation</td>
                  <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Yes (&ldquo;Reserved for 4 guests&rdquo;)</td>
                  <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Uncontrolled forwarding</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#2B211D]">Gatekeeper Hall QR Scanner</td>
                  <td className="p-4 text-[#5A1621] font-bold"><Check className="w-4 h-4 text-emerald-600 inline" /> Included for door staff</td>
                  <td className="p-4 text-[#A99D94]"><X className="w-4 h-4 text-rose-500 inline" /> Paper checklist</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------- 7. FAQ ACCORDION ---------------- */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#CFA954] font-semibold mb-2 block">
            Have Questions?
          </span>
          <h2 className="font-serif-luxury text-3xl text-[#2B211D]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFA] rounded-xl border border-[#E6DCCF] overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif text-sm font-semibold text-[#2B211D]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#CFA954] transition-transform duration-300 shrink-0 ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#6E625B] leading-relaxed border-t border-[#E6DCCF]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 8. RELATED DESIGNS ---------------- */}
      <section className="py-16 bg-[#F1EAE0] border-t border-[#E6DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6A1E] block mb-1">
                More in this aesthetic
              </span>
              <h3 className="font-serif-luxury text-2xl text-[#2B211D]">
                You Might Also Love
              </h3>
            </div>

            <Link
              href="/templates"
              className="text-xs uppercase font-semibold text-[#8C6A1E] hover:text-[#2B211D] tracking-wider"
            >
              View All 45 Designs →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedTemplates.map((rel) => (
              <Link
                key={rel.id}
                href={`/templates/${rel.id}`}
                className="group bg-[#FFFDFA] rounded-xl overflow-hidden border border-[#E6DCCF] shadow-sm hover:shadow-xl transition-all p-4 flex flex-col"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#1F1714] flex items-center justify-center p-2">
                  <img
                    src={rel.phoneMockup || `/img/home/phones/${rel.id}.webp`}
                    alt={rel.name}
                    className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="font-serif font-bold text-base text-[#2B211D] group-hover:text-[#5A1621] transition-colors">
                  {rel.name}
                </div>
                <div className="text-xs text-[#8C6A1E] font-serif mb-2">{rel.aesthetic}</div>
                <div className="mt-auto font-serif-luxury font-bold text-sm text-[#2B211D]">
                  Rs. {rel.price?.toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 9. STICKY MOBILE CONVERSION BAR ---------------- */}
      <div className="sticky bottom-0 z-50 bg-[#2E231F] border-t border-white/10 px-4 py-3 shadow-2xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-serif tracking-widest text-[#CFA954] line-clamp-1">
              {template.name}
            </span>
            <span className="font-serif font-bold text-base text-white">
              Rs. {template.price?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/preview/${template.id}`}
              className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold px-3 py-2 rounded-full border border-white/20"
            >
              Demo
            </Link>

            <Link
              href={`/studio?theme=${template.id}`}
              className="wedinvite-btn bg-[#CFA954] text-[#2B211D] text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow"
            >
              Customize
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------- 10. FOOTER ---------------- */}
      <footer className="bg-[#211916] text-[#A69A93] text-xs pt-12 pb-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
          <p>© 2026 WedInvite.pk. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/templates" className="text-white font-bold">Catalog</Link>
            <Link href="/studio" className="hover:text-white">Studio</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function TemplateProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F4EE] flex items-center justify-center font-serif text-sm">Loading Wedding Invitation...</div>}>
      <TemplateProductContent />
    </Suspense>
  );
}
