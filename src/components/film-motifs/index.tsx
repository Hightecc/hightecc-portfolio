"use client";

import { type ReactNode, useMemo } from "react";

import {
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  type MeshTransmissionMaterialProps,
  RoundedBox,
} from "@react-three/drei";
import { CatmullRomCurve3, ExtrudeGeometry, Shape, Vector3 } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

import { MARK_CENTER, MARK_OFFSET, MARK_PATH, MARK_SCALE } from "@/lib/brand-mark";
import type { Motif } from "@/lib/film";

export type GlassProps = Omit<MeshTransmissionMaterialProps, "color">;

const SILVER = "#f4eeea";
const EMBER = "#ffd2bd";
const ROSE = "#ffd9e6";
const PEACH = "#ffe6d8";
const CORAL = "#ffc9b6";

type MotifProps = { glass: GlassProps };

const iridescent = {
  iridescence: 1,
  iridescenceIOR: 1.6,
  iridescenceThicknessMinimum: 120,
  iridescenceThicknessMaximum: 480,
};

function Chrome({ tint = SILVER, roughness = 0.18 }: { tint?: string; roughness?: number }) {
  return (
    <meshPhysicalMaterial
      color={tint}
      metalness={1}
      roughness={roughness}
      clearcoat={1}
      clearcoatRoughness={0.08}
      envMapIntensity={1.5}
      {...iridescent}
    />
  );
}

function Liquid({ tint = SILVER, distort = 0.32 }: { tint?: string; distort?: number }) {
  return (
    <MeshDistortMaterial
      color={tint}
      metalness={1}
      roughness={0.2}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={1.3}
      distort={distort}
      speed={1.4}
      {...iridescent}
    />
  );
}

function Pearl({ tint = EMBER }: { tint?: string }) {
  return (
    <meshPhysicalMaterial
      color={tint}
      metalness={0.85}
      roughness={0.22}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={1.3}
      sheen={1}
      sheenColor="#ffb38a"
      {...iridescent}
    />
  );
}

function HoloGlass({ glass }: MotifProps) {
  return (
    <MeshTransmissionMaterial {...glass} color="#ffffff" {...iridescent} iridescenceIOR={1.4} />
  );
}

function usePuffy(shape: Shape, depth = 0.12, bevel = 0.16) {
  return useMemo(() => {
    const geometry = new ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel * 0.85,
      bevelSegments: 18,
      curveSegments: 48,
    });
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }, [shape, depth, bevel]);
}

function roundedRect(width: number, height: number, radius: number) {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function linkCurve(length: number, radius: number) {
  const points: Vector3[] = [];
  const half = length / 2;
  const steps = 18;
  for (let i = 0; i < steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * Math.PI;
    points.push(new Vector3(half + Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  for (let i = 0; i < steps; i++) {
    const a = Math.PI / 2 + (i / steps) * Math.PI;
    points.push(new Vector3(-half + Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return new CatmullRomCurve3(points, true);
}

function useMarkGeometry() {
  return useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${MARK_PATH}"/></svg>`;
    const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => path.toShapes());
    const geometry = new ExtrudeGeometry(shapes, {
      depth: 60,
      bevelEnabled: true,
      bevelThickness: 70,
      bevelSize: 46,
      bevelSegments: 16,
      curveSegments: 64,
    });
    geometry.translate(0, 0, -30);
    geometry.scale(MARK_SCALE, MARK_SCALE, MARK_SCALE);
    geometry.translate(MARK_OFFSET.x - MARK_CENTER.x, MARK_OFFSET.y - MARK_CENTER.y, 0);
    const unit = 1 / 760;
    geometry.scale(unit, -unit, -unit);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

function Mark() {
  const geometry = useMarkGeometry();

  return (
    <group>
      <mesh geometry={geometry} rotation={[0, 0.22, 0]}>
        <Chrome tint={SILVER} roughness={0.14} />
      </mesh>
      <mesh geometry={geometry} rotation={[0, -0.22, Math.PI]}>
        <Chrome tint={PEACH} roughness={0.16} />
      </mesh>
    </group>
  );
}

function Lens({ glass }: MotifProps) {
  return (
    <group rotation={[-0.45, 0.5, 0]}>
      <mesh>
        <torusGeometry args={[0.78, 0.2, 64, 192]} />
        <HoloGlass glass={glass} />
      </mesh>
      <mesh scale={[0.6, 0.6, 0.2]}>
        <sphereGeometry args={[1, 96, 48]} />
        <Liquid tint={ROSE} distort={0.22} />
      </mesh>
    </group>
  );
}

function Flows({ glass }: MotifProps) {
  const link = useMemo(() => linkCurve(0.46, 0.3), []);

  return (
    <group rotation={[0.3, -0.35, 0.5]}>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * 0.62, 0, 0]} rotation={[i === 0 ? Math.PI / 2 : 0, 0, 0]}>
          <tubeGeometry args={[link, 220, 0.085, 32, true]} />
          <HoloGlass glass={glass} />
        </mesh>
      ))}
    </group>
  );
}

function Bridge() {
  return (
    <group position={[0, -0.18, 0]}>
      <mesh position={[-0.66, -0.12, 0]}>
        <sphereGeometry args={[0.36, 96, 48]} />
        <Liquid tint={ROSE} distort={0.3} />
      </mesh>
      <mesh position={[0.66, -0.12, 0]}>
        <sphereGeometry args={[0.36, 96, 48]} />
        <Liquid tint={CORAL} distort={0.3} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.66, 0.11, 48, 160, Math.PI]} />
        <Chrome />
      </mesh>
    </group>
  );
}

