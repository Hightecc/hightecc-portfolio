"use client";

import { useMemo } from "react";

import {
  AdditiveBlending,
  Color,
  MathUtils,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  type Texture,
} from "three";

import type { Motif } from "@/lib/film";

export const FOV = 30;
export const CAMERA_Z = 10;
export const WORLD_HEIGHT = 2 * CAMERA_Z * Math.tan(MathUtils.degToRad(FOV / 2));

export const BACKGROUND = "#07070a";
export const ORANGE = "#ff6b35";
export const EMBER = "#ff4d1f";
export const PEACH = "#ffb48f";
export const CORAL = "#ff7a5c";
export const PINK = "#ff5f8f";
export const MAGENTA = "#e04fd4";
export const VIOLET = "#8b5cf6";
export const BLUE = "#3b82f6";

export type Framing = { fill: number; offsetY: number; tilt: [number, number, number] };

export const framing: Record<Motif, Framing> = {
  mark: { fill: 0.72, offsetY: 0.06, tilt: [0.15, 0, 0] },
  lens: { fill: 0.78, offsetY: 0, tilt: [0, 0, 0] },
  flows: { fill: 0.74, offsetY: 0, tilt: [0.2, 0, 0] },
  bridge: { fill: 0.78, offsetY: 0.04, tilt: [0.15, 0, 0] },
  software: { fill: 0.7, offsetY: 0, tilt: [0, 0, 0] },
  listen: { fill: 0.86, offsetY: 0, tilt: [0, 0, 0] },
  small: { fill: 0.9, offsetY: 0, tilt: [0.15, 0, 0] },
  grow: { fill: 0.8, offsetY: 0, tilt: [0, 0, 0] },
  prism: { fill: 0.74, offsetY: 0, tilt: [0.08, 0.42, 0] },
};

export const passVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uEdge;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float falloff = clamp(1.0 - distance(vUv, vec2(0.5)) * 2.0, 0.0, 1.0);
    vec3 color = mix(uEdge, uColor, smoothstep(0.0, 0.9, falloff));
    gl_FragColor = vec4(color, pow(falloff, 2.0) * uIntensity);
  }
`;

export const leakFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uEdge;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float across = pow(clamp(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0, 1.0), 2.4);
    float along = smoothstep(0.0, 0.6, vUv.x);
    vec3 color = mix(uColor, uEdge, smoothstep(0.35, 1.0, vUv.x));
    color = mix(color, vec3(1.0), pow(across, 6.0) * along * 0.85);
    gl_FragColor = vec4(color, across * along * uIntensity);
  }
`;

export const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float across = pow(clamp(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0, 1.0), 2.0);
    float along = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
    gl_FragColor = vec4(uColor, across * along * uIntensity);
  }
`;

export const compositeFragment = /* glsl */ `
  uniform sampler2D tScene;
  uniform float uGrain;
  uniform float uPixel;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    gl_FragColor = texture2D(tScene, vUv);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    float light = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
    float noise = hash(floor(gl_FragCoord.xy / uPixel)) - 0.5;
    gl_FragColor.rgb += noise * uGrain * (0.45 + light);
  }
`;

export function fxMaterial(fragmentShader: string, color: string, edge = color) {
  const intensity = { value: 0 };
  const material = new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(color) },
      uEdge: { value: new Color(edge) },
      uIntensity: intensity,
    },
    vertexShader: passVertex,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  return { material, intensity };
}

export function useComposite() {
  return useMemo(() => {
    const uniforms = {
      tScene: { value: null as Texture | null },
      uGrain: { value: 0.11 },
      uPixel: { value: 1 },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: passVertex,
      fragmentShader: compositeFragment,
      depthTest: false,
      depthWrite: false,
    });
    const scene = new Scene();
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));
    return { scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1), uniforms };
  }, []);
}

export const easeOut = (t: number) => 1 - (1 - t) ** 3;

export const FLOW_STOPS = [ORANGE, PINK, MAGENTA, VIOLET, PEACH, ORANGE];

export const flowGlsl = /* glsl */ `
  uniform vec3 uStops[6];

  vec3 flow(float t) {
    float scaled = fract(t) * 5.0;
    int index = int(floor(scaled));
    float blend = smoothstep(0.0, 1.0, fract(scaled));
    vec3 color = uStops[0];
    for (int i = 0; i < 5; i++) {
      if (i == index) color = mix(uStops[i], uStops[i + 1], blend);
    }
    return color;
  }
`;
