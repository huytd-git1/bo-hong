import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createWrappingPaperGeometry, createRuffleGeometry } from './RoseGeometry';

// Ribbon loop geometry created via deformed torus/tube
function createRibbonLoopGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.35, 0.25, 0.15),
    new THREE.Vector3(0.55, 0.45, 0.05),
    new THREE.Vector3(0.4, 0.5, -0.05),
    new THREE.Vector3(0.15, 0.25, -0.05),
    new THREE.Vector3(0, 0, 0),
  ]);
  return new THREE.TubeGeometry(curve, 24, 0.07, 8, false);
}

// Ribbon tail geometry
function createRibbonTailGeometry(flip = false) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(flip ? 0.2 : -0.2, -0.6, 0.1),
    new THREE.Vector3(flip ? 0.35 : -0.35, -1.3, 0.2),
    new THREE.Vector3(flip ? 0.25 : -0.25, -2.1, 0.15),
  ]);
  return new THREE.TubeGeometry(curve, 28, 0.07, 8, false);
}

export const BouquetWrapper = React.memo(function BouquetWrapper({
  colorTheme = 'red',
}) {
  // Shared geometries
  const paperGeo = useMemo(() => createWrappingPaperGeometry(36, 16), []);
  const ruffleGeo = useMemo(() => createRuffleGeometry(40, 8), []);
  const ribbonLoopGeo = useMemo(() => createRibbonLoopGeometry(), []);
  const ribbonTailGeoLeft = useMemo(() => createRibbonTailGeometry(false), []);
  const ribbonTailGeoRight = useMemo(() => createRibbonTailGeometry(true), []);
  const ribbonBandGeo = useMemo(() => new THREE.CylinderGeometry(1.3, 1.25, 0.35, 32, 1, true), []);
  const ribbonKnotGeo = useMemo(() => new THREE.SphereGeometry(0.18, 14, 12), []);

  // Determine ribbon color
  const ribbonColorHex = useMemo(() => {
    switch (colorTheme) {
      case 'pink':
        return '#db2777'; // Romantic deep rose pink ribbon
      case 'white':
        return '#e0a96d'; // Warm luxurious golden champagne ribbon for white roses
      case 'red':
      default:
        return '#991b1b'; // Deep luxurious wine red ribbon for classic red bouquet
    }
  }, [colorTheme]);

  // Materials
  const materials = useMemo(() => {
    return {
      // Cream wrapping paper: soft warm ivory with natural paper texture
      paper: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#faf5ea'),
        roughness: 0.78,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      // Inner translucent sheer organza collar
      organza: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.72,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      // Silk/satin ribbon with subtle sheen
      ribbon: new THREE.MeshStandardMaterial({
        color: new THREE.Color(ribbonColorHex),
        roughness: 0.35,
        metalness: 0.15,
        side: THREE.DoubleSide,
      }),
    };
  }, [ribbonColorHex]);

  return (
    <group position={[0, -0.65, 0]}>
      {/* 1. Main outer pleated cream wrapping paper */}
      <mesh
        geometry={paperGeo}
        material={materials.paper}
        position={[0, -0.6, 0]}
        castShadow
        receiveShadow
      />

      {/* 2. Inner delicate organza lace / ruffled tissue collar */}
      <mesh
        geometry={ruffleGeo}
        material={materials.organza}
        position={[0, 0.15, 0]}
        scale={[0.96, 0.9, 0.96]}
      />

      {/* 3. Ribbon waist band */}
      <mesh
        geometry={ribbonBandGeo}
        material={materials.ribbon}
        position={[0, -1.25, 0]}
        scale={[1.02, 1, 1.02]}
        castShadow
      />

      {/* 4. Ribbon Bow & Hanging Tails on Front */}
      <group position={[0, -1.25, 1.34]}>
        {/* Central knot */}
        <mesh
          geometry={ribbonKnotGeo}
          material={materials.ribbon}
          scale={[1.1, 0.9, 0.8]}
          castShadow
        />

        {/* Left loop */}
        <mesh
          geometry={ribbonLoopGeo}
          material={materials.ribbon}
          position={[-0.05, 0, 0]}
          rotation={[0.1, -0.3, THREE.MathUtils.degToRad(125)]}
          scale={[1, 1, 1]}
          castShadow
        />

        {/* Right loop */}
        <mesh
          geometry={ribbonLoopGeo}
          material={materials.ribbon}
          position={[0.05, 0, 0]}
          rotation={[0.1, 0.3, THREE.MathUtils.degToRad(-125)]}
          scale={[-1, 1, 1]}
          castShadow
        />

        {/* Left hanging tail */}
        <mesh
          geometry={ribbonTailGeoLeft}
          material={materials.ribbon}
          position={[-0.08, -0.1, 0.05]}
          rotation={[0.1, 0, 0.05]}
          castShadow
        />

        {/* Right hanging tail */}
        <mesh
          geometry={ribbonTailGeoRight}
          material={materials.ribbon}
          position={[0.08, -0.1, 0.05]}
          rotation={[0.1, 0, -0.05]}
          castShadow
        />
      </group>
    </group>
  );
});
