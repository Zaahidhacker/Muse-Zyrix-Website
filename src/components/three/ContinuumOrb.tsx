"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { scrollState } from "@/lib/scroll-state";

const BLUE = "#82BODB";
const BLUE_LIGHT = "#A9D1E4";
const YELLOW_GLINT = "#F7EB4F";
/**
 * Render albedo for the torus body. The brand blue #82BODB is too pale
 * and desaturated to survive ACES tone mapping + bright lighting as a
 * PBR albedo — through every metalness/roughness/light iteration it
 * washed to grey-white (the gold orb survived only because gold is
 * extremely saturated). A deeper, saturated steel blue renders on
 * screen close to dusty blue #82BODB after lighting and tone mapping;
 * the pale brand blue is kept for the dust, the orbit ring and all
 * 2D UI, where it renders exactly.
 */
const TORUS_ALBEDO = "#2f7fb8";

type Vec3 = [number, number, number];

type Waypoint = {
  p: number;
  pos: Vec3;
  scale: number;
  rotZ: number;
};

/** Scroll travel for the orb, keyed to page progress (0 = top). */
const WAYPOINTS: Waypoint[] = [
  { p: 0, pos: [0.9, 0, 0], scale: 1.15, rotZ: 0 },
  { p: 0.12, pos: [-1.4, 0.2, 0], scale: 0.55, rotZ: 0 },
  { p: 0.22, pos: [0, 0, 0], scale: 0.9, rotZ: 0.6 },
  { p: 0.34, pos: [1.5, -0.2, 0], scale: 0.6, rotZ: 0 },
  { p: 0.68, pos: [-1.6, 0.4, -0.5], scale: 0.5, rotZ: 0 },
  { p: 0.95, pos: [0, 0, 0], scale: 0.8, rotZ: 0 },
];

const HERO_WAYPOINT = WAYPOINTS[0];

/** Deterministic PRNG (mulberry32) so the dust field is stable per render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function probeWebgl(): boolean {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

function waypointFor(progress: number): {
  pos: THREE.Vector3;
  scale: number;
  rotZ: number;
} {
  const p = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < WAYPOINTS.length - 2 && p > WAYPOINTS[i + 1].p) i += 1;
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const span = b.p - a.p || 1;
  const t = Math.min(1, Math.max(0, (p - a.p) / span));
  return {
    pos: new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), t),
    scale: a.scale + (b.scale - a.scale) * t,
    rotZ: a.rotZ + (b.rotZ - a.rotZ) * t,
  };
}

/** Under frameloop="demand" (reduced motion), force one static frame. */
function InvalidateOnce() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
  return null;
}

