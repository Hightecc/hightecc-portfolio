"use client";

import { type RefObject, useMemo, useRef } from "react";

import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, type Group, MathUtils, NeutralToneMapping, ShaderMaterial } from "three";

const ORANGE = "#ff6b35";
const PEACH = "#ffb48f";
const MINT = "#1f8a84";
const MIST = "#a9ddd2";
const WHITE = new Color("#ffffff");

const glowVertex = /* glsl */ `
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
    float d = distance(vUv, vec2(0.5)) * 2.0;
    float falloff = clamp(1.0 - d, 0.0, 1.0);
    vec3 color = mix(uEdge, uColor, smoothstep(0.0, 0.9, falloff));
    gl_FragColor = vec4(color, pow(falloff, 1.6) * uIntensity);
  }
`;

function useGlow(color: string, edge: string, initial: number) {
  return useMemo(() => {
    const intensity = { value: initial };
    const material = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color(color) },
        uEdge: { value: new Color(edge) },
        uIntensity: intensity,
      },
      vertexShader: glowVertex,
      fragmentShader: glowFragment,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    return { material, intensity };
  }, [color, edge, initial]);
}

type SceneProps = {
  progress: RefObject<number>;
  onReady: () => void;
};

function Ring({ progress, onReady }: SceneProps) {
  const group = useRef<Group>(null);
  const eased = useRef(0);
  const frames = useRef(0);
  const warmGlow = useGlow(ORANGE, PEACH, 0.7);
  const coolGlow = useGlow(MIST, "#ffffff", 0.6);

  useFrame((state, delta) => {
    eased.current = MathUtils.damp(eased.current, progress.current, 3.5, delta);
    const p = eased.current;
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    g.position.y = MathUtils.lerp(-0.95, 0.15, p) + Math.sin(t * 0.6) * 0.03;
    g.rotation.x = MathUtils.lerp(0.12, -1.0, p) + state.pointer.y * 0.08;
    g.rotation.y = MathUtils.lerp(-0.08, 0.55, p) + state.pointer.x * 0.12;
    g.rotation.z = t * 0.04;
    state.camera.position.z = MathUtils.lerp(6.4, 4.8, p);

    warmGlow.intensity.value = MathUtils.lerp(0.7, 0.95, p);

    if (frames.current < 3 && ++frames.current === 3) onReady();
  });

  return (
    <>
      <mesh position={[0, -0.7, -1.6]} material={warmGlow.material}>
        <planeGeometry args={[5.2, 5.2]} />
      </mesh>
      <mesh position={[1.6, 0.4, -2.2]} material={coolGlow.material}>
        <planeGeometry args={[4, 4]} />
      </mesh>
      <group ref={group}>
        <mesh>
          <torusGeometry args={[1.3, 0.42, 96, 256]} />
          <MeshTransmissionMaterial
            samples={6}
            resolution={512}
            thickness={0.9}
            roughness={0.32}
            ior={1.32}
            chromaticAberration={0.12}
            anisotropicBlur={0.25}
            distortion={0.22}
            distortionScale={0.4}
            temporalDistortion={0.04}
            clearcoat={1}
            clearcoatRoughness={0.15}
            background={WHITE}
          />
        </mesh>
      </group>
    </>
  );
}

function Lights() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#f6f4f1"]} />
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#ffffff"
        position={[0, 4, 3]}
        scale={[8, 2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.2}
        color="#ffffff"
        position={[-5, 0, 2]}
        scale={[2, 6, 1]}
      />
      <Lightformer form="ring" intensity={2.2} color={MINT} position={[4, 1, 2]} scale={2.4} />
      <Lightformer form="circle" intensity={3} color={ORANGE} position={[0, -3, 1]} scale={3} />
      <Lightformer form="circle" intensity={1.4} color={PEACH} position={[-3, -2, -3]} scale={3} />
    </Environment>
  );
}

type GlassRingProps = SceneProps & {
  active: boolean;
};

export default function GlassRing({ progress, onReady, active }: GlassRingProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.4], fov: 32 }}
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: NeutralToneMapping }}
      aria-hidden
    >
      <color attach="background" args={["#ffffff"]} />
      <Ring progress={progress} onReady={onReady} />
      <Lights />
    </Canvas>
  );
}
