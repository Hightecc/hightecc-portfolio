"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Environment, Lightformer, PerformanceMonitor, useFBO } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  type Group,
  MathUtils,
  Mesh,
  NoToneMapping,
  OrthographicCamera,
  PlaneGeometry,
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

const ORANGE = "#ff6b35";
const PEACH = "#ffb48f";
const MINT = "#1f8a84";
const MIST = "#a9ddd2";

type Framing = { fill: number; offsetY: number; tilt: [number, number, number] };

const framing: Record<Motif, Framing> = {
  ring: { fill: 0.72, offsetY: 0.02, tilt: [0.1, 0, 0] },
  lens: { fill: 0.78, offsetY: 0, tilt: [0, 0, 0] },
  flows: { fill: 0.74, offsetY: 0, tilt: [0.2, 0, 0] },
  bridge: { fill: 0.78, offsetY: 0.04, tilt: [0.15, 0, 0] },
  software: { fill: 0.7, offsetY: 0, tilt: [0, 0, 0] },
  listen: { fill: 0.86, offsetY: 0, tilt: [0, 0, 0] },
  small: { fill: 0.9, offsetY: 0, tilt: [0.15, 0, 0] },
  grow: { fill: 0.8, offsetY: 0, tilt: [0, 0, 0] },
  prism: { fill: 0.72, offsetY: 0, tilt: [0.35, 0.55, 0] },
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
    gl_FragColor = vec4(color, pow(falloff, 1.6) * uIntensity);
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
    #include <colorspace_fragment>
    float ink = smoothstep(0.0, 0.1, 1.0 - dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114)));
    float noise = hash(floor(gl_FragCoord.xy / uPixel)) - 0.5;
    gl_FragColor.rgb -= abs(noise) * uGrain * ink;
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
  });
  return { material, intensity };
}

function useComposite() {
  return useMemo(() => {
    const uniforms = {
      tScene: { value: null as Texture | null },
      uGrain: { value: 0.16 },
      uPixel: { value: 1 },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: passVertex,
      fragmentShader: compositeFragment,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const scene = new Scene();
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));
    return { scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1), uniforms };
  }, []);
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
  const bead = useRef<Group>(null);
  const slots = useRef<Slot[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const leaning = useRef({ x: 0, y: 0 });
  const frames = useRef(0);

  const fx = useMemo(
    () => ({
      warm: fxMaterial(glowFragment, ORANGE, PEACH),
      cool: fxMaterial(glowFragment, MIST, "#ffffff"),
      beamIn: fxMaterial(beamFragment, "#fff3ea"),
      beamWarm: fxMaterial(beamFragment, ORANGE),
      beamCool: fxMaterial(beamFragment, MINT),
    }),
    [],
  );
  const warmGlow = useRef<Mesh>(null);
  const coolGlow = useRef<Mesh>(null);

  const glass = useMemo<GlassProps>(
    () => ({
      buffer: buffer.texture as Texture,
      resolution: 32,
      backsideResolution: 32,
      samples: 6,
      thickness: 0.35,
      roughness: 0.3,
      ior: 1.3,
      chromaticAberration: 0.1,
      anisotropicBlur: 0.2,
      distortion: 0.18,
      distortionScale: 0.4,
      temporalDistortion: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
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
      if (bead.current) {
        bead.current.visible = between > 0.001;
        bead.current.position.set(wx, wy, 0);
        bead.current.scale.setScalar(Math.max(worldSize * 0.09 * between, 1e-4));
      }

      const glow = Math.max(presence[from.motif] ?? 0, presence[to.motif] ?? 0, between * 0.7);
      const anchorY = wy + framing[from.motif].offsetY * worldSize * (1 - travel);
      warmGlow.current?.position.set(wx, anchorY - worldSize * 0.08, -3);
      warmGlow.current?.scale.setScalar(worldSize * 1.5);
      coolGlow.current?.position.set(wx + worldSize * 0.42, anchorY + worldSize * 0.3, -3.5);
      coolGlow.current?.scale.setScalar(worldSize * 1.1);
      fx.warm.intensity.value = 0.6 * glow;
      fx.cool.intensity.value = 0.45 * glow;

      const prism = motifGroups.current.prism;
      const beams = prismBeams.current;
      const prismAmount = presence.prism ?? 0;
      if (prism && beams) {
        beams.visible = prismAmount > 0.001;
        beams.position.copy(prism.position);
        beams.position.z = -1.2;
        beams.scale.setScalar((worldSize / 2) * framing.prism.fill);
        fx.beamIn.intensity.value = 0.9 * prismAmount;
        fx.beamWarm.intensity.value = 0.8 * prismAmount;
        fx.beamCool.intensity.value = 0.7 * prismAmount;
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
      <color attach="background" args={["#ffffff"]} />
      <mesh ref={warmGlow} material={fx.warm.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={coolGlow} material={fx.cool.material}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={prismBeams} visible={false}>
        <mesh material={fx.beamIn.material} position={[-1.9, -0.05, 0]} rotation={[0, 0, 0.08]}>
          <planeGeometry args={[2.8, 0.12]} />
        </mesh>
        <mesh material={fx.beamWarm.material} position={[1.7, -0.3, 0]} rotation={[0, 0, -0.2]}>
          <planeGeometry args={[2.6, 0.28]} />
        </mesh>
        <mesh material={fx.beamCool.material} position={[1.75, 0.15, 0]} rotation={[0, 0, -0.04]}>
          <planeGeometry args={[2.6, 0.24]} />
        </mesh>
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
        <group ref={bead} visible={false}>
          <mesh>
            <sphereGeometry args={[1, 48, 24]} />
            <meshPhysicalMaterial
              color={PEACH}
              transmission={0}
              roughness={0.25}
              clearcoat={1}
              emissive={ORANGE}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

function Lights() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#f6f4f1"]} />
      <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[-5, 0, 2]} scale={[2, 6, 1]} />
      <Lightformer form="ring" intensity={2.2} color={MINT} position={[4, 1, 2]} scale={2.4} />
      <Lightformer form="circle" intensity={3} color={ORANGE} position={[0, -3, 1]} scale={3} />
      <Lightformer form="circle" intensity={1.4} color={PEACH} position={[-3, -2, -3]} scale={3} />
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
        gl.toneMapping = NoToneMapping;
      }}
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <Film onReady={onReady} />
      <Lights />
    </Canvas>
  );
}
