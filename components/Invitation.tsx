"use client";
import { useEffect, useRef, useState } from "react";
type Meta = {
  title: string;
  events: { id: string; name: string }[];
  rsvpEnabled: boolean;
};
export default function Invitation({
  id,
  preview = false,
  event,
}: {
  id: string;
  preview?: boolean;
  event?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null),
    requestId = useRef("");
  const [open, O] = useState(false),
    [message, M] = useState(""),
    [meta, setMeta] = useState<Meta | null>(null),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false);
  const query = new URLSearchParams();
  if (preview) query.set("preview", "1");
  if (event) query.set("event", event);
  const src =
    "/api/invitation/" +
    encodeURIComponent(id) +
    (query.size ? "?" + query : "");
  useEffect(() => {
    const ctrl = new AbortController();
    const q = new URLSearchParams({ format: "meta" });
    if (event) q.set("event", event);
    fetch("/api/invitation/" + encodeURIComponent(id) + "?" + q, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMeta)
      .catch(() => {});
    return () => ctrl.abort();
  }, [id, event]);
  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (
        e.origin === location.origin &&
        e.source === frame.current?.contentWindow &&
        e.data?.type === "open-rsvp"
      )
        O(true);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
  return (
    <div className="invitation">
      <iframe
        ref={frame}
        title="Your wedding invitation"
        src={src}
        allow="autoplay; fullscreen"
      />
      {meta?.rsvpEnabled && (
        <button className="rsvp-float" onClick={() => O(true)}>
          Reply with love ♡
        </button>
      )}
      {open && meta?.rsvpEnabled && (
        <div className="modal">
          <form
            className="panel"
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy || sent) return;
              setBusy(true);
              M("");
              const f = new FormData(e.currentTarget);
              if (!requestId.current) requestId.current = crypto.randomUUID();
              try {
                const r = await fetch("/api/platform", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "rsvp",
                    id,
                    eventId: event,
                    eventIds: f.getAll("eventIds"),
                    requestId: requestId.current,
                    name: f.get("name"),
                    count: Number(f.get("count")),
                    attending: f.get("attending") === "yes",
                  }),
                });
                const d = await r.json();
                if (!r.ok) throw Error(d.error);
                M("Thank you. Your reply has reached the couple.");
                setSent(true);
              } catch (e) {
                M(
                  (e as Error).message ||
                    "Unable to send your reply. Please try again.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <button type="button" onClick={() => O(false)}>
              Close ×
            </button>
            <h2>A little reply, with love.</h2>
            <p>{meta.title}</p>
            <label>
              Your name
              <input name="name" required maxLength={100} />
            </label>
            <label>
              Your reply
              <select name="attending">
                <option value="yes">Happily attending</option>
                <option value="no">Sending love from afar</option>
              </select>
            </label>
            <label>
              Number of guests
              <input
                name="count"
                type="number"
                min="1"
                max="20"
                defaultValue="1"
                required
              />
            </label>
            <fieldset>
              <legend>
                {meta.events.length === 1
                  ? "Your event"
                  : "Events you will attend"}
              </legend>
              {meta.events.map((e) => (
                <label className="check" key={e.id}>
                  <input
                    type="checkbox"
                    name="eventIds"
                    value={e.id}
                    defaultChecked
                  />
                  {e.name}
                </label>
              ))}
            </fieldset>
            <button className="button" disabled={busy || sent}>
              {busy ? "Sending…" : sent ? "Reply received" : "Send my reply ♡"}
            </button>
            <p role="status">{message}</p>
          </form>
        </div>
      )}
    </div>
  );
}
