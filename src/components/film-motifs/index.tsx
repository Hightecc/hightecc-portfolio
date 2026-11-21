"use client";

import { type ReactNode, useMemo } from "react";

import {
  MeshTransmissionMaterial,
  type MeshTransmissionMaterialProps,
  RoundedBox,
} from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from "three";

import type { Motif } from "@/lib/film";

export type GlassProps = Omit<MeshTransmissionMaterialProps, "color">;

const CLEAR = "#ffffff";
const WARM = "#ffd4c2";
const COOL = "#cdeee7";

type MotifProps = { glass: GlassProps };

function Glass({ glass, tint = CLEAR }: MotifProps & { tint?: string }) {
  return <MeshTransmissionMaterial {...glass} color={tint} />;
}

function Ring({ glass }: MotifProps) {
  return (
    <mesh>
      <torusGeometry args={[0.74, 0.26, 64, 192]} />
      <Glass glass={glass} />
    </mesh>
  );
}

function Lens({ glass }: MotifProps) {
  return (
    <group rotation={[-0.5, 0.45, 0]}>
      <mesh>
        <torusGeometry args={[0.8, 0.13, 48, 192]} />
        <Glass glass={glass} />
      </mesh>
      <mesh scale={[0.68, 0.68, 0.14]}>
        <sphereGeometry args={[1, 64, 32]} />
        <Glass glass={glass} tint={WARM} />
      </mesh>
    </group>
  );
}

function Flows({ glass }: MotifProps) {
  const ribbon = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-1.05, -0.35, 0.1),
        new Vector3(-0.68, 0.2, 0.25),
        new Vector3(0, -0.22, 0.3),
        new Vector3(0.68, 0.24, 0.25),
        new Vector3(1.05, -0.3, 0.1),
      ]),
    [],
  );

  return (
    <group>
      {[-0.68, 0, 0.68].map((x, i) => (
        <mesh key={x} position={[x, i === 1 ? -0.08 : 0.08, 0]}>
          <capsuleGeometry args={[0.2, 0.42, 16, 48]} />
          <Glass glass={glass} tint={i === 1 ? WARM : CLEAR} />
        </mesh>
      ))}
      <mesh>
        <tubeGeometry args={[ribbon, 160, 0.055, 24, false]} />
        <Glass glass={glass} tint={COOL} />
      </mesh>
    </group>
  );
}

function Bridge({ glass }: MotifProps) {
  return (
    <group position={[0, -0.18, 0]}>
      <mesh position={[-0.66, -0.12, 0]}>
        <sphereGeometry args={[0.36, 64, 32]} />
        <Glass glass={glass} tint={WARM} />
      </mesh>
      <mesh position={[0.66, -0.12, 0]}>
        <sphereGeometry args={[0.36, 64, 32]} />
        <Glass glass={glass} tint={COOL} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.66, 0.075, 32, 128, Math.PI]} />
        <Glass glass={glass} />
      </mesh>
    </group>
  );
}

function Software({ glass }: MotifProps) {
  return (
    <group rotation={[0.12, -0.5, 0]}>
      {[-1, 0, 1].map((i) => (
        <RoundedBox
          key={i}
          args={[1.15, 0.74, 0.06]}
          radius={0.03}
          smoothness={4}
          position={[i * 0.32, i * -0.24, i * 0.42]}
        >
          <Glass glass={glass} tint={i === 0 ? WARM : CLEAR} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Listen({ glass }: MotifProps) {
  return (
    <group>
      <mesh position={[-0.3, 0.06, 0]} scale={[0.56, 0.5, 0.5]}>
        <sphereGeometry args={[1, 64, 32]} />
        <Glass glass={glass} tint={WARM} />
      </mesh>
      <mesh position={[0.32, -0.06, 0.2]} scale={[0.5, 0.46, 0.46]}>
        <sphereGeometry args={[1, 64, 32]} />
        <Glass glass={glass} tint={COOL} />
      </mesh>
    </group>
  );
}

function Small({ glass }: MotifProps) {
  return (
    <group>
      <mesh position={[-0.28, 0.02, 0]}>
        <sphereGeometry args={[0.42, 64, 32]} />
        <Glass glass={glass} tint={WARM} />
      </mesh>
      <RoundedBox
        args={[0.34, 0.34, 0.34]}
        radius={0.06}
        smoothness={4}
        position={[0.4, -0.22, 0.2]}
        rotation={[0.4, 0.6, 0]}
      >
        <Glass glass={glass} />
      </RoundedBox>
    </group>
  );
}

function Grow({ glass }: MotifProps) {
  return (
    <group rotation={[0.25, 0.5, 0]}>
      {[0.32, 0.56, 0.8, 1.04].map((height, i) => (
        <RoundedBox
          key={height}
          args={[0.36, height, 0.36]}
          radius={0.06}
          smoothness={4}
          position={[-0.6 + i * 0.4, -0.55 + height / 2, 0]}
        >
          <Glass glass={glass} tint={i === 3 ? WARM : CLEAR} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Prism({ glass }: MotifProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0.12]}>
      <cylinderGeometry args={[0.66, 0.66, 1.1, 3, 1]} />
      <Glass glass={glass} tint={WARM} />
    </mesh>
  );
}

export const motifNodes: Record<Motif, (props: MotifProps) => ReactNode> = {
  ring: Ring,
  lens: Lens,
  flows: Flows,
  bridge: Bridge,
  software: Software,
  listen: Listen,
  small: Small,
  grow: Grow,
  prism: Prism,
};
