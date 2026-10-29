import * as THREE from 'three';

/**
 * Procedural BufferGeometry generator for rose petals, leaves, sepals, and wrapping paper.
 * Reusable geometries ensure maximum performance and high visual fidelity.
 */

// 1. Create a single curved parametric rose petal geometry
export function createPetalGeometry(type = 'mid', segU = 16, segV = 16) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Configuration per petal type
  let length = 1.0;
  let maxWidth = 0.8;
  let cupDepth = 0.35; // Transverse curvature (cross-section)
  let bendOutward = 0.2; // Longitudinal curvature
  let reflexCurl = 0.15; // Curled top edge

  if (type === 'inner') {
    length = 0.85;
    maxWidth = 0.55;
    cupDepth = 0.45;
    bendOutward = -0.25; // Curves inwards over the center
    reflexCurl = 0.0;
  } else if (type === 'mid') {
    length = 1.0;
    maxWidth = 0.78;
    cupDepth = 0.35;
    bendOutward = 0.15; // Begins unfolding
    reflexCurl = 0.1;
  } else if (type === 'outer') {
    length = 1.15;
    maxWidth = 1.05;
    cupDepth = 0.25;
    bendOutward = 0.55; // Gracefully flared outward
    reflexCurl = 0.3; // Noticeable reflexed edge curl
  }

  // Generate grid vertices
  for (let i = 0; i <= segU; i++) {
    const u = i / segU; // 0 (base) to 1 (tip)

    // Petal width profile: slender at base, wide in upper half, rounded tip
    // Using smooth sine and polynomial taper
    const widthFactor = Math.sin(u * Math.PI) * (1 - 0.15 * u) + 0.08 * Math.sin(u * Math.PI * 0.5);
    const currentHalfWidth = (maxWidth * 0.5) * Math.max(0.01, widthFactor);

    // Height along spine
    const y = u * length;

    // Longitudinal spine curvature (Z displacement along center)
    // Inner petals bow inwards; outer petals bow outwards with reflexed tips
    let spineZ = 0;
    if (type === 'inner') {
      spineZ = Math.sin(u * Math.PI * 0.8) * bendOutward;
    } else {
      spineZ = Math.pow(u, 1.6) * bendOutward - (u > 0.7 ? Math.pow(u - 0.7, 2) * reflexCurl * 4 : 0);
    }

    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1; // -1 (left) to +1 (right)

      // X coordinate: spreads across width
      const x = v * currentHalfWidth;

      // Z coordinate: transverse cupping (curving inward like a spoon)
      // Highest cup depth near middle of petal
      const cupProfile = Math.sin(u * Math.PI);
      const cupZ = -cupDepth * (1 - v * v) * cupProfile;

      // Edge flare/ruffle (subtle organic waviness on outer edges)
      const edgeRuffle = (type === 'outer' && u > 0.4) 
        ? Math.sin(v * Math.PI * 3 + u * 4) * 0.03 * (Math.abs(v)) 
        : 0;

      const z = spineZ + cupZ + edgeRuffle;

      positions.push(x, y, z);
      uvs.push(j / segV, u);
    }
  }

  // Generate faces (two triangles per quad)
  const rowStride = segV + 1;
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * rowStride + j;
      const b = (i + 1) * rowStride + j;
      const c = (i + 1) * rowStride + (j + 1);
      const d = i * rowStride + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// 2. Create calyx sepal geometry (the 5 pointed green sepals hugging flower base)
export function createSepalGeometry(segU = 10, segV = 6) {
  const positions = [];
  const uvs = [];
  const indices = [];

  const length = 0.65;
  const maxWidth = 0.22;

  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    // Taper to sharp pointed leaf tip
    const currentHalfWidth = (maxWidth * 0.5) * (1 - Math.pow(u, 1.2)) * Math.sin(u * Math.PI * 0.7 + 0.3);
    const y = -u * length; // Hangs down/wraps base
    const z = Math.sin(u * Math.PI * 0.7) * 0.12 - (u * 0.1);

    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1;
      const x = v * Math.max(0.005, currentHalfWidth);
      const cupZ = -0.04 * (1 - v * v);
      positions.push(x, y, z + cupZ);
      uvs.push(j / segV, u);
    }
  }

  const rowStride = segV + 1;
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * rowStride + j;
      const b = (i + 1) * rowStride + j;
      const c = (i + 1) * rowStride + (j + 1);
      const d = i * rowStride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// 3. Create realistic rose leaf geometry with serrations and center vein crease
