# Imagery

Every image on the site belongs to one series: playful, hand-drawn risograph illustrations in two inks on white paper. They are generated with an image model and are clearly stylised, so they are not labelled.

## Style

- **Two spot inks only:** warm orange `#FF6B35` (the logo colour) and deep teal `#1F5F6B`, printed on white. Where they overlap they make a third, darker tone. No other colours, no gradients.
- **Hand-drawn, a little rough:** loose, slightly wobbly ink lines, riso grain, halftone dots, uneven ink coverage and slight misregistration between the two inks.
- **Playful, not cute:** lively scenes full of small details (tools, mugs, plants, cable reels), but no hearts, faces on objects, flowers, sparkles or swirly decoration. The reference point is a workshop or engineering zine, not a greeting card.
- **No lettering:** no text, letters, numbers or logos, including on screens, posters and whiteboards (boxes and arrows only). Check every image at full size before shipping.

## Casting

A typical German Mittelstand team: men and women, apprentices to people near retirement, mostly white with a little visible variety in skin tone. Never only men. Do not name ethnicities in prompts; re-roll or edit an image that reads as staged or as a diversity checklist.

## Two kinds of image

1. **Scenes** (hero, contact): people at work, one person walking in through an open door, a colleague greeting them.
2. **Card backgrounds** (services, process): abstract doodles with no people that hint at the card's topic. The motifs fill the top of the image and the bottom stays almost empty paper. The cards show only the top strip of the image (`object-position: top`) with the text set below it on white, so the drawing never sits behind text.

## Generating

Model: `gemini-3.1-flash-image`. It is much cheaper than `gemini-3-pro-image` and good enough for this style; generate one image at a time and only re-roll the ones that fail review. Use `imageSize` 1K for cards and 2K for scenes.

The flash model tends to return a photo of a printed sheet on a table. Prepend the format line to every prompt:

> FORMAT: a flat, full-bleed digital scan of the artwork. The white paper fills the entire frame edge to edge. This is NOT a photo of a printed sheet: no mockup, no table or surface behind it, no paper edges, no borders, no shadows, no frame.

Then the style line:

> Playful hand-drawn risograph print, like an indie editorial riso zine. Loose, slightly wobbly hand-drawn ink lines, charming and a little naive. Printed in exactly two spot inks, warm orange #FF6B35 and deep teal #1F5F6B, on plain white paper; where the inks overlap they make a third mixed tone. Visible riso grain, uneven ink coverage, halftone dots, slight misregistration. No gradients, no other colours. No text, no letters, no numbers, no logos anywhere.

For card backgrounds, add the tone line and the layout line, filling in the motif and the split (cards in the services grid: 4:3, top half / bottom half; process cards: 2:3, top 40 percent / bottom 60 percent):

> TONE: bold, graphic and a little rough, like a workshop or engineering zine. Not cute: no hearts, no faces, no smiling objects, no flowers, no sparkles, no swirly decorative doodles.

> Abstract decorative background, no people. Loose playful shapes, doodles and patterns that hint at the theme: {motif} IMPORTANT LAYOUT: all shapes sit in the TOP {top} of the image and may bleed off the top and side edges; the BOTTOM {bottom} is almost empty plain paper with only a few tiny sparse dots or a single thin wavy line, so dark text can be set on it and stay perfectly readable.

## Post-processing

1. **Paper to white.** The model prints on a slightly tinted paper. Take the median colour of the empty paper area and scale each channel so that colour becomes pure white (`pixel * 255 / paper`, clipped). The inks shift only slightly.
2. **Trim scenes.** Crop away any empty paper margin around a scene so it fills its frame.
3. **Save** as JPEG (q80–85): cards at their native 1K size, scenes at most 2400 px wide (hero) or 1300 px (contact).

## Files

All in `src/assets/imagery/`.

| File | Use | Motif |
| ---- | --- | ----- |
| `riso-werkstatt.jpg` | Hero (21:9) | Busy metalworking workshop seen from above, a worker with a coffee walks in through the open double doors |
| `riso-kontakt.jpg` | Contact (4:5) | A woman walks into a small office in a brick building, two colleagues talk over coffee at a whiteboard |
| `riso-check.jpg` | Service: KI-Check | Magnifying glass, ticks and crosses, circles |
| `riso-flows.jpg` | Service: Abläufe planen | Boxes joined by loopy arrows, branching dotted paths |
| `riso-bridge.jpg` | Service: Brücke zur IT | Arched bridge, overlapping speech bubbles, plugs and sockets |
| `riso-software.jpg` | Service: Software nach Maß | Browser windows, a phone, sliders, toggles, curly brackets, a cursor |
| `riso-listen.jpg` | Process 1: Erst zuhören | Overlapping speech bubbles, notepad, pencil, mug |
| `riso-small.jpg` | Process 2: Klein anfangen | Seedling in a pot, stacked blocks, paper plane |
| `riso-grow.jpg` | Process 3: Nur ausbauen | Rising bars, growing plant, coins, upward arrow |

## Hero prompt

Generated with `gemini-3-pro-image` before the switch to the flash model; regenerate with the format line above if it ever needs replacing.

> Playful hand-drawn risograph print illustration, like an indie editorial riso zine. Loose, slightly wobbly ink lines drawn by hand, a little naive and charming, expressive characters with personality, lots of small lively details. Printed in exactly two spot inks (warm orange #FF6B35 and deep teal #1F5F6B) on warm off-white paper; where the two inks overlap they create a third mixed tone. Visible riso grain, uneven ink coverage, halftone dots in the shading and slight misregistration between the two colours. No gradients, no other colours. Scene, wide 21:9: a cosy, busy small German metalworking workshop, seen from slightly above with a playful tilted perspective, its big double doors flung open at the front center. A worker with a coffee cup walks in through the doors, seen from behind. Inside, colleagues of different ages, men and women: one waves hello, two chat at a workbench, one bends over a lathe, one points at a laptop showing a simple flow chart of boxes and arrows. Workbenches, tools hanging on a pegboard, drawers, potted plants, coffee mugs, a radio, cable reels, a sleeping workshop cat. Keep the outer left and right edges calmer, with paper showing through. No text, no letters, no numbers, no logos anywhere, including on the laptop and posters.

## Contact prompt

Format line and style line, then:

> Scene, portrait 4:5: the open glass door of a small cosy office in an old brick building, seen frontally. A woman with a tote bag walks in through the door, seen from behind. Inside, two colleagues, a man and a woman, chat over coffee at a big wooden table with plants, a laptop and a whiteboard covered only in simple boxes and arrows. A typical German small team. Lots of small charming details: a coat rack, a bike, mugs, plants on the windowsill. Calm plain paper at the bottom edge.
