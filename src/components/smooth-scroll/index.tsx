"use client";

import "lenis/dist/lenis.css";

import { type ReactNode, useEffect, useRef } from "react";

import { type LenisRef, ReactLenis, useLenis } from "lenis/react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, [reducedMotion]);

  if (reducedMotion) return children;

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, anchors: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
