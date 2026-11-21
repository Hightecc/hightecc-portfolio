"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import styles from "./film.module.css";

const FilmScene = dynamic(() => import("@/components/film-scene"), { ssr: false });

const MorphScene = dynamic(() => import("@/components/morph-scene"), { ssr: false });

function supportsWebGL2() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

export function Film({ variant = "meshes" }: { variant?: "meshes" | "morph" }) {
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const live = webgl && !reducedMotion;

  useEffect(() => setWebgl(supportsWebGL2()), []);

  useEffect(() => {
    if (!live || !ready) return;
    const root = document.documentElement;
    root.dataset.film = "live";
    return () => {
      delete root.dataset.film;
    };
  }, [live, ready]);

  const onReady = useCallback(() => setReady(true), []);

  if (!live) return null;

  return (
    <div className={styles.film} data-ready={ready} aria-hidden>
      {variant === "morph" ? <MorphScene onReady={onReady} /> : <FilmScene onReady={onReady} />}
    </div>
  );
}
