# Imagery

Two photographic series carry the brand. Both are AI-generated.

1. **The threshold at first light** (hero, contact): one person crossing a threshold into light, on the central axis of a symmetric composition. The image never says "AI". It shows the moment of stepping into something new.
2. **Work in motion** (card backgrounds): people at work in German companies, photographed with a slow shutter so they streak into warm trails of light. These sit behind text, so they stay soft and abstract.

## Casting

Germany's workforce as it actually looks in a typical Mittelstand company, not a stock-photo default and not a checklist.

- **Gender:** a natural mix; never only men.
- **Origin:** mostly white, the way a typical Mittelstand team in Germany looks. Many images show no one of a visibly different background; when someone does appear, it is one person, never several in one image. Diversity must never be the subject of the picture.
- **Age:** apprentices to people near retirement.
- **Prompting:** describe the team plainly ("colleagues, a typical German team"). Do not name ethnicities or religious dress at all; the model already mixes more than reality, so the prompt should not push it further. Re-roll images that read as staged or as a diversity checklist.

## Palette

The site is light (warm off-white paper) and the logo is orange. Photos must sit next to both:

- **Warm, never blue.** Golden sunrise light, warm greys, sandstone, timber, brick, brushed steel. No saturated blue facades, workbenches, uniforms or blue-hour skies; cold blue fights the orange logo.
- **Bright overall.** The lit interior and the sunlit ground carry the frame. Shadows are warm grey, not navy.

## Mood

Upbeat, never lonely. First light (blue dawn outside, warm light just switched on inside) works, as long as the scene is alive: colleagues already working inside, others arriving outside, people greeting each other, holding a door, talking. Show people in profile or three-quarter view, upright and engaged, rather than a single figure from behind.

## Threshold rules

1. **Sunrise.** Low, warm sunlight; the lit side glows golden. Not blue hour.
2. **One threshold, one person, mid-step.** A physical threshold (strip curtain, door, gate). The light changes at the threshold.
3. **Strict symmetry.** Frontal, one-point composition, threshold centered, both halves mirrored. Calm and precise.
4. **Seen from behind or the side.** Nobody looks at the camera.
5. **Room for type.** Calm negative space (usually the ground) where headlines sit without covering the person.

## Motion rules

1. **Slow shutter, panning.** Strong horizontal motion blur; one area only slightly sharper.
2. **Warm morning light** through windows, bright interiors.
3. **Readable behind text.** Cards add a dark gradient from the bottom, so keep the lower half calm.

## Both series

- **No text.** No logos, brand marks, licence plates, readable signs, or lettering on clothing. Check every image for invented lettering before shipping; edit it out with the same model if needed.
- **Style line,** appended to every prompt:

> Shot on Fujifilm with a Pro 400H color film look: warm golden morning sunlight, airy and optimistic, soft natural contrast, gentle organic film grain, documentary photography, unstaged, set in Germany, no text, no logos, no lettering on clothing, no readable signs, nobody looking at the camera.

- **Motion prefix,** prepended for the card series:

> Photographed with a slow shutter speed while panning, strong horizontal motion blur, people and objects streak into soft trails of color and light, abstract enough to sit behind text, with one area only slightly sharper.

Model: `gemini-3-pro-image`, `imageSize` 2K; 21:9 for the hero, 16:9 for wide cards, 4:5 for tall cards. The hero is shown at 21:9 on desktop and cropped to 4:3 around the centre on mobile, so keep the person and the threshold in the middle third.

## Files

All in `src/assets/imagery/`, resized with Lanczos and saved as JPEG q82.

| File | Use | Width |
| ---- | --- | ----- |
| `threshold-metalworks.jpg` | Hero: worker pushing through a strip curtain at sunrise, colleague waving inside (hero prompt v2) | 2400 |
| `threshold-kontakt.jpg` | Contact: two people at the glass door of a lit office at dusk. Also blue; replace with the same palette rules | 2400 |
| `motion-kommunikation.jpg` | Approach card 1: colleagues talking at a workbench | 1200 |
| `motion-essenz.jpg` | Approach card 2: hands assembling parts | 1200 |
| `motion-business.jpg` | Approach card 3: walking past a planning wall | 1200 |
| `motion-orientierung.jpg` | Services card A: walking through a production hall with a tablet | 1600 |
| `motion-integration.jpg` | Services card B: office team at screens | 1600 |
| `motion-automation.jpg` | Services card C: parcels on a conveyor | 1600 |
| `motion-web.jpg` | Services card D: phone in a train station concourse | 1600 |

## Hero prompt v2 (warm, for the light theme)

> Strictly frontal, perfectly symmetrical one-point composition, wide 21:9 frame, camera at eye level and a little back, centered on the open entrance of a German mid-sized metalworking hall on a clear morning just after sunrise. The facade is warm light-grey corrugated metal and sandstone-colored concrete, mirrored evenly left and right, catching low golden sunlight. The wide entrance with a transparent PVC strip curtain sits exactly in the center. Inside, the hall is bright with warm white light: workbenches in natural steel and timber, machines in warm grey, a few colleagues already at work, a typical German team of men and women of different ages. One worker in a charcoal work jacket and trousers, seen in three-quarter view from behind, is caught mid-step exactly in the center as he pushes through the curtain, front foot inside the warm light, back foot still on the sunlit forecourt. A female colleague inside raises a hand in greeting. The forecourt in the lower third is clean pale concrete with long soft morning shadows, calm and empty, room for type. No blue surfaces, no blue sky, no blue clothing or machines: the whole image stays in warm greys, sand, steel and gold.

Append the style line. Check the result against the casting and palette rules above before shipping.

## Hero prompt v1 (blue hour, retired)

The first hero was made in two steps: the blue-hour prompt below, then an edit to sunrise. It stays here for reference; its blue palette clashes with the orange logo.

> Strictly frontal, perfectly symmetrical one-point composition, camera low and further back, centered on the entrance of a German mid-sized metalworking hall at blue hour before sunrise in winter. The wide entrance opening with a heavy transparent PVC strip curtain sits in the UPPER HALF of the frame, exactly centered. The LOWER HALF of the frame is a wide, empty, frosted concrete yard in deep blue shadow, completely clear of objects, calm negative space. The facade left and right is dark blue and mirrored evenly. Behind the curtain, the hall's lights have just come on, warm golden-white light glowing through the strips and spilling a soft warm pool onto the frost just in front of the entrance. A worker in a dark work jacket, seen from behind, small in the frame, is caught mid-step exactly in the center as he pushes through the curtain with both hands, the strips parting around him, his back foot still outside on the blue frosted ground, his front foot in the warm light. Calm, precise, documentary, in the tradition of German typological architecture photography.
