"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PerformanceMonitor, useFBO } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  Euler,
  Matrix3,
  Matrix4,
  type Mesh,
  NeutralToneMapping,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";

import type { Motif } from "@/lib/film";
import {
  BACKGROUND,
  CAMERA_Z,
  EMBER,
  easeOut,
  FOV,
  flowGlsl,
  framing,
  fxMaterial,
  glowFragment,
  leakFragment,
  MAGENTA,
  ORANGE,
  PEACH,
  PINK,
  useComposite,
  VIOLET,
  WORLD_HEIGHT,
} from "@/lib/film-fx";
import { measureSlots, type Slot, shotAt } from "@/lib/film-track";

const morphMotifs: Motif[] = ["mark", "lens", "flows"];

const BOUND = 1.45;

const MORPH_STOPS = [ORANGE, PEACH, ORANGE, PINK, VIOLET, ORANGE];

const raymarchVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const raymarchFragment = /* glsl */ `
  uniform mat4 uInverse;
  uniform mat3 uRotation;
  uniform int uFrom;
  uniform int uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uPixelAngle;
  uniform float uBound;
  varying vec3 vWorld;

  ${flowGlsl}

  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  float sdTorus(vec3 p, float big, float small) {
    return length(vec2(length(p.xy) - big, p.z)) - small;
  }

  float sdCappedTorus(vec3 p, vec2 sc, float big, float small) {
    p.x = abs(p.x);
    float k = (sc.y * p.x > sc.x * p.y) ? dot(p.xy, sc) : length(p.xy);
    return sqrt(dot(p, p) + big * big - 2.0 * big * k) - small;
  }

  float sdEllipsoid(vec3 p, vec3 r) {
    float k0 = length(p / r);
    float k1 = length(p / (r * r));
    return k0 * (k0 - 1.0) / k1;
  }

  float sdLink(vec3 p, float stretch, float big, float small) {
    vec3 q = vec3(max(abs(p.x) - stretch, 0.0), p.y, p.z);
    return length(vec2(length(q.xy) - big, q.z)) - small;
  }

  float sdC(vec3 p) {
    p -= vec3(-0.388, -0.314, 0.0);
    p.yz *= rot(0.18);
    p.xz *= rot(-0.16);
    vec3 q = vec3(-p.y, -p.x, p.z);
    return sdCappedTorus(q, vec2(sin(2.286), cos(2.286)), 0.52, 0.176);
  }

  float sdMark(vec3 p) {
    return min(sdC(p), sdC(vec3(-p.xy, p.z)));
  }

  float sdLens(vec3 p) {
    p.yz *= rot(0.45);
    p.xz *= rot(-0.5);
    float ring = sdTorus(p, 0.78, 0.2);
    float disc = sdEllipsoid(p, vec3(0.6, 0.6, 0.13));
    return min(ring, disc);
  }

  float sdFlows(vec3 p) {
    p.xy *= rot(0.5);
    p.xz *= rot(-0.35);
    p.yz *= rot(0.3);
    float d = sdLink(p - vec3(-0.62, 0.0, 0.0), 0.23, 0.3, 0.085);
    d = min(d, sdLink(p - vec3(0.62, 0.0, 0.0), 0.23, 0.3, 0.085));
    d = min(d, sdLink(vec3(p.x, p.z, -p.y), 0.23, 0.3, 0.085));
    return d;
  }

  float sdMotif(int id, vec3 p) {
    if (id == 0) return sdMark(p);
    if (id == 1) return sdLens(p);
    return sdFlows(p);
  }

  float map(vec3 p) {
    float shape = sdMotif(uFrom, p);
    float swell = 0.0;
    if (uFrom != uTo) {
      shape = mix(shape, sdMotif(uTo, p), uMix);
      swell = sin(3.14159 * uMix);
    }
    float drift =
      sin(p.x * 2.6 + uTime * 0.8) * sin(p.y * 2.2 - uTime * 0.6) * sin(p.z * 2.9 + uTime * 0.7) +
      0.5 * sin(p.x * 4.3 - uTime * 1.1) * sin(p.y * 3.9 + uTime * 0.9) * sin(p.z * 4.6 - uTime * 0.5);
    float ripple = sin(p.x * 5.0 + uTime * 1.3) * sin(p.y * 4.0 - uTime) * sin(p.z * 6.0 + uTime * 0.7);
    return shape - swell * 0.05 + drift * 0.014 + ripple * swell * 0.045;
  }

  vec3 normalAt(vec3 p) {
    const vec2 e = vec2(0.0015, -0.0015);
    return normalize(
      e.xyy * map(p + e.xyy) +
      e.yyx * map(p + e.yyx) +
      e.yxy * map(p + e.yxy) +
      e.xxx * map(p + e.xxx)
    );
  }

  vec3 environment(vec3 d) {
    float angle = atan(d.z, d.x) / 6.28318 + 1.25;
    vec3 hue = flow(angle + d.y * 0.22);
    float light = 0.25 + 0.75 * smoothstep(-0.9, 0.7, d.y);
    hue = mix(hue, vec3(1.0, 0.94, 0.9), smoothstep(0.55, 0.98, d.y) * 0.55);
    vec3 color = hue * light * 1.35;
    color += vec3(1.0) * smoothstep(0.9, 0.97, d.y) * 3.0;
    color += vec3(1.0) * smoothstep(0.86, 0.95, -d.x) * smoothstep(0.5, 0.0, abs(d.y)) * 1.6;
    return color;
  }

  void main() {
    vec3 ro = (uInverse * vec4(cameraPosition, 1.0)).xyz;
    vec3 rd = normalize((uInverse * vec4(vWorld, 1.0)).xyz - ro);

    float b = dot(ro, rd);
    float h = b * b - (dot(ro, ro) - uBound * uBound);
    if (h < 0.0) discard;
    h = sqrt(h);
    float t = max(-b - h, 0.0);
    float tEnd = -b + h;

    float closest = 1e9;
    float tClosest = t;
    bool hit = false;
    for (int i = 0; i < 120; i++) {
      vec3 p = ro + rd * t;
      float d = map(p);
      if (d < closest) {
        closest = d;
        tClosest = t;
      }
      if (d < 0.0006 * t) {
        hit = true;
        break;
      }
      t += d * 0.8;
      if (t > tEnd) break;
    }

    float footprint = uPixelAngle * tClosest;
    float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, footprint * 1.5, closest);
    if (alpha < 0.01) discard;

    vec3 p = ro + rd * (hit ? t : tClosest);
    vec3 n = normalAt(p);
    vec3 view = normalize(uRotation * rd);
    vec3 normal = normalize(uRotation * n);

    float facing = max(dot(normal, -view), 0.0);
    float fresnel = 0.06 + 0.94 * pow(1.0 - facing, 3.0);
    vec3 reflection = environment(reflect(view, normal));
    vec3 film = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + fresnel * 1.4 + normal.y * 0.3));
    reflection *= mix(vec3(1.0), film, 0.45);

    vec3 refractedR = environment(refract(view, normal, 1.0 / 1.38));
    vec3 refractedG = environment(refract(view, normal, 1.0 / 1.42));
    vec3 refractedB = environment(refract(view, normal, 1.0 / 1.47));
    vec3 body = vec3(refractedR.r, refractedG.g, refractedB.b) * 0.55;

    vec3 color = mix(body, reflection, 0.45 + 0.55 * fresnel);
    float spark = pow(max(dot(reflect(view, normal), normalize(vec3(-0.3, 0.9, 0.4))), 0.0), 60.0);
    color += spark * 2.0;
    gl_FragColor = vec4(color, alpha);
  }
`;

