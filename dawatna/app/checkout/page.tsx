'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Copy,
  Check,
  UploadCloud,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { PackageTier } from '@/lib/types';

function CheckoutContent() {
  const searchParams = useSearchParams();

  const tier: PackageTier =
    (searchParams.get('tier') as PackageTier) || 'royal';
  const amount = tier === 'standard' ? 4999 : 7999;
  const groom = searchParams.get('groom') || 'Hamza Mehmood';
  const bride = searchParams.get('bride') || 'Ayesha Tariq';

  // Bank Copy feedback states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderWhatsapp, setSenderWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate database save & webhook alert
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0507] text-[#FDFBF7] font-sans pb-20">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/60 px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-black tracking-wider text-[#D4AF37]">
            WEDINVITE.PK
          </span>
          <span className="text-xs font-serif text-white/50 border-l border-white/20 pl-2">
            Checkout
          </span>
        </Link>
        <div className="text-xs text-white/70">
          Selected: <strong className="text-[#D4AF37]">{tier === 'standard' ? 'Standard (Rs. 4,999)' : 'Royal (Rs. 7,999)'}</strong>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-10">
        {/* VIP INSTANT TEST ACCESS BANNER */}
        <div className="mb-8 bg-gradient-to-r from-amber-950/60 via-[#D4AF37]/20 to-amber-950/60 border-2 border-[#D4AF37] rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(212,175,55,0.2)] backdrop-blur-md">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] text-black flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              ⚡
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-[#ECD29A] flex items-center gap-2">
                <span>VIP Test Mode Active</span>
                <span className="bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">100% Unlocked</span>
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                Skip bank transfer & receipt upload — test live wedding link, guest allocation, and dashboard instantly.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOrderSubmitted(true);
              if (typeof window !== 'undefined') {
                localStorage.setItem('wedinvite_test_mode', 'true');
                localStorage.setItem('wedinvite_order_status', 'approved');
              }
            }}
            className="w-full sm:w-auto whitespace-nowrap bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-extrabold px-6 py-3 rounded-xl text-xs hover:brightness-110 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Unlock All Access Now</span>
            <span>→</span>
          </button>
        </div>

        {!orderSubmitted ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Manual Bank / Wallet Payment
              </span>
              <h1 className="text-3xl font-serif font-bold text-white">
                Send Payment & Confirm
              </h1>
              <p className="text-xs text-white/60">
                Send <strong className="text-[#D4AF37]">Rs. {amount.toLocaleString()}</strong> from your banking app, upload the receipt screenshot below, and our team confirms on WhatsApp within 30–60 minutes.
              </p>
            </div>

            {/* STEP 1: BANK & WALLET DETAILS */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5">
              <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base border-b border-white/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Send Exactly Rs. {amount.toLocaleString()} to Any Account</span>
              </div>

              {/* 1. MEEZAN BANK */}
              <div className="bg-black/50 border border-white/10 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-white font-bold">
                  <span>Meezan Bank Ltd</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Account Title:</span>
                  <span className="text-white font-medium">WEDINVITE DIGITAL</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Account Number:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[#D4AF37]">
                    <span>01020109923812</span>
                    <button
                      onClick={() => copyToClipboard('01020109923812', 'meezan_acc')}
                      className="p-1 hover:text-white"
                      title="Copy"
                    >
                      {copiedField === 'meezan_acc' ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>IBAN:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[#D4AF37]">
                    <span className="truncate max-w-[200px]">PK86MEZN0001020109923812</span>
                    <button
                      onClick={() => copyToClipboard('PK86MEZN0001020109923812', 'meezan_iban')}
                      className="p-1 hover:text-white"
                      title="Copy"
                    >
                      {copiedField === 'meezan_iban' ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. JAZZCASH */}
              <div className="bg-black/50 border border-white/10 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-white font-bold">
                  <span>JazzCash</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                    Instant Mobile Wallet
                  </span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Account Title:</span>
                  <span className="text-white font-medium">Hafiz M. Ahmad</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>JazzCash Mobile Number:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[#D4AF37]">
                    <span>03014544411</span>
                    <button
                      onClick={() => copyToClipboard('03014544411', 'jazzcash')}
                      className="p-1 hover:text-white"
                      title="Copy"
                    >
                      {copiedField === 'jazzcash' ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. EASYPAISA */}
              <div className="bg-black/50 border border-white/10 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-white font-bold">
                  <span>Easypaisa</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    Instant Mobile Wallet
                  </span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Account Title:</span>
                  <span className="text-white font-medium">Hafiz M. Ahmad</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Easypaisa Mobile Number:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[#D4AF37]">
                    <span>03014544411</span>
                    <button
                      onClick={() => copyToClipboard('03014544411', 'easypaisa')}
                      className="p-1 hover:text-white"
                      title="Copy"
                    >
                      {copiedField === 'easypaisa' ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: UPLOAD RECEIPT FORM */}
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5">
              <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base border-b border-white/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Upload Receipt & Contact Details</span>
              </div>

              {/* Receipt File Dropzone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-semibold">
                  Screenshot of Payment Receipt / رسید کا اسکرین شاٹ
                </label>
                <label className="border-2 border-dashed border-white/20 hover:border-[#D4AF37] bg-black/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                  <UploadCloud className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-semibold text-white">
                    {receiptFile ? receiptFile.name : 'Tap to Pick Screenshot from Gallery'}
                  </span>
                  <span className="text-[10px] text-white/50 mt-1">
                    Accepts PNG, JPG or PDF up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>

                {receiptPreview && (
                  <div className="mt-3 p-2 bg-black/60 border border-white/15 rounded-xl flex items-center gap-3">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-12 h-12 object-cover rounded-lg border border-white/20"
                    />
                    <span className="text-xs text-green-400 font-semibold">
                      ✓ Screenshot Selected
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Inputs */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-white/70 mb-1 font-semibold">
                    Your Full Name / آپ کا نام
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Hamza Mehmood"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-white/70 mb-1 font-semibold">
                    WhatsApp Number (Mandatory)
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderWhatsapp}
                    onChange={(e) => setSenderWhatsapp(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-white/70 mb-1 font-semibold">
                    Choose a Password (8+ characters)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="To access your dashboard"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-white/70 mb-1 font-semibold">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. TID-98214"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !receiptFile}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-extrabold py-4 rounded-xl shadow-xl hover:brightness-110 active:scale-95 transition-all text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading Proof...' : `Confirm & Send Receipt (Rs. ${amount.toLocaleString()})`}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="bg-gradient-to-b from-[#2B0007] to-black border-2 border-[#D4AF37] p-8 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-[#25D366]/20 border border-[#25D366] text-[#25D366] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Order Received · رسید موصول ہو گئی
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Thank You, {senderName}!
              </h2>
              <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                We have received your payment proof for the <strong className="text-white">{tier.toUpperCase()}</strong> package. Our team is verifying your deposit and will confirm on your WhatsApp number (<strong>{senderWhatsapp}</strong>) within 30–60 minutes.
              </p>
            </div>

            {/* Next Steps Box */}
            <div className="bg-black/60 border border-white/10 p-5 rounded-2xl text-left space-y-3 text-xs">
              <div className="font-bold text-[#D4AF37] uppercase tracking-wider">
                What Happens Next:
              </div>
              <div className="flex items-start gap-2.5 text-white/80">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>We verify your deposit in our banking app (usually under 1 hour).</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/80">
                <Send className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span>Your live link is activated, and we message you your live URL on WhatsApp.</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/80">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>You can log in to your dashboard with your WhatsApp number & password anytime.</span>
              </div>
            </div>

            {/* Direct VIP Test Action Links */}
            <div className="bg-[#1C140F] border border-[#D4AF37]/40 p-5 rounded-2xl text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#ECD29A]">Instant VIP Access Links (Unlocked)</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-full uppercase">Active Now</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/w/ahmad-mawra"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-extrabold p-3 rounded-xl text-xs flex items-center justify-between hover:brightness-110 transition-all shadow"
                >
                  <span>1. Live Wedding Card</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-between border border-white/20 transition-all"
                >
                  <span>2. Host Dashboard</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/g/sample-guest"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-between border border-white/20 transition-all"
                >
                  <span>3. Private Guest Link (Headcount)</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/scanner"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-between border border-white/20 transition-all"
                >
                  <span>4. Gatekeeper QR Scanner</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/923014544411?text=${encodeURIComponent(
                  `Hi WedInvite.pk! I just placed an order for the ${tier} package (Rs. ${amount}). My name is ${senderName}. Please verify my receipt!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-transform active:scale-95 text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Fast-Track on WhatsApp</span>
              </a>

              <Link
                href="/dashboard"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center"
              >
                Open Dashboard →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-10">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