export function createLeafGeometry(segU = 14, segV = 10) {
  const positions = [];
  const uvs = [];
  const indices = [];

  const length = 1.0;
  const maxWidth = 0.55;

  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    // Oval shape with tapered pointed tip
    let w = Math.sin(u * Math.PI) * (1 - 0.2 * u);
    // Serrated edge frequency
    const serration = 1.0 + (u > 0.15 && u < 0.9 ? Math.sin(u * 38) * 0.05 : 0);
    const currentHalfWidth = (maxWidth * 0.5) * w * serration;

    const y = u * length;
    // Arching curve along length
    const spineZ = Math.sin(u * Math.PI * 0.9) * 0.15 - Math.pow(u, 2) * 0.1;

    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1;
      const x = v * Math.max(0.01, currentHalfWidth);
      // V-shaped central crease (fold along vein)
      const creaseZ = -Math.abs(v) * 0.08;
      positions.push(x, y, spineZ + creaseZ);
      uvs.push(j / segV, u);
    }
  }

  const rowStride = segV + 1;
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * rowStride + j;
      const b = (i + 1) * rowStride + j;
      const c = (i + 1) * rowStride + (j + 1);
      const d = i * rowStride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// 4. Create wrapping paper pleated cone geometry
export function createWrappingPaperGeometry(radialSegments = 36, heightSegments = 16) {
  const positions = [];
  const uvs = [];
  const indices = [];

  const bottomRadius = 0.9;
  const waistRadius = 1.25;
  const topRadius = 3.4;
  const height = 4.2;
  const waistHeightRatio = 0.35;

  for (let i = 0; i <= heightSegments; i++) {
    const t = i / heightSegments; // 0 at bottom, 1 at top
    const y = (t - 0.5) * height;

    // Radius interpolates with bouquet flare
    let r = 0;
    if (t < waistHeightRatio) {
      const subT = t / waistHeightRatio;
      r = THREE.MathUtils.lerp(bottomRadius, waistRadius, subT);
    } else {
      const subT = (t - waistHeightRatio) / (1 - waistHeightRatio);
      // Flaring outwards gracefully with gentle curve
      r = waistRadius + Math.pow(subT, 1.2) * (topRadius - waistRadius);
    }

    // Number of soft folds/pleats
    const pleatCount = 14;
    // Folds are more pronounced at top rim
    const pleatDepth = (t > waistHeightRatio ? Math.pow((t - waistHeightRatio) / (1 - waistHeightRatio), 1.3) * 0.35 : 0.05);

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      
      // Pleat wave + organic asymmetry
      const pleat = Math.sin(angle * pleatCount) * pleatDepth + Math.sin(angle * 3) * 0.08;
      const effectiveR = r + pleat;

      const x = Math.cos(angle) * effectiveR;
      const z = Math.sin(angle) * effectiveR;

      positions.push(x, y, z);
      uvs.push(j / radialSegments, t);
    }
  }

  const rowStride = radialSegments + 1;
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * rowStride + j;
      const b = (i + 1) * rowStride + j;
      const c = (i + 1) * rowStride + (j + 1);
      const d = i * rowStride + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// 5. Create inner sheer organza ruffle trim (the ruffled paper collar inside the bouquet)
export function createRuffleGeometry(radialSegments = 40, heightSegments = 8) {
  const positions = [];
  const uvs = [];
  const indices = [];

  const rBase = 2.4;
  const rTop = 3.55;
  const height = 1.6;

  for (let i = 0; i <= heightSegments; i++) {
    const t = i / heightSegments;
    const y = t * height;
    const r = THREE.MathUtils.lerp(rBase, rTop, t);
    const waveAmp = t * 0.28; // Scalloped ruffle edge

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const wave = Math.sin(angle * 22) * waveAmp + Math.cos(angle * 11) * 0.06;
      const effectiveR = r + wave;

      const x = Math.cos(angle) * effectiveR;
      const z = Math.sin(angle) * effectiveR;

      positions.push(x, y, z);
      uvs.push(j / radialSegments, t);
    }
  }

  const rowStride = radialSegments + 1;
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * rowStride + j;
      const b = (i + 1) * rowStride + j;
      const c = (i + 1) * rowStride + (j + 1);
      const d = i * rowStride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