function OrbScene({ reducedMotion }: { reducedMotion: boolean }) {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smoothPointer = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const current = useRef({
    pos: new THREE.Vector3(...HERO_WAYPOINT.pos),
    scale: HERO_WAYPOINT.scale,
    rotZ: HERO_WAYPOINT.rotZ,
  });

  // Sparse field of small blue dust points around the torus.
  const dustPositions = useMemo(() => {
    const count = 200;
    const rand = mulberry32(20261120);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 2.4 + rand() * 1.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  useFrame((_, delta) => {
    // rAF already pauses in a hidden tab; guard anyway so no work runs.
    if (document.hidden) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const dt = Math.min(delta, 0.05);

    if (reducedMotion) {
      // One static frame at the hero pose: no spin, no pointer, no travel.
      outer.position.set(...HERO_WAYPOINT.pos);
      outer.scale.setScalar(HERO_WAYPOINT.scale);
      outer.rotation.z = HERO_WAYPOINT.rotZ;
      inner.rotation.set(0, 0, 0);
      return;
    }

    // Pointer tilt, damped (transform only).
    const damp = THREE.MathUtils.damp;
    smoothPointer.current.x = damp(
      smoothPointer.current.x,
      pointer.current.x,
      4,
      dt,
    );
    smoothPointer.current.y = damp(
      smoothPointer.current.y,
      pointer.current.y,
      4,
      dt,
    );
    spin.current += dt * 0.15;
    inner.rotation.y = spin.current + smoothPointer.current.x * 0.45;
    inner.rotation.x = smoothPointer.current.y * -0.3;

    // Scroll travel: damp the outer group toward the interpolated waypoint.
    const target = waypointFor(scrollState.progress);
    const cur = current.current;
    cur.pos.x = damp(cur.pos.x, target.pos.x, 3.5, dt);
    cur.pos.y = damp(cur.pos.y, target.pos.y, 3.5, dt);
    cur.pos.z = damp(cur.pos.z, target.pos.z, 3.5, dt);
    cur.scale = damp(cur.scale, target.scale, 3.5, dt);
    cur.rotZ = damp(cur.rotZ, target.rotZ, 3.5, dt);
    outer.position.copy(cur.pos);
    outer.scale.setScalar(cur.scale);
    outer.rotation.z = cur.rotZ;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <group
        ref={outerRef}
        position={HERO_WAYPOINT.pos}
        scale={HERO_WAYPOINT.scale}
      >
        <group ref={innerRef}>
          <mesh>
            <torusGeometry args={[1.05, 0.38, 64, 128]} />
            {/* MeshDistortMaterial restored: the grey wash was the pale
                #82BODB albedo under ACES + bright lights, not the
                wrapper — the saturated TORUS_ALBEDO renders blue with
                the distort wobble intact (verified). Explicit
                directional lights, no env map (see below). */}
            <MeshDistortMaterial
              color={TORUS_ALBEDO}
              metalness={0.35}
              roughness={0.35}
              distort={0.28}
              speed={1.2}
            />
          </mesh>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[dustPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.02}
              color={BLUE}
              sizeAttenuation
              transparent
              opacity={0.75}
              depthWrite={false}
            />
          </points>
        </group>
        {/* Thin light-blue orbit ring, tilted. */}
        <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
          <torusGeometry args={[1.9, 0.012, 8, 128]} />
          <meshBasicMaterial color={BLUE_LIGHT} />
        </mesh>
      </group>
      {/* Explicit lights, no Environment map. The drei Environment
          (Lightformers baked into an env map) made the torus render
          grey-white in the verification renderer regardless of
          metalness/roughness/emissive — the env reflections washed
          the dusty-blue albedo out. Directional lights render the
          diffuse colour faithfully: a white key, a blue fill, and a
          yellow accent (the single glint touch, kept as a light). */}
      <directionalLight position={[2, 4, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, 1, 2]} intensity={0.9} color="#82bodb" />
      <directionalLight position={[0, 5, -3]} intensity={0.8} color={YELLOW_GLINT} />
      {reducedMotion ? <InvalidateOnce /> : null}
    </>
  );
}

/**
 * The signature dusty-blue liquid-metal torus, rendered in real 3D and fixed to
 * the viewport so it travels the whole page. Lazy-loaded via next/dynamic
 * (ssr: false) from Hero; if WebGL is unavailable it renders the CSS
 * `.orb-fallback` poster inside the hero stage instead.
 */
export default function ContinuumOrb() {
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        scrollState.reducedMotion),
  );
  // WebGL probe runs once, as the lazy state initializer — the component
  // is only ever rendered on the client (dynamic ssr: false from Hero).
  const [glOk, setGlOk] = useState<boolean>(probeWebgl);

  // WebGL unavailable: the CSS poster inside .orb-stage shows instead.
  if (!glOk) {
    return (
      <div className="orb-fallback" aria-hidden="true">
        <div className="torus" />
      </div>
    );
  }

  // One continuous object travelling the whole page: the canvas is fixed
  // to the viewport behind all page content (z-index -1: above the body's
  // background, below every section's text, so it can never cover a focused
  // control) and the scroll waypoints move the orb through it. Sections
  // paint above it in DOM order; the cream pricing band acts as a curtain
  // it dives under.
  return (
    <div
      aria-hidden="true"
      className="orb-canvas"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 38, position: [0, 0, 5.2] }}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            setGlOk(false);
          });
        }}
      >
        <OrbScene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
