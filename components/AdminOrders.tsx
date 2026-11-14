"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeliverySuite from "./DeliverySuite";
import {
  ArrowUpRight,
  ClipboardList,
  UsersRound,
  Plus,
  LogOut,
} from "lucide-react";
import type { Order } from "@/lib/platform";
import { normalizeWhatsApp } from "@/lib/platform";
import { offerById } from "@/lib/offers";
const fulfillment = {
  not_started: "Unfulfilled",
  in_progress: "In production",
  ready: "Ready to deliver",
  delivered: "Delivered",
};
const payment = (o: Order) =>
  o.status === "approved"
    ? "Paid"
    : o.status === "pending"
      ? "Needs review"
      : o.status === "changes"
        ? "Changes requested"
        : "Unpaid";
const money = (n: number) => "Rs. " + n.toLocaleString("en-PK");
const date = (s: string) =>
  new Date(s).toLocaleDateString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
type Reply = {
  responses?: {
    eventId: string;
    eventName: string;
    attending: boolean;
    count: number;
  }[];
  orderId: string;
  name: string;
  count: number;
  attending: boolean;
};
type Props = {
  orders: Order[];
  rsvps: Reply[];
  busy: boolean;
  error: string;
  act: (body: Record<string, unknown>) => Promise<unknown>;
  refresh: () => unknown;
};
export default function AdminOrders({
  orders,
  rsvps,
  busy,
  error,
  act,
  refresh,
}: Props) {
  const [search, setSearch] = useState(""),
    [tab, setTab] = useState("All"),
    [selected, setSelected] = useState(() =>
      typeof window === "undefined"
        ? ""
        : new URLSearchParams(window.location.search).get("order") || "",
    ),
    [sort, setSort] = useState("newest"),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const t = setInterval(() => {
      void refresh();
    }, 5000);
    return () => clearInterval(t);
  }, [refresh]);
  useEffect(() => {
    const handle = () =>
      setSelected(new URLSearchParams(location.search).get("order") || "");
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);
  const open = (id: string) => {
    setSelected(id);
    setNotice("");
    history.pushState(null, "", id ? "/admin?order=" + id : "/admin");
  };
  const o = orders.find((o) => o.id === selected);
  const filtered = orders
    .filter((o) =>
      `${o.details.groom} ${o.details.bride} ${o.details.phone} ${o.id} ${o.slug} ${o.template}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .filter(
      (o) =>
        tab === "All" ||
        (tab === "Payment review" && o.status === "pending") ||
        (tab === "Unfulfilled" &&
          (o.fulfillment || "not_started") !== "delivered") ||
        (tab === "Ready to deliver" && o.fulfillment === "ready") ||
        (tab === "Delivered" && o.fulfillment === "delivered"),
    )
    .sort((a, b) =>
      sort === "value"
        ? b.amount - a.amount
        : sort === "oldest"
          ? a.created.localeCompare(b.created)
          : b.created.localeCompare(a.created),
    );
  const action = async (body: Record<string, unknown>) => {
    setNotice("");
    const result = await act(body);
    if (result) setNotice("Order updated.");
  };
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Live link copied.");
    } catch {
      setNotice("Copy the invitation URL from the Open live link button.");
    }
  };
  const statusClass = (status: string) =>
    status === "Paid" || status === "Delivered"
      ? "success"
      : status === "Needs review" || status === "Ready to deliver"
        ? "attention"
        : "neutral";
  return (
    <div className="orders-app">
      <aside className="orders-sidebar">
        <Link className="orders-brand" href="/">
          wedinvite<span>STUDIO ADMIN</span>
        </Link>
        <Link
          href="/admin"
          className="active"
          onClick={(e) => {
            e.preventDefault();
            open("");
          }}
        >
          <ClipboardList size={16} /> Orders <small>{orders.length}</small>
        </Link>
        <Link href="/admin/crm">
          <UsersRound size={16} /> Leads & CRM
        </Link>
        <Link href="/admin/create">
          <Plus size={16} /> Create invitation
        </Link>
        <Link href="/templates" target="_blank">
          <ArrowUpRight size={16} /> View storefront
        </Link>
        <button onClick={() => void action({ action: "logout" })}>
          <LogOut size={15} /> Sign out
        </button>
      </aside>
      <main className="orders-main">
        <header className="orders-header">
          <div>
            <span className="orders-eyebrow">YOUR STUDIO AT A GLANCE</span>
            <h1>{o ? "Order details" : "Orders"}</h1>
            <p>
              {o
                ? "Everything you need to prepare and deliver this invitation."
                : "Review payments, prepare invitations, and keep every delivery on track."}
            </p>
          </div>
          <Link className="orders-primary" href="/admin/create">
            + Create invitation
          </Link>
        </header>
        {error && (
          <p className="orders-alert" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="orders-notice">
            {notice}
          </p>
        )}
        {o ? (
          <>
            <button className="orders-back" onClick={() => open("")}>
              ← All orders
            </button>
            <div className="orders-detail-heading">
              <div>
                <span className="orders-ref">
                  #{o.id.slice(0, 8).toUpperCase()} · {date(o.created)}
                </span>
                <h2>
                  {o.details.groom} & {o.details.bride}
                </h2>
              </div>
              <div className="orders-badges">
                <span className={"order-badge " + statusClass(payment(o))}>
                  {payment(o)}
                </span>
                <span
                  className={
                    "order-badge " +
                    statusClass(fulfillment[o.fulfillment || "not_started"])
                  }
                >
                  {fulfillment[o.fulfillment || "not_started"]}
                </span>
              </div>
            </div>
            <div className="orders-detail-grid">
              <div>
                <section className="orders-panel">
                  <div className="orders-panel-heading">
                    <h3>Invitation</h3>
                    <Link href={"/admin/create?order=" + o.id}>
                      Edit details →
                    </Link>
                  </div>
                  <div className="order-product">
                    <Image
                      width={63}
                      height={100}
                      src={"/showcase/" + o.template + ".png"}
                      alt={o.template + " invitation"}
                    />
                    <div>
                      <h3>
                        {o.template.charAt(0).toUpperCase() +
                          o.template.slice(1)}
                      </h3>
                      <p>{offerById(o.tier).name}</p>
                      <span>{offerById(o.tier).deliverables}</span>
                      <p>
                        {o.addons.length
                          ? "Add-ons: " + o.addons.join(", ")
                          : "No extra add-ons"}
                      </p>
                    </div>
                    <strong>{money(o.amount)}</strong>
                  </div>
                  <div className="orders-link-row">
                    <Link
                      className="orders-secondary"
                      href={"/invite/" + (o.slug || o.id) + "?preview=1"}
                    >
                      Preview invitation{" "}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                    {o.status === "approved" && (
                      <>
                        <button
                          onClick={() =>
                            void copy(
                              location.origin + "/invite/" + (o.slug || o.id),
                            )
                          }
                        >
                          Copy live link
                        </button>
                        <Link
                          href={"/invite/" + (o.slug || o.id)}
                          target="_blank"
                        >
                          Open live link{" "}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </Link>
                        <a
                          href={
                            "https://wa.me/" +
                            normalizeWhatsApp(o.details.phone) +
                            "?text=" +
                            encodeURIComponent(
                              `Your WedInvite invitation is ready: ${location.origin}/invite/${o.slug || o.id}`,
                            )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Share on WhatsApp{" "}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                </section>
                <DeliverySuite order={o} busy={busy} act={act} />
                <section className="orders-panel">
                  <div className="orders-panel-heading">
                    <h3>Payment</h3>
                    <span className={"order-badge " + statusClass(payment(o))}>
                      {payment(o)}
                    </span>
                  </div>
                  <dl className="order-summary-lines">
                    <div>
                      <dt>Package and add-ons</dt>
                      <dd>{money(o.amount)}</dd>
                    </div>
                    <div>
                      <dt>Transaction reference</dt>
                      <dd>{o.transaction || "Not supplied"}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd>
                        <strong>{money(o.amount)}</strong>
                      </dd>
                    </div>
                  </dl>
                  {o.status !== "approved" ? (
                    <>
                      <p className="orders-help">
                        Check the actual transfer before verifying. This action
                        activates the customer’s invitation.
                      </p>
                      <button
                        className="orders-primary"
                        disabled={busy}
                        onClick={() =>
                          void action({ action: "approve", id: o.id })
                        }
                      >
                        Verify payment & activate
                      </button>
                    </>
                  ) : (
                    <p className="orders-help">
                      The invitation is activated. Track its preparation and
                      delivery separately below.
                    </p>
                  )}
                </section>
                <section className="orders-panel">
                  <div className="orders-panel-heading">
                    <h3>Fulfillment</h3>
                    <span
                      className={
                        "order-badge " +
                        statusClass(fulfillment[o.fulfillment || "not_started"])
                      }
                    >
                      {fulfillment[o.fulfillment || "not_started"]}
                    </span>
                  </div>
                  <ol className="order-progress">
                    {Object.entries(fulfillment).map(([key, label], i) => (
                      <li
                        key={key}
                        className={
                          i <=
                          Object.keys(fulfillment).indexOf(
                            o.fulfillment || "not_started",
                          )
                            ? "done"
                            : ""
                        }
                      >
                        <span>{i + 1}</span>
                        {label}
                      </li>
                    ))}
                  </ol>
                  <form
                    key={o.id + o.fulfillment}
                    onSubmit={(e) => {
                      e.preventDefault();
                      void action({
                        action: "fulfillment",
                        id: o.id,
                        fulfillment: new FormData(e.currentTarget).get(
                          "fulfillment",
                        ),
                      });
                    }}
                  >
                    <label>
                      Update fulfillment status
                      <select
                        name="fulfillment"
                        defaultValue={o.fulfillment || "not_started"}
                      >
                        {Object.entries(fulfillment).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button className="orders-secondary" disabled={busy}>
                      Save fulfillment
                    </button>
                  </form>
                  <p className="orders-help">
                    Mark Delivered after you actually send the link and included
                    sharing files. Opening WhatsApp does not confirm delivery.
                  </p>
                  {o.fulfilledAt && <p>Delivered on {date(o.fulfilledAt)}</p>}
                </section>
                <section className="orders-panel">
                  <h3>Celebrations</h3>
                  {o.details.events.map((e, i) => (
                    <div className="order-event" key={i}>
                      <strong>{e.name}</strong>
                      <span>
                        {e.date} · {e.time} Pakistan time
                      </span>
                      <p>
                        {e.venue}
                        {e.address ? " — " + e.address : ""}
                      </p>
                    </div>
                  ))}
                </section>
                <section className="orders-panel">
                  <h3>
                    Guest replies (
                    {rsvps.filter((r) => r.orderId === o.id).length})
                  </h3>
                  {rsvps
                    .filter((r) => r.orderId === o.id)
                    .map((r, i) => (
                      <div className="order-event" key={i}>
                        <strong>{r.name}</strong>
                        <span>
                          {r.attending ? "Attending" : "Not attending"} ·{" "}
                          {r.count} guests
                        </span>
                        {r.responses?.map((reply) => (
                          <small key={reply.eventId}>
                            {reply.eventName}:{" "}
                            {reply.attending
                              ? reply.count + " attending"
                              : "Not attending"}{" "}
                            ·{" "}
                          </small>
                        ))}
                      </div>
                    ))}
                  {!rsvps.some((r) => r.orderId === o.id) && (
                    <p className="orders-help">
                      Replies will appear here when guests respond.
                    </p>
                  )}
                </section>
              </div>
              <aside>
                <section className="orders-panel">
                  <h3>Customer</h3>
                  <p>
                    <strong>
                      {o.details.groom} & {o.details.bride}
                    </strong>
                  </p>
                  <p>{o.details.phone}</p>
                  <a
                    className="orders-secondary"
                    href={
                      "https://wa.me/" +
                      normalizeWhatsApp(o.details.phone) +
                      "?text=" +
                      encodeURIComponent(
                        `Assalam o Alaikum! About your WedInvite invitation for ${o.details.groom} & ${o.details.bride}.`,
                      )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message customer{" "}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                  {o.leadId ? (
                    <Link
                      className="orders-crm-link"
                      href={"/admin/crm?order=" + o.id}
                    >
                      View customer in CRM →
                    </Link>
                  ) : (
                    <p className="orders-help">
                      Created directly in the studio. No checkout lead is
                      linked.
                    </p>
                  )}
                </section>
                <section className="orders-panel">
                  <h3>Next action</h3>
                  <p>
                    {o.status !== "approved"
                      ? "Preview the saved details and independently verify the payment."
                      : o.fulfillment === "delivered"
                        ? "Delivery is recorded. Manage any requested corrections through the invitation editor."
                        : o.fulfillment === "ready"
                          ? "Send the invitation and included files to the customer, then mark Delivered."
                          : "Prepare and review the invitation and any included sharing files, then mark Ready to deliver."}
                  </p>
                </section>
                <section className="orders-panel">
                  <h3>Correction notes</h3>
                  <p>{o.note || "No corrections requested."}</p>
                  {o.status !== "approved" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void action({
                          action: "changes",
                          id: o.id,
                          note: new FormData(e.currentTarget).get("note"),
                        });
                      }}
                    >
                      <label>
                        Details to correct
                        <textarea name="note" required maxLength={1000} />
                      </label>
                      <button className="orders-secondary" disabled={busy}>
                        Request corrections
                      </button>
                    </form>
                  )}
                </section>
              </aside>
            </div>
          </>
        ) : (
          <>
            <section className="orders-metrics">
              {[
                ["Total orders", orders.length],
                [
                  "Payment review",
                  orders.filter((o) => o.status === "pending").length,
                ],
                [
                  "Ready to deliver",
                  orders.filter((o) => o.fulfillment === "ready").length,
                ],
                [
                  "Verified order value",
                  money(
                    orders
                      .filter((o) => o.status === "approved")
                      .reduce((n, o) => n + o.amount, 0),
                  ),
                ],
              ].map(([title, value]) => (
                <div key={title}>
                  <span>{title}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </section>
            <section className="orders-panel orders-list">
              <div
                className="orders-tabs"
                role="tablist"
                aria-label="Order views"
              >
                {[
                  "All",
                  "Payment review",
                  "Unfulfilled",
                  "Ready to deliver",
                  "Delivered",
                ].map((t) => (
                  <button
                    role="tab"
                    aria-selected={tab === t}
                    className={tab === t ? "active" : ""}
                    key={t}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="orders-filters">
                <input
                  aria-label="Search orders"
                  placeholder="Search customer, phone, order, design or URL…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  aria-label="Sort orders"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="value">Highest value</option>
                </select>
                <button onClick={() => void refresh()}>Refresh</button>
              </div>
              <div className="orders-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Order / customer</th>
                      <th>Created</th>
                      <th>Design</th>
                      <th>Payment</th>
                      <th>Fulfillment</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <button
                            className="order-open"
                            onClick={() => open(o.id)}
                          >
                            <strong>
                              {o.details.groom} & {o.details.bride}
                            </strong>
                            <small>
                              #{o.id.slice(0, 8).toUpperCase()} ·{" "}
                              {o.details.phone}
                            </small>
                          </button>
                        </td>
                        <td>{date(o.created)}</td>
                        <td>
                          {o.template}
                          <small>{offerById(o.tier).name}</small>
                        </td>
                        <td>
                          <span
                            className={"order-badge " + statusClass(payment(o))}
                          >
                            {payment(o)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              "order-badge " +
                              statusClass(
                                fulfillment[o.fulfillment || "not_started"],
                              )
                            }
                          >
                            {fulfillment[o.fulfillment || "not_started"]}
                          </span>
                        </td>
                        <td>{money(o.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!filtered.length && (
                <div className="orders-empty">
                  <h2>
                    {orders.length
                      ? "No orders match this view."
                      : "Your first order starts here."}
                  </h2>
                  <p>
                    {orders.length
                      ? "Try another filter or search."
                      : "Create an invitation, or convert an inquiry from Leads & CRM."}
                  </p>
                  <Link href="/admin/crm">Open leads & CRM →</Link>
                </div>
              )}
              <footer>
                {filtered.length} orders · refreshes every 5 seconds
              </footer>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
