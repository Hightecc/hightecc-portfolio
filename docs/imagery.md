# Imagery

Two photographic series carry the brand. Both are AI-generated.

1. **The threshold at first light** (hero, contact): one person crossing a threshold into light, on the central axis of a symmetric composition. The image never says "AI". It shows the moment of stepping into something new.
2. **Work in motion** (card backgrounds): people at work in German companies, photographed with a slow shutter so they streak into warm trails of light. These sit behind text, so they stay soft and abstract.

## Casting

Germany's workforce, not a stock-photo default. Across the series, and within any image with several people:

- **Gender:** at least half women; never only men.
- **Origin:** roughly 70% white, 30% people of colour (Black, Middle Eastern, South and East Asian, mixed), in ordinary roles, not as tokens.
- **Age:** apprentices to people near retirement.
- **Write it into the prompt.** Image models default to white men, so name the people explicitly (e.g. "a Black woman in her thirties", "an older Turkish-German man").

## Mood

Upbeat, never lonely. First light (blue dawn outside, warm light just switched on inside) works, as long as the scene is alive: colleagues already working inside, others arriving outside, people greeting each other, holding a door, talking. Show people in profile or three-quarter view, upright and engaged, rather than a single figure from behind.

## Threshold rules

1. **Sunrise.** Low, warm sunlight; the lit side glows golden.
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

Model: `gemini-3-pro-image`, `imageSize` 2K; 16:9 for full-bleed and wide cards, 4:5 for tall cards.

## Files

All in `src/assets/imagery/`, resized with Lanczos and saved as JPEG q82.

| File | Use | Width |
| ---- | --- | ----- |
| `threshold-metalworks.jpg` | Hero: worker through a strip curtain at sunrise | 2400 |
| `threshold-kontakt.jpg` | Contact: woman stepping out of a lobby into spring sunlight | 2400 |
| `motion-kommunikation.jpg` | Approach card 1: colleagues talking at a workbench | 1200 |
| `motion-essenz.jpg` | Approach card 2: hands assembling parts | 1200 |
| `motion-business.jpg` | Approach card 3: walking past a planning wall | 1200 |
| `motion-orientierung.jpg` | Services card A: walking through a production hall with a tablet | 1600 |
| `motion-integration.jpg` | Services card B: office team at screens | 1600 |
| `motion-automation.jpg` | Services card C: parcels on a conveyor | 1600 |
| `motion-web.jpg` | Services card D: phone in a train station concourse | 1600 |

The hero was made in two steps: the original blue-hour prompt below, then an edit to sunrise.

## Hero prompt (image 1)

> Strictly frontal, perfectly symmetrical one-point composition, camera low and further back, centered on the entrance of a German mid-sized metalworking hall at blue hour before sunrise in winter. The wide entrance opening with a heavy transparent PVC strip curtain sits in the UPPER HALF of the frame, exactly centered. The LOWER HALF of the frame is a wide, empty, frosted concrete yard in deep blue shadow, completely clear of objects, calm negative space. The facade left and right is dark blue and mirrored evenly. Behind the curtain, the hall's lights have just come on, warm golden-white light glowing through the strips and spilling a soft warm pool onto the frost just in front of the entrance. A worker in a dark work jacket, seen from behind, small in the frame, is caught mid-step exactly in the center as he pushes through the curtain with both hands, the strips parting around him, his back foot still outside on the blue frosted ground, his front foot in the warm light. Calm, precise, documentary, in the tradition of German typological architecture photography.
