"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import PhoneMockup from "./PhoneMockup";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  Play,
  Pause,
  X,
  Menu,
  Check,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Volume2,
  CalendarDays,
  MapPin,
  MousePointer2,
  ChevronDown,
  Smartphone,
  Languages,
  Copy,
  CheckCheck,
  Layers,
  Flower2,
  Link2,
} from "lucide-react";
import { designs, inquiry, type Design } from "@/lib/designs";
import { OfferPicker, PackageComparison } from "./OfferPicker";
import { offerById, offerInquiry, type OfferId } from "@/lib/offers";
const format = (n: number) => "Rs. " + n.toLocaleString("en-PK");
function Bloom({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M40 70V39M40 56C13 55 14 40 14 40c19-2 26 16 26 16Zm0 7c27-1 27-18 27-18-20 0-27 18-27 18Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M40 40C16 41 16 18 21 18c8 0 12 6 12 6s-5-19 7-21c12 3 7 21 7 21s6-8 13-6c6 9-1 24-20 22Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M40 39V14M40 39 26 25m14 14 14-14"
        stroke="currentColor"
        strokeWidth=".7"
      />
    </svg>
  );
}
export function Wordmark() {
  return (
    <Link href="/" className="wv-wordmark" aria-label="WedInvite home">
      <Bloom />
      <span>
        wedinvite<small>.pk</small>
        <i>INVITATIONS, PERSONALLY YOURS</i>
      </span>
    </Link>
  );
}
export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="wv-announcement">
        <span>
          Your invitation, personally created. Delivered within 24 hours.*
        </span>
        <a href={inquiry()}>
          Made in Pakistan. Shared with love. <ArrowUpRight size={12} />
        </a>
      </div>
      <header className="wv-nav">
        <Wordmark />
        <nav aria-label="Main navigation">
          <Link href="/templates">
            The collection <ChevronDown size={12} />
          </Link>
          <Link href="/#experience">The experience</Link>
          <Link href="/#packages">Our packages</Link>
          <Link href="/#process">How it works</Link>
        </nav>
        <a className="wv-button wv-button-dark wv-nav-cta" href="/order">
          Start your invitation <ArrowUpRight size={15} />
        </a>
        <button
          className="wv-icon wv-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && (
        <nav className="wv-mobile-nav" aria-label="Mobile navigation">
          <Link onClick={() => setOpen(false)} href="/templates">
            The collection <ArrowRight />
          </Link>
          <Link onClick={() => setOpen(false)} href="/#experience">
            The experience <ArrowRight />
          </Link>
          <Link onClick={() => setOpen(false)} href="/#packages">
            Our packages <ArrowRight />
          </Link>
          <Link onClick={() => setOpen(false)} href="/#process">
            How it works <ArrowRight />
          </Link>
          <a onClick={() => setOpen(false)} href="/order">
            Start your invitation <MessageCircle />
          </a>
        </nav>
      )}
    </>
  );
}
export function FloatingWhatsApp() {
  return (
    <a
      className="whatsapp-float"
      href={inquiry()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with WedInvite on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.96 11.96 0 0 0 5.78 1.47h.01C18.63 23.83 24 18.47 24 11.89c0-3.19-1.24-6.18-3.48-8.41ZM12.05 21.82a9.91 9.91 0 0 1-5.06-1.39l-.36-.21-3.72.98.99-3.63-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.95-9.94a9.86 9.86 0 0 1 7.03 2.92 9.88 9.88 0 0 1 2.91 7.04c0 5.48-4.47 9.86-9.99 9.86Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span className="whatsapp-float-label">Chat with us</span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="wv-footer">
      <div>
        <Wordmark />
        <p>
          Thoughtfully made invitations.
          <br />
          For beautifully lived beginnings.
        </p>
        <a href={inquiry()}>
          Let’s talk about your celebration <ArrowUpRight size={15} />
        </a>
      </div>
      <div>
        <small>EXPLORE</small>
        <Link href="/templates">The collection</Link>
        <Link href="/#experience">The experience</Link>
        <Link href="/#packages">Our packages</Link>
      </div>
      <div>
        <small>THE STUDIO</small>
        <a href={inquiry()}>WhatsApp us</a>
        <a href="tel:+923001063545">+92 300 1063545</a>
        <Link href="/admin">Studio login</Link>
      </div>
      <div className="wv-footer-note">
        <Bloom />
        <span>
          Rooted in tradition.
          <br />
          <em>Made for your story.</em>
        </span>
      </div>
      <div className="wv-footer-bottom">
        <span>© 2026 wedinvite.pk</span>
        <span>Made with love in Pakistan</span>
        <a href="#top">Back to the beginning ↑</a>
      </div>
    </footer>
  );
}
function Button({
  children,
  href,
  outline = false,
}: {
  children: ReactNode;
  href: string;
  outline?: boolean;
}) {
  return (
    <a
      className={
        "wv-button " + (outline ? "wv-button-outline" : "wv-button-dark")
      }
      href={href}
    >
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}
function Label({ children }: { children: ReactNode }) {
  return (
    <div className="wv-label">
      <span />
      {children}
    </div>
  );
}
function Modal({
  children,
  onClose,
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="wv-modal"
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="wv-modal-inner">
        <button
          className="wv-modal-close wv-icon"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X />
        </button>
        {children}
      </div>
    </dialog>
  );
}
function QuickLook({
  design,
  onClose,
}: {
  design: Design;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} label={design.name + " interactive preview"}>
      <div className="wv-quick">
        <div className="wv-quick-device">
          <iframe
            title={design.name + " interactive invitation"}
            src={"/collection/card-" + design.id + ".html"}
            allow="autoplay; fullscreen"
          />
        </div>
        <div className="wv-quick-copy">
          <Label>YOU’RE THE GUEST NOW</Label>
          <h2>{design.name}</h2>
          <p>{design.description}</p>
          <div className="wv-touch-note">
            <MousePointer2 size={18} />
            <span>
              Tap the invitation to begin.
              <br />
              Explore the opening, music and little details.
            </span>
          </div>
          <Button href={"/order?template=" + design.id}>
            Make {design.name} ours
          </Button>
          <Link className="wv-text-link" href={"/templates/" + design.id}>
            Explore the full design <ArrowRight size={15} />
          </Link>
          <small>
            This is a sample. We’ll create yours with your own wedding details.
          </small>
        </div>
      </div>
    </Modal>
  );
}
function Film({
  design,
  auto = false,
  className = "",
  controls = false,
}: {
  design: Design;
  auto?: boolean;
  className?: string;
  controls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (auto && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.play().catch(() => {});
    }
  }, [auto, design.id]);
  return (
    <div className={"wv-film " + className}>
      <video
        key={design.id}
        ref={ref}
        src={design.film}
        poster={design.poster}
        muted
        playsInline
        loop
        preload={auto ? "metadata" : "none"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {controls && (
        <button
          className="wv-film-control"
          aria-label={playing ? "Pause opening film" : "Play opening film"}
          onClick={() => {
            if (playing) ref.current?.pause();
            else ref.current?.play().catch(() => {});
          }}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
          <span>{playing ? "Pause film" : "Play film"}</span>
        </button>
      )}
    </div>
  );
}
function Hero() {
  const featured = [designs[0], designs[1], designs[2]];
  const [active, setActive] = useState(0),
    [preview, setPreview] = useState(false);
  const t = featured[active];
  return (
    <section className="at-hero" id="top">
      <div className="at-hero-copy">
        <span className="at-kicker">
          <span /> PAKISTANI WEDDINGS. BEAUTIFULLY INVITED.
        </span>
        <h1>
          The first little
          <br />
          moment of
          <br />
          <em>your forever.</em>
        </h1>
        <p>
          A wedding invitation they can open, explore and feel. Choose a design
          you love. Our studio makes every detail yours.
        </p>
        <div className="at-hero-actions">
          <Link className="at-primary" href="/templates">
            Find your invitation <ArrowUpRight size={19} />
          </Link>
          <button className="at-demo-link" onClick={() => setPreview(true)}>
            <Play size={15} fill="currentColor" /> Open a live invitation
          </button>
        </div>
        <div className="at-hero-facts">
          <span>
            <Check size={15} /> Personally created for you
          </span>
          <span>
            From <strong>Rs. 4,999</strong>
          </span>
        </div>
        <span className="at-hero-handwriting">
          a little link. a beautiful beginning.
        </span>
      </div>
      <div className="at-hero-scene">
        <span className="at-scene-word">you&apos;re invited</span>
        <div className="at-scene-orbit" />
        <div className="at-scene-flower">
          <Bloom />
        </div>
        <div className="at-paper-card at-paper-back">
          <PhoneMockup>
            <Image
              src={designs[5].poster}
              width={402}
              height={820}
              alt="Khat wax-sealed invitation artwork"
              sizes="240px"
            />
          </PhoneMockup>
        </div>
        <div className="at-paper-card at-paper-front">
          <PhoneMockup>
            <Image
              src={designs[3].image}
              width={402}
              height={820}
              alt="Basant wedding invitation"
              sizes="240px"
            />
          </PhoneMockup>
        </div>
        <div className="at-featured-film">
          <PhoneMockup>
            <Film design={t} auto controls />
          </PhoneMockup>
          <button
            className="at-scene-play"
            aria-label={"Experience " + t.name}
            onClick={() => setPreview(true)}
          >
            <Play fill="currentColor" size={20} />
            <span>Step inside {t.name}</span>
          </button>
        </div>
        <div className="at-studio-seal">
          <Bloom />
          <span>
            PERSONALLY
            <br />
            MADE WITH DIL
          </span>
        </div>
        <div className="at-scene-selector">
          <span>EXPLORE AN OPENING</span>
          {featured.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              aria-label={"Show " + f.name}
              aria-pressed={active === i}
              className={active === i ? "active" : ""}
            >
              {f.name}
              <span>0{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
      {preview && <QuickLook design={t} onClose={() => setPreview(false)} />}
    </section>
  );
}
function Deliverables() {
  return (
    <section className="at-deliverables">
      <div className="at-section-title">
        <span className="at-kicker">ONE DESIGN. EVERY WAY TO INVITE.</span>
        <h2>
          A link for the details.
          <br />
          <em>A little something to share.</em>
        </h2>
        <p>
          Start with your invitation website. Add the sharing formats you need,
          <br />
          or choose the complete suite and receive them together.
        </p>
      </div>
      <div className="at-format-grid">
        <article>
          <div className="at-format-visual at-format-web">
            <Image
              src={designs[1].image}
              width={402}
              height={820}
              alt="An invitation website with personalized names"
              sizes="260px"
            />
            <span className="at-format-chip">
              <MapPin size={14} /> Maps, calendar & guest replies
            </span>
          </div>
          <div className="at-format-caption">
            <span>01 / YOUR WEBSITE</span>
            <h3>One link. All the details.</h3>
            <p>
              The invitation your guests open on their phone. Their dates,
              directions and reply, together.
            </p>
            <small>Included in every package</small>
          </div>
        </article>
        <article>
          <div className="at-format-visual at-format-social">
            <div className="at-status-art">
              <Image
                src={designs[0].poster}
                width={402}
                height={820}
                alt="Floral artwork illustrating a wedding status image"
                sizes="220px"
              />
              <div>
                <small>WITH OUR FAMILIES</small>
                <h4>
                  Bilal
                  <br />
                  <i>&</i> Mahrukh
                </h4>
                <p>A BEAUTIFUL NEW CHAPTER</p>
              </div>
            </div>
            <span className="at-format-chip">
              <Play size={14} /> Images + a video for your status
            </span>
          </div>
          <div className="at-format-caption">
            <span>02 / YOUR ANNOUNCEMENT</span>
            <h3>Let the group chats know.</h3>
            <p>
              Shareable images and a short invitation video, prepared to match
              your chosen design.
            </p>
            <small>
              Included in the complete suite · optional extras otherwise
            </small>
          </div>
        </article>
        <article>
          <div className="at-format-visual at-format-events">
            {["Mehndi", "Baraat", "Walima"].map((e, i) => (
              <div className={"at-event-paper paper-" + i} key={e}>
                <Bloom />
                <small>YOU’RE INVITED TO</small>
                <h4>{e}</h4>
                <span>BILAL & MAHRUKH</span>
                <i>with love, always</i>
              </div>
            ))}
          </div>
          <div className="at-format-caption">
            <span>03 / YOUR CELEBRATIONS</span>
            <h3>A card for each occasion.</h3>
            <p>
              Separate invitation images for three events, so you can send each
              one to the right people.
            </p>
            <small>
              Included in the complete suite · optional event pack otherwise
            </small>
          </div>
        </article>
      </div>
      <p className="at-sample-note">
        Sharing formats shown as illustrations. Your files are personally
        prepared with your details.
      </p>
    </section>
  );
}
function Ribbon() {
  return (
    <div className="wv-ribbon">
      {[
        [Smartphone, "No app. Just a little link."],
        [Languages, "English & اردو"],
        [MessageCircle, "Made for WhatsApp"],
        [Heart, "Created by our studio"],
      ].map(([Icon, text]) => {
        const I = Icon as typeof Heart;
        return (
          <span key={text as string}>
            <I size={16} />
            {text as string}
          </span>
        );
      })}
    </div>
  );
}
const savedKey = "wedinvite-favourites";
let savedFallback = "[]";
function readSaved() {
  try {
    return localStorage.getItem(savedKey) || "[]";
  } catch {
    return savedFallback;
  }
}
function subscribeSaved(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("wedinvite:saved", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("wedinvite:saved", listener);
  };
}
function useSaved() {
  const snapshot = useSyncExternalStore(subscribeSaved, readSaved, () => "[]");
  let saved: string[] = [];
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (Array.isArray(parsed))
      saved = parsed.filter((id) => designs.some((d) => d.id === id));
  } catch {
    /* Ignore invalid saved preferences. */
  }
  const toggle = (id: string) => {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    savedFallback = JSON.stringify(next);
    try {
      localStorage.setItem(savedKey, savedFallback);
    } catch {
      /* Session-only fallback. */
    }
    window.dispatchEvent(new Event("wedinvite:saved"));
  };
  return { saved, toggle };
}
function DesignCard({
  t,
  saved,
  toggle,
  selected,
  onCompare,
}: {
  t: Design;
  saved: boolean;
  toggle: () => void;
  selected?: boolean;
  onCompare?: () => void;
}) {
  return (
    <article className={"wv-design-card wv-design-" + t.id}>
      <div className="wv-card-visual">
        <div className="wv-card-tags">
          <span>{t.category}</span>
          <button
            aria-label={(saved ? "Remove " : "Save ") + t.name}
            className={"wv-save " + (saved ? "is-saved" : "")}
            onClick={toggle}
          >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <Link
          href={"/templates/" + t.id}
          className="wv-card-phone"
          aria-label={"Explore " + t.name}
        >
          <PhoneMockup>
            <Image
              width={402}
              height={820}
              sizes="(max-width: 560px) 50vw, 320px"
              src={t.image}
              alt={t.name + " wedding invitation with couple names and artwork"}
              loading="lazy"
            />
          </PhoneMockup>
        </Link>
        <span className="wv-card-script">
          {t.id === "gulistan"
            ? "a garden kind of love"
            : t.id === "shabistan"
              ? "written in the stars"
              : t.id === "khat"
                ? "sealed with love"
                : t.palette.toLowerCase()}
        </span>
        <a
          className="wv-quick-button"
          href={"/preview/" + t.id}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"Preview " + t.name + " (opens in a new tab)"}
        >
          <Play size={12} fill="currentColor" /> Preview invitation{" "}
          <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="wv-card-heading">
        <Link href={"/templates/" + t.id}>
          <h3>{t.name}</h3>
        </Link>
        <div className="wv-swatches">
          {t.colors.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </div>
      </div>
      <p>{t.line}</p>
      <div className="wv-card-bottom">
        <Link href={"/templates/" + t.id}>
          Discover this design <ArrowUpRight size={13} />
        </Link>
        {onCompare && (
          <label>
            <input
              type="checkbox"
              checked={selected || false}
              onChange={onCompare}
              aria-label={"Compare " + t.name}
            />
            Compare
          </label>
        )}
      </div>
    </article>
  );
}
export function Collection({ home = false }: { home?: boolean }) {
  const [filter, setFilter] = useState("All designs"),
    [query, setQuery] = useState(""),
    [compare, setCompare] = useState<string[]>([]),
    [showCompare, setShowCompare] = useState(false);
  const { saved, toggle } = useSaved();
  const list = designs.filter(
    (t) =>
      (filter === "All designs" ||
        filter === t.category ||
        (filter === "Saved" && saved.includes(t.id))) &&
      `${t.name} ${t.occasion} ${t.palette} ${t.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section
      className={"wv-section wv-collection " + (home ? "" : "wv-catalogue")}
      id="collection"
    >
      <div className="wv-section-head">
        <div>
          <Label>
            {home
              ? "THE SIGNATURE COLLECTION"
              : "TEN ORIGINALS. ENDLESS FEELING."}
          </Label>
          <h2>
            Ten little worlds.
            <br />
            <em>Which one is yours?</em>
          </h2>
        </div>
        <p>
          Garden romance or old-city grandeur.
          <br />A midnight sky or a riot of colour.
          <br />
          Every design, a different kind of forever.
        </p>
      </div>
      <div className="wv-collection-toolbar">
        <div
          className="wv-filter-tabs"
          role="group"
          aria-label="Filter designs"
        >
          {[
            "All designs",
            "Romantic",
            "Heritage",
            "Royal",
            "Festive",
            "Saved",
          ].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "Saved" && <Heart size={12} />} {f}
              {f === "Saved" ? " (" + saved.length + ")" : ""}
            </button>
          ))}
        </div>
        <label className="wv-search">
          <Search size={16} />
          <input
            aria-label="Search designs"
            placeholder="Find a design or feeling…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </label>
      </div>
      <div className="wv-collection-meta">
        <span>
          {list.length.toString().padStart(2, "0")} DESIGNS TO FALL IN LOVE WITH
        </span>
        <span>
          <SlidersHorizontal size={12} /> Curated by the studio
        </span>
      </div>
      <div className="wv-design-grid">
        {(home && filter === "All designs" && !query
          ? list.slice(0, 4)
          : list
        ).map((t) => (
          <DesignCard
            key={t.id}
            t={t}
            saved={saved.includes(t.id)}
            toggle={() => toggle(t.id)}
            selected={compare.includes(t.id)}
            onCompare={() =>
              setCompare(
                compare.includes(t.id)
                  ? compare.filter((x) => x !== t.id)
                  : [...compare.slice(-1), t.id],
              )
            }
          />
        ))}
      </div>
      {!list.length && (
        <div className="wv-empty">
          <Flower2 size={40} />
          <h3>
            {filter === "Saved"
              ? "Your favourites will feel right at home here."
              : "A different search might be the one."}
          </h3>
          <p>
            {filter === "Saved"
              ? "Tap the heart on any design to keep it close."
              : "Try a design name, colour or celebration."}
          </p>
          <button
            className="wv-button wv-button-outline"
            onClick={() => {
              setFilter("All designs");
              setQuery("");
            }}
          >
            Explore all designs <ArrowRight size={15} />
          </button>
        </div>
      )}
      {home && (
        <div className="wv-collection-end">
          <p>
            Ten little worlds.<em> Yours is waiting.</em>
          </p>
          <Link href="/templates" className="wv-button wv-button-outline">
            Explore all ten designs <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
      {compare.length > 0 && (
        <div className="wv-compare-tray">
          <div>
            {compare.map((id) => (
              <Image
                width={402}
                height={820}
                sizes="(max-width: 560px) 50vw, 320px"
                key={id}
                src={designs.find((d) => d.id === id)!.poster}
                alt={id}
              />
            ))}
          </div>
          <span>
            {compare.length === 1
              ? "Choose one more to compare"
              : "Two favourites. Let’s take a closer look."}
          </span>
          <button
            disabled={compare.length !== 2}
            onClick={() => setShowCompare(true)}
          >
            Compare designs <Layers size={15} />
          </button>
          <button
            className="wv-icon"
            aria-label="Clear comparison"
            onClick={() => setCompare([])}
          >
            <X size={17} />
          </button>
        </div>
      )}
      {showCompare && (
        <Modal
          label="Compare your favourite designs"
          onClose={() => setShowCompare(false)}
        >
          <div className="wv-compare">
            <Label>TWO DIFFERENT KINDS OF LOVELY</Label>
            <h2>
              Which one feels <em>like you?</em>
            </h2>
            <div className="wv-compare-grid">
              {compare.map((id) => {
                const d = designs.find((d) => d.id === id)!;
                return (
                  <div key={id}>
                    <Image
                      width={402}
                      height={820}
                      sizes="(max-width: 560px) 50vw, 320px"
                      src={d.image}
                      alt={d.name + " invitation"}
                    />
                    <h3>{d.name}</h3>
                    <p>{d.gesture}</p>
                    <small>{d.occasion}</small>
                    <Button href={"/order?template=" + d.id}>
                      Choose {d.name}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
function Experience() {
  const [active, setActive] = useState(0),
    [preview, setPreview] = useState<Design | null>(null);
  const items = [
    {
      title: "A beginning they can feel.",
      copy: "A key to turn. A seal to break. Lanterns to light. Your guests become part of the story from their very first touch.",
      icon: MousePointer2,
      design: designs[1],
    },
    {
      title: "All your moments, together.",
      copy: "Mehndi, Baraat, Walima. Dates, venues and little details, thoughtfully arranged so your family knows exactly where to be.",
      icon: CalendarDays,
      design: designs[0],
    },
    {
      title: "A little reply. A lot of love.",
      copy: "Guests reply from the invitation. You get a clearer picture of who is joining your celebration, without another round of calls.",
      icon: Heart,
      design: designs[5],
    },
  ];
  return (
    <section className="wv-experience" id="experience">
      <div className="wv-experience-art">
        <div
          className="wv-exp-background"
          style={{
            backgroundImage: "url(" + items[active].design.poster + ")",
          }}
        />
        <div className="wv-exp-device">
          <Image
            width={402}
            height={820}
            sizes="(max-width: 560px) 50vw, 320px"
            src={
              active === 0
                ? items[active].design.image
                : items[active].design.detailsImage
            }
            alt={
              active === 0
                ? "Interactive invitation"
                : active === 1
                  ? "Event details inside the invitation"
                  : "Invitation details"
            }
          />
        </div>
        <button
          className="wv-exp-play"
          onClick={() => setPreview(items[active].design)}
        >
          <Play size={13} /> Step inside the invitation
        </button>
        <span className="wv-exp-caption">
          More than something you read.
          <br />
          <em>Something you remember.</em>
        </span>
      </div>
      <div className="wv-experience-copy">
        <Label>BEAUTIFUL IS JUST THE BEGINNING</Label>
        <h2>
          Little details.
          <br />
          <em>Big feelings.</em>
        </h2>
        <div className="wv-exp-tabs">
          {items.map((item, i) => (
            <button
              key={item.title}
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
              aria-expanded={i === active}
            >
              <span className="wv-exp-number">0{i + 1}</span>
              <div>
                <h3>{item.title}</h3>
                {i === active && <p>{item.copy}</p>}
              </div>
              <item.icon size={18} />
            </button>
          ))}
        </div>
        <div className="wv-feature-icons">
          <span>
            <MapPin size={18} />
            Venue directions
          </span>
          <span>
            <Languages size={18} />
            English & Urdu
          </span>
          <span>
            <Volume2 size={18} />
            Music & motion
          </span>
          <span>
            <CalendarDays size={18} />
            Save the date
          </span>
        </div>
      </div>
      {preview && (
        <QuickLook design={preview} onClose={() => setPreview(null)} />
      )}
    </section>
  );
}
function Sharing() {
  const [copied, setCopied] = useState(false);
  return (
    <section className="wv-sharing wv-section">
      <div>
        <Label>A LITTLE LINK. EVERYONE YOU LOVE.</Label>
        <h2>
          From your heart.
          <br />
          <em>To their WhatsApp.</em>
        </h2>
        <p>
          Across cities, time zones and family groups. Your invitation is always
          just a tap away. No app to install. No account for your guests.
        </p>
        <div className="wv-link-demo">
          <Link2 size={16} />
          <span>wedinvite.pk/invite/your-story</span>
          <button
            aria-label="Copy sample invitation link"
            onClick={() =>
              navigator.clipboard
                .writeText(location.origin + "/preview/gulistan")
                .then(() => setCopied(true))
            }
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <small role="status">
          {copied
            ? "Sample preview link copied."
            : "Your own memorable address, chosen with the studio."}
        </small>
      </div>
      <div className="wv-chat-scene">
        <div className="wv-chat-top">
          <span className="wv-chat-avatar">
            <Heart size={17} />
          </span>
          <div>
            The people we love<small>A little wedding announcement</small>
          </div>
          <span>•••</span>
        </div>
        <div className="wv-chat-date">A BEAUTIFUL NEW CHAPTER</div>
        <div className="wv-chat-message">
          <div className="wv-chat-preview">
            <Image
              width={402}
              height={820}
              sizes="(max-width: 560px) 50vw, 320px"
              src={designs[0].poster}
              alt="Gulistan invitation artwork"
            />
            <div>
              <b>Bilal & Mahrukh</b>
              <span>A celebration of love. And you.</span>
              <small>wedinvite.pk</small>
            </div>
          </div>
          <p>
            With full hearts, we invite you to celebrate our beautiful
            beginning. Your presence would mean the world. ♡
          </p>
          <span className="wv-chat-url">wedinvite.pk/invite/bilal-mahrukh</span>
          <small className="wv-chat-time">
            12:24 <CheckCheck size={13} />
          </small>
        </div>
        <div className="wv-chat-reply">
          Keeping this day close to our hearts. ♡ <small>12:26</small>
        </div>
        <span className="wv-chat-caption">
          An illustration of how you can share your link.
        </span>
      </div>
    </section>
  );
}
export function Packages({ design }: { design?: string }) {
  return <PackageComparison design={design} />;
}
function Process() {
  return (
    <section className="wv-process wv-section" id="process">
      <div className="wv-section-head">
        <div>
          <Label>YOU ENJOY THE MOMENT. WE HANDLE THE DETAILS.</Label>
          <h2>
            From “this is the one”
            <br />
            <em>to “you’re invited”.</em>
          </h2>
        </div>
        <a href={inquiry()} className="wv-text-link">
          Say hello to the studio <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="wv-process-grid">
        {[
          [
            "01",
            "Fall for a design",
            "Try the openings. Save your favourites. Find the invitation that feels like your story.",
          ],
          [
            "02",
            "Tell us your story",
            "Message us on WhatsApp. Share your names, events and venues. We take it from there.",
          ],
          [
            "03",
            "Make it perfect",
            "We create your invitation and review the details with you. Confirm payment by Easypaisa or JazzCash.",
          ],
          [
            "04",
            "Send a little love",
            "We activate your custom link. Share it with your favourite people and let the celebration begin.",
          ],
        ].map(([n, t, d]) => (
          <article key={n}>
            <span>{n}</span>
            <div className="wv-process-line" />
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function FAQ({ design }: { design?: string }) {
  return (
    <section className="wv-faq wv-section">
      <div>
        <Label>BEFORE WE BEGIN</Label>
        <h2>
          A few little
          <br />
          <em>things to know.</em>
        </h2>
        <p>
          Still have something on your mind?
          <br />
          There’s a real person on the other side.
        </p>
        <a href={inquiry(design)} className="wv-text-link">
          Ask us on WhatsApp <ArrowUpRight size={16} />
        </a>
      </div>
      <div>
        {[
          [
            "How do we make this invitation ours?",
            "Choose a design and message us on WhatsApp. We’ll collect your names, event dates, times, venues and family message, then create the invitation for you. No customer account or technical setup needed.",
          ],
          [
            "Can we try the design before deciding?",
            "Absolutely. Open any live preview and explore it just as your guests will. We’ll review your personalized details with you before sharing the final invitation.",
          ],
          [
            "How do payment and delivery work?",
            "Pay through Easypaisa or JazzCash to 03001063545 and send your receipt to +92 300 1063545 on WhatsApp. After we verify payment and have your complete details, delivery is within 24 hours.",
          ],
          [
            "What if a name, date or venue changes?",
            "Your package includes two free support edit requests. Contact us on WhatsApp and we’ll help make the correction. Your invitation can be updated at the same link.",
          ],
          [
            "Will it work for our family abroad?",
            "Yes. Your guests can open the link on a phone or computer, without installing an app or creating an account. The original templates include English and Urdu controls.",
          ],
        ].map(([q, a], i) => (
          <details key={q}>
            <summary>
              <span>0{i + 1}</span>
              {q}
              <ChevronDown size={16} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function Closing({ design }: { design?: string }) {
  return (
    <section className="wv-closing">
      <div className="wv-closing-line" />
      <Bloom />
      <Label>FOR THE PEOPLE. FOR THE FEELING. FOR FOREVER.</Label>
      <h2>
        Let’s make something
        <br />
        <em>worth opening.</em>
      </h2>
      <p>Your love story deserves a beautiful first impression.</p>
      <Button href={inquiry(design)}>Tell us about your wedding</Button>
      <span className="wv-closing-note">
        <MessageCircle size={14} /> A conversation, not a commitment.
      </span>
      <div className="wv-closing-line" />
    </section>
  );
}
export function StorefrontHome() {
  return (
    <div className="wv">
      <SiteNav />
      <main>
        <Hero />
        <Ribbon />
        <Collection home />
        <Experience />
        <Deliverables />
        <Packages />
        <Sharing />
        <Process />
        <FAQ />
        <Closing />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
export function CollectionPage() {
  return (
    <div className="wv" id="top">
      <SiteNav />
      <main>
        <Collection />
        <section className="wv-concierge">
          <Bloom />
          <div>
            <h3>Not sure which one is your one?</h3>
            <p>
              Tell us a little about your wedding. We’ll help you find its
              perfect invitation.
            </p>
          </div>
          <Button href={inquiry()}>Find my kind of lovely</Button>
        </section>
        <Closing />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
export function ProductPage({ id }: { id: string }) {
  const t = designs.find((d) => d.id === id)!;
  const [view, setView] = useState("film"),
    [preview, setPreview] = useState<Design | null>(null),
    [activePackage, setPackage] = useState<OfferId>("premium");
  const { saved, toggle } = useSaved();
  const related = designs
    .filter((d) => d.id !== id && d.category === t.category)
    .concat(designs.filter((d) => d.id !== id && d.category !== t.category))
    .slice(0, 3);
  return (
    <div className="wv" id="top">
      <SiteNav />
      <main>
        <div className="wv-breadcrumb">
          <Link href="/templates">The collection</Link>
          <span>/</span>
          <span>{t.name}</span>
        </div>
        <section className="wv-product">
          <div className={"wv-product-stage tone-" + t.category.toLowerCase()}>
            <div className="wv-product-stage-top">
              <span>{t.category.toUpperCase()} · ORIGINAL COLLECTION</span>
              <button
                className="wv-icon"
                onClick={() => toggle(id)}
                aria-label={(saved.includes(id) ? "Unsave " : "Save ") + t.name}
              >
                <Heart
                  size={18}
                  fill={saved.includes(id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <PhoneMockup className="wv-product-device">
              {view === "film" ? (
                <Film design={t} auto controls />
              ) : (
                <Image
                  width={402}
                  height={820}
                  sizes="(max-width: 560px) 50vw, 320px"
                  src={view === "invitation" ? t.image : t.detailsImage}
                  alt={
                    view === "invitation"
                      ? t.name + " invitation"
                      : "Event details in " + t.name
                  }
                />
              )}
            </PhoneMockup>
            <div className="wv-product-views" aria-label="Design views">
              {[
                ["film", "The opening"],
                ["invitation", "The invitation"],
                ["details", "The details"],
              ].map(([v, title]) => (
                <button
                  key={v}
                  className={view === v ? "active" : ""}
                  onClick={() => setView(v)}
                >
                  {v === "film" ? (
                    <Play size={12} />
                  ) : v === "invitation" ? (
                    <Heart size={12} />
                  ) : (
                    <CalendarDays size={12} />
                  )}{" "}
                  {title}
                </button>
              ))}
            </div>
            <a
              className="wv-product-live"
              href={"/preview/" + t.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MousePointer2 size={15} /> Preview invitation in a new tab{" "}
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="wv-product-copy">
            <Label>
              AN INVITATION TO{" "}
              {t.category === "Romantic"
                ? "FALL IN LOVE"
                : t.category === "Festive"
                  ? "CELEBRATE"
                  : "REMEMBER"}
            </Label>
            <h1>
              {t.name}
              <em>{t.line}.</em>
            </h1>
            <p>{t.description}</p>
            <div className="wv-product-palette">
              <div className="wv-swatches">
                {t.colors.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </div>
              <span>{t.palette}</span>
            </div>
            <div className="wv-product-fit">
              <Flower2 size={19} />
              <span>
                BEAUTIFULLY SUITED TO<b>{t.occasion}</b>
              </span>
            </div>
            <OfferPicker
              design={t.name}
              value={activePackage}
              onChange={setPackage}
            />
          </div>
        </section>
        <div className="at-product-summary">
          <span>
            <Check size={16} /> All 10 designs available in every package
          </span>
          <span>
            <MessageCircle size={16} /> We collect your details on WhatsApp
          </span>
          <span>
            <Heart size={16} /> Your studio does the setup
          </span>
        </div>
        <Packages design={t.name} />
        <section className="wv-design-story wv-section">
          <div className="wv-story-image">
            <Image
              width={402}
              height={820}
              sizes="(max-width: 560px) 50vw, 320px"
              src={t.poster}
              alt={t.name + " artwork detail"}
              loading="lazy"
            />
            <div>
              <Bloom />
              <span>
                The art of
                <br />
                <em>being invited.</em>
              </span>
            </div>
          </div>
          <div>
            <Label>THE LITTLE RITUAL</Label>
            <h2>
              {t.gesture}
              <em> And then, your story.</em>
            </h2>
            <p>
              There’s a moment before the invitation opens. A little curiosity.
              A touch of anticipation. That’s where {t.name} begins.
            </p>
            <p>
              We preserve every crafted detail of the design, then make the
              important parts yours: the names, the dates, the venues and the
              words that welcome your people.
            </p>
            <button className="wv-play-link" onClick={() => setPreview(t)}>
              <span>
                <Play size={12} />
              </span>
              Experience the opening
            </button>
          </div>
        </section>
        <section className="wv-inclusions wv-section">
          <Label>BEAUTY, WITH EVERY DETAIL CONSIDERED</Label>
          <h2>
            All the lovely.<em> All in one place.</em>
          </h2>
          <div>
            {[
              [
                Languages,
                "Your names. Your words.",
                "English and optional Urdu names, with your family’s message.",
              ],
              [
                CalendarDays,
                "Every celebration, together.",
                "Up to three events, with dates, times and calendar links.",
              ],
              [
                MapPin,
                "A little help getting there.",
                "Venue details and maps for each of your celebrations.",
              ],
              [
                Heart,
                "Replies that reach you.",
                "Guests can reply from the invitation, ready for the studio to review.",
              ],
              [
                Volume2,
                "A moment that comes alive.",
                "Original entrance rituals, background music and motion.",
              ],
              [
                Link2,
                "An address of your own.",
                "A memorable custom URL to send to everyone you love.",
              ],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof Heart;
              return (
                <article key={title as string}>
                  <I size={23} />
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                </article>
              );
            })}
          </div>
        </section>
        <Process />
        <FAQ design={t.name} />
        <section className="wv-section wv-related">
          <div className="wv-section-head">
            <div>
              <Label>A FEW MORE TO FALL FOR</Label>
              <h2>
                Other beautiful<em> beginnings.</em>
              </h2>
            </div>
            <Link className="wv-text-link" href="/templates">
              See the collection <ArrowRight size={15} />
            </Link>
          </div>
          <div className="wv-design-grid">
            {related.map((d) => (
              <DesignCard
                key={d.id}
                t={d}
                saved={saved.includes(d.id)}
                toggle={() => toggle(d.id)}
              />
            ))}
          </div>
        </section>
        <Closing design={t.name} />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <div className="wv-product-sticky">
        <div>
          <b>{t.name}</b>
          <span>
            {offerById(activePackage).name} ·{" "}
            {format(offerById(activePackage).price)}
          </span>
        </div>
        <a
          className="wv-button wv-button-dark"
          href={
            "/order?" +
            new URLSearchParams({ template: t.id, tier: activePackage })
          }
        >
          Start my invitation <MessageCircle size={16} />
        </a>
      </div>
      {preview && (
        <QuickLook design={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
