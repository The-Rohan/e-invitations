'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  Send,
  Eye,
  Clock,
  DollarSign,
  Users,
  Search,
} from 'lucide-react';
import { INITIAL_ORDERS, SAMPLE_WEDDING } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const handleApprove = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'verified' as OrderStatus } : o))
    );
  };

  const handleReject = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'rejected' as OrderStatus } : o))
    );
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const totalRevenue = orders
    .filter((o) => o.status === 'verified')
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending_verification').length;

  return (
    <div className="min-h-screen bg-[#070406] text-[#FDFBF7] font-sans pb-20">
      {/* Top Admin Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-serif font-black tracking-wider text-[#D4AF37]">
            WEDINVITE.PK
          </Link>
          <span className="text-xs bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-mono font-bold">
            ADMIN PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link href="/dashboard" className="text-white/70 hover:text-white">
            Client Dashboard Demo →
          </Link>
          <Link href="/w/hamza-ayesha" target="_blank" className="text-[#D4AF37] hover:underline">
            View Live Wedding Demo ↗
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Verified Revenue (PKR)
            </div>
            <div className="text-3xl font-serif font-bold text-[#D4AF37]">
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-green-400 mt-1">✓ Bank & Wallet Verified</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Pending Manual Verifications
            </div>
            <div className="text-3xl font-serif font-bold text-amber-400">
              {pendingCount}
            </div>
            <div className="text-[10px] text-white/50 mt-1">Requires WhatsApp verification</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Total Order Inquiries
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              {orders.length}
            </div>
            <div className="text-[10px] text-white/50 mt-1">Active shadi cards</div>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">
                Customer Receipts & Manual Activations
              </h2>
              <p className="text-xs text-white/60">
                Inspect customer bank screenshots, verify deposit in your app, and 1-click activate.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
              {['all', 'pending_verification', 'verified', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    filter === st
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-white/60 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & WhatsApp</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Receipt Proof</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 px-4 font-mono">
                      <div className="font-bold text-white">{order.id}</div>
                      <div className="text-[10px] text-white/50">{order.created_at}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{order.sender_name}</div>
                      <div className="text-white/60 font-mono">{order.sender_whatsapp}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          order.package_tier === 'royal'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {order.package_tier}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-white font-mono">
                      Rs. {order.amount.toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
                      {order.receipt_image_url ? (
                        <button
                          onClick={() => setSelectedReceipt(order.receipt_image_url!)}
                          className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Screenshot</span>
                        </button>
                      ) : (
                        <span className="text-white/40">No Image</span>
                      )}
                      {order.transaction_id && (
                        <div className="text-[10px] text-white/50 font-mono mt-0.5">
                          TID: {order.transaction_id}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.status === 'verified'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : order.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      {order.status === 'pending_verification' && (
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Activate</span>
                        </button>
                      )}

                      {/* WhatsApp Fast-Message Button */}
                      <a
                        href={`https://wa.me/${order.sender_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Assalam-o-Alaikum ${order.sender_name}! Humey aapki Rs. ${order.amount.toLocaleString()} ki payment receive ho gayi hai. Aapka ${order.package_tier.toUpperCase()} wedding invitation live ho chuka hai! Aapka card link: https://wedinvite.pk/w/${SAMPLE_WEDDING.slug}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md inline-flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>WhatsApp Client</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Lightbox for Receipt Screenshot */}
      {selectedReceipt && (
        <div
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="relative max-w-lg w-full bg-[#18181B] p-4 rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-[#D4AF37]">
                Payment Receipt Proof Screenshot
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-white/60 hover:text-white text-xs bg-white/10 px-2.5 py-1 rounded-full"
              >
                Close ✕
              </button>
            </div>
            <img
              src={selectedReceipt}
              alt="Payment proof"
              className="w-full max-h-[500px] object-contain rounded-xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
