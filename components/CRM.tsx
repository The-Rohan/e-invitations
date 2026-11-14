"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  stages,
  steps,
  total,
  inactivityMinutes,
  type PublicLead,
} from "@/lib/leads";
import { normalizeWhatsApp } from "@/lib/platform";
type OrderLink = { id: string; slug?: string; status: string };
const date = (s: string) =>
  s
    ? new Date(s).toLocaleString("en-PK", {
        timeZone: "Asia/Karachi",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
export default function CRM() {
  const [leads, setLeads] = useState<PublicLead[]>([]),
    [orders, setOrders] = useState<OrderLink[]>([]),
    [selected, setSelected] = useState(""),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All"),
    [stage, setStage] = useState("All"),
    [error, setError] = useState(""),
    [auth, setAuth] = useState(false),
    [loaded, setLoaded] = useState(false),
    [synced, setSynced] = useState(""),
    [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/crm", { cache: "no-store" });
      if (r.status === 401) {
        setAuth(true);
        setLeads([]);
        return;
      }
      if (!r.ok) throw Error("Live updates interrupted. Retrying…");
      const d = await r.json();
      setLeads(d.leads);
      setOrders(d.orders);
      const linkedOrder = new URLSearchParams(location.search).get("order");
      if (linkedOrder) {
        setSelected(
          d.leads.find((l: PublicLead) => l.orderId === linkedOrder)?.id || "",
        );
        history.replaceState(null, "", "/admin/crm");
      }
      setSynced(d.now);
      setAuth(false);
      setLoaded(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    const initial = setTimeout(() => void refresh(), 0);
    const t = setInterval(() => void refresh(), 2000);
    return () => {
      clearTimeout(initial);
      clearInterval(t);
    };
  }, [refresh]);
  const update = async (l: PublicLead, patch: Record<string, unknown>) => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: l.id, revision: l.adminRevision, ...patch }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const inactive = (l: PublicLead) =>
    Date.parse(synced || "1970-01-01") - Date.parse(l.lastSeen) >
      inactivityMinutes * 60000 && !["Delivered", "Lost"].includes(l.stage);
  const due = (l: PublicLead) =>
    l.followUp &&
    Date.parse(l.followUp) < Date.parse(synced || "1970-01-01") &&
    !["Delivered", "Lost"].includes(l.stage);
  const visible = leads.filter(
    (l) =>
      (stage === "All" || l.stage === stage) &&
      `${l.name} ${l.phone} ${l.email} ${l.id} ${l.template}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All" ||
        (filter === "Needs follow-up" && due(l)) ||
        (filter === "Inactive" && inactive(l)) ||
        (filter === "Payment review" &&
          l.paymentClaimed &&
          !l.paymentVerified)),
  );
  const lead = leads.find((l) => l.id === selected);
  const linked = orders.find((o) => o.id === lead?.orderId);
  return (
    <div className="crm-shell">
      <aside className="crm-nav">
        <Link className="crm-brand" href="/">
          wedinvite<span>STUDIO DESK</span>
        </Link>
        <Link href="/admin">Invitations</Link>
        <Link href="/admin/crm" className="active">
          Leads & CRM
        </Link>
        <Link href="/admin/create">Create invitation</Link>
        <Link href="/templates">View storefront →</Link>
        <div className="crm-nav-note">
          A thoughtful follow-up
          <br />
          can start a beautiful story.
        </div>
      </aside>
      <main className="crm-main">
        <header className="crm-header">
          <div>
            <span className="eyebrow">RELATIONSHIPS, BEAUTIFULLY MANAGED</span>
            <h1>Your studio, in the loop.</h1>
            <p>From the first hello to the invitation they share.</p>
          </div>
          <span className="crm-live">
            ● {synced ? "Updates every 2 seconds" : "Connecting…"}
          </span>
        </header>
        {auth ? (
          <div className="journey-card">
            <h2>Welcome back.</h2>
            <p>Sign in to your studio to access customer records.</p>
            <Link className="journey-primary" href="/admin">
              Admin sign-in →
            </Link>
          </div>
        ) : (
          <>
            <section className="crm-stats">
              {[
                ["All inquiries", leads.length],
                ["Needs follow-up", leads.filter(due).length],
                [
                  "Payment review",
                  leads.filter((l) => l.paymentClaimed && !l.paymentVerified)
                    .length,
                ],
                [
                  "In production",
                  leads.filter((l) => l.stage === "In production").length,
                ],
              ].map(([label, n]) => (
                <button
                  key={label}
                  onClick={() =>
                    setFilter(
                      ["Needs follow-up", "Payment review"].includes(
                        String(label),
                      )
                        ? String(label)
                        : "All",
                    )
                  }
                >
                  <small>{label}</small>
                  <strong>{n}</strong>
                </button>
              ))}
            </section>
            <div className="crm-funnel">
              {steps.map((s, i) => (
                <div key={s}>
                  <span>
                    0{i + 1} · {s}
                  </span>
                  <strong>{leads.filter((l) => l.maxStep >= i).length}</strong>
                  <small>reached this step</small>
                </div>
              ))}
            </div>
            <div className="crm-toolbar">
              <input
                aria-label="Search leads"
                placeholder="Search name, phone, reference or design…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                aria-label="Filter leads"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["All", "Needs follow-up", "Inactive", "Payment review"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
              <select
                aria-label="Pipeline stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {["All", ...stages].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            {error && (
              <p className="journey-error" role="alert">
                {error}{" "}
                <button
                  onClick={() => {
                    setError("");
                    void refresh();
                  }}
                >
                  Refresh
                </button>
              </p>
            )}
            <div className="crm-workspace">
              <section className="crm-leads">
                <div className="crm-list-title">
                  <strong>{visible.length} inquiries</strong>
                  <small>
                    {synced ? "Synced " + date(synced) : "Loading…"}
                  </small>
                </div>
                {!visible.length && (
                  <div className="crm-empty">
                    <h2>
                      {loaded
                        ? "Room for your next hello."
                        : "Loading inquiries…"}
                    </h2>
                    <p>
                      {loaded
                        ? "Customer progress will appear here as they fill in the order journey. Try changing your filters or start a sample inquiry."
                        : ""}
                    </p>
                    <Link href="/order" target="_blank">
                      Open customer journey →
                    </Link>
                  </div>
                )}
                {visible
                  .sort((a, b) => b.updated.localeCompare(a.updated))
                  .map((l) => (
                    <button
                      key={l.id}
                      className={
                        "crm-lead " + (selected === l.id ? "selected" : "")
                      }
                      onClick={() => setSelected(l.id)}
                    >
                      <div className="lead-avatar">
                        {(l.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <strong>{l.name || "Anonymous inquiry"}</strong>
                        <span>{l.phone || "No phone entered yet"}</span>
                        <small>
                          {l.template} · {steps[l.step]}
                        </small>
                      </div>
                      <div className="lead-state">
                        <span className="pill">{l.stage}</span>
                        <small>
                          {inactive(l)
                            ? "Inactive · " + steps[l.step]
                            : "Updated " + date(l.lastSeen)}
                        </small>
                        {due(l) && <b>Follow-up due</b>}
                      </div>
                    </button>
                  ))}
              </section>
              <aside className="crm-detail">
                {!lead ? (
                  <div className="crm-empty">
                    <span className="eyebrow">THE WHOLE STORY</span>
                    <h2>Every detail, in one place.</h2>
                    <p>
                      Select an inquiry to see saved choices, follow up, and
                      manage its journey to delivery.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="crm-detail-head">
                      <small>{lead.id}</small>
                      <h2>{lead.name || "Anonymous inquiry"}</h2>
                      <p>
                        {lead.phone || "Contact number not provided"}
                        <br />
                        {lead.email}
                      </p>
                      {/^\d{10,15}$/.test(normalizeWhatsApp(lead.phone)) && (
                        <a
                          className="journey-primary"
                          href={
                            "https://wa.me/" +
                            normalizeWhatsApp(lead.phone) +
                            "?text=" +
                            encodeURIComponent(
                              `Assalam o Alaikum ${lead.name}! Following up on your WedInvite inquiry ${lead.id} for ${lead.template}. How can we help?`,
                            )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Follow up on WhatsApp →
                        </a>
                      )}
                    </div>
                    <dl className="lead-facts">
                      <div>
                        <dt>Current / furthest step</dt>
                        <dd>
                          {steps[lead.step]} / {steps[lead.maxStep]}
                        </dd>
                      </div>
                      <div>
                        <dt>Last customer save</dt>
                        <dd>{date(lead.lastSeen)}</dd>
                      </div>
                      <div>
                        <dt>Design & package</dt>
                        <dd>
                          {lead.template} · {lead.tier} · Rs.{" "}
                          {total(lead.tier, lead.addons).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt>Add-ons</dt>
                        <dd>{lead.addons.join(", ") || "None"}</dd>
                      </div>
                      <div>
                        <dt>Payment</dt>
                        <dd>
                          {lead.paymentVerified
                            ? "Manually verified"
                            : lead.paymentClaimed
                              ? "Claimed · awaiting verification"
                              : "Not claimed"}{" "}
                          · {lead.paymentMethod}
                          <br />
                          {lead.transaction || "No transaction reference"}
                        </dd>
                      </div>
                      <div>
                        <dt>WhatsApp handoff</dt>
                        <dd>
                          {lead.whatsappOpened
                            ? "Link opened; message not confirmed"
                            : "Not opened"}
                        </dd>
                      </div>
                    </dl>
                    <form
                      key={lead.id + "-" + lead.adminRevision}
                      className="crm-edit"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = new FormData(e.currentTarget);
                        void update(lead, {
                          stage: f.get("stage"),
                          assignee: f.get("assignee"),
                          followUp: f.get("followUp")
                            ? new Date(
                                String(f.get("followUp")) + "+05:00",
                              ).toISOString()
                            : "",
                          ...(f.get("note") ? { note: f.get("note") } : {}),
                        });
                      }}
                    >
                      <h3>Next steps</h3>
                      <label>
                        Pipeline stage
                        <select name="stage" defaultValue={lead.stage}>
                          {stages.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Assigned to
                        <input
                          name="assignee"
                          maxLength={100}
                          defaultValue={lead.assignee}
                          placeholder="Team member"
                        />
                      </label>
                      <label>
                        Follow-up date & time (Pakistan)
                        <input
                          type="datetime-local"
                          name="followUp"
                          defaultValue={
                            lead.followUp
                              ? new Date(
                                  Date.parse(lead.followUp) + 5 * 3600000,
                                )
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                        />
                      </label>
                      <label>
                        Internal note
                        <textarea
                          name="note"
                          maxLength={2000}
                          placeholder="What should the team know?"
                        />
                      </label>
                      <button className="journey-primary" disabled={busy}>
                        Save follow-up
                      </button>
                    </form>
                    <div className="crm-block">
                      <h3>Payment review</h3>
                      <p>
                        Confirm the actual transfer before marking it verified.
                        This does not activate an invitation.
                      </p>
                      <button
                        disabled={busy}
                        onClick={() =>
                          void update(lead, {
                            paymentVerified: !lead.paymentVerified,
                          })
                        }
                      >
                        {lead.paymentVerified
                          ? "Clear verification"
                          : "I checked the transfer · verify payment"}
                      </button>
                    </div>
                    <div className="crm-block">
                      <h3>Invitation & delivery</h3>
                      {linked ? (
                        <>
                          <p>
                            Linked invitation: {linked.slug || linked.id} ·{" "}
                            {linked.status}
                          </p>
                          <Link href={"/admin?order=" + linked.id}>
                            Manage order & delivery →
                          </Link>
                          <Link href={"/admin/create?order=" + linked.id}>
                            Edit invitation →
                          </Link>
                          {linked.status === "approved" && (
                            <Link
                              target="_blank"
                              href={"/invite/" + (linked.slug || linked.id)}
                            >
                              Open live invitation →
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          <Link
                            className="journey-primary"
                            href={
                              "/admin/create?lead=" +
                              lead.id +
                              "&template=" +
                              lead.template +
                              "&tier=" +
                              lead.tier
                            }
                          >
                            Create invitation from lead →
                          </Link>
                          <label>
                            Or link an existing invitation
                            <select
                              aria-label="Link invitation"
                              value=""
                              onChange={(e) => {
                                if (e.target.value)
                                  void update(lead, {
                                    orderId: e.target.value,
                                  });
                              }}
                            >
                              <option value="">Choose invitation…</option>
                              {orders.map((o) => (
                                <option key={o.id} value={o.id}>
                                  {o.slug || o.id}
                                </option>
                              ))}
                            </select>
                          </label>
                        </>
                      )}
                      <p>
                        Mark Ready or Delivered in the pipeline after reviewing
                        or sending the invitation.
                      </p>
                    </div>
                    <div className="crm-block">
                      <h3>Studio notes</h3>
                      {lead.notes.length ? (
                        lead.notes
                          .slice()
                          .reverse()
                          .map((n, i) => (
                            <p key={i}>
                              {n.text}
                              <small>{date(n.at)}</small>
                            </p>
                          ))
                      ) : (
                        <p>No notes yet.</p>
                      )}
                    </div>
                    <div className="crm-block">
                      <h3>Activity timeline</h3>
                      <ol className="crm-timeline">
                        {lead.timeline
                          .slice()
                          .reverse()
                          .map((e, i) => (
                            <li key={i}>
                              {e.text}
                              <small>{date(e.at)}</small>
                            </li>
                          ))}
                      </ol>
                    </div>
                  </>
                )}
              </aside>
            </div>
            <p className="fine-print">
              Inactive means no saved customer changes for {inactivityMinutes}{" "}
              minutes; it does not prove they abandoned the order. Anonymous
              inquiries become identifiable only when contact details are
              entered. All times are Pakistan time.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
