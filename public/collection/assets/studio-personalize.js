/* Structured bindings for personalized copies of the original invitation designs. */
(function () {
  "use strict";
  var c = window.WI;
  if (!c) return;
  var $ = function (s) {
      return document.querySelector(s);
    },
    all = function (s) {
      return Array.from(document.querySelectorAll(s));
    };
  var esc = (c.esc = function (s) {
    return String(s || "").replace(/[&<>"']/g, function (x) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[x];
    });
  });
  var decode = function (s) {
    var t = document.createElement("textarea");
    t.innerHTML = s;
    return t.value;
  };
  function set(el, en, ur) {
    if (!el) return;
    el.dataset.en = esc(en).replace(/\n/g, "<br>");
    el.dataset.ur = esc(ur || en).replace(/\n/g, "<br>");
    el.innerHTML = el.dataset.en;
  }
  function setAll(selector, en, ur) {
    all(selector).forEach(function (el) {
      set(el, en, ur);
    });
  }
  var p = c.primary,
    options = c.options || {};
  c.gcal = function (v) {
    return (
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      encodeURIComponent(v.ics.t) +
      "&dates=" +
      v.ics.s +
      "/" +
      v.ics.e +
      "&location=" +
      encodeURIComponent(v.ics.loc) +
      "&details=" +
      encodeURIComponent(v.ics.description)
    );
  };
  c.icsHref = function (v) {
    var clean = function (s) {
      return String(s || "")
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    };
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WedInvite//Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + v.ics.uid,
      "DTSTAMP:" + v.ics.updated,
      "DTSTART:" + v.ics.s,
      "DTEND:" + v.ics.e,
      "SUMMARY:" + clean(v.ics.t),
      "LOCATION:" + clean(v.ics.loc),
      "DESCRIPTION:" + clean(v.ics.description),
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    // RFC 5545 lines fold at 75 octets; iterate Unicode code points, never bytes mid-character.
    var encoder = new TextEncoder();
    var folded =
      lines
        .map(function (line) {
          var out = "",
            width = 0;
          Array.from(line).forEach(function (ch) {
            var n = encoder.encode(ch).length;
            if (width + n > 75) {
              out += "\r\n ";
              width = 1;
            }
            out += ch;
            width += n;
          });
          return out;
        })
        .join("\r\n") + "\r\n";
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(folded);
  };
  c.writeNames = function (lang) {
    ["nm1", "nm2"].forEach(function (id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      var name =
        lang === "ur" ? (i ? c.brideUr : c.groomUr) : i ? c.bride : c.groom;
      el.replaceChildren();
      var pieces = lang === "ur" ? name.split(" ") : Array.from(name);
      pieces.forEach(function (part, j) {
        var letter = document.createElement("i");
        letter.textContent = part === " " ? "\u00a0" : part;
        letter.style.transitionDelay = j * 35 + "ms";
        el.append(letter);
        if (lang === "ur") el.append(document.createTextNode(" "));
      });
      el.style.whiteSpace = "normal";
    });
  };
  // Native language toggles insert HTML. Bind identity text as escaped data in both languages.
  c.fields.forEach(function (f) {
    if (!/Bilal|Mahrukh/.test(f.en)) return;
    var el = $('[data-wi-copy="' + f.key + '"]');
    var replace = function (text) {
      return text.replace(/Bilal|Mahrukh|بلال|ماہ رخ/g, function (name) {
        return {
          Bilal: c.groom,
          Mahrukh: c.bride,
          بلال: c.groomUr,
          "ماہ رخ": c.brideUr,
        }[name];
      });
    };
    set(el, replace(f.en), replace(f.ur || f.en));
  });
  all('.gateMonogram > span').forEach(function(el,i){
    set(el,Array.from((i?c.bride:c.groom).trim())[0]||'',Array.from((i?c.brideUr:c.groomUr).trim())[0]||'');
  });
  // Apply customer-written copy as text. Templates' own language toggle keeps both versions.
  Object.entries(options.copy || {}).forEach(function (pair) {
    set($('[data-wi-copy="' + pair[0] + '"]'), pair[1].en, pair[1].ur);
  });
  setAll(".heroDate,.heroWhen,.fd", c.dateEn, c.dateUr);
  setAll(".heroPlace,.heroWhere", c.place, c.placeUr);
  setAll(".footWhen", c.place + " · " + c.dateEn, c.placeUr + " · " + c.dateUr);
  setAll(".venueName", decode(p.venue.en), decode(p.venue.ur));
  setAll(".venueWhere", decode(p.addr.en), decode(p.addr.ur));
  setAll(
    ".venueAddr",
    decode(p.name.en) + " · " + c.dateEn,
    decode(p.name.ur) + " · " + c.dateUr,
  );
  all(".fams").forEach(function (el) {
    el.replaceChildren();
    var text = document.createElement("p");
    set(text, c.family, c.familyUr);
    el.append(text);
  });
  if (c.welcome)
    setAll(".heroLede,#invitation .lede,.secFam .lede", c.welcome, c.welcomeUr);
  c.fields.forEach(function (f) {
    var el = $('[data-wi-copy="' + f.key + '"]');
    if (!el) return;
    if (/three (days|evenings|celebrations)|Three celebrations/i.test(f.en))
      set(
        el,
        c.scope ? decode(p.name.en) : "Our celebrations",
        c.scope ? decode(p.name.ur) : "ہماری تقریبات",
      );
    if (f.group === "invitation" && f.className === "lede" && c.welcome)
      set(el, c.welcome, c.welcomeUr);
  });
  // Every standalone carries its own occasion in the hero, including designs without a date line.
  var occasion = document.createElement("div");
  occasion.className = "wi-occasion";
  set(
    occasion,
    c.scope ? decode(p.name.en) + " · " + c.dateEn : "Our wedding celebrations",
    c.scope ? decode(p.name.ur) + " · " + c.dateUr : "ہماری شادی کی تقریبات",
  );
  var names = $(".heroNames");
  if (names) names.after(occasion);
  setAll(".mapBtn", "Open in Google Maps", "گوگل میپ پر کھولیں");
  all(".mapBtn").forEach(function (a) {
    a.href = p.mapUrl;
  });
  var hide = function (el) {
    if (el) {
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
    }
  };
  var hasDress = c.events.some(function (e) {
    return decode(e.wear.en).trim();
  });
  c.sections.forEach(function (s) {
    var el = $('[data-wi-section="' + s.key + '"]');
    if (!el) return;
    if ((options.hiddenSections || []).includes(s.key)) hide(el);
    if (s.kind === "dress") {
      if (!hasDress) hide(el);
      else {
        var lines = c.events
            .map(function (e) {
              return decode(e.name.en) + ": " + decode(e.wear.en);
            })
            .join("\n"),
          urLines = c.events
            .map(function (e) {
              return decode(e.name.ur) + ": " + decode(e.wear.ur);
            })
            .join("\n");
        el.querySelectorAll(".dressNote,.dcHead .note,.dressRules").forEach(
          function (x) {
            set(x, lines, urLines);
          },
        );
        el.querySelectorAll(".dressSub,.dcHead .on").forEach(function (x) {
          set(x, "Dress for the celebration", "تقریب کے لیے لباس");
        });
      }
    }
    if (s.kind === "travel") {
      if (!c.travel) hide(el);
      else {
        var host = el.querySelector(".legs");
        if (host) {
          host.replaceChildren();
          var paragraph = document.createElement("p");
          paragraph.className = "lede";
          set(paragraph, c.travel, c.travelUr);
          host.append(paragraph);
        }
        el.querySelectorAll('a[href*="maps"]').forEach(function (a) {
          a.href = p.mapUrl;
        });
      }
    }
    if (s.kind === "stay") {
      if (!c.accommodation && !c.accommodationName) hide(el);
      else {
        el.querySelectorAll(".lede").forEach(function (x) {
          set(x, c.accommodation, c.accommodationUr);
        });
        el.querySelectorAll(".hotelName").forEach(function (x) {
          set(x, c.accommodationName, c.accommodationName);
        });
        el.querySelectorAll(".hotelWhere").forEach(function (x) {
          set(x, c.accommodationAddress, c.accommodationAddress);
        });
        el.querySelectorAll(".stayMail").forEach(hide);
        el.querySelectorAll('a[href*="maps"]').forEach(function (a) {
          if (c.accommodationMap) a.href = c.accommodationMap;
          else hide(a);
        });
      }
    }
    if (s.kind === "travel_stay") {
      var cards = el.querySelectorAll(".infoCard");
      if (cards[0]) {
        if (c.travel) set(cards[0].querySelector("p"), c.travel, c.travelUr);
        else hide(cards[0]);
      }
      if (cards[1]) {
        if (c.accommodation)
          set(cards[1].querySelector("p"), c.accommodation, c.accommodationUr);
        else hide(cards[1]);
      }
      if (!c.travel && !c.accommodation) hide(el);
    }
    if (s.kind === "schedule") {
      var host = el.querySelector(".tlList");
      if (host) {
        host.replaceChildren();
        var count = 0;
        c.events.forEach(function (e) {
          (e.schedule || []).forEach(function (item) {
            count++;
            var row = document.createElement("div");
            row.className = "tlRow";
            var time = document.createElement("span"),
              title = document.createElement("span");
            time.className = "tm";
            title.className = "pn";
            set(time, item.time, item.time);
            set(
              title,
              decode(e.name.en) + " · " + item.title,
              decode(e.name.ur) + " · " + (item.titleUr || item.title),
            );
            row.append(time, title);
            host.append(row);
          });
        });
        if (!count) hide(el);
      }
    }
    if (s.kind === "rsvp") {
      if (!c.rsvpEnabled) hide(el);
      else {
        el.querySelectorAll(".lede").forEach(function (x) {
          set(
            x,
            c.rsvpDeadline
              ? "Please reply by " + c.rsvpDeadline + "."
              : "Please let us know if you can join us.",
            c.rsvpDeadline
              ? "براہِ کرم " + c.rsvpDeadline + " تک جواب دیں۔"
              : "براہِ کرم اپنی شرکت سے آگاہ کریں۔",
          );
        });
      }
    }
  });
  // Keep original form elements for design scripts, but route all submissions through the connected RSVP UI.
  var form = $("#rsvpForm");
  if (form) {
    hide(form);
    var button = document.createElement("button");
    button.id = "studioRsvp";
    button.type = "button";
    button.className = "btn send";
    set(button, "Reply with love ♡", "شرکت کی تصدیق کریں");
    button.addEventListener("click", function () {
      parent.postMessage({ type: "open-rsvp" }, new URL(document.baseURI).origin);
    });
    form.before(button);
    if (!c.rsvpEnabled) hide(button);
  }
  if (!c.rsvpEnabled)
    all(
      '.dockRsvp,.rsvpBtn,.replyBtn,[data-target="rsvp"],a[href="#rsvpCard"],a[href="#rsvp"]',
    ).forEach(hide);
  if (options.textSize === "large")
    document.documentElement.classList.add("wi-large");
  if (options.accent) {
    var style = document.createElement("style");
    style.textContent =
      ":root{--gold:" +
      options.accent +
      ";--accent:" +
      options.accent +
      ";--wine:" +
      options.accent +
      "}";
    document.head.append(style);
  }
  var slots = {
    hero: ".hero .bgArt,.heroArt",
    venue: ".venueArt,#venueArt,#events .scenePlate img",
    dress: ".dressArt,#attireArt,#dress .dressScene img",
    stay: "#hotelArt,#stay .scenePlate img",
  };
  Object.entries(options.images || {}).forEach(function (pair) {
    if (!pair[1]) return;
    all(slots[pair[0]] || ":not(*)").forEach(function (el) {
      var img = el.matches("img") ? el : el.querySelector("img");
      if (img) img.src = pair[1];
      else el.style.backgroundImage = "url(" + JSON.stringify(pair[1]) + ")";
    });
  });
  var bgm = $("#bgm");
  if (bgm) {
    bgm.preload = "none";
    if (options.musicUrl) bgm.src = options.musicUrl;
    if (options.music === false) {
      bgm.pause();
      bgm.removeAttribute("src");
      bgm.play = function () {
        return Promise.resolve();
      };
      all("#musicFab,#gateSound").forEach(hide);
    }
  }
  // Make every surviving static map button use the appropriate current venue, never sample directions.
  all('a[href*="google.com/maps"],a[href*="maps.app.goo.gl"]').forEach(
    function (a) {
      var section = a.closest("[data-wi-section]");
      var stay =
        section &&
        c.sections.some(function (s) {
          return s.key === section.dataset.wiSection && s.kind === "stay";
        });
      if (!stay && !a.closest("[hidden]")) a.href = p.mapUrl;
    },
  );
  all(".made a").forEach(function (a) {
    a.href = "/";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  document.documentElement.dataset.wiPersonalized = "true";
})();
