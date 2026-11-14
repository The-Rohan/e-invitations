"use client";
import { useState } from "react";
import type { Order } from "@/lib/platform";
import { deliverables, invitationLink } from "@/lib/template-config";
export default function DeliverySuite({
  order,
  busy,
  act,
}: {
  order: Order;
  busy: boolean;
  act: (body: Record<string, unknown>) => Promise<unknown>;
}) {
  const [selected, setSelected] = useState(""),
    [device, setDevice] = useState("mobile"),
    [notice, setNotice] = useState("");
  const versions = deliverables(order),
    revision = order.contentRevision || 0;
  const current = versions.find((v) => v.key === selected);
  const reviewed = versions.filter(
    (v) => order.reviewedDeliverables?.[v.key] === revision,
  ).length;
  const message = () =>
    `Your invitations for ${order.details.groom} & ${order.details.bride}\n\n` +
    versions.map((v) => v.label + "\n" + location.origin + v.href).join("\n\n");
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Copied to clipboard.");
    } catch {
      setNotice("Clipboard access is unavailable. Use the link text below.");
    }
  };
  const download = () => {
    const blob = new Blob([message()], { type: "text/plain;charset=utf-8" }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = (order.slug || order.id) + "-delivery-links.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="orders-panel delivery-suite">
      <div className="orders-panel-heading">
        <h3>Invitation delivery suite</h3>
        <span className="order-badge">
          {reviewed}/{versions.length} reviewed
        </span>
      </div>
      <p>
        One complete invitation plus {order.details.events.length} standalone
        event invitation{order.details.events.length === 1 ? "" : "s"}. Each
        keeps the selected design and its own event details, maps, calendars and
        RSVP scope.
      </p>
      {versions.map((v) => (
        <div className="suite-version" key={v.key}>
          <div>
            <strong>{v.label}</strong>
            <small>{v.href}</small>
            <span>
              {order.reviewedDeliverables?.[v.key] === revision
                ? "Reviewed · current version"
                : "Needs review"}
            </span>
          </div>
          <div className="suite-version-actions">
            <button
              className="orders-secondary"
              onClick={() => setSelected(v.key)}
            >
              Preview {v.key === "combined" ? "complete" : v.label}
            </button>
            {order.status === "approved" && (
              <button onClick={() => void copy(location.origin + v.href)}>
                Copy link
              </button>
            )}
          </div>
        </div>
      ))}
      {order.status === "approved" ? (
        <div className="orders-link-row">
          <button
            className="orders-secondary"
            onClick={() => void copy(message())}
          >
            Copy full delivery message
          </button>
          <button onClick={download}>Download delivery links</button>
        </div>
      ) : (
        <p className="orders-help">
          All versions stay private until the payment is verified and the
          invitation activated.
        </p>
      )}
      <p className="orders-help">
        Changing invitation content resets review checks. Included image and
        video files are separate studio deliverables.
      </p>
      {notice && <p role="status">{notice}</p>}
      {current && (
        <div
          className="suite-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Review invitation version"
        >
          <div className="suite-preview-toolbar">
            <button onClick={() => setSelected("")}>Close preview</button>
            <strong>{current.label}</strong>
            <button
              aria-pressed={device === "mobile"}
              onClick={() => setDevice("mobile")}
            >
              Mobile
            </button>
            <button
              aria-pressed={device === "desktop"}
              onClick={() => setDevice("desktop")}
            >
              Desktop
            </button>
            <button
              disabled={busy}
              onClick={() =>
                void act({
                  action: "review-deliverable",
                  id: order.id,
                  version: current.key,
                  revision,
                })
              }
            >
              {order.reviewedDeliverables?.[current.key] === revision
                ? "Reviewed ✓"
                : "Mark this version reviewed"}
            </button>
            <a
              href={invitationLink(
                order,
                current.key === "combined" ? undefined : current.key,
                true,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open preview tab
            </a>
          </div>
          <iframe
            key={current.key + "-" + revision}
            title={current.label + " preview"}
            src={invitationLink(
              order,
              current.key === "combined" ? undefined : current.key,
              true,
            )}
            className={device === "mobile" ? "suite-mobile" : "suite-desktop"}
          />
        </div>
      )}
    </section>
  );
}
