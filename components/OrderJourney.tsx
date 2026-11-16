"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteNav, SiteFooter, FloatingWhatsApp } from "./Storefront";
import { collection, normalizeWhatsApp } from "@/lib/platform";
import { offers, offerById } from "@/lib/offers";
import { emptyLead, steps, total, type LeadInput } from "@/lib/leads";
type Draft = {
  token: string;
  revision: number;
  saved: number;
  data: LeadInput;
  id: string;
};
const storageKey = "wedinvite-order-v1";
const money = (n: number) => "Rs. " + n.toLocaleString("en-PK");
export default function OrderJourney() {
  const [data, setData] = useState<LeadInput>(emptyLead),
    [ready, setReady] = useState(false),
    [status, setStatus] = useState("Preparing your order…"),
    [error, setError] = useState(""),
    [reference, setReference] = useState(""),
    [copied, setCopied] = useState(false);
  const draft = useRef<Draft | null>(null),
    busy = useRef(false),
    conflict = useRef(false),
    lastEdit = useRef(0);
  const persist = (d: Draft) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(d));
      return true;
    } catch {
      return false;
    }
  };
  const pump = useCallback(async () => {
    const d = draft.current;
    if (!d || busy.current || conflict.current || d.revision <= d.saved) return;
    busy.current = true;
    setStatus("Saving…");
    const revision = d.revision;
    const payload = structuredClone(d.data);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + d.token,
        },
        body: JSON.stringify({ revision, data: payload }),
        keepalive: true,
      });
      const result = await r.json();
      if (!r.ok) {
        if (r.status === 409) conflict.current = true;
        throw Error(result.error || "Save failed");
      }
      d.saved = revision;
      d.id = result.id;
      persist(d);
      setReference(result.id);
      setStatus(d.revision === revision ? "All changes saved" : "Saving…");
    } catch (e) {
      setStatus(
        conflict.current
          ? "Newer changes found. Reload to resume."
          : "Connection interrupted — retrying automatically",
      );
      if (conflict.current) setError((e as Error).message);
    } finally {
      busy.current = false;
    }
  }, []);
  useEffect(() => {
    let disposed = false;
    const incoming = new URLSearchParams(location.search);
    (async () => {
      let local: Draft | null = null;
      try {
        local = JSON.parse(localStorage.getItem(storageKey) || "null");
      } catch {}
      if (!local || !/^[a-f0-9]{64}$/.test(local.token) || !local.data)
        local = {
          token: Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
            n.toString(16).padStart(2, "0"),
          ).join(""),
          revision: 0,
          saved: 0,
          data: { ...emptyLead },
          id: "",
        };
      const d = local;
      try {
        const r = await fetch("/api/leads", {
          headers: { Authorization: "Bearer " + d.token },
          cache: "no-store",
        });
        if (!r.ok) throw Error("Resume unavailable");
        const result = await r.json();
        if (result.lead && result.revision >= d.revision) {
          d.data = result.lead;
          d.revision = result.revision;
          d.saved = result.revision;
          d.id = result.id;
        }
      } catch {
        /* The locally queued version is retried once connectivity returns. */
      }
      if (disposed) return;
      const p = incoming;
      let changed = false;
      const template = p.get("template");
      const tier = p.get("tier");
      if (
        template &&
        collection.some((t) => t.id === template) &&
        d.data.template !== template
      ) {
        d.data.template = template;
        changed = true;
      }
      if (tier && offers.some((o) => o.id === tier) && d.data.tier !== tier) {
        d.data.tier = tier as LeadInput["tier"];
        changed = true;
      }
      if (changed && d.revision) d.revision++;
      if (p.has("template") || p.has("tier"))
        history.replaceState(null, "", "/order");
      if (disposed) return;
      draft.current = d;
      persist(d);
      setData({ ...d.data });
      setReference(d.id);
      setReady(true);
      setStatus(
        d.revision > d.saved
          ? "Waiting to save…"
          : d.saved
            ? "All changes saved"
            : "Your progress saves as you type",
      );
    })();
    const timer = setInterval(() => {
      if (Date.now() - lastEdit.current > 450) void pump();
    }, 650);
    const flush = () => void pump();
    window.addEventListener("online", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      disposed = true;
      clearInterval(timer);
      window.removeEventListener("online", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, [pump]);
  const update = (patch: Partial<LeadInput>) => {
    const d = draft.current;
    if (!d) return;
    d.data = { ...d.data, ...patch };
    d.revision++;
    lastEdit.current = Date.now();
    setData({ ...d.data });
    setError("");
    setStatus(
      persist(d)
        ? "Waiting to save…"
        : "Browser storage unavailable — keep this tab open",
    );
  };
  const advance = () => {
    if (data.step === 0) {
      if (!data.name.trim()) {
        setError("Please enter your name.");
        document.getElementById("customer-name")?.focus();
        return;
      }
      if (!/^\d{10,15}$/.test(normalizeWhatsApp(data.phone))) {
        setError("Enter a valid WhatsApp number, for example 03001063545.");
        document.getElementById("customer-phone")?.focus();
        return;
      }
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        setError("Check your email address or leave it blank.");
        return;
      }
    }
    update({ step: Math.min(3, data.step + 1) });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };
  const chosen = collection.find((t) => t.id === data.template)!;
  const offer = offerById(data.tier);
  const message = `Assalam o Alaikum! I’m ${data.name}. Inquiry ${reference || "pending sync"}. I chose ${chosen.name}, ${offer.name} (${money(total(data.tier, data.addons))}). Payment: ${data.paymentClaimed ? "claimed, awaiting manual verification" : "not yet paid"}. ${data.transaction ? "Reference: " + data.transaction + ". " : ""}Please help me with wedding details and delivery.`;
  return (
    <div className="wv order-site" id="top">
      <SiteNav />
      <main className="journey">
        <header className="journey-heading">
          <span className="eyebrow">PERSONALLY MADE. BEAUTIFULLY SHARED.</span>
          <h1>Your celebration starts here.</h1>
          <p>
            A few simple choices. Then our studio takes care of the lovely
            details.
          </p>
        </header>
        <ol className="journey-steps" aria-label="Order progress">
          {steps.map((s, i) => (
            <li
              key={s}
              className={
                data.step === i ? "current" : data.step > i ? "complete" : ""
              }
              aria-current={data.step === i ? "step" : undefined}
            >
              <span>{data.step > i ? "✓" : i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="journey-layout">
          <section className="journey-card">
            <div className="save-line" role="status">
              <span
                className={status === "All changes saved" ? "dot saved" : "dot"}
              />
              {status}
            </div>
            {!ready ? (
              <div className="journey-loading" role="status">
                Preparing your invitation journey…
              </div>
            ) : (
              <>
                {data.step === 0 && (
                  <>
                    <span className="eyebrow">01 / A LITTLE HELLO</span>
                    <h2>First, let’s get acquainted.</h2>
                    <p>Who should our studio help with this invitation?</p>
                    <div className="journey-fields">
                      <label>
                        Your name <span>*</span>
                        <input
                          id="customer-name"
                          autoComplete="name"
                          maxLength={100}
                          value={data.name}
                          onChange={(e) => update({ name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </label>
                      <label>
                        WhatsApp number <span>*</span>
                        <input
                          id="customer-phone"
                          type="tel"
                          autoComplete="tel"
                          maxLength={30}
                          value={data.phone}
                          onChange={(e) => update({ phone: e.target.value })}
                          placeholder="0300 1234567"
                        />
                      </label>
                      <label className="wide">
                        Email <small>optional</small>
                        <input
                          type="email"
                          autoComplete="email"
                          maxLength={150}
                          value={data.email}
                          onChange={(e) => update({ email: e.target.value })}
                          placeholder="you@example.com"
                        />
                      </label>
                    </div>
                    <div className="journey-notice">
                      Your entered details and choices are saved as you go, so
                      you can resume and our studio can help if you leave before
                      finishing. Wedding details will be collected on WhatsApp.
                    </div>
                  </>
                )}
                {data.step === 1 && (
                  <>
                    <span className="eyebrow">02 / MAKE IT YOURS</span>
                    <h2>A design you’ll love to share.</h2>
                    <p>
                      All ten designs are available with every package. Preview
                      one before deciding.
                    </p>
                    <div className="order-designs">
                      {collection.map((t) => (
                        <article
                          className={data.template === t.id ? "selected" : ""}
                          key={t.id}
                        >
                          <button
                            onClick={() => update({ template: t.id })}
                            aria-pressed={data.template === t.id}
                          >
                            <Image width={160} height={240} unoptimized
                              src={"/showcase/" + t.id + ".png"}
                              alt={t.name + " invitation"}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/collection/assets/" + t.asset + "/og.jpg";
                              }}
                            />
                            <span>
                              {t.name} {data.template === t.id ? "✓" : ""}
                            </span>
                          </button>
                          <Link href={"/preview/" + t.id} target="_blank">
                            Preview invitation →
                          </Link>
                        </article>
                      ))}
                    </div>
                    <h3>Choose what you’d like to receive.</h3>
                    <div className="order-offers">
                      {offers.map((o) => (
                        <button
                          key={o.id}
                          className={data.tier === o.id ? "selected" : ""}
                          onClick={() =>
                            update({
                              tier: o.id,
                              ...(o.id === "full" ? { addons: [] } : {}),
                            })
                          }
                          aria-pressed={data.tier === o.id}
                        >
                          <span>{o.name}</span>
                          <strong>{money(o.price)}</strong>
                          <small>{o.deliverables}</small>
                          <ul>
                            {o.includes.map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                    {data.tier !== "full" && (
                      <fieldset className="order-addons">
                        <legend>
                          A little extra <small>optional</small>
                        </legend>
                        {[
                          ["image", "Status image", 300],
                          ["video", "Status video", 500],
                          ["events", "Three event invitation images", 3000],
                        ].map(([id, label, price]) => (
                          <label key={id}>
                            <input
                              type="checkbox"
                              checked={data.addons.includes(String(id))}
                              onChange={(e) =>
                                update({
                                  addons: e.target.checked
                                    ? [...data.addons, String(id)]
                                    : data.addons.filter((a) => a !== id),
                                })
                              }
                            />
                            {label}
                            <span>{money(Number(price))}</span>
                          </label>
                        ))}
                      </fieldset>
                    )}
                  </>
                )}
                {data.step === 2 && (
                  <>
                    <span className="eyebrow">03 / ONE STEP CLOSER</span>
                    <h2>Payment, made simple.</h2>
                    <p>
                      Your studio-made invitation comes to{" "}
                      {money(total(data.tier, data.addons))}. Transfers are
                      checked personally by our team.
                    </p>
                    <div className="payment-accounts">
                      <span>Easypaisa · JazzCash</span>
                      <strong>0300 1063545</strong>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText("03001063545");
                            setCopied(true);
                          } catch {
                            setError("Copy this number manually: 03001063545");
                          }
                        }}
                      >
                        {copied ? "Copied ✓" : "Copy number"}
                      </button>
                      <small>
                        Please confirm the recipient in your payment app before
                        transferring.
                      </small>
                    </div>
                    <div className="journey-fields">
                      <label>
                        Payment method
                        <select
                          value={data.paymentMethod}
                          onChange={(e) =>
                            update({ paymentMethod: e.target.value })
                          }
                        >
                          <option>Easypaisa</option>
                          <option>JazzCash</option>
                        </select>
                      </label>
                      <label>
                        Transaction reference <small>optional</small>
                        <input
                          maxLength={150}
                          value={data.transaction}
                          onChange={(e) =>
                            update({ transaction: e.target.value })
                          }
                          placeholder="Reference from your transfer"
                        />
                      </label>
                    </div>
                    <label className="claim-payment">
                      <input
                        type="checkbox"
                        checked={data.paymentClaimed}
                        onChange={(e) =>
                          update({ paymentClaimed: e.target.checked })
                        }
                      />
                      I have made the transfer. I understand the studio will
                      verify it manually.
                    </label>
                    <div className="journey-notice">
                      You can continue to speak with us before paying. Send your
                      receipt on WhatsApp; checking this box does not verify
                      payment.
                    </div>
                  </>
                )}
                {data.step === 3 && (
                  <>
                    <span className="eyebrow">
                      04 / WE’LL TAKE IT FROM HERE
                    </span>
                    <h2>Let’s bring your story to life.</h2>
                    <p>
                      Your choices are ready. Share your wedding details with
                      our studio on WhatsApp—we’ll guide you through everything
                      and coordinate delivery.
                    </p>
                    <div className="handoff-reference">
                      <small>YOUR INQUIRY REFERENCE</small>
                      <strong>{reference || "Saving your reference…"}</strong>
                    </div>
                    <ol className="handoff-list">
                      <li>
                        <b>Say hello on WhatsApp</b>
                        <span>
                          Your design, package and reference are already in the
                          message.
                        </span>
                      </li>
                      <li>
                        <b>Share your celebration details</b>
                        <span>
                          Names, dates, venues and any special wishes. Send your
                          receipt there too.
                        </span>
                      </li>
                      <li>
                        <b>Review, then share the joy</b>
                        <span>
                          We create your invitation and deliver your link within
                          24 hours after complete details and payment
                          verification.
                        </span>
                      </li>
                    </ol>
                    <a
                      className="journey-primary whatsapp"
                      href={
                        "https://wa.me/923001063545?text=" +
                        encodeURIComponent(message)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        update({ whatsappOpened: true });
                        void pump();
                      }}
                    >
                      Continue on WhatsApp →
                    </a>
                    <p className="fine-print">
                      Tap Send in WhatsApp to reach us. Opening WhatsApp alone
                      does not send your message.
                    </p>
                  </>
                )}
                {error && (
                  <p role="alert" className="journey-error">
                    {error}
                  </p>
                )}
                <div className="journey-actions">
                  {data.step > 0 ? (
                    <button onClick={() => update({ step: data.step - 1 })}>
                      ← Back
                    </button>
                  ) : (
                    <Link href="/templates">← Explore designs</Link>
                  )}
                  {data.step < 3 && (
                    <button className="journey-primary" onClick={advance}>
                      {
                        [
                          "Choose my invitation",
                          "Continue to payment",
                          "Continue to WhatsApp details",
                        ][data.step]
                      }{" "}
                      →
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
          <aside className="order-summary">
            <span className="eyebrow">YOUR INVITATION</span>
            <h2>{chosen.name}</h2>
            <p>{chosen.line}</p>
            <Link target="_blank" href={"/preview/" + chosen.id}>
              Experience this design →
            </Link>
            <hr />
            <strong>{offer.name}</strong>
            <p>{offer.deliverables}</p>
            <ul>
              {offer.includes.slice(1, 4).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <div className="summary-total">
              <span>Total</span>
              <strong>{money(total(data.tier, data.addons))}</strong>
            </div>
            <p className="fine-print">
              Two edit requests included. Sharing files are personally prepared
              by our studio.
            </p>
            <div className="summary-help">
              <b>A real person, every step.</b>
              <p>Wedding details and delivery are coordinated on WhatsApp.</p>
              <a
                href="https://wa.me/923001063545"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask the studio →
              </a>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
