"use client";

import "lenis/dist/lenis.css";

import type { ReactNode } from "react";

import { ReactLenis } from "lenis/react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return children;

  return (
    <ReactLenis root options={{ anchors: true }}>
      {children}
    </ReactLenis>
  );
}
