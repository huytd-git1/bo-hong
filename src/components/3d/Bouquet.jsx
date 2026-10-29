import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoseFlower } from './RoseFlower';
import { BabyBreathSprig } from './BabyBreath';
import { LeafBranch, StemBundle } from './StemsAndLeaves';
import { BouquetWrapper } from './BouquetWrapper';
import { PhotoPicksGroup } from './PhotoPick';

/**
 * Generates natural floral dome coordinates for 9, 12, or 20 roses.
 * Each rose is given subtle random variations in height, scale, bloom, and rotation
 * to mimic a real handcrafted florist bouquet.
 */
function generateRosePositions(count = 12) {
  const roses = [];

  // Deterministic pseudo-random helper so arrangement stays stable across renders
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  if (count === 9) {
    // 1 Center + 8 Outer ring
    roses.push({
      pos: [0, 1.18, 0],
      rot: [rand() * 0.08, rand() * Math.PI, 0],
      scale: 1.04,
      bloom: 1.05,
    });

    const ringCount = 8;
    const ringRadius = 1.1;
    const ringY = 0.78;
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2 + (rand() * 0.15 - 0.075);
      const r = ringRadius + (rand() * 0.1 - 0.05);
      const y = ringY + (rand() * 0.08 - 0.04);
      const tilt = THREE.MathUtils.degToRad(36 + rand() * 6);

      roses.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [
          Math.sin(angle) * tilt,
          -angle + Math.PI * 0.5 + (rand() * 0.4 - 0.2),
          -Math.cos(angle) * tilt,
        ],
        scale: 0.95 + rand() * 0.1,
        bloom: 0.92 + rand() * 0.2,
      });
    }
  } else if (count === 20) {
    // 1 Center + 5 Tier 1 + 7 Tier 2 + 7 Tier 3
    roses.push({
      pos: [0, 1.35, 0],
      rot: [rand() * 0.08, rand() * Math.PI, 0],
      scale: 1.05,
      bloom: 1.1,
    });

    // Tier 1 (5 roses)
    const t1Count = 5;
    for (let i = 0; i < t1Count; i++) {
      const angle = (i / t1Count) * Math.PI * 2 + (rand() * 0.1 - 0.05);
      const r = 0.65 + rand() * 0.08;
      const y = 1.15 + (rand() * 0.06 - 0.03);
      const tilt = THREE.MathUtils.degToRad(18 + rand() * 5);
      roses.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [Math.sin(angle) * tilt, -angle + Math.PI * 0.5, -Math.cos(angle) * tilt],
        scale: 0.98 + rand() * 0.08,
        bloom: 0.98 + rand() * 0.15,
      });
    }

    // Tier 2 (7 roses)
    const t2Count = 7;
    for (let i = 0; i < t2Count; i++) {
      const angle = (i / t2Count) * Math.PI * 2 + 0.35 + (rand() * 0.1 - 0.05);
      const r = 1.25 + rand() * 0.1;
      const y = 0.82 + (rand() * 0.08 - 0.04);
      const tilt = THREE.MathUtils.degToRad(35 + rand() * 6);
      roses.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [Math.sin(angle) * tilt, -angle + Math.PI * 0.5, -Math.cos(angle) * tilt],
        scale: 0.94 + rand() * 0.1,
        bloom: 0.94 + rand() * 0.18,
      });
    }

    // Tier 3 (7 roses)
    const t3Count = 7;
    for (let i = 0; i < t3Count; i++) {
      const angle = (i / t3Count) * Math.PI * 2 + 0.1 + (rand() * 0.1 - 0.05);
      const r = 1.72 + rand() * 0.1;
      const y = 0.44 + (rand() * 0.08 - 0.04);
      const tilt = THREE.MathUtils.degToRad(50 + rand() * 6);
      roses.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [Math.sin(angle) * tilt, -angle + Math.PI * 0.5, -Math.cos(angle) * tilt],
        scale: 0.92 + rand() * 0.12,
        bloom: 0.9 + rand() * 0.22,
      });
    }
  } else {
    // Default 12 roses (1 Center + 4 Inner + 7 Outer)
    roses.push({
      pos: [0, 1.25, 0],
      rot: [rand() * 0.05, rand() * Math.PI, 0],
      scale: 1.05,
      bloom: 1.1,
    });

    // Inner ring (4 roses)
    const innerCount = 4;
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + 0.25 + (rand() * 0.1 - 0.05);
      const r = 0.72 + rand() * 0.08;
      const y = 1.02 + (rand() * 0.06 - 0.03);
      const tilt = THREE.MathUtils.degToRad(20 + rand() * 5);
      roses.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [Math.sin(angle) * tilt, -angle + Math.PI * 0.5, -Math.cos(angle) * tilt],
        scale: 0.98 + rand() * 0.08,
        bloom: 1.0 + rand() * 0.15,
      });
    }

    // Outer ring (7 roses)
    const outerCount = 7;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2 + (rand() * 0.1 - 0.05);
      const r = 1.35 + rand() * 0.1;
      const y = 0.65 + (rand() * 0.08 - 0.04);
      const tilt = THREE.MathUtils.degToRad(42 + rand() * 6);
      roses.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [Math.sin(angle) * tilt, -angle + Math.PI * 0.5, -Math.cos(angle) * tilt],
        scale: 0.94 + rand() * 0.1,
        bloom: 0.92 + rand() * 0.2,
      });
    }
  }

  return roses;
}

