"use client";

import { type ReactNode, useMemo } from "react";

import {
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  type MeshTransmissionMaterialProps,
  RoundedBox,
} from "@react-three/drei";
import { CatmullRomCurve3, ExtrudeGeometry, Shape, Vector3 } from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

import { MARK_ARC } from "@/lib/brand-mark";
import type { Motif } from "@/lib/film";

export type GlassProps = Omit<MeshTransmissionMaterialProps, "color">;

const SILVER = "#f7f3f1";
const EMBER = "#ffe2d4";
const ROSE = "#ffe6ef";
const PEACH = "#fff0e8";

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
      metalness={1}
      roughness={0.13}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={1.4}
      {...iridescent}
    />
  );
}

function HoloGlass({ glass, tint = "#ffffff" }: MotifProps & { tint?: string }) {
  return <MeshTransmissionMaterial {...glass} color={tint} {...iridescent} iridescenceIOR={1.4} />;
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

function arcCurve(radius: number, from: number, to: number) {
  const points: Vector3[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const angle = from + ((to - from) * i) / steps;
    points.push(new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  return new CatmullRomCurve3(points);
}

const markCurve = arcCurve(MARK_ARC.radius, MARK_ARC.from, MARK_ARC.to);

const markEnds = [MARK_ARC.from, MARK_ARC.to].map(
  (angle) => [Math.cos(angle) * MARK_ARC.radius, Math.sin(angle) * MARK_ARC.radius, 0] as const,
);

function MarkC({ glass, tint }: MotifProps & { tint: string }) {
  return (
    <>
      <mesh>
        <tubeGeometry args={[markCurve, 160, MARK_ARC.tube, 48, false]} />
        <HoloGlass glass={glass} tint={tint} />
      </mesh>
      {markEnds.map(([x, y, z]) => (
        <mesh key={`${x}:${y}`} position={[x, y, z]}>
          <sphereGeometry args={[MARK_ARC.tube, 48, 24]} />
          <HoloGlass glass={glass} tint={tint} />
        </mesh>
      ))}
    </>
  );
}

function Mark({ glass }: MotifProps) {
  const { x, y } = MARK_ARC.center;

  return (
    <group>
      <group position={[x, y, 0]} rotation={[0.18, 0.16, 0]}>
        <MarkC glass={glass} tint={PEACH} />
      </group>
      <group rotation={[0, 0, Math.PI]}>
        <group position={[x, y, 0]} rotation={[0.18, 0.16, 0]}>
          <MarkC glass={glass} tint={ROSE} />
        </group>
      </group>
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

function useMobius(radius: number, width: number, thickness: number) {
  return useMemo(
    () =>
      new ParametricGeometry(
        (u, v, target) => {
          const angle = u * Math.PI * 2;
          const around = v * Math.PI * 2;
          const twist = angle / 2;
          const a = Math.cos(around) * width;
          const b = Math.sin(around) * thickness;
          const radial = a * Math.cos(twist) - b * Math.sin(twist);
          const lift = a * Math.sin(twist) + b * Math.cos(twist);
          target.set(
            (radius + radial) * Math.cos(angle),
            (radius + radial) * Math.sin(angle),
            lift,
          );
        },
        320,
        48,
      ),
    [radius, width, thickness],
  );
}

function Bridge() {
  const geometry = useMobius(0.66, 0.24, 0.06);

  return (
    <mesh geometry={geometry} rotation={[-0.9, 0.2, 0.3]}>
      <Chrome tint={SILVER} roughness={0.12} />
    </mesh>
  );
}

function Software() {
  const panel = useMemo(() => roundedRect(1.0, 0.64, 0.14), []);
  const geometry = usePuffy(panel, 0.02, 0.07);

  return (
    <group rotation={[0.12, -0.5, 0]}>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} geometry={geometry} position={[i * 0.3, i * -0.24, i * 0.42]}>
          <Pearl tint={[SILVER, PEACH, ROSE][i + 1]} />
        </mesh>
      ))}
    </group>
  );
}

const ripples = [
  { radius: 0.3, tube: 0.075, z: 0.12 },
  { radius: 0.6, tube: 0.06, z: 0 },
  { radius: 0.9, tube: 0.045, z: -0.12 },
];

function Listen({ glass }: MotifProps) {
  return (
    <group rotation={[-1.05, 0, 0.25]}>
      {ripples.map(({ radius, tube, z }, i) => (
        <mesh key={radius} position={[0, 0, z]}>
          <torusGeometry args={[radius, tube, 48, 192]} />
          {i === 1 ? <Chrome tint={EMBER} roughness={0.1} /> : <HoloGlass glass={glass} />}
        </mesh>
      ))}
    </group>
  );
}

function Small() {
  return (
    <group>
      <mesh position={[-0.26, 0.04, 0]}>
        <sphereGeometry args={[0.42, 96, 48]} />
        <Chrome tint={SILVER} roughness={0.1} />
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
