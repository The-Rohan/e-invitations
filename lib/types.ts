export type PackageTier = 'standard' | 'royal';
export type OrderStatus = 'pending_verification' | 'verified' | 'rejected';
export type WeddingStatus = 'draft' | 'pending_verification' | 'active';
export type RSVPStatus = 'pending' | 'attending' | 'regret';
export type OpeningType =
  | 'ribbon'
  | 'wax_seal'
  | 'diya'
  | 'door_knock'
  | 'origami'
  | 'curtain'
  | 'lantern'
  | 'water_ripple'
  | 'scroll';

export interface WeddingEvent {
  id: string;
  wedding_id: string;
  event_type: 'mehndi' | 'barat' | 'walima' | 'nikkah' | 'dholki' | 'qawwali' | 'aqiqah' | 'birthday' | 'custom';
  event_title_en: string;
  event_title_ur: string;
  date: string;
  hijri_date?: string;
  start_time: string;
  end_time?: string;
  venue_name: string;
  venue_address: string;
  google_maps_url: string;
  dress_code?: string;
}

export interface Guest {
  id: string;
  wedding_id: string;
  guest_token: string;
  guest_name: string;
  allocated_seats: number;
  allowed_event_ids: string[];
  rsvp_status: RSVPStatus;
  attended_headcount?: number;
  meal_choice?: string;
  gate_qr_hash: string;
}

export interface Order {
  id: string;
  wedding_id: string;
  package_tier: PackageTier;
  amount: number;
  sender_name: string;
  sender_whatsapp: string;
  receipt_image_url?: string;
  transaction_id?: string;
  payment_method: 'bank' | 'jazzcash' | 'easypaisa';
  status: OrderStatus;
  created_at: string;
}

export interface GuestWish {
  id: string;
  wedding_id: string;
  guest_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export interface Wedding {
  id: string;
  slug: string;
  groom_name: string;
  groom_name_ur?: string;
  bride_name: string;
  bride_name_ur?: string;
  groom_family?: string;
  bride_family?: string;
  theme_id: string;
  opening_type: OpeningType;
  music_url?: string;
  package_tier: PackageTier;
  status: WeddingStatus;
  active_until?: string;
  custom_domain?: string;
  couple_video_url?: string;
  gallery_photos?: string[];
  raast_id?: string;
  raast_title?: string;
  iban?: string;
  events: WeddingEvent[];
  guests?: Guest[];
  wishes?: GuestWish[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  nameUrdu: string;
  brand?: 'cinematic' | 'atelier';
  collection?: 'cinematic' | 'atelier';
  htmlFile?: string;
  originalSlug?: string;
  badge?: string;
  category:
    | 'Royal'
    | 'Floral'
    | 'Cultural'
    | 'Modern'
    | 'Celebration'
    | 'Film'
    | 'Classic'
    | 'Signature'
    | 'Luxury'
    | 'Islamic'
    | 'Birthday'
    | 'Embroidery'
    | 'Heritage'
    | 'Atelier';
  tags: string[];
  price?: number;
  originalPrice?: number;
  phoneMockup?: string;
  previewUrl?: string;
  isVideo?: boolean;
  aesthetic: string;
  description: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  openingType: OpeningType;
  bgTexture: string;
  borderStyle: string;
  fontEnglish: string;
  fontUrdu: string;
  audioTrack: string;
}
