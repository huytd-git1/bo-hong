import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createPetalGeometry, createLeafGeometry } from './RoseGeometry';
import { COLOR_PALETTES } from './RoseFlower';

export const FallingPetals = React.memo(function FallingPetals({
  count = 75,
  colorTheme = 'pink',
  reducedMotion = false,
}) {
  const petalsMeshRef = useRef();
  const leavesMeshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Geometries
  const petalGeo = useMemo(() => createPetalGeometry('outer', 8, 8), []);
  const leafGeo = useMemo(() => createLeafGeometry(10, 6), []);

  const palette = COLOR_PALETTES[colorTheme] || COLOR_PALETTES.pink;

  // Materials
  const petalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.outer),
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });
  }, [palette]);

  const leafMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#388e3c'), // Lush green rose leaf
      roughness: 0.55,
      metalness: 0.08,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  const petalCount = Math.floor(count * 0.65); // ~48 petals
  const leafCount = Math.floor(count * 0.35);  // ~27 leaves

  // Particles initial state
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: (Math.random() - 0.5) * 18,
        y: Math.random() * 16 - 6,
        z: -2.0 - Math.random() * 8, // Distributed around bouquet
        vx: (Math.random() - 0.5) * 0.012,
        vy: 0.009 + Math.random() * 0.016, // Gentle fluttering fall
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.02,
        vRotY: (Math.random() - 0.5) * 0.025,
        vRotZ: (Math.random() - 0.5) * 0.02,
        scale: 0.4 + Math.random() * 0.3,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.9 + Math.random() * 1.0,
      });
    }
    return list;
  }, [count]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const dt = delta * 60;

    // Update Petals
    if (petalsMeshRef.current) {
      for (let i = 0; i < petalCount; i++) {
        const p = particles[i];
        if (!reducedMotion) {
          p.y -= p.vy * dt;
          p.x += Math.sin(time * p.swaySpeed + p.swayPhase) * 0.008 + p.vx;
          p.rotX += p.vRotX;
          p.rotY += p.vRotY;
          p.rotZ += p.vRotZ;

          if (p.y < -7) {
            p.y = 9 + Math.random() * 2;
            p.x = (Math.random() - 0.5) * 18;
          }
        }

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();

        petalsMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      petalsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Leaves
    if (leavesMeshRef.current) {
      for (let j = 0; j < leafCount; j++) {
        const p = particles[petalCount + j];
        if (!reducedMotion) {
          p.y -= p.vy * dt;
          p.x += Math.cos(time * p.swaySpeed + p.swayPhase) * 0.009 + p.vx;
          p.rotX += p.vRotX;
          p.rotY += p.vRotY;
          p.rotZ += p.vRotZ;

          if (p.y < -7) {
            p.y = 9 + Math.random() * 2;
            p.x = (Math.random() - 0.5) * 18;
          }
        }

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
        dummy.scale.set(p.scale * 0.85, p.scale * 0.85, p.scale * 0.85);
        dummy.updateMatrix();

        leavesMeshRef.current.setMatrixAt(j, dummy.matrix);
      }
      leavesMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Falling pink rose petals */}
      <instancedMesh
        ref={petalsMeshRef}
        args={[petalGeo, petalMaterial, petalCount]}
        castShadow={false}
        receiveShadow={false}
      />
      {/* Falling green rose leaves */}
      <instancedMesh
        ref={leavesMeshRef}
        args={[leafGeo, leafMaterial, leafCount]}
        castShadow={false}
        receiveShadow={false}
      />
    </group>
  );
});
