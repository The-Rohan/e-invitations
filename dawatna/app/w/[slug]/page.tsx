'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SAMPLE_WEDDING } from '@/lib/store';
import { TEMPLATES } from '@/lib/templates';

function WeddingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';

  const themeQuery = searchParams.get('t') || searchParams.get('theme');
  const groomQuery = searchParams.get('groom');
  const brideQuery = searchParams.get('bride');
  const guestQuery = searchParams.get('guest');
  const seatsQuery = searchParams.get('seats');
  const openQuery = searchParams.get('open');

  // Match template by ID
  const matchedTemplate = TEMPLATES.find(
    (t) => t.id === slug || t.id === themeQuery
  );

  const themeId = matchedTemplate?.id || themeQuery || (slug !== 'ahmad-mawra' && slug !== 'hamza-ayesha' ? slug : 'darbar-e-shahi');
  const groom = groomQuery || SAMPLE_WEDDING.groom_name;
  const bride = brideQuery || SAMPLE_WEDDING.bride_name;

  const [customWedding, setCustomWedding] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wedinvite_custom_wedding');
        if (saved) {
          setCustomWedding(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, []);

  const activeTheme = customWedding?.theme_id || themeId;
  const activeGroom = customWedding?.groom_name || groom;
  const activeBride = customWedding?.bride_name || bride;

  const iframeSrc = `/templates/${activeTheme}.html?groom=${encodeURIComponent(
    activeGroom
  )}&bride=${encodeURIComponent(activeBride)}${
    guestQuery ? `&guest=${encodeURIComponent(guestQuery)}` : ''
  }${seatsQuery ? `&seats=${encodeURIComponent(seatsQuery)}` : ''}${
    openQuery ? `&open=${encodeURIComponent(openQuery)}` : ''
  }`;

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-50 overflow-hidden">
      <iframe
        src={iframeSrc}
        className="w-full h-full border-0 fixed inset-0"
        title="Live Wedding Invitation"
        allow="autoplay; encrypted-media; fullscreen"
      />
    </div>
  );
}

export default function WeddingPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#0D0709] text-[#D4AF37] flex items-center justify-center font-serif text-lg">
          Loading Royal Wedding Invitation...
        </div>
      }
    >
      <WeddingContent />
    </Suspense>
  );
}
