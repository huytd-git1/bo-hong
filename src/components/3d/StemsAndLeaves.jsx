import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createLeafGeometry } from './RoseGeometry';

let sharedLeafGeo = null;
let sharedLeafStemGeo = null;
let leafMaterial = null;
let darkStemMaterial = null;

function getSharedFoliageAssets() {
  if (!sharedLeafGeo) {
    sharedLeafGeo = createLeafGeometry(14, 10);
    sharedLeafStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6);
    leafMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2d6a4f'), // Lush forest green rose leaf
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
    darkStemMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1b4332'),
      roughness: 0.5,
      metalness: 0.05,
    });
  }
  return { sharedLeafGeo, sharedLeafStemGeo, leafMaterial, darkStemMaterial };
}

/**
 * A compound rose leaf branch (3-leaflet rose leaf: terminal leaf + 2 opposite side leaflets)
 */
export const LeafBranch = React.memo(function LeafBranch({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) {
  const assets = useMemo(() => getSharedFoliageAssets(), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Central petiole stem */}
      <mesh
        geometry={assets.sharedLeafStemGeo}
        material={assets.darkStemMaterial}
        position={[0, 0.25, 0]}
      />

      {/* Terminal center leaf */}
      <mesh
        geometry={assets.sharedLeafGeo}
        material={assets.leafMaterial}
        position={[0, 0.5, 0]}
        rotation={[THREE.MathUtils.degToRad(20), 0, 0]}
        scale={[0.7, 0.7, 0.7]}
        castShadow
      />

      {/* Left side leaflet */}
      <mesh
        geometry={assets.sharedLeafGeo}
        material={assets.leafMaterial}
        position={[-0.14, 0.28, 0]}
        rotation={[THREE.MathUtils.degToRad(15), 0, THREE.MathUtils.degToRad(42)]}
        scale={[0.55, 0.55, 0.55]}
        castShadow
      />

      {/* Right side leaflet */}
      <mesh
        geometry={assets.sharedLeafGeo}
        material={assets.leafMaterial}
        position={[0.14, 0.28, 0]}
        rotation={[THREE.MathUtils.degToRad(15), 0, THREE.MathUtils.degToRad(-42)]}
        scale={[0.55, 0.55, 0.55]}
        castShadow
      />
    </group>
  );
});

/**
 * Base stems bundle visible beneath the wrapping
 */
export const StemBundle = React.memo(function StemBundle({ count = 12 }) {
  const assets = useMemo(() => getSharedFoliageAssets(), []);

  const stems = useMemo(() => {
    const list = [];
    const stemCyl = new THREE.CylinderGeometry(0.045, 0.04, 3.2, 7);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.25 + (i % 2) * 0.12;
      list.push({
        pos: [Math.cos(angle) * radius, -2.4, Math.sin(angle) * radius],
        rot: [
          (Math.sin(angle) * 0.08),
          0,
          (-Math.cos(angle) * 0.08),
        ],
        geo: stemCyl,
      });
    }
    return list;
  }, [count]);

  return (
    <group>
      {stems.map((s, i) => (
        <mesh
          key={i}
          geometry={s.geo}
          material={assets.darkStemMaterial}
          position={s.pos}
          rotation={s.rot}
          castShadow
        />
      ))}
    </group>
  );
});
