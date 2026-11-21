# Imagery

Every image on the site belongs to one series: abstract frosted-glass forms on white, lit from within in the brand orange with cool mint refractions, under a fine film grain. No people, no scenes, no text. The forms hint at the topic of each section (a ring for the check, an arch between two spheres for the IT bridge) without illustrating it literally.

## Style

- **Material:** soft frosted glass that glows from within. Smooth gradients, gentle soft shadows, lots of white space.
- **Colours:** warm orange `#FF6B35`, soft peach and mint teal `#1F8A84`. Everything else white.
- **Grain:** the model adds almost none, so the site lays a fine dark noise texture (`--grain-ink` in `globals.css`) over every image at about 30% opacity. Keep it there rather than baking it into the files.
- **No meaning:** no text, letters, numbers, logos, icons, symbols or people.

## Generating

Model: `gemini-3.1-flash-lite-image`, the cheapest Gemini image model. It only supports `imageSize` 1K, which is enough for soft glass. Generate one image per motif and only re-roll the ones that fail review.

Every prompt starts with the base line:

> Abstract 3D render, minimal and premium. Soft frosted-glass sculptural forms on a pure white background, lit so they glow softly from within. Colours only: warm orange #FF6B35, soft peach, and a cool mint teal #1F8A84 refracting through the glass; everything else white. Smooth soft gradients, gentle soft shadow, fine film grain. No text, no letters, no numbers, no logos, no people, no symbols, no icons.

Then the motif. Cards are 16:9 (the card shows a centred strip), the hero is 21:9 and the contact image 4:5.

## Post-processing

The model renders on a light grey studio backdrop. Take the median colour of the image edges and scale each channel so that colour becomes white (`pixel * 255 / backdrop`, clipped). Save as JPEG q86 at the generated size; the files come out around 35 KB.

## Files

All in `src/assets/imagery/`.

| File | Use | Motif |
| ---- | --- | ----- |
| `glass-hero.jpg` | Hero (21:9, full width, edges masked into white) | A monumental frosted-glass ring rising from the bottom edge like a sunrise, glowing orange inside, mint at its edges, a soft warm halo |
| `glass-contact.jpg` | Contact (4:5) and the link preview | A frosted glass prism splitting a beam of white light into orange and mint |
| `glass-check.jpg` | Service: KI-Check | A smooth glass ring, like a lens, slightly tilted |
| `glass-flows.jpg` | Service: Abläufe planen | Three rounded glass capsules joined by one flowing glass ribbon |
| `glass-bridge.jpg` | Service: Brücke zur IT | An orange and a mint glass sphere connected by an arched glass bridge |
| `glass-software.jpg` | Service: Software nach Maß | Three thin rounded glass panels, like floating screens, offset in depth |
| `glass-listen.jpg` | Process 1: Erst zuhören | Two soft glass blobs overlapping like bubbles in conversation |
| `glass-small.jpg` | Process 2: Klein anfangen | A small glass sphere next to an even smaller glass cube |
| `glass-grow.jpg` | Process 3: Nur ausbauen | Four rounded glass blocks forming rising steps |

## Live 3D on the home page

On the home page the same motifs are rendered live as one glass object that changes shape while you scroll (`src/components/film-scene`, shapes in `src/components/film-motifs`). Every chapter marks where its motif sits with a `data-film-slot` element. The JPEG inside that slot is the fallback: it shows until the scene is ready, and stays for visitors who prefer reduced motion or have no WebGL2. When you change a motif, change the image and the 3D shape together.
