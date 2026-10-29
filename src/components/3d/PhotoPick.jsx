import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Create a single Polaroid photo pick stuck into the bouquet
export function PhotoPick({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  visible = true,
  delay = 0,
  onClickPhoto,
}) {
  const groupRef = useRef();
  const currentScale = useRef(0);
  const targetScale = visible ? 1 : 0;
  const [hovered, setHovered] = useState(false);

  // Load the photo texture safely
  const texture = useLoader(THREE.TextureLoader, url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  // Polaroid frame materials
  const materials = useMemo(() => {
    return {
      card: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fffdfa'),
        roughness: 0.7,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      photo: new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
      stick: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b5835a'), // Natural bamboo / wood stick
        roughness: 0.8,
        metalness: 0.02,
      }),
      clip: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fb7185'), // Rose-gold clip
        roughness: 0.3,
        metalness: 0.6,
      }),
    };
  }, [texture]);

  // Geometries - longer stick and higher card mounting
  const cardGeo = useMemo(() => new THREE.PlaneGeometry(1.25, 1.5), []);
  const photoGeo = useMemo(() => new THREE.PlaneGeometry(1.1, 1.1), []);
  const stickGeo = useMemo(() => new THREE.CylinderGeometry(0.025, 0.02, 3.8, 8), []);
  const clipGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.22, 10), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Smooth spring scale animation
    const speed = 7.0;
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale,
      Math.min(delta * speed, 0.2)
    );

    const s = Math.max(0.0001, currentScale.current);
    groupRef.current.scale.set(s, s, s);

    // Subtle breathing / swaying motion when visible
    if (visible && currentScale.current > 0.8) {
      const sway = Math.sin(time * 1.8 + delay) * 0.035;
      groupRef.current.rotation.z = rotation[2] + sway;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={0}
      onClick={(e) => {
        e.stopPropagation();
        if (onClickPhoto) onClickPhoto(url);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Wooden Stick inserting deep into the bouquet */}
      <mesh
        geometry={stickGeo}
        material={materials.stick}
        position={[0, -0.65, -0.02]}
        castShadow
      />

      {/* Polaroid Card backing - elevated higher above roses */}
      <mesh
        geometry={cardGeo}
        material={materials.card}
        position={[0, 1.45, 0]}
        castShadow
        receiveShadow
      />

      {/* Photo inside Polaroid */}
      <mesh
        geometry={photoGeo}
        material={materials.photo}
        position={[0, 1.56, 0.005]}
      />

      {/* Rose-Gold decorative clip at base of card */}
      <mesh
        geometry={clipGeo}
        material={materials.clip}
        position={[0, 0.7, 0.02]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </group>
  );
}

// Group of 4 photo picks elevated higher above the 20-rose bouquet
export const PhotoPicksGroup = React.memo(function PhotoPicksGroup({
  visible = false,
  onClickPhoto,
  photoUrls,
}) {
  const cacheBuster = useMemo(() => Date.now(), []);
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/';

  const defaultUrls = useMemo(() => [
    `${base}photos/photo1.jpg?t=${cacheBuster}`,
    `${base}photos/photo2.jpg?t=${cacheBuster}`,
    `${base}photos/photo3.jpg?t=${cacheBuster}`,
    `${base}photos/photo4.jpg?t=${cacheBuster}`,
  ], [base, cacheBuster]);

  const activeUrls = photoUrls && photoUrls.length >= 4 ? photoUrls : defaultUrls;

  const photos = useMemo(() => [
    {
      url: activeUrls[0],
      pos: [-1.05, 1.1, 0.65],
      rot: [0.18, 0.35, -0.22],
      delay: 0,
    },
    {
      url: activeUrls[1],
      pos: [1.02, 1.25, 0.55],
      rot: [0.15, -0.38, 0.24],
      delay: 1.2,
    },
    {
      url: activeUrls[2],
      pos: [-0.68, 1.75, -0.2],
      rot: [-0.12, 0.4, -0.14],
      delay: 2.1,
    },
    {
      url: activeUrls[3],
      pos: [0.65, 1.85, -0.15],
      rot: [-0.1, -0.38, 0.16],
      delay: 3.0,
    },
  ], [activeUrls]);

  return (
    <group>
      {photos.map((p, idx) => (
        <PhotoPick
          key={`${idx}-${p.url}`}
          url={p.url}
          position={p.pos}
          rotation={p.rot}
          visible={visible}
          delay={p.delay}
          onClickPhoto={onClickPhoto}
        />
      ))}
    </group>
  );
});
