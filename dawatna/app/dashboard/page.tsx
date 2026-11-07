'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Copy,
  Check,
  Download,
  Send,
  Plus,
  QrCode,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Gift,
  FileSpreadsheet,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { SAMPLE_WEDDING } from '@/lib/store';
import { Guest, GuestWish } from '@/lib/types';

export default function DashboardPage() {
  const [wedding, setWedding] = useState(SAMPLE_WEDDING);
  const [guests, setGuests] = useState<Guest[]>(SAMPLE_WEDDING.guests || []);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New Guest Form State
  const [newGuestName, setNewGuestName] = useState('');
  const [newSeats, setNewSeats] = useState(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['ev-1', 'ev-2', 'ev-3']);

  // Wishes state
  const [wishes, setWishes] = useState<GuestWish[]>([
    {
      id: 'w-1',
      wedding_id: 'w-001',
      guest_name: 'Chacha Tariq',
      message: 'MashaAllah! May Allah bless both of you with eternal happiness and barakah in your marriage.',
      is_approved: true,
      created_at: '2 hours ago',
    },
    {
      id: 'w-2',
      wedding_id: 'w-001',
      guest_name: 'Zainab & Family',
      message: 'Heartiest congratulations to Hamza & Ayesha! Can’t wait for the Barat night!',
      is_approved: true,
      created_at: 'Yesterday',
    },
  ]);

  const copyGuestInvite = (guest: Guest) => {
    const inviteUrl = `${window.location.origin}/g/${guest.guest_token}`;
    const text = `Assalam-o-Alaikum ${guest.guest_name}!\n\nYou are cordially invited to the wedding celebrations of ${wedding.groom_name} & ${wedding.bride_name}.\n\n✨ We have reserved ${guest.allocated_seats} seats in your honor.\n\nPlease view your personalized invitation with venue Google Maps & timings here:\n${inviteUrl}\n\nLooking forward to celebrating with you!`;
    navigator.clipboard.writeText(text);
    setCopiedToken(guest.guest_token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const slug = newGuestName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const token = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      wedding_id: wedding.id,
      guest_token: token,
      guest_name: newGuestName,
      allocated_seats: newSeats,
      allowed_event_ids: selectedEvents,
      rsvp_status: 'pending',
      gate_qr_hash: `QR_${token}`,
    };

    setGuests((prev) => [newGuest, ...prev]);
    setNewGuestName('');
    setNewSeats(2);
  };

  const exportCSV = () => {
    const headers = ['Guest Name', 'Allocated Seats', 'RSVP Status', 'Headcount', 'Meal Preference', 'Private Link'];
    const rows = guests.map((g) => [
      `"${g.guest_name}"`,
      g.allocated_seats,
      g.rsvp_status,
      g.attended_headcount || 0,
      `"${g.meal_choice || 'Standard'}"`,
      `${window.location.origin}/g/${g.guest_token}`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${wedding.slug}_guest_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RSVP metrics
  const confirmedAttendees = guests
    .filter((g) => g.rsvp_status === 'attending')
    .reduce((sum, g) => sum + (g.attended_headcount || g.allocated_seats), 0);

  const pendingCount = guests.filter((g) => g.rsvp_status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#070406] text-[#FDFBF7] font-sans pb-24">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-serif font-black tracking-wider text-[#D4AF37]">
            WEDINVITE.PK
          </Link>
          <span className="text-xs bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-bold">
            HOST DASHBOARD
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href={`/w/${wedding.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold px-3.5 py-1.5 rounded-full shadow-md transition-all"
          >
            <span>Open Live Card</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-10">
        {/* Welcome Hero */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              Wedding Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {wedding.groom_name} & {wedding.bride_name}
            </h1>
            <p className="text-xs text-white/60 mt-0.5">
              General Link: <strong className="text-white">wedinvite.pk/w/{wedding.slug}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
              <span>Export Caterer CSV</span>
            </button>
            <Link
              href="/scanner"
              className="bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Gate Scanner</span>
            </Link>
          </div>
        </div>

        {/* 1. RSVP SUMMARY STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">
              Confirmed Guests
            </div>
            <div className="text-3xl font-bold font-mono text-green-400 mt-1">
              {confirmedAttendees}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">Attending banquet</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">
              Pending Replies
            </div>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-1">
              {pendingCount}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">Awaiting confirmation</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">
              Meal: Chicken Menu
            </div>
            <div className="text-3xl font-bold font-mono text-[#D4AF37] mt-1">
              {Math.max(0, confirmedAttendees - 2)}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">Biryani & Qorma</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">
              Meal: Mutton / Special
            </div>
            <div className="text-3xl font-bold font-mono text-white mt-1">
              {confirmedAttendees > 0 ? 2 : 0}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">Mutton & BBQ</div>
          </div>
        </div>

        {/* 2. ADD NEW GUEST FORM & PRIVATE LINKS TABLE */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">
                Guest Management & Private Links
              </h2>
              <p className="text-xs text-white/60">
                Every guest gets a dedicated private link greeting them by name with their allocated seats.
              </p>
            </div>
          </div>

          {/* Quick Add Guest Form */}
          <form onSubmit={handleAddGuest} className="bg-black/40 border border-white/10 p-4 rounded-2xl grid sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5">
              <label className="block text-[10px] uppercase text-white/60 mb-1 font-semibold">
                Guest / Family Name
              </label>
              <input
                type="text"
                required
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="e.g. Uncle Salman & Family"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase text-white/60 mb-1 font-semibold">
                Reserved Seats
              </label>
              <select
                value={newSeats}
                onChange={(e) => setNewSeats(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n} className="bg-black text-white">
                    {n} Seats
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] uppercase text-white/60 mb-1 font-semibold">
                Allowed Functions
              </label>
              <div className="text-[11px] text-white/70 py-2">
                All 3 Functions (Mehndi, Barat, Walima)
              </div>
            </div>

            <div className="sm:col-span-2 sm:pt-4">
              <button
                type="submit"
                className="w-full bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guest</span>
              </button>
            </div>
          </form>

          {/* Guests Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/50 text-white/60 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Guest / Family</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Allowed Events</th>
                  <th className="py-3 px-4">RSVP Status</th>
                  <th className="py-3 px-4 text-right">Personalized Invite Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {g.guest_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                        {g.allocated_seats} Seats
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-white/70">
                      {g.allowed_event_ids.length === 3 ? 'All Functions' : 'Walima Only'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          g.rsvp_status === 'attending'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : g.rsvp_status === 'regret'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {g.rsvp_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/g/${g.guest_token}`}
                        target="_blank"
                        className="text-white/60 hover:text-white text-xs inline-flex items-center gap-1 p-1"
                        title="View card as this guest"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>

                      <button
                        onClick={() => copyGuestInvite(g)}
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                      >
                        {copiedToken === g.guest_token ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy WhatsApp Invite</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. DOWNLOAD MEDIA ASSETS */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                WhatsApp Deliverable 1
              </span>
              <h3 className="text-lg font-serif font-bold text-white">
                Vertical 9:16 Status Video (MP4)
              </h3>
              <p className="text-xs text-white/70">
                15-second animated teaser video with Shehnai music formatted for your WhatsApp Status and Instagram Reels.
              </p>
            </div>
            <button
              onClick={() => alert('Downloading your vertical status video (1080x1920 MP4)...')}
              className="mt-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 rounded-xl border border-white/20 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>Download WhatsApp Status Video (MP4)</span>
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                WhatsApp Deliverable 2
              </span>
              <h3 className="text-lg font-serif font-bold text-white">
                High-Resolution Static Flyer (PNG)
              </h3>
              <p className="text-xs text-white/70">
                Crystal-clear digital card for printing or direct photo messaging.
              </p>
            </div>
            <button
              onClick={() => alert('Downloading your high-resolution invitation flyer (PNG)...')}
              className="mt-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 rounded-xl border border-white/20 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>Download Digital Flyer (PNG)</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
