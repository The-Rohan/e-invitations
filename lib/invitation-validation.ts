import { templateManifest, type TemplateId } from "./template-config";
import { isCalendarDate, normalizeWhatsApp, type Details } from "./platform";
export type DetailIssue = { field: string; step: number; message: string };
export function detailIssues(value: unknown, maxEvents = 3): DetailIssue[] {
  const d = (value || {}) as Partial<Details>;
  const issues: DetailIssue[] = [];
  const add = (field: string, step: number, message: string) =>
    issues.push({ field, step, message });
  for (const key of ["groom", "bride"] as const)
    if (typeof d[key] !== "string" || !d[key]!.trim())
      add(key, 1, `Enter the ${key}’s name.`);
  if (
    typeof d.phone !== "string" ||
    !/^\+?[\d\s()-]{10,24}$/.test(d.phone.trim()) ||
    !/^[1-9]\d{9,14}$/.test(normalizeWhatsApp(d.phone))
  )
    add(
      "phone",
      1,
      "Enter the customer’s WhatsApp number, for example 03001063545 or +923001063545.",
    );
  if (!Array.isArray(d.events) || !d.events.length)
    add("events", 2, "Add at least one event.");
  else {
    if (d.events.length > maxEvents)
      add(
        "events",
        2,
        `This package includes ${maxEvents} event${maxEvents === 1 ? "" : "s"}. Remove extra events or choose a larger package.`,
      );
    d.events.forEach((event, i) => {
      const e = event || {};
      for (const key of ["name", "venue"] as const)
        if (typeof e[key] !== "string" || !e[key].trim())
          add(
            `events.${i}.${key}`,
            2,
            `Event ${i + 1}: enter the ${key === "name" ? "event name" : "venue name"}.`,
          );
      if (typeof e.date !== "string" || !isCalendarDate(e.date))
        add(
          `events.${i}.date`,
          2,
          `Event ${i + 1}: choose a valid calendar date.`,
        );
      if (
        typeof e.time !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time)
      )
        add(`events.${i}.time`, 2, `Event ${i + 1}: choose a valid time.`);
    });
  }
  return issues;
}

