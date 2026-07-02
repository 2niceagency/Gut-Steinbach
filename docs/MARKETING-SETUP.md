# Gut Steinbach — Marketing-, SEO- & Ads-Vorbereitung

Stand: Juli 2026 · Für: 2nice / Vorreiter Hospitality GmbH

## 1. Was die neue Website bereits mitbringt

### SEO (behebt alle Mängel aus dem LeisureOne-Bericht)

| Bericht-Mangel (alte Seite) | Lösung (neue Seite) |
|---|---|
| Widersprüchliche Kontakt-/Standortdaten | Eine kanonische NAP überall: Steinbachweg 10, 83242 Reit im Winkl · +49 8640 807-0 · Geo 47.6671689, 12.481517 |
| Doppelte, widersprüchliche Schema-Daten | Ein `@graph` pro Seite; Hotel-Entity nur auf der Startseite definiert, Unterseiten referenzieren per `@id` |
| Technische Notlösungen / Baukasten | Handgeschriebenes HTML/CSS/JS, keine Page-Builder-Altlasten, kein jQuery, keine externen Skripte |
| Barrierefreiheit nur „aufgesetzt" | Nativ: semantisches HTML, Skip-Link, Fokus-Ringe, Tastatur-Menü, `prefers-reduced-motion`, Kontraste ≥ 4,5:1 — kein Overlay-Tool |
| Schwergewichtiger Aufbau / Tempo | Selbst gehostete Fonts (3 Dateien, ~180 KB gesamt), WebP-Bilder mit `loading="lazy"` + `width/height`, 5-MB-Hero-Video mit Poster & Pause außerhalb des Viewports, CSS+JS zusammen < 60 KB |

- Einzigartige Titles + Descriptions je Seite, `rel=canonical`, OG/Twitter-Cards
- `sitemap.xml`, `robots.txt` (inkl. expliziter Freigabe für GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- Saubere URL-Struktur, sprechende Ankerziele für Deeplinks (`/angebote.html#alpine-ruhe` etc.)

### GEO/AEO (KI-Suche: ChatGPT, Perplexity, Google AI Overviews)

- `llms.txt` mit allen Kernfakten und Preisen in extrahierbarer Form
- FAQ-Seite (`/kontakt.html#faq`) mit FAQPage-Schema — Antworten identisch mit sichtbarem Text
- Fakten als klare, zitierfähige Sätze im Fließtext („80 % der Zutaten aus höchstens 80 Kilometern", „Day Spa ab 85 €")
- Konsistente Entity-Signale: einziges Relais & Châteaux im Chiemgau, Grüner Michelin-Stern, 1435, 51 Hektar

**Noch zu tun (nach Go-Live):**
- [ ] Google Business Profile mit exakt derselben NAP abgleichen (Name, Steinbachweg 10, +49 8640 807-0)
- [ ] Google Search Console + Bing Webmaster Tools verifizieren, Sitemap einreichen
- [ ] hreflang ergänzen, sobald die EN-Version live ist (`de-DE`/`en` + `x-default`)
- [ ] Relais-&-Châteaux-Profil, Michelin-Guide-Eintrag und Bioland-Verzeichnis auf identische Daten prüfen (Zitierquellen für KI-Antworten)

## 2. Conversion-Tracking (Voraussetzung für Ads)

Die Seite ist bewusst Cookie-frei ausgeliefert (kein Banner nötig). Für Ads-Messung:

1. **Consent-Management** einbauen (z. B. Usercentrics/Cookiebot) — erst danach Pixel laden, Google Consent Mode v2 aktivieren.
2. **GA4** + **Google Ads Conversion Tag**: Conversion = Klick auf OnePageBooking-Links (`onepagebooking.com/gut-steinbach`). Alle Buchungs-CTAs sind einheitliche `<a>`-Links → per GTM-Trigger „Click URL contains onepagebooking" messbar. Ideal: OnePageBooking-Conversion-Import (Buchungswert) beim Anbieter anfragen.
3. **Meta Pixel** + Conversions API; Event „InitiateCheckout" auf Buchungs-Klick, „Lead" auf tel:/mailto:-Klicks.
4. **UTM-Konvention:** `utm_source=google|meta` · `utm_medium=cpc|paid_social` · `utm_campaign=<kampagne>` · `utm_content=<anzeige>`. Landingpages nehmen UTMs ohne Seiteneffekte an (statisches HTML).

## 3. Google Ads — empfohlene Struktur

| Kampagne | Keywords/Signal | Landingpage |
|---|---|---|
| Brand (Schutz) | „gut steinbach", „gut steinbach reit im winkl" | `/` |
| Wellnesshotel Chiemgau | „wellnesshotel chiemgau", „spa hotel bayern", „wellnesswochenende bayern" | `/spa.html` oder `/angebote.html#alpine-ruhe` |
| Chalet-Urlaub | „chalet mit sauna bayern", „luxus chalet alpen", „hüttenurlaub mit privater sauna" | `/chalets.html` |
| Hotel Reit im Winkl | „hotel reit im winkl", „hotel winklmoosalm", „hotel kitzbühel umgebung" | `/` oder `/uebernachten.html` |
| Genuss/Kulinarik | „gourmet hotel bayern", „grüner michelin stern restaurant" | `/kulinarik.html` + `/angebote.html#geniesser-tage` |
| PMax (Feed: Hotelbilder) | Zielgruppen: R&C-Gäste, Wellness-Affinität, HHI oben | `/angebote.html` |

- Anzeigentexte: Bestpreis + kostenfreie Stornierung bis 7 Tage immer als Vorteil nennen (Direktbuchungs-Argument gegen OTA-Anzeigen).
- Hotel Ads (Google Hotel Center) über OnePageBooking-Schnittstelle prüfen — wichtigster Hebel gegen Booking.com-Provisionen.

## 4. Meta Ads — empfohlene Struktur

1. **Awareness/Traffic:** Hero-Video (liegt vor: `assets/video/hero.mp4`) + Chalet-Luftaufnahme als Reels/Stories. Zielgruppe: DACH 35–65, Interessen Wellness/Relais & Châteaux/Skiurlaub, Lookalike aus Newsletter-Liste.
2. **Conversion:** Carousel „Sieben Chalets" (je Karte 1 Chalet-Bild) → `/chalets.html`; Angebots-Ads mit konkretem Preis („3 Nächte Alpine Ruhe ab 549 €") → `/angebote.html#alpine-ruhe`.
3. **Retargeting:** Website-Besucher 30 Tage ohne Buchungs-Klick → Direktbuchungs-Vorteile (Bestpreis, Storno 7 Tage, persönliche Beratung).
4. Saisonale Flights: Sommer (Wandern/Golf) ab März, Winter (Ski/44 Pistenkilometer) ab Oktober, Retreat-Termine je 8 Wochen vorher.

## 5. Content-Assets für Kampagnen

- Hero-Video 16:9 (5 MB, bereits web-optimiert) — für Meta auf 9:16 croppen
- 55 kuratierte WebP-Bilder in `assets/img/` (benannt nach Thema: chalet-*, spa-*, kulinarik-*, sommer-*, winter-*)
- Claims aus der Website wiederverwendbar: „Zeit ist der wahre Luxus.", „Gewachsen, nicht gebaut.", „2.000 Quadratmeter, null Gedanken.", „80:80"
