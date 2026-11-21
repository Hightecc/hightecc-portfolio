"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Environment, Lightformer, PerformanceMonitor, useFBO } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  MathUtils,
  Mesh,
  NeutralToneMapping,
  OrthographicCamera,
  PlaneGeometry,
  type Points,
  Scene,
  ShaderMaterial,
  type Texture,
} from "three";

import { type GlassProps, motifNodes } from "@/components/film-motifs";
import { type Motif, motifs } from "@/lib/film";
import { measureSlots, type Slot, shotAt } from "@/lib/film-track";

const FOV = 30;
const CAMERA_Z = 10;
const WORLD_HEIGHT = 2 * CAMERA_Z * Math.tan(MathUtils.degToRad(FOV / 2));

const BACKGROUND = "#07070a";
const ORANGE = "#ff6b35";
const EMBER = "#ff4d1f";
const PEACH = "#ffb48f";
const CORAL = "#ff7a5c";
const PINK = "#ff5f8f";
const MAGENTA = "#e04fd4";
const VIOLET = "#8b5cf6";
const BLUE = "#3b82f6";

type Framing = { fill: number; offsetY: number; tilt: [number, number, number] };

const framing: Record<Motif, Framing> = {
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

const passVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
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

const leakFragment = /* glsl */ `
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

const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float across = pow(clamp(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0, 1.0), 2.0);
    float along = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
    gl_FragColor = vec4(uColor, across * along * uIntensity);
  }
`;

const compositeFragment = /* glsl */ `
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

function fxMaterial(fragmentShader: string, color: string, edge = color) {
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

function useComposite() {
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

const dustVertex = /* glsl */ `
  attribute float aRadius;
  attribute float aArm;
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uSpread;
  uniform float uTime;
  uniform float uSize;
  uniform vec3 uColors[4];
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float radius = aRadius * mix(0.08, 1.0, uSpread);
    float orbit = uTime * 0.25;
    float angle = aArm + aRadius * 5.0 + orbit + (1.0 - uSpread) * 4.0;
    vec3 p = vec3(cos(angle) * radius, 0.0, sin(angle) * radius);
    p += aScatter * mix(0.15, 1.0, uSpread);
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * view;
    float core = 1.0 - smoothstep(0.0, 0.35, aRadius);
    gl_PointSize = uSize * (0.35 + fract(aSeed * 3.7) + core * 0.3) / -view.z;
    float along = clamp(aRadius * 3.0 + (fract(aSeed * 13.7) - 0.5) * 0.8, 0.0, 2.999);
    vColor = mix(uColors[int(along)], uColors[int(along) + 1], fract(along));
    vColor = mix(vColor, vec3(1.0, 0.92, 0.86), core * 0.35);
    vAlpha = (0.35 + 0.65 * fract(aSeed * 11.1)) * (0.7 + core * 0.3);
  }
`;

const dustFragment = /* glsl */ `
  uniform float uIntensity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float dot = pow(clamp(1.0 - d, 0.0, 1.0), 1.4);
    gl_FragColor = vec4(vColor, dot * vAlpha * uIntensity);
  }
