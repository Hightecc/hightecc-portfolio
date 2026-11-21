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
| `knot` | Contact | A trefoil knot, for "wo es hakt" |

## Fallback images

Each slot holds a still of its motif from the film, in `src/assets/imagery/<slot>.jpg` (`mark.jpg` is 21:9 for the hero, the chapter stills are square). They show until the film is ready, and stay for visitors who prefer reduced motion or have no WebGL2. They already carry the film's grain and dark background, so no filter or overlay goes on top. `mark.jpg` is also the picture in the link preview (`src/lib/og-image.tsx`).

When a motif changes, capture its still again:

1. Temporarily pin the film to a device pixel ratio of 2 (`useState(2)` and `onDecline` in `FilmScene`) and set the light leak's intensity to 0. Do not commit this.
2. Build and start the site, open `/de` at 1440×900 with a device scale factor of 2, and hide everything except the film (`body * { visibility: hidden }`, then make `[data-ready]` and its children visible again).
3. For each slot, scroll until its centre sits at half the viewport height, wait a few seconds for the shape to settle, and screenshot the slot's bounding box.
4. Save as JPEG q86 (the hero at 1920 px wide, the chapter stills at their captured size).
