'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Play,
  Volume2,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  MessageCircle,
  Smartphone,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { TemplateDefinition } from '@/lib/types';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const filterTabs = [
    { id: 'all', label: `All Collections (${TEMPLATES.length})` },
    { id: 'cinematic', label: 'Cinematic Drapes (21)', count: TEMPLATES.filter((t) => t.brand === 'cinematic' || t.openingType === 'curtain').length },
    { id: 'atelier', label: 'Atelier Tactile & Royal (24)', count: TEMPLATES.filter((t) => t.brand === 'atelier' || t.category === 'Atelier' || t.openingType === 'diya' || t.openingType === 'door_knock' || t.openingType === 'scroll').length },
    { id: 'barat', label: 'Baraat & Nikah', count: TEMPLATES.filter((t) => t.tags.includes('luxury') || t.tags.includes('royal') || t.category === 'Royal').length },
    { id: 'mehndi', label: 'Mehndi & Mayun', count: TEMPLATES.filter((t) => t.tags.includes('floral') || t.tags.includes('celebration') || t.tags.includes('mehndi')).length },
    { id: 'walima', label: 'Walima Reception', count: TEMPLATES.filter((t) => t.tags.includes('classic') || t.tags.includes('signature')).length },
    { id: 'embroidery', label: 'Hand Embroidery', count: TEMPLATES.filter((t) => t.category === 'Embroidery' || t.tags.includes('embroidery')).length },
    { id: 'heritage', label: 'Heritage & Haveli', count: TEMPLATES.filter((t) => t.category === 'Heritage' || t.tags.includes('heritage') || t.category === 'Atelier').length },
    { id: 'islamic', label: 'Islamic Spiritual', count: TEMPLATES.filter((t) => t.tags.includes('islamic') || t.category === 'Islamic').length },
    { id: 'birthday', label: 'Birthdays & Parties', count: TEMPLATES.filter((t) => t.tags.includes('birthday') || t.category === 'Birthday').length },
  ];

  const filteredAndSortedTemplates = useMemo(() => {
    let list = TEMPLATES.filter((t) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchUrdu = t.nameUrdu.includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchAes = t.aesthetic.toLowerCase().includes(q);
        const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchName && !matchUrdu && !matchDesc && !matchAes && !matchTags) {
          return false;
        }
      }

      // 2. Tab Filter
      if (activeFilter === 'all') return true;
      if (activeFilter === 'cinematic') return t.brand === 'cinematic' || t.openingType === 'curtain';
      if (activeFilter === 'atelier') return t.brand === 'atelier' || t.category === 'Atelier' || t.openingType === 'diya' || t.openingType === 'door_knock' || t.openingType === 'scroll';
      if (activeFilter === 'barat') return t.tags.includes('luxury') || t.tags.includes('royal') || t.category === 'Royal';
      if (activeFilter === 'mehndi') return t.tags.includes('floral') || t.tags.includes('celebration') || t.tags.includes('mehndi');
      if (activeFilter === 'walima') return t.tags.includes('classic') || t.tags.includes('signature');
      if (activeFilter === 'embroidery') return t.category === 'Embroidery' || t.tags.includes('embroidery');
      if (activeFilter === 'heritage') return t.category === 'Heritage' || t.tags.includes('heritage') || t.category === 'Atelier';
      if (activeFilter === 'islamic') return t.tags.includes('islamic') || t.category === 'Islamic';
      if (activeFilter === 'birthday') return t.tags.includes('birthday') || t.category === 'Birthday';
      return true;
    });

    // 3. Sorting
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [searchQuery, activeFilter, sortBy]);

  const getGestureLabel = (t: TemplateDefinition) => {
    switch (t.openingType) {
      case 'curtain':
        return 'Royal Velvet Drapes';
      case 'diya':
        return 'Press & Hold Diya';
      case 'door_knock':
        return 'Knock Haveli Gates';
      case 'wax_seal':
        return 'Break Royal Wax Seal';
      case 'scroll':
        return 'Unroll Farmaan Scroll';
      case 'lantern':
        return 'Swing Brass Lantern';
      case 'water_ripple':
        return 'Touch Starlit Lotus Pool';
      case 'origami':
        return '3D Layered Cut Paper';
      case 'ribbon':
        return 'Untie Satin Ribbon';
      default:
        return 'Interactive 3D Opening';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F4EE] text-[#2B211D] font-sans selection:bg-[#CFA954] selection:text-[#2B211D]">
      {/* ---------------- 1. TOP NAVBAR ---------------- */}
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
            <Link href="/" className="hover:text-[#ECD29A] transition-colors">
              Home
            </Link>
            <Link href="/templates" className="text-[#ECD29A] font-bold transition-colors">
              All Templates ({TEMPLATES.length})
            </Link>
            <Link href="/studio" className="hover:text-[#ECD29A] transition-colors">
              Studio Customizer
            </Link>
            <Link href="/#pricing" className="hover:text-[#ECD29A] transition-colors">
              Pricing
            </Link>
            <Link href="/#why" className="hover:text-[#ECD29A] transition-colors">
              Why Us
            </Link>
            <Link href="/#faqs" className="hover:text-[#ECD29A] transition-colors">
              FAQ’s
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-wider text-white/70 hover:text-white px-2 py-1"
            >
              Host Login
            </Link>
            <Link
              href="/studio"
              className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] px-4 py-2 text-xs font-bold uppercase tracking-wider shadow"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- 2. CATALOG HERO HEADER ---------------- */}
      <section className="bg-gradient-to-b from-[#2E231F] via-[#3B2D26] to-[#2E231F] text-white pt-16 pb-12 px-4 sm:px-6 border-b border-[#CFA954]/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CFA954_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFA954]/20 border border-[#CFA954]/40 text-[#ECD29A] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#CFA954]" />
            <span>Complete Pakistani E-Invitation Catalog</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight mb-3">
            The Master Invitation Collection
          </h1>
          <p className="font-urdu text-xl sm:text-2xl text-[#ECD29A] mb-4">
            تمام شاہی و روایتی دعوت نامے
          </p>

          <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed mb-8 font-serif">
            Browse 45 bespoke Pakistani digital wedding invitations. From theatrical velvety red curtains
            to tactile brass diyas and hand-embroidered Kashmiri linen. Every template is complete with
            1-tap Google Maps, shehnai audio, and private guest headcount RSVP.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-white/50 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, aesthetic, color, or event (e.g. Mehru, Diya, Velvet, Chinar, Green)..."
                className="w-full bg-[#1F1714] border border-[#CFA954]/40 rounded-full pl-12 pr-28 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#CFA954] focus:ring-2 focus:ring-[#CFA954]/30 shadow-2xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs text-white/60 hover:text-white bg-white/10 px-2.5 py-1 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. FILTER TABS & SORT CONTROLS ---------------- */}
      <section className="sticky top-16 z-40 bg-[#F9F4EE]/95 backdrop-blur-md border-b border-[#E6DCCF] py-3.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Scrollable Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeFilter === tab.id
                    ? 'bg-[#2B211D] text-white shadow-md'
                    : 'bg-[#FFFDFA] text-[#6E625B] hover:text-[#2B211D] border border-[#E6DCCF]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-xs text-[#6E625B] font-medium">
              Showing <strong className="text-[#2B211D]">{filteredAndSortedTemplates.length}</strong> designs
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-[#FFFDFA] border border-[#E6DCCF] rounded-full px-4 py-1.5 pr-8 text-xs font-medium text-[#2B211D] focus:outline-none focus:border-[#CFA954] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E625B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. TEMPLATES MASTER GRID ---------------- */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {filteredAndSortedTemplates.length === 0 ? (
          <div className="bg-[#FFFDFA] rounded-2xl border border-[#E6DCCF] p-16 text-center max-w-lg mx-auto">
            <Search className="w-10 h-10 text-[#CFA954] mx-auto mb-4" />
            <h3 className="font-serif-luxury text-2xl text-[#2B211D] mb-2">No Matching Designs Found</h3>
            <p className="text-xs text-[#6E625B] mb-6 leading-relaxed">
              We couldn't find any designs matching &ldquo;{searchQuery}&rdquo;. Try clearing your search query or selecting another collection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="wedinvite-btn bg-[#2B211D] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedTemplates.map((template) => {
              const isAtelier = template.brand === 'atelier';
              const gestureLabel = getGestureLabel(template);

              return (
                <div
                  key={template.id}
                  className="group bg-[#FFFDFA] rounded-2xl overflow-hidden border border-[#E6DCCF] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Artwork Area - Fixed Proportions with ZERO Cropping */}
                  <div className="relative aspect-[4/5] bg-gradient-to-b from-[#251B17] via-[#2F231D] to-[#1E1512] overflow-hidden flex items-center justify-center p-6">
                    {/* Background subtle radial glow matching palette */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${template.palette.accent} 0%, transparent 70%)`,
                      }}
                    />

                    {/* SMART FEATURED IMAGE: Complete Display for both Square Artwork & Tall Phone Mockups */}
                    {isAtelier ? (
                      /* Atelier Square Artwork: Rendered 100% Complete in a luxury framed art matte */
                      <div className="relative w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 p-1.5 bg-[#1C140F] group-hover:scale-105 transition-transform duration-500">
                        <img
                          src={template.phoneMockup || `/atelier/thumbs/thumb-${template.id}-480.webp`}
                          alt={template.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    ) : (
                      /* Cinematic Phone Mockup: Rendered 100% Complete with unclipped top speaker and bottom bezel */
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
                      {isAtelier ? (
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
                    </div>

                    {/* Opening Gesture Pill on bottom */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-[#ECD29A] text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full border border-white/15">
                        <Sparkles className="w-3 h-3 text-[#CFA954]" />
                        <span>{gestureLabel}</span>
                      </span>
                    </div>

                    {/* Audio Indicator */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <span className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md text-white/90 flex items-center justify-center text-xs shadow border border-white/10">
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

                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#CFA954] mb-2 flex items-center gap-1.5">
                        <span>{template.aesthetic}</span>
                      </div>

                      <p className="text-xs text-[#6E625B] line-clamp-2 mb-4 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Pricing & 3 Action CTAs */}
                    <div className="pt-4 border-t border-[#E6DCCF]">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif-luxury font-bold text-xl text-[#2B211D]">
                            Rs. {template.price?.toLocaleString()}
                          </span>
                          <span className="text-xs text-[#A99D94] line-through">
                            Rs. {template.originalPrice?.toLocaleString()}
                          </span>
                        </div>

                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Save Rs. {((template.originalPrice || 0) - (template.price || 0)).toLocaleString()}
                        </span>
                      </div>

                      {/* 3 CTAs: Details (Product Page) | Preview (Phone Frame) | Customize */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Link
                          href={`/templates/${template.id}`}
                          className="wedinvite-btn bg-[#2B211D] hover:bg-[#43362F] text-white py-2 px-2.5 text-xs font-semibold uppercase tracking-wider justify-center shadow text-center"
                        >
                          View Details
                        </Link>

                        <Link
                          href={`/preview/${template.id}`}
                          className="wedinvite-btn bg-[#CFA954] hover:bg-[#ECD29A] text-[#2B211D] py-2 px-2.5 text-xs font-bold uppercase tracking-wider justify-center shadow text-center"
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
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------- 5. CUSTOM BESPOKE BANNER ---------------- */}
      <section className="py-16 px-4 sm:px-6 bg-[#2B211D] text-white border-t border-[#43362F]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#CFA954] px-3 py-1 rounded-full bg-[#CFA954]/10 border border-[#CFA954]/30 inline-block mb-3">
            Bespoke Atelier Commission
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-normal mb-4">
            Want a 100% Unique Design Drawn for Your Wedding Alone?
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto leading-relaxed mb-6 font-serif">
            For prominent families and grand celebrations, our studio creates custom venue paintings,
            monograms, and bespoke animated entrance sequences. Chat directly with our creative director in Lahore & Karachi.
          </p>

          <a
            href="https://wa.me/923014544411?text=Salam!%20I%20am%20interested%20in%20a%20bespoke%20custom%20commission%20on%20WedInvite.pk."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-black font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider hover:bg-[#1EBE5D] transition-transform shadow-xl"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consult on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* ---------------- 6. FOOTER ---------------- */}
      <footer className="bg-[#211916] text-[#A69A93] text-xs pt-12 pb-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
          <p>© 2026 WedInvite.pk. All rights reserved. Pakistan's Luxury Digital Wedding Invitation Platform.</p>
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
