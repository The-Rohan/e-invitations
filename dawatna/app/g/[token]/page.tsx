'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SAMPLE_WEDDING } from '@/lib/store';
import { Guest } from '@/lib/types';

function GuestInviteContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = (params?.token as string) || '';

  const matchedGuest: Guest =
    SAMPLE_WEDDING.guests?.find((g) => g.guest_token === token) || {
      id: 'g-temp',
      wedding_id: SAMPLE_WEDDING.id,
      guest_token: token || 'guest-family',
      guest_name: token
        ? token.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Honored Guest & Family',
      allocated_seats: 4,
      allowed_event_ids: ['ev-1', 'ev-2', 'ev-3'],
      rsvp_status: 'pending' as const,
      gate_qr_hash: `QR_${token}`,
    };

  const themeQuery =
    searchParams.get('theme') ||
    searchParams.get('t') ||
    SAMPLE_WEDDING.theme_id ||
    'darbar-e-shahi';

  const iframeSrc = `/templates/${themeQuery}.html?groom=${encodeURIComponent(
    SAMPLE_WEDDING.groom_name
  )}&bride=${encodeURIComponent(SAMPLE_WEDDING.bride_name)}&guest=${encodeURIComponent(
    matchedGuest.guest_name
  )}&seats=${matchedGuest.allocated_seats}&token=${encodeURIComponent(token)}`;

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-50 overflow-hidden">
      <iframe
        src={iframeSrc}
        className="w-full h-full border-0 fixed inset-0"
        title="Personalized Guest Wedding Invitation"
        allow="autoplay; encrypted-media; fullscreen"
      />
    </div>
  );
}

export default function GuestInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#0D0709] text-[#D4AF37] flex items-center justify-center font-serif text-lg">
          Loading Personalized Invitation...
        </div>
      }
    >
      <GuestInviteContent />
    </Suspense>
  );
}
