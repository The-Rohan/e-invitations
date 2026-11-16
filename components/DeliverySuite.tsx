"use client";
import { useState } from "react";
import type { Order } from "@/lib/platform";
import {
  deliverables,
  invitationLink,
  eventId,
  eventSlugs,
} from "@/lib/template-config";
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
    versions
      .filter((v) => v.key !== "combined" || order.combinedPublic !== false)
      .map((v) => v.label + "\n" + location.origin + v.href)
      .join("\n\n");
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
      <LinkSettings
        key={
          order.id +
          ":" +
          (order.linkRevision || 0) +
          ":" +
          order.details.events.map((e, i) => eventId(e, i)).join(",")
        }
        order={order}
        busy={busy}
        act={act}
      />
      {versions.map((v) => (
        <div className="suite-version" key={v.key}>
          <div>
            <strong>{v.label}</strong>
            <small>{v.href}</small>
            {v.key === "combined" && order.combinedPublic === false && (
              <span>Private · studio preview only</span>
            )}
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
            {order.status === "approved" &&
              (v.key !== "combined" || order.combinedPublic !== false) && (
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

function LinkSettings({
  order,
  busy,
  act,
}: {
  order: Order;
  busy: boolean;
  act: (body: Record<string, unknown>) => Promise<unknown>;
}) {
  const [links, setLinks] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      order.details.events.map((e, i) => [
        eventId(e, i),
        order.eventLinks?.[eventId(e, i)] ||
          (
            (order.slug || "invitation") +
            "-" +
            eventSlugs(order.details.events)[i]
          )
            .slice(0, 80)
            .replace(/-$/, ""),
      ]),
    ),
  );
  const [combined, setCombined] = useState(order.combinedPublic !== false);
  return (
    <details className="invitation-link-settings">
      <summary>Link settings</summary>
      <p>
        Choose independent addresses for individual events. Removing the address
        leaves /event, not your complete invitation.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await act({
            action: "configure-links",
            id: order.id,
            linkRevision: order.linkRevision || 0,
            eventLinks: links,
            combinedPublic: combined,
          });
        }}
      >
        {order.details.events.map((e, i) => {
          const key = eventId(e, i);
          return (
            <label key={key}>
              {e.name} address
              <span>/event/</span>
              <input
                required
                minLength={3}
                maxLength={80}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                value={links[key] || ""}
                onChange={(event) =>
                  setLinks({ ...links, [key]: event.target.value })
                }
              />
            </label>
          );
        })}
        <label className="link-visibility">
          <input
            type="checkbox"
            checked={combined}
            onChange={(e) => setCombined(e.target.checked)}
          />
          Allow guests to open the complete invitation
        </label>
        <p>
          {combined
            ? "Anyone with the complete invitation address can view all events."
            : "The complete invitation will be unavailable to guests, including through its old address and API. Studio previews remain available."}
        </p>
        <p>
          Changing an independent address stops its previous address from
          working. Existing nested event links continue to work. Names and
          addresses are public links, not guest passwords.
        </p>
        <button disabled={busy} type="submit">
          Save link settings
        </button>
      </form>
    </details>
  );
}