function useRaymarch() {
  return useMemo(() => {
    const uniforms = {
      uInverse: { value: new Matrix4() },
      uRotation: { value: new Matrix3() },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uMix: { value: 0 },
      uTime: { value: 0 },
      uPixelAngle: { value: 0.001 },
      uBound: { value: BOUND },
      uStops: { value: MORPH_STOPS.map((hex) => new Color(hex)) },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: raymarchVertex,
      fragmentShader: raymarchFragment,
      transparent: true,
      depthWrite: false,
    });
    return { material, uniforms };
  }, []);
}

function Morph({ onReady }: { onReady: () => void }) {
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const target = useFBO({ samples: 4 });
  const composite = useComposite();
  const raymarch = useRaymarch();

  const body = useRef<Mesh>(null);
  const warmGlow = useRef<Mesh>(null);
  const coolGlow = useRef<Mesh>(null);
  const leak = useRef<Mesh>(null);
  const slots = useRef<Slot[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const leaning = useRef({ x: 0, y: 0 });
  const frames = useRef(0);

  const fx = useMemo(
    () => ({
      warm: fxMaterial(glowFragment, ORANGE, EMBER),
      cool: fxMaterial(glowFragment, MAGENTA, ORANGE),
      leak: fxMaterial(leakFragment, EMBER, ORANGE),
    }),
    [],
  );

  const scratch = useMemo(
    () => ({
      matrix: new Matrix4(),
      position: new Vector3(),
      rotation: new Quaternion(),
      euler: new Euler(),
      scale: new Vector3(),
      orientation: new Matrix4(),
    }),
    [],
  );

  useEffect(() => {
    const measure = () => {
      slots.current = measureSlots().filter((slot) => morphMotifs.includes(slot.motif));
    };
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useFrame((state, delta) => {
    const { gl, scene, camera, clock } = state;
    const t = clock.elapsedTime;
    const unit = WORLD_HEIGHT / size.height;
    const anchor = size.width < 720 ? 0.4 : 0.5;
    const scrollY = window.scrollY;
    const shot = shotAt(slots.current, scrollY + size.height * anchor);

    const sway = Math.min(delta * 3, 1);
    const lean = leaning.current;
    lean.x += (pointer.current.x - lean.x) * sway;
    lean.y += (pointer.current.y - lean.y) * sway;

    if (leak.current) {
      const depth = CAMERA_Z + 6;
      const halfH = depth * Math.tan((FOV / 2) * (Math.PI / 180));
      const halfW = halfH * (size.width / size.height);
      leak.current.position.set(halfW * 0.72, halfH * 0.86, -6);
      leak.current.rotation.z = -0.42 + Math.sin(t * 0.15 + scrollY * 0.0004) * 0.06;
      leak.current.scale.set(halfW * 1.5, halfH * 0.55, 1);
      fx.leak.intensity.value = 0.85;
    }

    if (shot && body.current) {
      const { from, to, u } = shot;
      const travel = easeOut(u) * 0.5 + u * 0.5;
      const x = from.x + (to.x - from.x) * travel;
      const y = from.y - scrollY + (to.y - from.y) * travel;
      const worldSize = (from.size + (to.size - from.size) * travel) * unit;
      const fill =
        framing[from.motif].fill + (framing[to.motif].fill - framing[from.motif].fill) * u;
      const offset =
        framing[from.motif].offsetY + (framing[to.motif].offsetY - framing[from.motif].offsetY) * u;
      const wx = (x - size.width / 2) * unit;
      const wy = -(y - size.height / 2) * unit + offset * worldSize;
      const scale = (worldSize / 2) * fill;
      const spin = Math.sin(Math.PI * u) * 0.9;

      scratch.position.set(wx, wy + Math.sin(t * 0.7) * worldSize * 0.012, 0);
      scratch.euler.set(
        0.12 + Math.sin(t * 0.4) * 0.05 - lean.y * 0.12 + spin * 0.3,
        Math.sin(t * 0.25) * 0.2 + lean.x * 0.2 + spin,
        spin * 0.2,
      );
      scratch.rotation.setFromEuler(scratch.euler);
      scratch.scale.setScalar(scale * (1 + Math.sin(t * 0.9) * 0.012));
      scratch.matrix.compose(scratch.position, scratch.rotation, scratch.scale);
      scratch.orientation.makeRotationFromQuaternion(scratch.rotation);
      raymarch.uniforms.uRotation.value.setFromMatrix4(scratch.orientation);
      raymarch.uniforms.uInverse.value.copy(scratch.matrix).invert();
      raymarch.uniforms.uFrom.value = morphMotifs.indexOf(from.motif);
      raymarch.uniforms.uTo.value = morphMotifs.indexOf(to.motif);
      raymarch.uniforms.uMix.value = u;
      raymarch.uniforms.uTime.value = t;
      raymarch.uniforms.uPixelAngle.value =
        (2 * Math.tan((FOV / 2) * (Math.PI / 180))) / (size.height * dpr);

      body.current.position.set(wx, wy, 0);
      body.current.scale.setScalar(scale * BOUND * 2.6);

      warmGlow.current?.position.set(wx, wy - worldSize * 0.08, -3);
      warmGlow.current?.scale.setScalar(worldSize * 1.5);
      coolGlow.current?.position.set(wx + worldSize * 0.42, wy + worldSize * 0.3, -3.5);
      coolGlow.current?.scale.setScalar(worldSize * 1.1);
      fx.warm.intensity.value = 0.5;
      fx.cool.intensity.value = 0.22;
    }

    composite.uniforms.uPixel.value = dpr;
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    composite.uniforms.tScene.value = target.texture;
    gl.render(composite.scene, composite.camera);

    if (frames.current < 3 && ++frames.current === 3) onReady();
  }, 1);

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <mesh ref={leak} material={fx.leak.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={warmGlow} material={fx.warm.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={coolGlow} material={fx.cool.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={body} material={raymarch.material} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}

export default function MorphScene({ onReady }: { onReady: () => void }) {
  const [maxDpr, setMaxDpr] = useState(1.5);

  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 40 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
      }}
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <Morph onReady={onReady} />
    </Canvas>
  );
}
