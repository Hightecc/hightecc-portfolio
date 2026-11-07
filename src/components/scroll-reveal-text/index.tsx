"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./scroll-reveal-text.module.css";

type Props = {
  text: string;
  className?: string;
};

export function ScrollRevealText({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(words.length);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const distance = rect.height + vh * 0.35;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
      setLit(Math.round(progress * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: words repeat and never reorder
        <span key={i} className={i < lit ? styles.lit : styles.word}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
