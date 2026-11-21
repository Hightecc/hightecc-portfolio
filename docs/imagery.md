# Imagery

The home page is one scroll-driven 3D film (`src/components/film-scene`, shapes in `src/components/film-motifs`). One holographic object changes shape from chapter to chapter. No people, no scenes, no text. The forms hint at the topic of each chapter (a lens for the check, chain links for the workflows, two blobs joined by an arch for the IT bridge) without illustrating it literally.

## Style

- **Materials:** liquid chrome (`MeshDistortMaterial`, fully metallic, iridescent), dispersive glass with strong chromatic aberration for links, lens and prism, and inflated pearlescent forms (rounded panels, capsule arrow).
- **Colours:** orange `#ff6b35` leads, with ember `#ff4d1f`, peach `#ffb48f` and coral `#ff7a5c` around it and magenta `#e04fd4` and a narrow band of violet `#8b5cf6` for the holographic shift. They come from a gradient dome in the environment map that blends through orange, pink, magenta, violet and peach in long, even steps, so the shapes reflect flowing gradients rather than being painted. The material tints stay near silver and peach; strong tints flatten the gradients. An orange light leak sits in the top right corner, and the glows behind each shape are orange first.
- **Background:** near-black `#07070a`, the same as `--background`.
- **Grain:** added in the film's final pass over the whole frame, slightly stronger on bright areas. Keep it there rather than in the materials.
- **No meaning:** no text, letters, numbers, logos, icons, symbols or people.

## Chapters

Every chapter marks where its motif sits with a `data-film-slot` element. The object follows those slots as you scroll. Between chapters it shrinks away inside a swirling cloud of orange, pink and violet dust that travels to the next slot, where the next motif grows back out of it.

| Slot | Chapter | Motif |
| ---- | ------- | ----- |
| `mark` | Hero | The two Cs of the logo mark as round glass tubes, interlocked like an infinity sign (`MARK_ARC` in `src/lib/brand-mark.ts`) |
| `lens` | Service: KI-Check | A dispersive glass ring around a liquid disc, tilted like a lens |
| `flows` | Service: Abläufe planen | Three interlocking glass chain links |
| `bridge` | Service: Brücke zur IT | A chrome Möbius band, one surface that joins both sides |
| `software` | Service: Software nach Maß | Three inflated rounded panels, offset in depth |
| `listen` | Process 1: Erst zuhören | Three concentric rings spreading like ripples, glass and chrome |
| `small` | Process 2: Klein anfangen | A chrome sphere next to a small inflated cube |
| `grow` | Process 3: Nur ausbauen | An inflated arrow pointing up and to the right |
| `prism` | Contact | A triangular glass prism splitting a white beam into a spectrum |

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
