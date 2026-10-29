import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createPetalGeometry, createSepalGeometry } from './RoseGeometry';

// Pre-create shared geometries to save memory and maximize render performance
let sharedInnerPetalGeo = null;
let sharedMidPetalGeo = null;
let sharedOuterPetalGeo = null;
let sharedSepalGeo = null;
let sharedReceptacleGeo = null;
let sharedStemGeo = null;

function getSharedGeometries() {
  if (!sharedInnerPetalGeo) {
    sharedInnerPetalGeo = createPetalGeometry('inner', 14, 14);
    sharedMidPetalGeo = createPetalGeometry('mid', 14, 14);
    sharedOuterPetalGeo = createPetalGeometry('outer', 14, 14);
    sharedSepalGeo = createSepalGeometry(10, 6);
    sharedReceptacleGeo = new THREE.SphereGeometry(0.32, 12, 10);
    sharedStemGeo = new THREE.CylinderGeometry(0.045, 0.04, 2.5, 8);
  }
  return {
    innerPetal: sharedInnerPetalGeo,
    midPetal: sharedMidPetalGeo,
    outerPetal: sharedOuterPetalGeo,
    sepal: sharedSepalGeo,
    receptacle: sharedReceptacleGeo,
    stem: sharedStemGeo,
  };
}

/**
 * Color palettes tailored for velvety natural roses:
 * Each color theme provides core color, mid color, and outer rim color for rich depth.
 */
export const COLOR_PALETTES = {
  red: {
    name: 'Đỏ Ruby',
    core: '#7f091c', // Deep velvet wine red center
    mid: '#b91c1c',  // Rich classic rose red
    outer: '#dc2626', // Lighter red with slight scarlet glow
    accent: '#ef4444',
  },
  pink: {
    name: 'Hồng Phấn',
    core: '#be185d', // Soft magenta deep core
    mid: '#ec4899',  // Pastel romantic pink
    outer: '#f472b6', // Soft blush pink outer
    accent: '#fbcfe8',
  },
  white: {
    name: 'Trắng Tinh Khôi',
    core: '#fef08a', // Subtle warm champagne / cream bud center
    mid: '#fefce8',  // Soft ivory white
    outer: '#ffffff', // Crisp pure white outer petals
    accent: '#f1f5f9',
  },
};

export const RoseFlower = React.memo(function RoseFlower({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  bloom = 1.0, // 0.8 (tight bud) to 1.2 (full lush bloom)
  colorTheme = 'red',
  stemLength = 2.4,
}) {
  const geos = useMemo(() => getSharedGeometries(), []);

  // Compute petal layout parameters
  const petalData = useMemo(() => {
    const petals = [];
    const GOLDEN_ANGLE = 2.39996; // ~137.5 degrees

    // 1. Core tight bud: 7 inner petals
    const coreCount = 7;
    for (let i = 0; i < coreCount; i++) {
      const angle = i * GOLDEN_ANGLE;
      const radius = 0.05 + i * 0.015;
      const tilt = THREE.MathUtils.degToRad(8 + i * 4); // Almost upright
      const pScale = 0.65 + i * 0.04;
      petals.push({
        geo: geos.innerPetal,
        pos: [Math.cos(angle) * radius, 0.15 + i * 0.02, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI * 0.5, 0],
        scale: [pScale * 0.85, pScale, pScale * 0.85],
        layer: 'core',
      });
    }

    // 2. Mid spiral: 10 mid petals unfolding
    const midCount = 10;
    for (let i = 0; i < midCount; i++) {
      const angle = (coreCount + i) * GOLDEN_ANGLE;
      const radius = 0.14 + i * 0.018 * bloom;
      const tilt = THREE.MathUtils.degToRad(26 + i * 3.5 * bloom);
      const pScale = 0.88 + i * 0.03;
      petals.push({
        geo: geos.midPetal,
        pos: [Math.cos(angle) * radius, 0.12 - i * 0.01, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI * 0.5, 0],
        scale: [pScale * 0.95, pScale, pScale],
        layer: 'mid',
      });
    }

    // 3. Outer lush layer: 12 outer petals with reflexed curve
    const outerCount = 12;
    for (let i = 0; i < outerCount; i++) {
      const angle = (coreCount + midCount + i) * GOLDEN_ANGLE;
      const radius = 0.28 + i * 0.022 * bloom;
      const tilt = THREE.MathUtils.degToRad(55 + i * 2.8 * bloom);
      const pScale = 1.05 + i * 0.035;
      petals.push({
        geo: geos.outerPetal,
        pos: [Math.cos(angle) * radius, 0.05 - i * 0.015, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI * 0.5, 0],
        scale: [pScale * 1.05, pScale, pScale],
        layer: 'outer',
      });
    }

    return petals;
  }, [geos, bloom]);

  // Materials based on selected theme
  const palette = COLOR_PALETTES[colorTheme] || COLOR_PALETTES.red;

  const materials = useMemo(() => {
    return {
      core: new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.core),
        roughness: 0.62,
        metalness: 0.03,
        side: THREE.DoubleSide,
      }),
      mid: new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.mid),
        roughness: 0.65,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      outer: new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.outer),
        roughness: 0.70,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      calyx: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2d6a4f'),
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
      stem: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1b4332'),
        roughness: 0.5,
        metalness: 0.05,
      }),
    };
  }, [palette]);

  // 5 sepals radiating beneath the flower
  const sepals = useMemo(() => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + 0.3;
      list.push({
        pos: [Math.cos(angle) * 0.2, -0.05, Math.sin(angle) * 0.2],
        rot: [THREE.MathUtils.degToRad(75), -angle + Math.PI * 0.5, 0],
      });
    }
    return list;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Petals */}
      {petalData.map((p, idx) => (
        <mesh
          key={idx}
          geometry={p.geo}
          material={materials[p.layer]}
          position={p.pos}
          rotation={p.rot}
          scale={p.scale}
          castShadow
          receiveShadow
        />
      ))}

      {/* Receptacle (swollen green base beneath petals) */}
      <mesh
        geometry={geos.receptacle}
        material={materials.calyx}
        position={[0, -0.18, 0]}
        scale={[0.7, 0.9, 0.7]}
        castShadow
      />

      {/* 5 Calyx sepals */}
      {sepals.map((s, idx) => (
        <mesh
          key={`sepal-${idx}`}
          geometry={geos.sepal}
          material={materials.calyx}
          position={s.pos}
          rotation={s.rot}
          scale={[0.9, 0.9, 0.9]}
          castShadow
        />
      ))}

      {/* Stem segment */}
      <mesh
        geometry={geos.stem}
        material={materials.stem}
        position={[0, -stemLength * 0.5 - 0.2, 0]}
        scale={[1, stemLength / 2.5, 1]}
        castShadow
      />
    </group>
  );
});
