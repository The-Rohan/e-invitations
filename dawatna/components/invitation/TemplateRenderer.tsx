'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  Volume2,
  VolumeX,
  Share2,
  Send,
  Users,
  QrCode,
  Gift,
  Copy,
  Check,
} from 'lucide-react';
import { Wedding, Guest, WeddingEvent } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';
import { InvitationOpeningWrapper } from './InvitationOpeningWrapper';

interface TemplateRendererProps {
  wedding: Wedding;
  currentGuest?: Guest;
  isPreview?: boolean;
}

export function TemplateRenderer({
  wedding,
  currentGuest,
  isPreview = false,
}: TemplateRendererProps) {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedRaast, setCopiedRaast] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'regret' | null>(
    currentGuest?.rsvp_status !== 'pending' ? (currentGuest?.rsvp_status as any) : null
  );
  const [headcount, setHeadcount] = useState(currentGuest?.allocated_seats || 2);
  const [mealChoice, setMealChoice] = useState('Chicken Biryani & Qorma');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Find template definition
  const template =
    TEMPLATES.find((t) => t.id === wedding.theme_id) || TEMPLATES[0];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingMusic]);

  // Countdown Calculation to earliest event
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!wedding.events || wedding.events.length === 0) return;
    const targetDate = new Date(`${wedding.events[0].date}T${wedding.events[0].start_time || '19:00'}`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [wedding]);

  const copyRaast = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRaast(true);
    setTimeout(() => setCopiedRaast(false), 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  // Filter events if currentGuest is event-gated
  const visibleEvents =
    currentGuest && currentGuest.allowed_event_ids && currentGuest.allowed_event_ids.length > 0
      ? wedding.events.filter((ev) => currentGuest.allowed_event_ids.includes(ev.id))
      : wedding.events;

  return (
    <InvitationOpeningWrapper
      openingType={wedding.opening_type || template.openingType}
      themeTitle={template.name}
      coupleNames={`${wedding.groom_name} & ${wedding.bride_name}`}
      onOpenComplete={() => setIsPlayingMusic(true)}
    >
      <div
        className="min-h-screen text-[#FDFBF7] relative pb-24 overflow-x-hidden font-sans"
        style={{
          backgroundColor: template.palette.background,
          color: template.palette.text,
        }}
      >
        <audio
          ref={audioRef}
          src={wedding.music_url || template.audioTrack || '/music/mu08ueox-229c3cea.mp3'}
          loop
          preload="auto"
        />
        {/* Floating Language & Audio Bar */}
        <div className="fixed top-4 inset-x-0 z-40 flex justify-between items-center px-4 max-w-md mx-auto pointer-events-none">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage((l) => (l === 'en' ? 'ur' : 'en'))}
            className="pointer-events-auto bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg hover:bg-black/80 transition-all flex items-center gap-1.5"
          >
            <span>{language === 'en' ? 'اردو میں دیکھیں' : 'View in English'}</span>
          </button>

          {/* Audio Floating Disc */}
          <button
            onClick={() => setIsPlayingMusic((m) => !m)}
            className="pointer-events-auto bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
            title={isPlayingMusic ? 'Mute Music' : 'Play Music'}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* PREVIEW WATERMARK IF NOT PAID */}
        {isPreview && (
          <div className="bg-[#D4AF37] text-black text-center text-xs py-1.5 font-bold tracking-widest uppercase sticky top-0 z-50 shadow-md">
            ⭐ Preview Mode · پیش نظارہ
          </div>
        )}

        <div className="max-w-md mx-auto px-5 pt-14 space-y-12">
          {/* PERSONALIZED GUEST BADGE */}
          {currentGuest && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-[#D4AF37]/20 border border-[#D4AF37]/40 p-4 rounded-2xl text-center backdrop-blur-md shadow-xl"
            >
              <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                {language === 'en' ? 'Warmly Welcoming' : 'خوش آمدید'}
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                {currentGuest.guest_name}
              </h3>
              <div className="inline-flex items-center gap-1.5 mt-2 bg-black/40 px-3 py-1 rounded-full text-xs text-[#D4AF37] border border-[#D4AF37]/30">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {currentGuest.allocated_seats}{' '}
                  {language === 'en' ? 'Seats Reserved in Your Honor' : 'نشستیں مختص ہیں'}
                </span>
              </div>
            </motion.div>
          )}

          {/* HERO SECTION */}
          <section className="text-center space-y-4 pt-2">
            {/* Islamic Calligraphy */}
            <div className="text-2xl sm:text-3xl font-serif text-[#D4AF37] drop-shadow-md select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <p className="text-xs tracking-widest uppercase text-[#D4AF37]/80 font-serif">
              {language === 'en'
                ? 'Under the blessings of Allah Almighty'
                : 'اللہ تعالیٰ کے فضل و کرم سے'}
            </p>

            {/* Couple Names */}
            <div className="py-6 space-y-3 relative">
              <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 to-transparent blur-2xl pointer-events-none" />

              <h1 className="text-4xl sm:text-5xl font-serif tracking-wide text-white drop-shadow-lg">
                {language === 'ur' && wedding.groom_name_ur ? wedding.groom_name_ur : wedding.groom_name}
              </h1>

              <div className="flex items-center justify-center gap-3 text-[#D4AF37]">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <Heart className="w-4 h-4 fill-[#D4AF37]" />
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-serif tracking-wide text-white drop-shadow-lg">
                {language === 'ur' && wedding.bride_name_ur ? wedding.bride_name_ur : wedding.bride_name}
              </h1>
            </div>

            {/* Families */}
            {(wedding.groom_family || wedding.bride_family) && (
              <div className="text-xs text-white/70 space-y-1 font-serif pt-1">
                {wedding.groom_family && <p>{wedding.groom_family}</p>}
                {wedding.bride_family && <p>{wedding.bride_family}</p>}
              </div>
            )}

            {/* Quranic Verse */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-white/80 italic font-serif leading-relaxed">
              {language === 'en'
                ? '“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.” — (30:21)'
                : '”اور اس کی نشانیوں میں سے ہے کہ اس نے تمہارے لیے تمہاری ہی جنس سے جوڑے بنائے تاکہ تم ان سے سکون حاصل کرو اور تمہارے درمیان محبت اور ہمدردی پیدا کر دی۔“ (الروم: ۲۱)'}
            </div>
          </section>

          {/* COUNTDOWN TIMER */}
          <section className="bg-gradient-to-b from-white/10 to-white/5 border border-[#D4AF37]/30 p-5 rounded-2xl text-center backdrop-blur-md shadow-2xl">
            <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3">
              {language === 'en' ? 'Counting Down to the Big Day' : 'شادی کا کاؤنٹ ڈاؤن'}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: timeLeft.days, labelEn: 'Days', labelUr: 'دن' },
                { val: timeLeft.hours, labelEn: 'Hours', labelUr: 'گھنٹے' },
                { val: timeLeft.minutes, labelEn: 'Mins', labelUr: 'منٹ' },
                { val: timeLeft.seconds, labelEn: 'Secs', labelUr: 'سیکنڈ' },
              ].map((item, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-2.5 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF37]">
                    {item.val}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60 mt-0.5">
                    {language === 'en' ? item.labelEn : item.labelUr}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EVENTS ITINERARY */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif text-[#D4AF37] tracking-wider">
                {language === 'en' ? 'Wedding Functions' : 'تقاریب کے شیڈول'}
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
            </div>

            <div className="space-y-5">
              {visibleEvents.map((ev, index) => (
                <motion.div
                  key={ev.id || index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white/10 via-white/5 to-black/30 border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#D4AF37] text-black">
                        {ev.event_type.toUpperCase()}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white mt-2">
                        {language === 'ur' && ev.event_title_ur ? ev.event_title_ur : ev.event_title_en}
                      </h3>
                    </div>
                    {ev.dress_code && (
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/80 border border-white/15">
                        {ev.dress_code}
                      </span>
                    )}
                  </div>

                  {/* Timing & Date */}
                  <div className="space-y-2 text-sm text-white/80 py-2 border-y border-white/10 my-3">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <span>{ev.date} {ev.hijri_date ? `(${ev.hijri_date})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>{ev.start_time} {ev.end_time ? `to ${ev.end_time}` : ''}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">{ev.venue_name}</div>
                        <div className="text-xs text-white/60">{ev.venue_address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Maps & Calendar */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={ev.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(ev.venue_name + ' ' + ev.venue_address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-bold text-xs py-2.5 px-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{language === 'en' ? 'Google Maps' : 'راستہ دیکھیں'}</span>
                    </a>

                    <a
                      href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(ev.event_title_en)}%0ADESCRIPTION:${encodeURIComponent('Wedding Celebration')}%0ALOCATION:${encodeURIComponent(ev.venue_name)}%0AEND:VEVENT%0AEND:VCALENDAR`}
                      download={`${ev.event_type}.ics`}
                      className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs py-2.5 px-3 rounded-xl transition-all active:scale-95"
                    >
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <span>{language === 'en' ? 'Add to Calendar' : 'کیلنڈر'}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* RSVP SECTION */}
          <section className="bg-gradient-to-br from-black/80 to-[#180004] border border-[#D4AF37]/50 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
            <div className="text-center space-y-1 mb-5">
              <h2 className="text-2xl font-serif text-[#D4AF37] tracking-wide">
                {language === 'en' ? 'Will You Grace Us?' : 'کیا آپ تشریف لائیں گے؟'}
              </h2>
              <p className="text-xs text-white/60">
                {language === 'en'
                  ? 'Kindly confirm your presence before the date'
                  : 'براہ کرم بروقت اطلاع دیں تاکہ انتظامات مکمل کیے جا سکیں'}
              </p>
            </div>

            {wedding.package_tier === 'standard' ? (
              /* Tier 1: 1-Tap WhatsApp RSVP Button */
              <div className="text-center space-y-3">
                <a
                  href={`https://wa.me/923001234567?text=${encodeURIComponent(
                    `Assalam-o-Alaikum! We received your wedding invitation for ${wedding.groom_name} & ${wedding.bride_name}. InshaAllah we will attend! Name: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'en' ? 'RSVP on WhatsApp' : 'واٹس ایپ پر مطلع کریں'}</span>
                </a>
              </div>
            ) : (
              /* Tier 2: Interactive Web RSVP Form */
              <div>
                {rsvpSubmitted ? (
                  <div className="bg-[#25D366]/20 border border-[#25D366]/40 p-4 rounded-xl text-center text-sm text-[#25D366]">
                    ✓ {language === 'en' ? 'Thank you! Your response has been noted.' : 'شکریہ! آپ کا جواب موصول ہو چکا ہے۔'}
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('attending')}
                        className={`py-3 rounded-xl font-bold border transition-all ${
                          rsvpStatus === 'attending'
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-white/5 border-white/10 text-white'
                        }`}
                      >
                        ✓ {language === 'en' ? 'Will Attend' : 'ضرور آئیں گے'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('regret')}
                        className={`py-3 rounded-xl font-bold border transition-all ${
                          rsvpStatus === 'regret'
                            ? 'bg-red-900/60 text-white border-red-500'
                            : 'bg-white/5 border-white/10 text-white'
                        }`}
                      >
                        ✕ {language === 'en' ? 'Regret / Cannot' : 'معذرت'}
                      </button>
                    </div>

                    {rsvpStatus === 'attending' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-white/70 mb-1">
                            {language === 'en' ? 'How many guests are attending?' : 'کتنے افراد شریک ہوں گے؟'}
                          </label>
                          <select
                            value={headcount}
                            onChange={(e) => setHeadcount(Number(e.target.value))}
                            className="w-full bg-black/60 border border-white/20 rounded-xl p-2.5 text-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? 'Person / فرد' : 'People / افراد'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-white/70 mb-1">
                            {language === 'en' ? 'Meal Preference (Optional)' : 'کھانے کی ترجیح'}
                          </label>
                          <select
                            value={mealChoice}
                            onChange={(e) => setMealChoice(e.target.value)}
                            className="w-full bg-black/60 border border-white/20 rounded-xl p-2.5 text-white"
                          >
                            <option value="Chicken Biryani & Qorma">Chicken Menu / چکن مینو</option>
                            <option value="Mutton & BBQ">Mutton / مٹن</option>
                            <option value="Vegetarian">Vegetarian / سبزی</option>
                            <option value="Diabetic / Low Spice">Diabetic & Light / کم مصالحہ</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!rsvpStatus}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-bold py-3 rounded-xl disabled:opacity-50 shadow-lg text-sm mt-2"
                    >
                      {language === 'en' ? 'Submit RSVP / تصدیق کریں' : 'جواب بھیجیں'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>

          {/* DIGITAL SALAMI / BLESSINGS TRAY (TIER 2) */}
          {wedding.package_tier === 'royal' && (wedding.raast_id || wedding.iban) && (
            <section className="bg-gradient-to-r from-[#D4AF37]/15 via-white/5 to-[#D4AF37]/15 border border-[#D4AF37]/40 p-5 rounded-2xl text-center backdrop-blur-md space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#D4AF37]">
                <Gift className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-white">
                  {language === 'en' ? 'Salami & Duas' : 'سلامی اور نیک تمنائیں'}
                </h3>
              </div>
              <p className="text-xs text-white/70">
                {language === 'en'
                  ? 'For loving family & friends sending their blessings from afar'
                  : 'دور دراز سے نیک دعائیں اور تحائف بھیجنے والے عزیزوں کے لیے'}
              </p>

              <div className="bg-black/50 p-3 rounded-xl border border-white/10 space-y-2 text-xs">
                {wedding.raast_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Raast ID (Mobile):</span>
                    <div className="flex items-center gap-1.5 font-mono text-[#D4AF37]">
                      <span>{wedding.raast_id}</span>
                      <button onClick={() => copyRaast(wedding.raast_id!)} className="p-1">
                        {copiedRaast ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
                {wedding.iban && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">IBAN:</span>
                    <div className="flex items-center gap-1.5 font-mono text-[#D4AF37]">
                      <span className="truncate max-w-[180px]">{wedding.iban}</span>
                      <button onClick={() => copyRaast(wedding.iban!)} className="p-1">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* BANQUET ENTRY PASS QR CODE (TIER 2 PRIVATE GUEST) */}
          {wedding.package_tier === 'royal' && currentGuest && (
            <section className="bg-black/40 border border-white/15 p-5 rounded-2xl text-center space-y-3 backdrop-blur-md">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                <QrCode className="w-4 h-4" />
                <span>{language === 'en' ? 'Banquet Hall Entry Pass' : 'ہال انٹری پاس'}</span>
              </div>
              <div className="w-36 h-36 bg-white p-2.5 rounded-xl mx-auto shadow-2xl flex items-center justify-center">
                {/* Simulated QR Code Graphic */}
                <div className="w-full h-full border-2 border-black border-dashed flex flex-col items-center justify-center text-black">
                  <QrCode className="w-20 h-20" />
                  <span className="text-[8px] font-mono font-bold mt-1">PASS: {currentGuest.guest_token}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/50">
                {language === 'en'
                  ? 'Show this digital pass at the reception desk for seamless entrance'
                  : 'ہال میں داخلے کے وقت یہ ڈیجیٹل پاس گیٹ کیپر کو دکھائیں'}
              </p>
            </section>
          )}

          {/* FOOTER */}
          <footer className="text-center pt-8 text-[11px] text-white/40 space-y-2">
            <p>
              {wedding.groom_name} & {wedding.bride_name} · Wedding Celebrations
            </p>
            <p>Created with WedInvite.pk · Digital Invitations for Pakistan</p>
          </footer>
        </div>
      </div>
    </InvitationOpeningWrapper>
  );
}