export const Bouquet = React.memo(function Bouquet({
  count = 20,
  colorTheme = 'pink',
  showPhotos = false,
  onTogglePhotos,
  onClickPhoto,
  photoUrls,
}) {
  const roses = useMemo(() => generateRosePositions(count), [count]);

  // Generate filler baby's breath sprigs tucked between roses
  const babyBreathSprigs = useMemo(() => {
    const list = [];
    const sprigCount = count === 20 ? 12 : 8;
    for (let i = 0; i < sprigCount; i++) {
      const angle = (i / sprigCount) * Math.PI * 2 + 0.4;
      const radius = count === 20 ? 1.45 : 1.15;
      const y = 0.55;
      list.push({
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        rot: [0.35 * Math.sin(angle), -angle + Math.PI * 0.5, -0.35 * Math.cos(angle)],
        scale: 0.95,
      });
    }
    return list;
  }, [count]);

  // Foliage rose leaves framing the collar
  const leafBranches = useMemo(() => {
    const list = [];
    const branchCount = count === 20 ? 10 : 8;
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2 + 0.15;
      const radius = count === 20 ? 1.85 : 1.48;
      const y = 0.35;
      list.push({
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        rot: [
          THREE.MathUtils.degToRad(58) * Math.sin(angle),
          -angle + Math.PI * 0.5,
          -THREE.MathUtils.degToRad(58) * Math.cos(angle),
        ],
        scale: 1.1,
      });
    }
    return list;
  }, [count]);

  // Overall scale adjustment based on count to keep bouquet balanced in view
  const bouquetScale = useMemo(() => {
    if (count === 20) return 0.88;
    if (count === 9) return 1.05;
    return 1.0;
  }, [count]);

  return (
    <group
      position={[0, -0.2, 0]}
      scale={[bouquetScale, bouquetScale, bouquetScale]}
      onClick={(e) => {
        e.stopPropagation();
        if (onTogglePhotos) onTogglePhotos();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* 1. Wrapping Paper & Ribbon */}
      <BouquetWrapper colorTheme={colorTheme} />

      {/* 2. Foliage Leaves under roses */}
      {leafBranches.map((l, i) => (
        <LeafBranch
          key={`leaf-${i}`}
          position={l.pos}
          rotation={l.rot}
          scale={l.scale}
        />
      ))}

      {/* 3. Baby's breath filler flowers */}
      {babyBreathSprigs.map((b, i) => (
        <BabyBreathSprig
          key={`bb-${i}`}
          position={b.pos}
          rotation={b.rot}
          scale={b.scale}
        />
      ))}

      {/* 4. Roses */}
      {roses.map((r, i) => (
        <RoseFlower
          key={`rose-${count}-${i}`}
          position={r.pos}
          rotation={r.rot}
          scale={r.scale}
          bloom={r.bloom}
          colorTheme={colorTheme}
        />
      ))}

      {/* 5. Photos of her pinned into the bouquet */}
      <PhotoPicksGroup
        visible={showPhotos}
        onClickPhoto={onClickPhoto}
        photoUrls={photoUrls}
      />

      {/* 6. Stem bundle inside */}
      <StemBundle count={count} />
    </group>
  );
});

