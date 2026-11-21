export const motifs = [
  "mark",
  "lens",
  "flows",
  "bridge",
  "software",
  "listen",
  "small",
  "grow",
  "knot",
] as const;

export type Motif = (typeof motifs)[number];

export function isMotif(value: string | undefined): value is Motif {
  return motifs.includes(value as Motif);
}
