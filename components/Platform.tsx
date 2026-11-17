"use client";
import AdminOrders from "./AdminOrders";
import { EventOptions, TemplateSettings } from "./TemplateEditor";
import StudioPreview from "./StudioPreview";
import { eventId } from "@/lib/template-config";
import {
  detailIssues,
  customizationIssues,
  type DetailIssue,
} from "@/lib/invitation-validation";
import { offerById } from "@/lib/offers";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteNav as Nav, SiteFooter as Footer } from "./Storefront";
import {
  collection,
  prices,
  normalizeWhatsApp,
  type Details,
  type Order,
} from "@/lib/platform";
const wa = "https://wa.me/923001063545";
const money = (n: number) => "Rs. " + n.toLocaleString("en-PK");
export {
  Wordmark as Brand,
  SiteNav as Nav,
  SiteFooter as Footer,
} from "./Storefront";
async function api(body: Record<string, unknown>) {
  const r = await fetch("/api/platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  if (!r.ok) throw Error(d.error);
  return d;
}
const initial: Details = {
  groom: "",
  bride: "",
  groomUr: "",
  brideUr: "",
  family: "",
  phone: "",
  events: [
    {
      id: "event-1",
      name: "Baraat",
      date: "",
      time: "19:00",
      venue: "",
      address: "",
    },
  ],
};
export function Workspace({
  mode,
}: {
  mode: "studio" | "dashboard" | "admin" | "login" | "checkout";
}) {
  const [data, D] = useState<{
    user?: { email: string };
    admin?: boolean;
    orders: Order[];
    rsvps: {
      orderId: string;
      name: string;
      count: number;
      attending: boolean;
    }[];
  }>({ orders: [], rsvps: [] });
  const [leadId, setLeadId] = useState("");
  const [step, S] = useState(0),
    [template, T] = useState("gulistan"),
    [tier, P] = useState<keyof typeof prices>("premium"),
    [details, V] = useState<Details>(initial),
    [addons, A] = useState<string[]>([]),
    [id, I] = useState(""),
    [error, E] = useState(""),
    [busy, B] = useState(false),
    [tab, Q] = useState("register"),
    [notice, N] = useState(""),
    [slug, SL] = useState(""),
    [search, Search] = useState("");
  const savedNavigation = useRef(false);
  const savedOrder = data.orders.find((order) => order.id === id);
  const snapshot = JSON.stringify({ template, tier, details, addons, slug });
  const baseline = savedOrder
    ? JSON.stringify({
        template: savedOrder.template,
        tier: savedOrder.tier,
        details: {
          ...savedOrder.details,
          events: savedOrder.details.events.map((e, i) => ({
            ...e,
            id: eventId(e, i),
          })),
        },
        addons: savedOrder.addons,
        slug: savedOrder.slug || "",
      })
    : JSON.stringify({
        template: "gulistan",
        tier: "premium",
        details: initial,
        addons: [],
        slug: "",
      });
  const dirty =
    mode === "studio" &&
    data.admin &&
    (!id || savedOrder) &&
    snapshot !== baseline;
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (savedNavigation.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const leave = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !link ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.getAttribute("href")?.startsWith("#") ||
        savedNavigation.current
      )
        return;
      if (
        !window.confirm(
          "You have unsaved invitation changes. Leave without saving?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);
  const [issues, setIssues] = useState<DetailIssue[]>([]);
  const goToStep = (next: number) => {
    const found = detailIssues(details, offerById(tier).events).filter(
      (i) => i.step < next,
    );
    setIssues(found);
    E("");
    if (!found.length && next === 3 && !slug)
      SL(
        [details.groom, details.bride]
          .join("-and-")
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 70),
      );
    S(found.length ? found[0].step : next);
  };
  useEffect(() => {
    if (issues.length) {
      const input = document.querySelector<HTMLInputElement>(
        `[name="${issues[0].field}"]`,
      );
      input?.focus();
    }
  }, [issues, step]);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/platform", { cache: "no-store" });
      if (!response.ok) throw Error("Unable to refresh orders. Please retry.");
      D(await response.json());
    } catch (e) {
      E((e as Error).message);
    }
  }, []);
  useEffect(() => {
    refresh();
    const p = new URLSearchParams(location.search);
    if (collection.some((t) => t.id === p.get("template")))
      T(p.get("template")!);
    if (p.get("tier") && Object.hasOwn(prices, p.get("tier")!))
      P(p.get("tier") as keyof typeof prices);
    I(p.get("order") || "");
    if (p.get("lead"))
      fetch("/api/crm")
        .then((r) => r.json())
        .then((d) => {
          const lead = d.leads?.find(
            (l: { id: string }) => l.id === p.get("lead"),
          );
          if (lead) {
            setLeadId(lead.id);
            T(lead.template);
            P(lead.tier);
            A(lead.addons);
            V((v) => ({ ...v, phone: lead.phone }));
          }
        });
  }, []);
  useEffect(() => {
    const edit = new URLSearchParams(location.search).get("order");
    const o = data.orders.find((o) => o.id === edit);
    if (o) {
      I(o.id);
      T(o.template);
      P(o.tier);
      V({
        ...o.details,
        events: o.details.events.map((e, i) => ({ ...e, id: eventId(e, i) })),
      });
      A(o.addons);
      SL(o.slug || "");
    }
  }, [data.orders]);
  const act = async (body: Record<string, unknown>) => {
    B(true);
    E("");
    try {
      const result = await api(body);
      await refresh();
      return result;
    } catch (e) {
      E((e as Error).message);
    } finally {
      B(false);
    }
  };
  const total =
    prices[tier] +
    (tier === "full"
      ? 0
      : addons.reduce(
          (n, x) => n + ({ image: 300, video: 500, events: 3000 }[x] || 0),
          0,
        ));
  const field = (
    label: string,
    key: "groom" | "bride" | "groomUr" | "brideUr" | "family" | "phone",
    placeholder = "",
  ) => (
    <label>
      {label}
      <input
        required={["groom", "bride", "phone"].includes(key)}
        aria-label={label}
        name={key}
        type={key === "phone" ? "tel" : "text"}
        aria-invalid={issues.some((i) => i.field === key)}
        value={details[key]}
        placeholder={placeholder}
        onChange={(e) => V({ ...details, [key]: e.target.value })}
      />
      {key === "phone" && (
        <small>
          Use 03001063545 or +923001063545. This is the customer’s contact
          number.
        </small>
      )}
      {issues
        .filter((i) => i.field === key)
        .map((i) => (
          <small className="field-error" key={i.field}>
            {i.message}
          </small>
        ))}
    </label>
  );
  const auth = (
    <form
      className="panel auth"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const r = await act({
          action: "admin-login",
          username: f.get("username"),
          password: f.get("password"),
        });
        if (r) N("Welcome to the studio.");
      }}
    >
      <span className="big-flower">❦</span>
      <h2>The studio desk</h2>
      <p>
        Sign in to create invitations, review payments and manage your couples.
      </p>
      <label>
        Username
        <input
          name="username"
          required
          autoComplete="username"
          placeholder="Your studio username"
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>
      <button disabled={busy} className="button">
        {busy ? "One moment…" : "Open studio desk ↗"}
      </button>
    </form>
  );
  if (mode === "admin" && data.admin)
    return (
      <AdminOrders
        orders={data.orders}
        rsvps={data.rsvps}
        busy={busy}
        error={error}
        act={act}
        refresh={refresh}
      />
    );
  const order = data.orders.find((o) => o.id === id) || data.orders[0];
  return (
    <div className="platform">
      <Nav />
      <main className="workspace">
        <div className="workspace-heading">
          <div className="eyebrow">YOUR LITTLE CORNER OF FOREVER</div>
          <h1>
            {mode === "studio"
              ? "The invitation studio"
              : mode === "admin"
                ? "The studio desk"
                : mode === "checkout"
                  ? "One step closer to forever."
                  : "Your celebrations"}
          </h1>
          <p>
            {mode === "studio"
              ? "1. Enter the customer’s details. 2. Save and preview the private invitation. 3. Verify payment, activate, and share the live link."
              : "From the first little detail to the final “you’re invited”."}
          </p>
        </div>
        {error && (
          <div role="alert" className="alert">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="alert success">
            {notice}
          </div>
        )}
        {mode === "admin" && !data.admin ? (
          auth
        ) : mode === "studio" && !data.admin ? (
          auth
        ) : mode !== "admin" && mode !== "studio" && !data.user ? (
          auth
        ) : mode === "studio" ? (
          <div className="studio-layout">
            <section className="panel">
              <div className="progress">
                {[
                  "Design & package",
                  "Couple & contact",
                  "Events & venues",
                  "Review & save",
                ].map((s, i) => (
                  <button
                    key={s}
                    onClick={() => goToStep(i)}
                    className={step === i ? "active" : ""}
                  >
                    {i + 1}. {s}
                  </button>
                ))}
              </div>
              <p role="status" className="editor-save-state">
                {dirty
                  ? "Unsaved changes · use Review & save to keep them."
                  : "No unsaved changes."}
              </p>
              <form
                noValidate
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (step < 3) {
                    goToStep(step + 1);
                    return;
                  }
                  const found = [
                    ...detailIssues(details, offerById(tier).events),
                    ...customizationIssues(details),
                  ];
                  setIssues(found);
                  if (found.length) {
                    S(found[0].step);
                    return;
                  }
                  if (!e.currentTarget.reportValidity()) return;
                  const r = await act({
                    action: "save",
                    suiteVersion: 2,
                    contentRevision: id
                      ? data.orders.find((o) => o.id === id)?.contentRevision ||
                        0
                      : undefined,
                    leadId,
                    id,
                    template,
                    tier,
                    details,
                    addons,
                    slug,
                  });
                  if (r) {
                    savedNavigation.current = true;
                    location.href = "/admin";
                  }
                }}
              >
                {issues.length > 0 && (
                  <div role="alert" className="alert">
                    <strong>Complete these details to continue:</strong>
                    <ul>
                      {issues.map((i) => (
                        <li key={i.field}>{i.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {step === 0 ? (
                  <>
                    <h2>Choose a design and package</h2>
                    <div className="design-picker">
                      {collection.map((t) => (
                        <button
                          type="button"
                          className={template === t.id ? "chosen" : ""}
                          onClick={() => T(t.id)}
                          key={t.id}
                        >
                          <b>{t.name}</b>
                          <small>{t.palette}</small>
                        </button>
                      ))}
                    </div>
                    <h3>Customer’s package</h3>
                    <div className="package-picker">
                      {Object.entries(prices).map(([k, v]) => (
                        <button
                          type="button"
                          className={tier === k ? "chosen" : ""}
                          key={k}
                          onClick={() => P(k as keyof typeof prices)}
                        >
                          {offerById(k as keyof typeof prices).name}
                          <b>{money(v)}</b>
                        </button>
                      ))}
                    </div>
                    <p>
                      {offerById(tier).deliverables}.{" "}
                      {offerById(tier).includes.join(" · ")}
                    </p>
                    {details.events.length > offerById(tier).events && (
                      <p role="alert">
                        This package includes {offerById(tier).events} event.
                        Remove extra events or choose The wedding website.
                      </p>
                    )}
                    {tier !== "full" && (
                      <div className="addons">
                        {[
                          ["image", "WhatsApp status image", 300],
                          ["video", "WhatsApp status video", 500],
                          ["events", "Complete event pack", 3000],
                        ].map(([k, l, p]) => (
                          <label key={k}>
                            <input
                              type="checkbox"
                              checked={addons.includes(k as string)}
                              onChange={(e) =>
                                A(
                                  e.target.checked
                                    ? [...addons, k as string]
                                    : addons.filter((x) => x !== k),
                                )
                              }
                            />
                            {l} <b>+{money(p as number)}</b>
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                ) : step === 1 ? (
                  <>
                    <h2>Couple and customer contact</h2>
                    <div className="form-grid">
                      {field("Groom’s name", "groom", "e.g. Bilal Ahmed")}
                      {field("Bride’s name", "bride", "e.g. Mahrukh Khan")}
                      {field(
                        "Groom’s name in Urdu (optional)",
                        "groomUr",
                        "بلال",
                      )}
                      {field(
                        "Bride’s name in Urdu (optional)",
                        "brideUr",
                        "ماہ رخ",
                      )}
                      {field(
                        "Host / family message (optional)",
                        "family",
                        "Together with their families",
                      )}
                      {field(
                        "Customer WhatsApp number",
                        "phone",
                        "03001234567",
                      )}
                    </div>
                  </>
                ) : step === 2 ? (
                  <>
                    <h2>Event dates, times and venues</h2>
                    <p>All dates and times are Pakistan local time.</p>
                    {details.events.map((ev, i) => (
                      <div className="event-form" key={eventId(ev, i)}>
                        <div className="row">
                          <h3>Celebration {i + 1}</h3>
                          <div className="event-reorder">
                            <button
                              type="button"
                              disabled={i === 0}
                              aria-label={"Move " + ev.name + " up"}
                              onClick={() => {
                                const events = [...details.events];
                                [events[i - 1], events[i]] = [
                                  events[i],
                                  events[i - 1],
                                ];
                                V({ ...details, events });
                              }}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={i === details.events.length - 1}
                              aria-label={"Move " + ev.name + " down"}
                              onClick={() => {
                                const events = [...details.events];
                                [events[i], events[i + 1]] = [
                                  events[i + 1],
                                  events[i],
                                ];
                                V({ ...details, events });
                              }}
                            >
                              ↓
                            </button>
                          </div>
                          {details.events.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                V({
                                  ...details,
                                  primaryEventId:
                                    details.primaryEventId === eventId(ev, i)
                                      ? undefined
                                      : details.primaryEventId,
                                  events: details.events.filter(
                                    (_, j) => i !== j,
                                  ),
                                })
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="form-grid">
                          {(
                            [
                              "name",
                              "date",
                              "time",
                              "venue",
                              "address",
                            ] as const
                          ).map((k) => (
                            <label key={k}>
                              {
                                {
                                  name: "Event name",
                                  date: "Date",
                                  time: "Time",
                                  venue: "Venue name",
                                  address: "Venue address (optional)",
                                }[k]
                              }
                              <input
                                name={"events." + i + "." + k}
                                aria-invalid={issues.some(
                                  (issue) =>
                                    issue.field === "events." + i + "." + k,
                                )}
                                required={k !== "address"}
                                type={k === "date" || k === "time" ? k : "text"}
                                value={ev[k]}
                                onChange={(e) =>
                                  V({
                                    ...details,
                                    events: details.events.map((v, j) =>
                                      j === i
                                        ? { ...v, [k]: e.target.value }
                                        : v,
                                    ),
                                  })
                                }
                              />
                            </label>
                          ))}
                        </div>
                        <EventOptions
                          event={ev}
                          index={i}
                          template={template}
                          onChange={(updated) =>
                            V({
                              ...details,
                              events: details.events.map((e, j) =>
                                j === i ? updated : e,
                              ),
                            })
                          }
                        />
                      </div>
                    ))}
                    {details.events.length < offerById(tier).events && (
                      <button
                        type="button"
                        className="outline-button"
                        onClick={() =>
                          V({
                            ...details,
                            events: [
                              ...details.events,
                              {
                                id: crypto.randomUUID(),
                                name:
                                  ["Mehndi", "Baraat", "Walima"][
                                    details.events.length
                                  ] || "Celebration",
                                date: "",
                                time: "19:00",
                                venue: "",
                                address: "",
                              },
                            ],
                          })
                        }
                      >
                        + Add a celebration
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <TemplateSettings
                      template={template}
                      details={details}
                      onChange={V}
                    />
                    <h2>Review the invitation and save</h2>
                    <div className="review">
                      <h3>
                        {details.groom || "Groom"} & {details.bride || "Bride"}
                      </h3>
                      <p>
                        {collection.find((t) => t.id === template)?.name} ·{" "}
                        {offerById(tier).name} package
                      </p>
                      {details.events.map((ev, i) => (
                        <p key={i}>
                          {ev.name} · {ev.date} · {ev.time}
                          <br />
                          {ev.venue}, {ev.address}
                        </p>
                      ))}
                      <label>
                        Custom invitation URL
                        <input
                          required
                          value={slug}
                          onChange={(e) =>
                            SL(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, ""),
                            )
                          }
                          placeholder="bilal-and-mahrukh"
                          pattern="[a-z0-9-]{3,80}"
                        />
                        <small>
                          wedinvite.pk/invite/{slug || "your-couple-name"}
                        </small>
                      </label>
                      <p>Customer WhatsApp: {details.phone}</p>
                      <strong>{money(total)}</strong>
                    </div>
                    <p>
                      {id
                        ? "Saved changes update this invitation immediately."
                        : "Your invitation stays private until we verify your payment."}{" "}
                      Image and video add-ons are fulfilled by the studio within
                      24 hours of confirmation and complete details.
                    </p>
                    <label className="check">
                      <input required type="checkbox" /> I’ve checked the names,
                      dates and venues.
                    </label>
                  </>
                )}
                <div className="form-actions">
                  {step > 0 && (
                    <button
                      type="button"
                      className="outline-button"
                      onClick={() => S(step - 1)}
                    >
                      ← Back
                    </button>
                  )}
                  <button className="button" disabled={busy}>
                    {busy
                      ? "Saving…"
                      : step === 3
                        ? id
                          ? "Save invitation changes ↗"
                          : "Create private invitation ↗"
                        : "Next little detail →"}
                  </button>
                </div>
              </form>
            </section>
            <aside className="preview-panel">
              <div className="eyebrow">
                YOUR DESIGN · {collection.find((t) => t.id === template)?.name}
              </div>
              <StudioPreview
                template={template}
                details={details}
                tier={tier}
              />
              <iframe
                title="Interactive design sample"
                src={"/collection/card-" + template + ".html"}
              />
              <p>
                Original design sample · use Personalized preview above to see
                your current edits.
              </p>
              <strong>{money(total)}</strong>
              <small>One payment. A beautiful beginning.</small>
            </aside>
          </div>
        ) : mode === "checkout" ? (
          order ? (
            <div className="checkout-grid">
              <section className="panel">
                <span className="status">{order.status}</span>
                <h2>
                  A little transfer.
                  <br />A beautiful beginning.
                </h2>
                <p>
                  {order.details.groom} & {order.details.bride} ·{" "}
                  {order.template}
                </p>
                <h3>{money(order.amount)}</h3>
                <div className="payment-box">
                  <small>EASYPAISA / JAZZCASH</small>
                  <h3>0300 1063545</h3>
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText("03001063545")
                        .then(() => N("Payment number copied."))
                    }
                  >
                    Copy account number ↗
                  </button>
                </div>
                <p>
                  Check the recipient in your payment app before transferring.
                  Keep the receipt, then enter the transaction reference below.
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    const r = await act({
                      action: "submit",
                      id: order.id,
                      transaction: f.get("transaction"),
                    });
                    if (r)
                      N(
                        "Payment submitted for review. Send your receipt using the WhatsApp button below.",
                      );
                  }}
                >
                  <label>
                    Transaction reference
                    <input
                      name="transaction"
                      required
                      placeholder="Your Easypaisa / JazzCash transaction ID"
                      disabled={!["draft", "changes"].includes(order.status)}
                    />
                  </label>
                  <button
                    disabled={
                      busy || !["draft", "changes"].includes(order.status)
                    }
                    className="button"
                  >
                    Submit payment for review ↗
                  </button>
                </form>
                <a
                  className="outline-button"
                  href={
                    wa +
                    "?text=" +
                    encodeURIComponent(
                      "Assalam o Alaikum! Please verify my wedinvite.pk payment. Order: " +
                        order.id +
                        " | " +
                        order.details.groom +
                        " & " +
                        order.details.bride +
                        " | " +
                        money(order.amount) +
                        ". I will attach my payment receipt here.",
                    )
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Send receipt on WhatsApp ↗
                </a>
                <p className="fine">
                  WhatsApp opens a prepared message. Please attach the receipt
                  yourself. Sending a message does not automatically verify
                  payment.
                </p>
              </section>
              <section className="panel">
                <h2>Your invitation, in the making.</h2>
                <iframe
                  className="checkout-preview"
                  src={"/invite/" + order.id + "?preview=1"}
                  title="Your personalized preview"
                />
                <Link className="text-link" href="/dashboard">
                  Back to your dashboard ↗
                </Link>
              </section>
            </div>
          ) : (
            <p>
              No invitation saved yet.{" "}
              <Link href="https://wa.me/923001063545?text=Assalam%20o%20Alaikum!%20I%20would%20love%20a%20wedding%20invitation.">
                Start in the studio →
              </Link>
            </p>
          )
        ) : (
          <>
            <div className="dashboard-bar">
              <p>
                {mode === "admin"
                  ? data.orders.filter((o) => o.status === "pending").length +
                    " payments waiting for your review"
                  : data.user?.email}
              </p>
              <Link className="button small" href="/admin/create">
                + Create invitation
              </Link>
              <Link href="/admin/crm">Leads & CRM →</Link>
              <button disabled={busy} onClick={() => act({ action: "logout" })}>
                Sign out
              </button>
            </div>
            {mode === "admin" && (
              <>
                <div className="admin-stats">
                  <div>
                    <small>CELEBRATIONS CREATED</small>
                    <strong>{data.orders.length}</strong>
                  </div>
                  <div>
                    <small>LIVE INVITATIONS</small>
                    <strong>
                      {
                        data.orders.filter((o) => o.status === "approved")
                          .length
                      }
                    </strong>
                  </div>
                  <div>
                    <small>GUEST REPLIES</small>
                    <strong>{data.rsvps.length}</strong>
                  </div>
                </div>
                <label>
                  Find a celebration
                  <input
                    placeholder="Search couple, design or custom URL…"
                    value={search}
                    onChange={(e) => Search(e.target.value)}
                  />
                </label>
              </>
            )}
            <div className="order-grid">
              {data.orders.length === 0 && (
                <section className="panel empty">
                  <span>✉︎</span>
                  <h2>Your first little link awaits.</h2>
                  <p>Choose a design and start your wedding story.</p>
                  <Link href="/admin/create" className="button">
                    Create an invitation ↗
                  </Link>
                </section>
              )}
              {data.orders
                .filter((o) =>
                  `${o.details.groom} ${o.details.bride} ${o.slug} ${o.template}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((o) => (
                  <article key={o.id} className="panel order">
                    <span className={"status " + o.status}>
                      {o.status === "approved"
                        ? "Live & lovely"
                        : o.status === "pending"
                          ? "Payment in review"
                          : o.status === "changes"
                            ? "Needs your attention"
                            : "Private draft"}
                    </span>
                    <h2>
                      {o.details.groom} <em>&</em> {o.details.bride}
                    </h2>
                    <p>
                      {o.template} · {o.tier} · {money(o.amount)}
                    </p>
                    <small>Order {o.id}</small>
                    <p className="order-next-step">
                      <strong>Next step: </strong>
                      {o.status === "approved"
                        ? "Copy the live link and send it to the customer."
                        : o.status === "changes"
                          ? "Edit the requested details, preview, then verify payment and activate."
                          : "Preview the saved details. After confirming payment, activate the invitation to unlock the customer’s link."}
                    </p>
                    {o.note && <p className="alert">Studio note: {o.note}</p>}
                    <div className="order-events">
                      {o.details.events.map((ev, i) => (
                        <p key={i}>
                          <b>{ev.name}</b> {ev.date} · {ev.venue}
                        </p>
                      ))}
                    </div>
                    <div className="actions">
                      <Link
                        className="outline-button"
                        href={"/invite/" + (o.slug || o.id) + "?preview=1"}
                      >
                        Preview ↗
                      </Link>
                      {o.status === "approved" ? (
                        <>
                          <button
                            className="button"
                            onClick={() =>
                              navigator.clipboard
                                .writeText(
                                  location.origin +
                                    "/invite/" +
                                    (o.slug || o.id),
                                )
                                .then(() =>
                                  N(
                                    "Invitation link copied. Ready to share with love.",
                                  ),
                                )
                            }
                          >
                            Copy live link ↗
                          </button>
                          <a
                            className="text-link"
                            href={
                              "https://wa.me/?text=" +
                              encodeURIComponent(
                                "With love, you’re invited to " +
                                  o.details.groom +
                                  " & " +
                                  o.details.bride +
                                  "’s wedding. " +
                                  (typeof location !== "undefined"
                                    ? location.origin
                                    : "") +
                                  "/invite/" +
                                  (o.slug || o.id),
                              )
                            }
                          >
                            Share on WhatsApp ↗
                          </a>
                        </>
                      ) : (
                        <span className="fine">
                          Sharing unlocks after studio activation.
                        </span>
                      )}
                    </div>
                    {mode === "admin" && (
                      <>
                        <Link
                          className="text-link"
                          href={"/admin/create?order=" + o.id}
                        >
                          Edit invitation details ↗
                        </Link>
                        <p>
                          Contact: {o.details.phone}
                          <br />
                          Transaction: {o.transaction || "Not submitted"}
                        </p>
                        {["draft", "pending", "changes"].includes(o.status) && (
                          <div className="actions">
                            <button
                              className="button"
                              disabled={busy}
                              onClick={() =>
                                act({ action: "approve", id: o.id })
                              }
                            >
                              Verify payment & activate
                            </button>
                            <button
                              className="outline-button"
                              disabled={busy}
                              onClick={() => {
                                const note = prompt(
                                  "Explain what the customer needs to correct:",
                                );
                                if (note)
                                  act({ action: "changes", id: o.id, note });
                              }}
                            >
                              Request correction
                            </button>
                          </div>
                        )}
                        <a
                          className="text-link"
                          href={
                            "https://wa.me/" +
                            normalizeWhatsApp(o.details.phone) +
                            "?text=" +
                            encodeURIComponent(
                              "Your wedinvite.pk order " +
                                o.id +
                                " is " +
                                o.status +
                                ". " +
                                (o.status === "approved"
                                  ? location.origin +
                                    "/invite/" +
                                    (o.slug || o.id)
                                  : ""),
                            )
                          }
                        >
                          Message customer ↗
                        </a>
                      </>
                    )}
                    {o.status === "approved" && (
                      <div>
                        <h3>Guest replies</h3>
                        {data.rsvps
                          .filter((r) => r.orderId === o.id)
                          .map((r, i) => (
                            <p key={i}>
                              {r.name} ·{" "}
                              {r.attending
                                ? r.count + " attending"
                                : "Unable to attend"}
                            </p>
                          ))}
                        {!data.rsvps.some((r) => r.orderId === o.id) && (
                          <p>
                            No replies yet. Share your invitation to get
                            started.
                          </p>
                        )}
                        <a
                          href={
                            wa +
                            "?text=" +
                            encodeURIComponent(
                              "Edit / deliverables request for order " + o.id,
                            )
                          }
                          className="text-link"
                        >
                          Request edits or package deliverables ↗
                        </a>
                      </div>
                    )}
                  </article>
                ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