export function safeLink(value: unknown) {
  if (typeof value !== "string") return false;
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}
export function customizationIssues(d: Details): DetailIssue[] {
  const issues: DetailIssue[] = [];
  const add = (field: string, message: string) =>
    issues.push({ field, step: 2, message });
  const strings = [
    "groom",
    "bride",
    "groomUr",
    "brideUr",
    "family",
    "familyUr",
    "phone",
    "welcome",
    "welcomeUr",
    "travel",
    "travelUr",
    "accommodation",
    "accommodationUr",
    "accommodationName",
    "accommodationAddress",
    "rsvpDeadline",
  ] as const;
  for (const k of strings)
    if (
      d[k] !== undefined &&
      (typeof d[k] !== "string" ||
        d[k]!.length >
          (["groom", "bride", "groomUr", "brideUr"].includes(k) ? 100 : 2000))
    )
      add(k, `Invalid or overly long ${k}.`);
  if (d.rsvpDeadline && !isCalendarDate(d.rsvpDeadline))
    add("rsvpDeadline", "Choose a valid RSVP deadline.");
  if (d.rsvpEnabled !== undefined && typeof d.rsvpEnabled !== "boolean")
    add("rsvpEnabled", "Invalid RSVP setting.");
  if (d.accommodationMap && !safeLink(d.accommodationMap))
    add("accommodationMap", "Accommodation map must use an https:// link.");
  const ids = new Set<string>();
  (d.events || []).forEach((e, i) => {
    if (
      e.id !== undefined &&
      (!/^[a-zA-Z0-9-]{1,64}$/.test(e.id) ||
        ids.has(e.id) ||
        e.id === "combined")
    )
      add(`events.${i}.id`, "Event identifiers must be unique.");
    if (e.id) ids.add(e.id);
    for (const k of [
      "name",
      "nameUr",
      "venue",
      "venueUr",
      "address",
      "addressUr",
      "description",
      "descriptionUr",
      "dressCode",
      "dressCodeUr",
      "motif",
    ] as const)
      if (
        e[k] !== undefined &&
        (typeof e[k] !== "string" || e[k]!.length > 1500)
      )
        add(`events.${i}.${k}`, `Event ${i + 1}: invalid ${k}.`);
    if (e.mapUrl && !safeLink(e.mapUrl))
      add(`events.${i}.mapUrl`, `Event ${i + 1}: use an https:// map link.`);
    if (e.art && !["mehndi", "baraat", "walima"].includes(e.art))
      add(`events.${i}.art`, "Choose a valid event illustration.");
    if (
      e.separateSeating !== undefined &&
      typeof e.separateSeating !== "boolean"
    )
      add(`events.${i}.separateSeating`, "Invalid seating setting.");
    if (
      e.colors &&
      (!Array.isArray(e.colors) ||
        e.colors.length > 3 ||
        e.colors.some(
          (c) => typeof c !== "string" || !/^#[0-9a-f]{6}$/i.test(c),
        ))
    )
      add(`events.${i}.colors`, "Use up to three six-digit hex colors.");
    if (e.endTime || e.endDate) {
      if (
        !e.endTime ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(e.endTime) ||
        !isCalendarDate(e.endDate || e.date) ||
        Date.parse((e.endDate || e.date) + "T" + e.endTime + ":00+05:00") <=
          Date.parse(e.date + "T" + e.time + ":00+05:00")
      )
        add(
          `events.${i}.endTime`,
          `Event ${i + 1}: end must be after its start. Use the next date for overnight events.`,
        );
    }
    if (
      e.schedule &&
      (!Array.isArray(e.schedule) ||
        e.schedule.length > 12 ||
        e.schedule.some(
          (s) =>
            !s ||
            typeof s.title !== "string" ||
            !s.title.trim() ||
            s.title.length > 250 ||
            typeof s.time !== "string" ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time) ||
            (s.titleUr !== undefined &&
              (typeof s.titleUr !== "string" || s.titleUr.length > 250)),
        ))
    )
      add(
        `events.${i}.schedule`,
        `Event ${i + 1}: check the schedule times and labels.`,
      );
  });
  if (d.primaryEventId && !ids.has(d.primaryEventId))
    add("primaryEventId", "Choose an existing event for the main reveal.");
  if (d.templateOptions !== undefined) {
    if (
      !d.templateOptions ||
      typeof d.templateOptions !== "object" ||
      Array.isArray(d.templateOptions)
    )
      add("templateOptions", "Invalid design settings.");
    else
      for (const [id, options] of Object.entries(d.templateOptions)) {
        const m = templateManifest[id as TemplateId];
        if (
          !m ||
          !options ||
          typeof options !== "object" ||
          Array.isArray(options)
        ) {
          add("templateOptions", "Unknown design settings.");
          continue;
        }
        if (options.language && !["en", "ur"].includes(options.language))
          add("templateOptions", "Choose English or Urdu.");
        if (options.music !== undefined && typeof options.music !== "boolean")
          add("templateOptions", "Invalid music setting.");
        if (options.musicUrl && !safeLink(options.musicUrl))
          add("templateOptions", "Music must use an https:// link.");
        if (options.accent && !/^#[0-9a-f]{6}$/i.test(options.accent))
          add("templateOptions", "Choose a valid accent color.");
        if (
          options.textSize &&
          !["standard", "large"].includes(options.textSize)
        )
          add("templateOptions", "Invalid text size.");
        if (
          options.hiddenSections &&
          (!Array.isArray(options.hiddenSections) ||
            options.hiddenSections.some(
              (k) =>
                !m.sections.some(
                  (s) =>
                    s.key === k &&
                    !["entrance", "hero", "reveal", "events"].includes(s.kind),
                ),
            ))
        )
          add(
            "templateOptions",
            "Only optional design sections can be hidden.",
          );
        if (options.copy) {
          if (typeof options.copy !== "object" || Array.isArray(options.copy))
            add("templateOptions", "Invalid design wording.");
          else
            for (const [key, copy] of Object.entries(options.copy)) {
              if (
                !m.fields.some((f) => f.key === key && !f.managed) ||
                !copy ||
                typeof copy.en !== "string" ||
                typeof copy.ur !== "string" ||
                copy.en.length > 2500 ||
                copy.ur.length > 2500
              )
                add(
                  "templateOptions",
                  "Invalid design wording or too much text.",
                );
            }
        }
        if (
          options.images &&
          (typeof options.images !== "object" ||
            Array.isArray(options.images) ||
            Object.entries(options.images).some(
              ([k, v]) =>
                !["hero", "venue", "dress", "stay"].includes(k) || !safeLink(v),
            ))
        )
          add(
            "templateOptions",
            "Illustrations must use valid https:// links.",
          );
      }
  }
  return issues;
}
