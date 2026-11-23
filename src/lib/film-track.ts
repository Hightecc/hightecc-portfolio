import { isMotif, type Motif } from "@/lib/film";

export type Slot = {
  motif: Motif;
  x: number;
  y: number;
  size: number;
};

export type Shot = {
  from: Slot;
  to: Slot;
  u: number;
};

export function measureSlots(): Slot[] {
  const scrollY = window.scrollY;
  return Array.from(document.querySelectorAll<HTMLElement>("[data-film-slot]"))
    .flatMap((el) => {
      const motif = el.dataset.filmSlot;
      if (!isMotif(motif)) return [];
      const rect = el.getBoundingClientRect();
      return [
        {
          motif,
          x: rect.left + rect.width / 2,
          y: rect.top + scrollY + rect.height / 2,
          size: Math.min(rect.width, rect.height),
        },
      ];
    })
    .sort((a, b) => a.y - b.y);
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

export function shotAt(slots: Slot[], line: number): Shot | null {
  const first = slots[0];
  if (!first) return null;

  let from = first;
  let to = first;
  for (const slot of slots) {
    if (slot.y <= line) from = slot;
    else {
      to = slot;
      break;
    }
  }
  if (to.y <= line) to = from;

  const span = to.y - from.y;
  const raw = span > 0 ? (line - from.y) / span : 0;
  return { from, to, u: smoothstep(0.12, 0.88, raw) };
}
