"use client";
import { useState } from "react";
import type { Details, EventInfo } from "@/lib/platform";
import {
  manifestFor,
  gestures,
  mediaSlots,
  type TemplateId,
  type TemplateOptions,
  eventId,
} from "@/lib/template-config";
export function EventOptions({
  event,
  index,
  template,
  onChange,
}: {
  event: EventInfo;
  index: number;
  template: string;
  onChange: (e: EventInfo) => void;
}) {
  const set = (key: keyof EventInfo, value: unknown) =>
    onChange({ ...event, [key]: value });
  const text = (key: keyof EventInfo, label: string, type = "text") => (
    <label key={key}>
      {label}
      <input
        type={type}
        value={String(event[key] || "")}
        onChange={(e) => set(key, e.target.value)}
        maxLength={1500}
      />
    </label>
  );
  return (
    <details className="template-options">
      <summary>
        Customize {event.name || `event ${index + 1}`} · wording, directions &
        schedule
      </summary>
      <div className="form-grid">
        {text("nameUr", "Event name in Urdu")}
        {text("venueUr", "Venue in Urdu")}
        {text("addressUr", "Address in Urdu")}
        {text("mapUrl", "Exact Google Maps / venue link", "url")}
        {text("endDate", "End date (optional)", "date")}
        {text("endTime", "End time (optional)", "time")}
        {text("description", "Event invitation message")}
        {text("descriptionUr", "Event invitation message in Urdu")}
        {text("dressCode", "Dress code")}
        {text("dressCodeUr", "Dress code in Urdu")}
        {!["basant", "charkha", "khat"].includes(template) && (
          <label>
            Event illustration
            <select
              value={event.art || ["mehndi", "baraat", "walima"][index]}
              onChange={(e) => set("art", e.target.value)}
            >
              <option value="mehndi">Mehndi illustration</option>
              <option value="baraat">Wedding illustration</option>
              <option value="walima">Walima illustration</option>
            </select>
          </label>
        )}
        {["baradari", "shabistan"].includes(template) && (
          <label>
            {template === "baradari" ? "Garden motif" : "Courtyard motif"}
            <select
              value={event.motif || ""}
              onChange={(e) => set("motif", e.target.value)}
            >
              <option value="">Match event illustration</option>
              {(template === "baradari"
                ? ["fountain", "jali", "pomegranate"]
                : ["lantern", "arch", "cypress"]
              ).map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
        <label className="check">
          <input
            type="checkbox"
            checked={!!event.separateSeating}
            onChange={(e) => set("separateSeating", e.target.checked)}
          />
          Separate seating for ladies and gentlemen
        </label>
        <fieldset>
          <legend>Dress palette</legend>
          <div className="template-colors">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="color"
                aria-label={`Dress color ${i + 1}`}
                value={(event.colors || ["#d0aa71", "#809575", "#f5eedf"])[i]}
                onChange={(e) => {
                  const colors = [
                    ...(event.colors || ["#d0aa71", "#809575", "#f5eedf"]),
                  ];
                  colors[i] = e.target.value;
                  set("colors", colors);
                }}
              />
            ))}
          </div>
        </fieldset>
      </div>
      <h4>Event schedule</h4>
      <p>
        Times use Pakistan time. For overnight events, set the end date to the
        following day.
      </p>
      {(event.schedule || []).map((s, i) => (
        <div className="template-schedule" key={i}>
          <label>
            Time
            <input
              type="time"
              value={s.time}
              onChange={(e) =>
                set(
                  "schedule",
                  event.schedule!.map((v, j) =>
                    j === i ? { ...v, time: e.target.value } : v,
                  ),
                )
              }
            />
          </label>
          <label>
            Activity
            <input
              value={s.title}
              maxLength={250}
              onChange={(e) =>
                set(
                  "schedule",
                  event.schedule!.map((v, j) =>
                    j === i ? { ...v, title: e.target.value } : v,
                  ),
                )
              }
            />
          </label>
          <label>
            Activity in Urdu
            <input
              dir="auto"
              value={s.titleUr || ""}
              maxLength={250}
              onChange={(e) =>
                set(
                  "schedule",
                  event.schedule!.map((v, j) =>
                    j === i ? { ...v, titleUr: e.target.value } : v,
                  ),
                )
              }
            />
          </label>
          <button
            type="button"
            onClick={() =>
              set(
                "schedule",
                event.schedule!.filter((_, j) => j !== i),
              )
            }
          >
            Remove activity
          </button>
        </div>
      ))}
      {(event.schedule || []).length < 12 && (
        <button
          type="button"
          className="outline-button"
          onClick={() =>
            set("schedule", [
              ...(event.schedule || []),
              { time: event.time || "19:00", title: "" },
            ])
          }
        >
          + Add schedule item
        </button>
      )}
    </details>
  );
}
export function TemplateSettings({
  template,
  details,
  onChange,
}: {
  template: string;
  details: Details;
  onChange: (d: Details) => void;
}) {
  const m = manifestFor(template),
    opts = details.templateOptions?.[template] || {};
  const [query, setQuery] = useState("");
  const set = (patch: Partial<TemplateOptions>) =>
    onChange({
      ...details,
      templateOptions: {
        ...details.templateOptions,
        [template]: { ...opts, ...patch },
      },
    });
  const common = (key: keyof Details, label: string) => (
    <label key={key}>
      {label}
      <textarea
        value={String(details[key] || "")}
        maxLength={2000}
        dir="auto"
        onChange={(e) => onChange({ ...details, [key]: e.target.value })}
      />
    </label>
  );
  const groups = [
    ...new Set(m.fields.filter((f) => !f.managed).map((f) => f.group)),
  ];
  return (
    <section className="template-settings">
      <h2>Make this {template} invitation theirs</h2>
      <p>
        {gestures[template as TemplateId]}. The original opening and reveal stay
        intact. These settings apply to the full invitation and its individual
        event versions.
      </p>
      <div className="form-grid">
        <label>
          Main date reveal & countdown
          <select
            value={details.primaryEventId || eventId(details.events[0], 0)}
            onChange={(e) =>
              onChange({ ...details, primaryEventId: e.target.value })
            }
          >
            {details.events.map((e, i) => (
              <option key={eventId(e, i)} value={eventId(e, i)}>
                {e.name || `Event ${i + 1}`}
              </option>
            ))}
          </select>
          <small>
            Standalone invitations automatically use their own event.
          </small>
        </label>
        <label>
          Opening language
          <select
            value={opts.language || "en"}
            onChange={(e) => set({ language: e.target.value as "en" | "ur" })}
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
          </select>
        </label>
        <label>
          Text size
          <select
            value={opts.textSize || "standard"}
            onChange={(e) =>
              set({ textSize: e.target.value as "standard" | "large" })
            }
          >
            <option value="standard">Original design</option>
            <option value="large">Larger reading text</option>
          </select>
        </label>
        <label>
          Accent color
          <input
            type="color"
            value={opts.accent || "#b78c51"}
            onChange={(e) => set({ accent: e.target.value })}
          />
          <button type="button" onClick={() => set({ accent: "" })}>
            Use original colors
          </button>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={opts.music !== false}
            onChange={(e) => set({ music: e.target.checked })}
          />
          Enable invitation music
        </label>
        <label>
          Custom music URL (optional)
          <input
            type="url"
            value={opts.musicUrl || ""}
            onChange={(e) => set({ musicUrl: e.target.value })}
            placeholder="https://…/music.mp3"
          />
          <small>
            Leave blank for the original soundtrack. Use a direct audio file.
          </small>
        </label>
        <label>
          RSVP deadline
          <input
            type="date"
            value={details.rsvpDeadline || ""}
            onChange={(e) =>
              onChange({ ...details, rsvpDeadline: e.target.value })
            }
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={details.rsvpEnabled !== false}
            onChange={(e) =>
              onChange({ ...details, rsvpEnabled: e.target.checked })
            }
          />
          Collect guest replies
        </label>
      </div>
      <details className="template-options">
        <summary>Family wording & guest information</summary>
        <div className="form-grid">
          {common("familyUr", "Family message in Urdu")}
          {common("welcome", "Welcome message")}
          {common("welcomeUr", "Welcome message in Urdu")}
          {common("travel", "Transport, parking & directions")}
          {common("travelUr", "Travel information in Urdu")}
          {common("accommodation", "Accommodation details")}
          {common("accommodationUr", "Accommodation details in Urdu")}
          {common("accommodationName", "Hotel / guest house")}
          {common("accommodationAddress", "Accommodation address")}
          <label>
            Accommodation map
            <input
              type="url"
              value={details.accommodationMap || ""}
              onChange={(e) =>
                onChange({ ...details, accommodationMap: e.target.value })
              }
            />
          </label>
        </div>
        <p>
          Travel, accommodation, dress and schedule sections appear when their
          details are provided. Sample bookings and sample schedules are never
          delivered.
        </p>
      </details>
      <details className="template-options">
        <summary>Sections offered by this design</summary>
        <div className="template-section-grid">
          {m.sections
            .filter(
              (s) => !["entrance", "hero", "reveal", "events"].includes(s.kind),
            )
            .map((s) => (
              <label className="check" key={s.key}>
                <input
                  type="checkbox"
                  checked={!(opts.hiddenSections || []).includes(s.key)}
                  onChange={(e) =>
                    set({
                      hiddenSections: e.target.checked
                        ? (opts.hiddenSections || []).filter((k) => k !== s.key)
                        : [...(opts.hiddenSections || []), s.key],
                    })
                  }
                />
                {s.title}
              </label>
            ))}
        </div>
      </details>
      <details className="template-options">
        <summary>
          Design wording · {m.fields.filter((f) => !f.managed).length} editable
          text elements
        </summary>
        <p>
          Use plain text; line breaks are supported. Names, dates, venues and
          event counts come from the structured fields above.
        </p>
        <label>
          Find wording
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a heading, message or section…"
          />
        </label>
        {groups.map((group) => {
          const fields = m.fields.filter(
            (f) =>
              !f.managed &&
              f.group === group &&
              (f.en + " " + group).toLowerCase().includes(query.toLowerCase()),
          );
          return fields.length ? (
            <details key={group} className="template-copy-group">
              <summary>
                {group.replaceAll("_", " ")} · {fields.length}
              </summary>
              {fields.map((f) => (
                <div key={f.key} className="template-copy-pair">
                  <strong>{f.label}</strong>
                  <div className="form-grid">
                    <label>
                      English
                      <textarea
                        value={opts.copy?.[f.key]?.en ?? f.en}
                        maxLength={2500}
                        onChange={(e) =>
                          set({
                            copy: {
                              ...opts.copy,
                              [f.key]: {
                                en: e.target.value,
                                ur: opts.copy?.[f.key]?.ur ?? f.ur,
                              },
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Urdu
                      <textarea
                        dir="rtl"
                        value={opts.copy?.[f.key]?.ur ?? f.ur}
                        maxLength={2500}
                        onChange={(e) =>
                          set({
                            copy: {
                              ...opts.copy,
                              [f.key]: {
                                en: opts.copy?.[f.key]?.en ?? f.en,
                                ur: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const copy = { ...opts.copy };
                      delete copy[f.key];
                      set({ copy });
                    }}
                  >
                    Reset this text
                  </button>
                </div>
              ))}
            </details>
          ) : null;
        })}
      </details>
      <details className="template-options">
        <summary>Custom illustrations</summary>
        <p>
          Use direct HTTPS image links that you own. Keep the original artwork
          by leaving these blank. Opening films remain the original template
          animation.
        </p>
        <div className="form-grid">
          {mediaSlots
            .filter(
              ([key]) =>
                (template !== "khat" || key === "hero") &&
                (key !== "stay" || m.sections.some((s) => s.kind === "stay")),
            )
            .map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  type="url"
                  value={opts.images?.[key] || ""}
                  onChange={(e) =>
                    set({ images: { ...opts.images, [key]: e.target.value } })
                  }
                  placeholder="https://…/image.webp"
                />
              </label>
            ))}
        </div>
      </details>
    </section>
  );
}
