# Imagery

One photographic series carries the brand: **the threshold at first light**. People in German industries, caught mid-step as they cross from the blue dark into a space where the lights have just come on. The image never says "AI". It shows the moment of stepping into something new, which is the moment our audience is in.

All images are AI-generated and labelled as such on the page (`hero.meta.imageLabel` / `imageValue`).

## Rules

1. **First light only.** Blue hour before sunrise, winter. The dark side is deep blue, the lit side is warm golden-white.
2. **One threshold, one person, mid-step.** A physical threshold (strip curtain, roller door, swing door, doorframe). One foot on each side. The light changes exactly at the threshold.
3. **Strict symmetry.** Frontal, one-point composition, threshold centered, both halves of the frame mirrored. Calm and precise, in the tradition of German typological architecture photography. No whimsy, no pastel.
4. **Seen from behind or the side.** Nobody looks at the camera.
5. **Room for type.** Leave calm negative space (usually the ground) where headlines can sit without covering the person.
6. **No text.** No logos, brand marks, licence plates, or readable signage. Check every image for invented lettering before shipping.
7. **Vary the threshold and the industry,** never the light or the composition rule. Repetition of the rule reads as a series; repetition of the scene reads as a template.

## Style line

Appended to every prompt, unchanged:

> Shot on a Fujifilm X-T5 with Classic Chrome film simulation, 35mm lens, natural available light, muted desaturated colors, slightly lifted blacks, soft highlight rolloff, fine organic film grain, documentary photography, quiet and unstaged, set in Germany, no text, no logos, no people looking at camera.

Model: `gemini-3-pro-image`, `aspectRatio` 16:9 for full-bleed, 3:2 for section images, `imageSize` 2K.

## Series

| # | Industry | Threshold | Status |
| - | -------- | --------- | ------ |
| 1 | Metalworking | Heavy PVC strip curtain at the hall entrance, worker pushing through | Hero (`src/assets/imagery/threshold-metalworks.jpg`). Jacket shows faint invented lettering, fix in final pass. |
| 2 | Logistics | Roller door half open, worker ducking under it into the lit hall | Planned |
| 3 | Medical practice | Front door of an old townhouse, doctor stepping in from the blue street into the lit reception | Planned |
| 4 | Agriculture | Reversed: farmer stepping out of the lit barn into the blue yard | Planned |
| 5 | Bakery | Swing door from the lit bakehouse into the still-dark shop | Planned |
| 6 | Office | Glass door into the one lit room on a dark floor | Planned |

Generate one image at a time and review it against the rules before the next.

## Hero prompt (image 1)

> Strictly frontal, perfectly symmetrical one-point composition, camera low and further back, centered on the entrance of a German mid-sized metalworking hall at blue hour before sunrise in winter. The wide entrance opening with a heavy transparent PVC strip curtain sits in the UPPER HALF of the frame, exactly centered. The LOWER HALF of the frame is a wide, empty, frosted concrete yard in deep blue shadow, completely clear of objects, calm negative space. The facade left and right is dark blue and mirrored evenly. Behind the curtain, the hall's lights have just come on, warm golden-white light glowing through the strips and spilling a soft warm pool onto the frost just in front of the entrance. A worker in a dark work jacket, seen from behind, small in the frame, is caught mid-step exactly in the center as he pushes through the curtain with both hands, the strips parting around him, his back foot still outside on the blue frosted ground, his front foot in the warm light. Calm, precise, documentary, in the tradition of German typological architecture photography.