`;

const GALAXY_ARMS = 3;

function scatter(radius: number, amount: number) {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return Math.random() ** 2.4 * sign * amount * (0.3 + radius);
}

function useDust(count: number) {
  return useMemo(() => {
    const radii = new Float32Array(count);
    const arms = new Float32Array(count);
    const offsets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 0.04 + Math.random() ** 1.3 * 0.96;
      radii[i] = radius;
      arms[i] = ((i % GALAXY_ARMS) / GALAXY_ARMS) * Math.PI * 2;
      offsets[i * 3] = scatter(radius, 0.2);
      offsets[i * 3 + 1] = scatter(radius, 0.14);
      offsets[i * 3 + 2] = scatter(radius, 0.2);
      seeds[i] = Math.random();
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aRadius", new BufferAttribute(radii, 1));
    geometry.setAttribute("aArm", new BufferAttribute(arms, 1));
    geometry.setAttribute("aScatter", new BufferAttribute(offsets, 3));
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    const uniforms = {
      uSpread: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 60 },
      uIntensity: { value: 0 },
      uColors: { value: [PEACH, ORANGE, PINK, VIOLET].map((hex) => new Color(hex)) },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return { geometry, material, uniforms };
  }, [count]);
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

function Film({ onReady }: { onReady: () => void }) {
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const buffer = useFBO(Math.round(size.width * 0.6), Math.round(size.height * 0.6));
  const target = useFBO({ samples: 4 });
  const composite = useComposite();

  const glassRoot = useRef<Group>(null);
  const motifGroups = useRef<Partial<Record<Motif, Group>>>({});
  const prismBeams = useRef<Group>(null);
  const dustCloud = useRef<Points>(null);
  const dust = useDust(2400);
  const slots = useRef<Slot[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const leaning = useRef({ x: 0, y: 0 });
  const frames = useRef(0);

  const fx = useMemo(
    () => ({
      warm: fxMaterial(glowFragment, ORANGE, EMBER),
      cool: fxMaterial(glowFragment, CORAL, MAGENTA),
      leak: fxMaterial(leakFragment, EMBER, ORANGE),
      beamIn: fxMaterial(beamFragment, "#ffffff"),
      spectrum: [EMBER, ORANGE, MAGENTA, VIOLET, BLUE].map((color) =>
        fxMaterial(beamFragment, color),
      ),
    }),
    [],
  );
  const warmGlow = useRef<Mesh>(null);
  const coolGlow = useRef<Mesh>(null);
  const leak = useRef<Mesh>(null);

  const glass = useMemo<GlassProps>(
    () => ({
      buffer: buffer.texture as Texture,
      resolution: 32,
      backsideResolution: 32,
      samples: 8,
      thickness: 0.6,
      roughness: 0.04,
      ior: 1.5,
      chromaticAberration: 0.9,
      anisotropicBlur: 0.06,
      distortion: 0.08,
      distortionScale: 0.3,
      temporalDistortion: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.4,
    }),
    [buffer],
  );

  useEffect(() => {
    const measure = () => {
      slots.current = measureSlots();
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

    if (leak.current) {
      const depth = CAMERA_Z + 6;
      const halfH = depth * Math.tan(MathUtils.degToRad(FOV / 2));
      const halfW = halfH * (size.width / size.height);
      const drift = Math.sin(t * 0.15 + scrollY * 0.0004) * 0.06;
      leak.current.position.set(halfW * 0.72, halfH * 0.86, -6);
      leak.current.rotation.z = -0.42 + drift;
      leak.current.scale.set(halfW * 1.5, halfH * 0.55, 1);
      fx.leak.intensity.value = 0.85;
    }

    const sway = Math.min(delta * 3, 1);
    const lean = leaning.current;
    lean.x += (pointer.current.x - lean.x) * sway;
    lean.y += (pointer.current.y - lean.y) * sway;

    if (shot) {
      const { from, to, u } = shot;
      const travel = easeOut(u) * 0.5 + u * 0.5;
      const x = MathUtils.lerp(from.x, to.x, travel);
      const y = MathUtils.lerp(from.y - scrollY, to.y - scrollY, travel);
      const worldSize = MathUtils.lerp(from.size, to.size, travel) * unit;
      const wx = (x - size.width / 2) * unit;
      const wy = -(y - size.height / 2) * unit;

      const presence: Partial<Record<Motif, number>> = {};
      if (from === to) presence[from.motif] = 1;
      else {
        presence[from.motif] = 1 - MathUtils.smoothstep(u, 0, 0.5);
        presence[to.motif] = MathUtils.smoothstep(u, 0.5, 1);
      }

      for (const motif of motifs) {
        const group = motifGroups.current[motif];
        if (!group) continue;
        const amount = presence[motif] ?? 0;
        group.visible = amount > 0.001;
        if (!group.visible) continue;
        const frame = framing[motif];
        const scale = (worldSize / 2) * frame.fill * easeOut(amount);
        group.scale.setScalar(Math.max(scale, 1e-4));
        group.position.set(wx, wy + frame.offsetY * worldSize, 0);
        group.rotation.set(
          frame.tilt[0] + Math.sin(t * 0.4) * 0.05 - lean.y * 0.12,
          frame.tilt[1] + Math.sin(t * 0.25) * 0.2 + lean.x * 0.2 + (1 - amount) * 2.2,
          frame.tilt[2] + (1 - amount) * 0.6,
        );
      }

      const between = from === to ? 0 : (4 * u * (1 - u)) ** 3;
      if (dustCloud.current) {
        const spread = from === to ? 0 : Math.sin(Math.PI * u);
        dustCloud.current.visible = spread > 0.001;
        dustCloud.current.position.set(wx, wy, 0.4);
        dustCloud.current.scale.setScalar(worldSize * 0.62);
        dustCloud.current.rotation.set(0.85 + Math.sin(t * 0.3) * 0.12, t * 0.05, 0.35 - u * 0.5);
        dust.uniforms.uSpread.value = spread;
        dust.uniforms.uTime.value = t;
        dust.uniforms.uSize.value = 80 * dpr * (size.height / 900);
        dust.uniforms.uIntensity.value = 1.1 * MathUtils.smoothstep(spread, 0, 0.35);
      }

      const glow = Math.max(presence[from.motif] ?? 0, presence[to.motif] ?? 0, between * 0.7);
      const anchorY = wy + framing[from.motif].offsetY * worldSize * (1 - travel);
      warmGlow.current?.position.set(wx, anchorY - worldSize * 0.08, -3);
      warmGlow.current?.scale.setScalar(worldSize * 1.5);
      coolGlow.current?.position.set(wx + worldSize * 0.42, anchorY + worldSize * 0.3, -3.5);
      coolGlow.current?.scale.setScalar(worldSize * 1.1);
      fx.warm.intensity.value = 0.5 * glow;
      fx.cool.intensity.value = 0.22 * glow;

      const prism = motifGroups.current.prism;
      const beams = prismBeams.current;
      const prismAmount = presence.prism ?? 0;
      if (prism && beams) {
        beams.visible = prismAmount > 0.001;
        beams.position.copy(prism.position);
        beams.position.z = -1.2;
        beams.scale.setScalar((worldSize / 2) * framing.prism.fill);
        fx.beamIn.intensity.value = 0.9 * prismAmount;
        for (const beam of fx.spectrum) beam.intensity.value = 0.75 * prismAmount;
      }
    }

    composite.uniforms.uPixel.value = dpr;

    if (glassRoot.current) glassRoot.current.visible = false;
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    if (glassRoot.current) glassRoot.current.visible = true;
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
      <points
        ref={dustCloud}
        geometry={dust.geometry}
        material={dust.material}
        visible={false}
        frustumCulled={false}
      />
      <mesh ref={warmGlow} material={fx.warm.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={coolGlow} material={fx.cool.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={prismBeams} visible={false}>
        <mesh material={fx.beamIn.material} position={[-1.75, 0.02, 0]} rotation={[0, 0, 0.1]}>
          <planeGeometry args={[2.8, 0.12]} />
        </mesh>
        {fx.spectrum.map((beam, i) => (
          <mesh
            key={beam.material.uuid}
            material={beam.material}
            position={[1.7, 0.08 - i * 0.12, 0]}
            rotation={[0, 0, -0.06 - i * 0.07]}
          >
            <planeGeometry args={[2.6, 0.16]} />
          </mesh>
        ))}
      </group>
      <group ref={glassRoot}>
        {motifs.map((motif) => {
          const Node = motifNodes[motif];
          return (
            <group
              key={motif}
              visible={false}
              ref={(node) => {
                if (node) motifGroups.current[motif] = node;
              }}
            >
              <Node glass={glass} />
            </group>
          );
        })}
      </group>
    </>
  );
}

const domeFragment = /* glsl */ `
  uniform vec3 uStops[6];
  varying vec3 vDirection;

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

  void main() {
    vec3 d = normalize(vDirection);
    float angle = atan(d.z, d.x) / 6.28318 + 0.5;
    vec3 hue = flow(angle + d.y * 0.18);
    float light = 0.4 + 0.6 * smoothstep(-0.8, 0.6, d.y);
    hue = mix(hue, vec3(1.0, 0.94, 0.9), smoothstep(0.55, 0.98, d.y) * 0.55);
    gl_FragColor = vec4(hue * light * 1.6, 1.0);
  }
`;

const domeVertex = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Lights() {
  const dome = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uStops: {
            value: [ORANGE, PINK, MAGENTA, VIOLET, PEACH, ORANGE].map((hex) => new Color(hex)),
          },
        },
        vertexShader: domeVertex,
        fragmentShader: domeFragment,
        side: BackSide,
        depthWrite: false,
      }),
    [],
  );

  return (
    <Environment resolution={512} frames={1}>
      <mesh scale={40} material={dome}>
        <sphereGeometry args={[1, 64, 32]} />
      </mesh>
      <Lightformer form="rect" intensity={6} position={[0, 6, 2]} scale={[12, 0.8, 1]} />
      <Lightformer form="rect" intensity={3} position={[-6, 0, 3]} scale={[0.6, 10, 1]} />
      <Lightformer form="rect" intensity={1.5} position={[4, -2, 6]} scale={[3, 0.4, 1]} />
    </Environment>
  );
}

export default function FilmScene({ onReady }: { onReady: () => void }) {
  const [maxDpr, setMaxDpr] = useState(1.75);

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
      <Film onReady={onReady} />
      <Lights />
    </Canvas>
  );
}
