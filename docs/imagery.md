# Imagery

The home page is one scroll-driven 3D film (`src/components/film-scene`). One liquid holographic object changes shape from chapter to chapter. No people, no scenes, no text. The forms hint at the topic of each chapter (a lens for the check, chain links for the workflows, a Möbius band for the IT bridge) without illustrating it literally.

## How it is drawn

The shapes are not 3D models. Each motif is a signed distance function in the film's raymarching shader (`sdMark`, `sdLens`, … in `src/components/film-scene/index.tsx`), so any motif can melt into any other: between two chapters the shader blends the two distance functions as you scroll, with a short ripple while they melt. The shader only runs on a quad around the object and marches inside a bounding sphere. To change a motif, change its distance function; keep it inside a radius of about 1.4 units.

The shapes are never still. A slow domain warp makes the whole form sway like liquid metal and a two-octave drift rolls over the surface, even when the page is not scrolled. Thin parts (the chain links, the outer ripple ring) set the limit for how strong that motion can be before they tear.

## Style

- **Material:** liquid chrome with a glassy core. Reflections, a thin-film rainbow tint and per-channel refraction all sample the same analytic environment in the shader.
- **Colours:** orange `#ff6b35` leads, with peach `#ffb48f`, pink `#ff5f8f` and a narrow band of violet `#8b5cf6` for the holographic shift. The environment blends through them in long, even steps, so the shapes show flowing gradients rather than flat colour. Flat faces catch a single colour, so motifs stay rounded and puffy. An orange light leak sits in the top right corner, and the glows behind each shape are orange first.
- **Background:** near-black `#07070a`, the same as `--background`.
- **Grain:** added in the film's final pass over the whole frame, slightly stronger on bright areas.
- **No meaning:** no text, letters, numbers, logos, icons, symbols or people.

## Chapters

Every chapter marks where its motif sits with a `data-film-slot` element. The object follows those slots as you scroll and morphs from one motif into the next on the way.

| Slot | Chapter | Motif |
| ---- | ------- | ----- |
| `mark` | Hero | The two Cs of the logo mark as round tubes, interlocked like an infinity sign (`MARK_ARC` in `src/lib/brand-mark.ts`) |
| `lens` | Service: KI-Check | A ring around a flat disc, tilted like a lens |
| `flows` | Service: Abläufe planen | Three interlocking chain links |
| `bridge` | Service: Brücke zur IT | A Möbius band, one surface that joins both sides |
| `software` | Service: Software nach Maß | Three puffy rounded panels, offset in depth |
| `listen` | Process 1: Erst zuhören | Three concentric rings spreading like ripples |
| `small` | Process 2: Klein anfangen | A sphere next to a small rounded cube |
| `grow` | Process 3: Nur ausbauen | A capsule arrow pointing up and to the right |
| `prism` | Contact | A rounded triangular prism splitting a white beam into a spectrum |

## Fallback images

The JPEGs in `src/assets/imagery/` sit inside the slots. They show until the film is ready, and stay for visitors who prefer reduced motion or have no WebGL2. They are still the earlier frosted-glass series on white, shown inverted (`filter: invert(1) hue-rotate(180deg)`) so they read on the dark background. They should be regenerated in the holographic style; until then they do not match the 3D motifs.

## Generating (earlier frosted-glass series)

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