function Software() {
  const panel = useMemo(() => roundedRect(1.0, 0.64, 0.14), []);
  const geometry = usePuffy(panel, 0.02, 0.07);

  return (
    <group rotation={[0.12, -0.5, 0]}>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} geometry={geometry} position={[i * 0.3, i * -0.24, i * 0.42]}>
          <Pearl tint={[EMBER, ROSE, CORAL][i + 1]} />
        </mesh>
      ))}
    </group>
  );
}

function Listen() {
  return (
    <group>
      <mesh position={[-0.3, 0.06, 0]} scale={0.5}>
        <icosahedronGeometry args={[1, 24]} />
        <Liquid tint={ROSE} distort={0.42} />
      </mesh>
      <mesh position={[0.32, -0.06, 0.2]} scale={0.46}>
        <icosahedronGeometry args={[1, 24]} />
        <Liquid tint={CORAL} distort={0.42} />
      </mesh>
    </group>
  );
}

function Small() {
  return (
    <group>
      <mesh position={[-0.26, 0.04, 0]}>
        <sphereGeometry args={[0.42, 96, 48]} />
        <Chrome tint={EMBER} roughness={0.08} />
      </mesh>
      <RoundedBox
        args={[0.36, 0.36, 0.36]}
        radius={0.13}
        smoothness={8}
        position={[0.42, -0.22, 0.22]}
        rotation={[0.4, 0.6, 0]}
      >
        <Pearl tint={PEACH} />
      </RoundedBox>
    </group>
  );
}

const arrowStrokes: { length: number; position: [number, number, number]; angle: number }[] = [
  { length: 1.05, position: [0, -0.12, 0], angle: 0 },
  { length: 0.42, position: [-0.16, 0.38, 0.02], angle: -0.85 },
  { length: 0.42, position: [0.16, 0.38, 0.02], angle: 0.85 },
];

function Grow() {
  return (
    <group rotation={[0.25, -0.4, -0.75]}>
      {arrowStrokes.map(({ length, position, angle }) => (
        <mesh key={angle} position={position} rotation={[0, 0, angle]}>
          <capsuleGeometry args={[0.15, length, 24, 64]} />
          <Pearl tint={ROSE} />
        </mesh>
      ))}
    </group>
  );
}

function triangle(radius: number) {
  const shape = new Shape();
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI / 2 + (i * Math.PI * 2) / 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function Prism({ glass }: MotifProps) {
  const shape = useMemo(() => triangle(0.66), []);
  const geometry = usePuffy(shape, 0.7, 0.05);

  return (
    <mesh geometry={geometry}>
      <HoloGlass glass={glass} />
    </mesh>
  );
}

export function Droplet() {
  return (
    <mesh>
      <icosahedronGeometry args={[1, 16]} />
      <Liquid tint={SILVER} distort={0.35} />
    </mesh>
  );
}

export const motifNodes: Record<Motif, (props: MotifProps) => ReactNode> = {
  mark: Mark,
  lens: Lens,
  flows: Flows,
  bridge: Bridge,
  software: Software,
  listen: Listen,
  small: Small,
  grow: Grow,
  prism: Prism,
};
