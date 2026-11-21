"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

import styles from "./hero-stage.module.css";

const GlassRing = dynamic(() => import("@/components/glass-ring"), { ssr: false });

function supportsWebGL2() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

export function HeroStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const live = webgl && !reducedMotion;

  useEffect(() => setWebgl(supportsWebGL2()), []);

  useEffect(() => {
    const node = stage.current;
    if (!live || !node) return;
    const observer = new IntersectionObserver((entries) =>
      setInView(entries.some((entry) => entry.isIntersecting)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);

  useGSAP(
    () => {
      if (!live) return;
      ScrollTrigger.create({
        trigger: stage.current,
        start: 0,
        end: "bottom top",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    },
    { scope: stage, dependencies: [live] },
  );

  return (
    <div ref={stage} className={styles.stage} data-ready={live && ready}>
      <div className={styles.fallback}>{children}</div>
      {live ? (
        <div className={styles.canvas}>
          <GlassRing progress={progress} active={inView} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
