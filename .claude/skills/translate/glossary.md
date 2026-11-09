# Translation glossary

Authoritative list of terms that must not be translated, terms that must be translated in a specific way, and terms with mandated capitalisation. DE defines meaning and claims. EN is written natively and may restructure sentences, swap idioms, and shift emphasis freely. Never translate word for word.

## Do not translate (DNT)

These appear unchanged in every locale.

### Brand and identity
- `Hightecc`
- `Basile Bong`
- `hello@hightecc.com`
- `/in/basilebong`
- `Spechtstr. 3`, `50735 Köln`, `Deutschland` (postal address in impressum)
- `Sophienstraße 26, 80333 München` (insurance address in impressum)
- `Markel Insurance SE`, `Markel Pro IT v2`

### Legal references
- `§ 5 DDG`, `§ 7 Abs. 1 DDG`, `§§ 8 bis 10 DDG`, `§ 18 Abs. 2 MStV`, `§ 19 UStG`
- `Kleinunternehmerregelung`
- `Diensteanbieter`
- The full body of the German legal text in `src/components/impressum/index.tsx` (the `<dl><dt>…</dt><dd>…</dd></dl>` blocks). It stays in German on both `/de/impressum` and `/en/impressum`.

### Languages list (always in this exact form)
- `Deutsch · Français · English`

## Mandated translations

When the DE source contains the term on the left, the EN translation uses the term on the right. Capitalisation and punctuation as shown.

| German                          | English                                          |
| ------------------------------- | ------------------------------------------------ |
| `KI`                            | `AI`                                             |
| `KI-Beratung`                   | `AI consulting`                                  |
| `KI-Check`                      | `AI check`                                       |
| `KI-generiert`                  | `AI-generated`                                   |
| `Software nach Maß`             | `custom software`                                |
| `Abläufe planen`                | `Workflow planning`                              |
| `Brücke zur IT`                 | `Bridge to your IT`                              |
| `IT-Dienstleister`              | `IT provider`                                    |
| `deine IT`                      | `your IT` / `your IT team` (never "IT department") |
| `Betrieb`                       | `business` (not "company" or "operation")        |
| `KMU`                           | `SMEs` (metadata only; body copy spells it out)  |
| `Erstgespräch`                  | `intro call`                                     |
| `Erstgespräch anfragen` (CTA)   | `Arrange an intro call` (no booking tool, never "Book") |
| `per Video`                     | `by video call`                                  |
| `Ablauf` (nav, section)         | `How it works`                                   |
| `Leistungen` (nav, section)     | `Services`                                       |
| `Über mich` (nav)               | `About`                                          |
| `Schreib mir` (nav CTA)         | `Get in touch`                                   |
| `Kundschaft`                    | `customers` (never "clientele")                  |
| `Ansprechpartner` (About box)   | `Your contact`                                   |
| `Köln`                          | `Cologne` (in body copy and meta)                |
| `Köln, DE`                      | `Cologne, DE` (in body copy and meta)            |
| `Impressum` (page title)        | `Legal notice`                                   |
| `Impressum` (footer link)       | `Legal notice`                                   |
| `Anbieterkennzeichnung`         | `provider information`                           |

### Address note

In the impressum legal block (which stays German), the city is `Köln`. In ordinary body copy and metadata it becomes `Cologne` on the English locale. The About box and the footer brand suffix switch to Cologne on `/en`.

## Rich-text tags

These tags must appear in the EN output at the same positions as in DE. Tag names are case-sensitive.

- `<em>...</em>`: emphasis, renders as `<em>` in the DOM.
- `<strong>...</strong>`: strong emphasis, renders as `<strong>`.
- `<amp>...</amp>`: accent span used in the hero headline, renders as `<span class={styles.amp}>`. Only used in `hero.headline.line2`.
- `<muted>...</muted>`: secondary tone used in the About lede, renders as `<span class={styles.ledeMuted}>`. Only used in `about.lede`.

If a translation needs to move the emphasis to a different word for it to sound natural in English, that is allowed *as long as the same tag is used and the surrounding meaning is preserved*. Do not invent new tags. Do not drop tags. Do not change the tag name.

## Voice and register

- Address the reader as informal "you" in English (matches `du` in DE).
- Use straightforward, declarative sentences. Short clauses, but follow English rhythm, not the German sentence structure.
- Write for a non-technical small-business owner. No IT jargon where an everyday word exists.
- No gendered forms in DE (`Kund·innen`, `Unternehmer·innen`). Use neutral words like `Kundschaft`, `Team`, `Betrieb`.
- Avoid corporate "we". The site is a single freelancer (Basile).
- Avoid marketing buzzwords: "synergy", "leverage", "best-in-class", "cutting-edge", "world-class", "next-gen", "AI-powered". These don't appear in the DE source and must not appear in the EN translation.
- **Never use em dashes (`—`)**. Brand decision. Split into two sentences with a period instead, or use a comma, colon, or parentheses depending on what fits the rhythm. Middle dots (`·`) and arrows (`→`, `↓`) are still fine.

## Punctuation

- The DE source uses German double-low-9 quotation marks (`„…"`). In EN, switch to straight `"…"` or English curly `"…"`. Pick one style per string and be consistent.
- Apostrophes: use the typewriter `'` everywhere, in both locales.
- Lists: British English, no Oxford comma.
- Don't add or remove final periods compared to the DE source unless the English sentence structure genuinely demands it.

## When this glossary is silent

If a term isn't covered here and isn't obviously a brand term, translate it naturally. If you find yourself making a judgement call that future translations should also follow, **add it to this glossary** as part of the same change.
