"use client";
import { useEffect, useRef, useState } from "react";
import type { Details } from "@/lib/platform";
import { eventId } from "@/lib/template-config";
export default function StudioPreview({
  template,
  details,
  tier,
}: {
  template: string;
  details: Details;
  tier: string;
}) {
  const [html, setHtml] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [scope, setScope] = useState(""),
    [device, setDevice] = useState("mobile"),
    [open, setOpen] = useState(false),
    [snapshot, setSnapshot] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const [rsvpNotice, setRsvpNotice] = useState(false);
  useEffect(() => {
    const receive = (e: MessageEvent) => {
      if (
        e.source === frame.current?.contentWindow &&
        e.data?.type === "studio-preview-rsvp"
      )
        setRsvpNotice(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  const fingerprint = JSON.stringify({ template, details, tier, scope });
  async function preview() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/studio-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, details, tier, event: scope }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw Error(d.error);
      }
      setHtml(await r.text());
      setSnapshot(fingerprint);
      setOpen(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="studio-preview">
      <h3>Personalized preview</h3>
      <label>
        Invitation version
        <select
          aria-label="Invitation version"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="">Complete invitation</option>
          {details.events.map((e, i) => (
            <option key={eventId(e, i)} value={eventId(e, i)}>
              {e.name || "Event " + (i + 1)} only
            </option>
          ))}
        </select>
      </label>
      <button
        className="outline-button"
        type="button"
        disabled={busy}
        onClick={() => void preview()}
      >
        {busy ? "Preparing…" : "Preview these details"}
      </button>
      <p>
        Preview your current edits before saving. Your live invitation is
        updated only when you save.
      </p>
      {error && <p role="alert">{error}</p>}
      {open && (
        <div
          className="suite-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Personalized invitation preview"
        >
          <div className="suite-preview-toolbar">
            <button type="button" onClick={() => setOpen(false)}>
              Close preview
            </button>
            <button
              type="button"
              aria-pressed={device === "mobile"}
              onClick={() => setDevice("mobile")}
            >
              Mobile
            </button>
            <button
              type="button"
              aria-pressed={device === "desktop"}
              onClick={() => setDevice("desktop")}
            >
              Desktop
            </button>
            <span>
              {snapshot !== fingerprint
                ? "Edits changed — refresh preview"
                : "Preview of your current details"}
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => void preview()}
            >
              Refresh preview
            </button>
          </div>
          {rsvpNotice && (
            <div className="studio-rsvp-preview" role="status">
              <strong>Guest replies are connected.</strong>
              <p>
                This unsaved preview does not collect responses. After
                activation, guests can reply for{" "}
                {scope
                  ? details.events.find((e, i) => eventId(e, i) === scope)
                      ?.name || "this event"
                  : "each celebration"}{" "}
                and you can see their replies in the order.
              </p>
              <button type="button" onClick={() => setRsvpNotice(false)}>
                Back to preview
              </button>
            </div>
          )}
          <iframe
            ref={frame}
            title="Personalized invitation preview"
            srcDoc={html}
            className={device === "mobile" ? "suite-mobile" : "suite-desktop"}
          />
        </div>
      )}
    </div>
  );
}
