"use client";
import { useState } from "react";
import {
  Check,
  ArrowUpRight,
  MessageCircle,
  ChevronDown,
  CalendarDays,
  ImageIcon,
  Film,
  Globe,
  Plus,
} from "lucide-react";
import { offers, offerById, type OfferId } from "@/lib/offers";
const money = (n: number) => "Rs. " + n.toLocaleString("en-PK");
export function OfferPicker({
  design,
  value,
  onChange,
}: {
  design: string;
  value: OfferId;
  onChange: (id: OfferId) => void;
}) {
  const current = offerById(value);
  return (
    <section
      className="at-offer-picker"
      aria-label="Choose your invitation package"
    >
      <div className="at-picker-heading">
        <span>02 / CHOOSE WHAT YOU NEED</span>
        <a href="#package-comparison">Compare all inclusions ↓</a>
      </div>
      <div
        className="at-offer-options"
        role="radiogroup"
        aria-label="Invitation package"
      >
        {offers.map((o) => (
          <button
            type="button"
            role="radio"
            aria-checked={value === o.id}
            key={o.id}
            className={value === o.id ? "selected" : ""}
            onClick={() => onChange(o.id)}
          >
            <span className="at-radio">
              {value === o.id && <Check size={13} />}
            </span>
            <span>
              <strong>{o.name}</strong>
              <small>{o.deliverables}</small>
            </span>
            <b>{money(o.price)}</b>
          </button>
        ))}
      </div>
      <div className="at-selected-offer" aria-live="polite">
        <div>
          <Check size={16} />
          <strong>Included with {design}</strong>
        </div>
        <ul>
          {current.includes.map((s) => (
            <li key={s}>
              <Check size={14} />
              {s}
            </li>
          ))}
        </ul>
        <p>{current.extra}</p>
      </div>
      <a className="at-primary" href={'/order?'+new URLSearchParams({template:(design||'gulistan').toLowerCase().replace(/\s/g,''),tier:value})}>
        <MessageCircle size={18} />
        Choose {design}
        <ArrowUpRight size={19} />
      </a>
      <p className="at-order-note">
        Choose your details, then coordinate with our studio on WhatsApp.
        <br />
        We confirm your details before you pay.
      </p>
      <div className="at-service-line">
        <span>Studio-created</span>
        <span>2 edit requests</span>
        <span>24-hour delivery*</span>
      </div>
      <small className="at-delivery-note">
        *After complete details and payment verification. Images and video are
        prepared by our studio.
      </small>
    </section>
  );
}
export function PackageComparison({ design }: { design?: string }) {
  const [selected, setSelected] = useState<OfferId>("premium");
  const rows: [string, string, string, string][] = [
    ["Personalized website", "Included", "Included", "Included"],
    ["Events on your website", "1 event", "Up to 3", "Up to 3"],
    ["All 10 original designs", "Included", "Included", "Included"],
    ["Maps, calendar & countdown", "Included", "Included", "Included"],
    ["Guest reply collection", "Included", "Included", "Included"],
    [
      "WhatsApp status images",
      "Optional · Rs. 300 each",
      "Optional · Rs. 300 each",
      "2 images included",
    ],
    [
      "WhatsApp status video",
      "Optional · Rs. 500",
      "Optional · Rs. 500",
      "1 video included",
    ],
    [
      "Separate event images",
      "Optional · Rs. 3,000 / set",
      "Optional · Rs. 3,000 / set",
      "3 images included",
    ],
    ["Support edit requests", "2", "2", "2"],
  ];
  return (
    <section
      className="at-pricing"
      id={design ? "package-comparison" : "packages"}
    >
      <div className="at-section-title">
        <span className="at-kicker">
          THE RIGHT INVITATION. THE RIGHT PACKAGE.
        </span>
        <h2>
          Choose the celebration.
          <br />
          <em>We’ll take care of the invitation.</em>
        </h2>
        <p>
          Every package includes your chosen design and personal studio setup.
          <br />
          The difference is the number of events and the files you receive.
        </p>
      </div>
      <div className="at-pricing-tabs" aria-label="View package">
        {offers.map((o) => (
          <button
            key={o.id}
            aria-pressed={selected === o.id}
            onClick={() => setSelected(o.id)}
          >
            {o.name}
          </button>
        ))}
      </div>
      <div className="at-price-grid">
        {offers.map((o, i) => (
          <article
            key={o.id}
            className={
              (selected === o.id ? "mobile-selected " : "") +
              (i === 1 ? "featured" : "")
            }
          >
            <div className="at-price-label">
              0{i + 1} / {["ONE OCCASION", "THE WEDDING", "EVERY FORMAT"][i]}
              {i === 1 && <span>For multiple events</span>}
            </div>
            <h3>{o.name}</h3>
            <p>{o.label}</p>
            <div className="at-price">
              {money(o.price)}
              <small>one-time payment</small>
            </div>
            <div className="at-deliverable-art">
              <Globe />
              <span>{o.events === 1 ? "1 event" : "Up to 3 events"}</span>
              {o.id === "full" && (
                <>
                  <Plus size={14} />
                  <ImageIcon />
                  <Film />
                </>
              )}
            </div>
            <strong className="at-deliverable-label">{o.deliverables}</strong>
            <ul>
              {o.includes.map((f) => (
                <li key={f}>
                  <Check size={15} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              className={i === 1 ? "at-primary" : "at-secondary"}
              href={'/order?'+new URLSearchParams({template:(design||'gulistan').toLowerCase().replace(/\s/g,''),tier:o.id})}
            >
              Choose this package
              <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </div>
      <details className="at-compare-table" open={!!design}>
        <summary>
          See the exact differences
          <ChevronDown size={18} />
        </summary>
        <div className="at-table-scroll">
          <table>
            <caption>
              Package inclusions. All prices in Pakistani rupees.
            </caption>
            <thead>
              <tr>
                <th>What you receive</th>
                {offers.map((o) => (
                  <th key={o.id}>
                    {o.name}
                    <small>{money(o.price)}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((v, i) =>
                    i === 0 ? (
                      <th scope="row" key={i}>
                        {v}
                      </th>
                    ) : (
                      <td key={i}>{v}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <div className="at-pricing-note">
        <CalendarDays size={20} />
        <p>
          <strong>Have a different kind of celebration?</strong> Tell us on
          WhatsApp. We’ll confirm the scope and total before you pay. Additional
          work is quoted first.
        </p>
      </div>
    </section>
  );
}
