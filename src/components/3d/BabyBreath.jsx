import React, { useMemo } from 'react';
import * as THREE from 'three';

// Shared geometries and materials for baby's breath
let flowerHeadGeo = null;
let twigGeo = null;
let whiteFlowerMat = null;
let greenTwigMat = null;

function getSharedBabyBreathAssets() {
  if (!flowerHeadGeo) {
    // A tiny 5-petaled star or delicate cluster
    flowerHeadGeo = new THREE.DodecahedronGeometry(0.045, 0);
    twigGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.2, 5);
    whiteFlowerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.7,
      metalness: 0.05,
    });
    greenTwigMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#40916c'),
      roughness: 0.6,
      metalness: 0.05,
    });
  }
  return { flowerHeadGeo, twigGeo, whiteFlowerMat, greenTwigMat };
}

/**
 * A delicate sprig of Baby's breath (Gypsophila) with tiny white flowers
 */
export const BabyBreathSprig = React.memo(function BabyBreathSprig({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) {
  const assets = useMemo(() => getSharedBabyBreathAssets(), []);

  // Compute cluster of tiny flowers along small sub-branches
  const florets = useMemo(() => {
    const list = [];
    // 12-16 tiny blossom dots per sprig
    for (let i = 0; i < 14; i++) {
      const u = 0.3 + (i / 14) * 0.7; // Spread towards tip
      const angle = i * 2.4;
      const spread = 0.12 + u * 0.18;
      list.push({
        pos: [
          Math.cos(angle) * spread,
          u * 1.1,
          Math.sin(angle) * spread,
        ],
        s: 0.7 + (i % 3) * 0.25,
      });
    }
    return list;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Central thin stem */}
      <mesh
        geometry={assets.twigGeo}
        material={assets.greenTwigMat}
        position={[0, 0.5, 0]}
      />
      {/* Tiny flower heads */}
      {florets.map((f, i) => (
        <mesh
          key={i}
          geometry={assets.flowerHeadGeo}
          material={assets.whiteFlowerMat}
          position={f.pos}
          scale={[f.s, f.s, f.s]}
          castShadow
        />
      ))}
    </group>
  );
});
