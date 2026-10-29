import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Bouquet } from './Bouquet';
import { FallingPetals } from './FallingPetals';

// Camera controller component to handle smooth animated reset and intro float-in
function CameraManager({
  resetTrigger,
  autoRotate,
  onUserInteract,
  reducedMotion,
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const targetCamPos = useRef(new THREE.Vector3(0, 1.2, 7.2));
  const defaultTarget = useRef(new THREE.Vector3(0, 0.4, 0));
  const isResetting = useRef(false);

  // Initial intro entrance
  useEffect(() => {
    if (!reducedMotion) {
      camera.position.set(0, 1.8, 8.5);
    } else {
      camera.position.copy(targetCamPos.current);
    }
    camera.lookAt(defaultTarget.current);
  }, [camera, reducedMotion]);

  // Handle smooth reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      isResetting.current = true;
    }
  }, [resetTrigger]);

  useFrame((state, delta) => {
    // Smooth reset animation
    if (isResetting.current) {
      const step = Math.min(delta * 4, 0.1);
      camera.position.lerp(targetCamPos.current, step);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(defaultTarget.current, step);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
        camera.position.copy(targetCamPos.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(defaultTarget.current);
          controlsRef.current.update();
        }
        isResetting.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.8}
      maxDistance={25.0}
      minPolarAngle={THREE.MathUtils.degToRad(10)} // Allow high angle view
      maxPolarAngle={THREE.MathUtils.degToRad(105)} // Allow viewing from slightly below
      autoRotate={autoRotate && !isResetting.current}
      autoRotateSpeed={0.8}
      target={[0, 0.4, 0]}
      onStart={() => {
        isResetting.current = false;
        if (onUserInteract) onUserInteract();
      }}
    />
  );
}

export const Scene = React.memo(function Scene({
  flowerCount = 20,
  colorTheme = 'pink',
  autoRotate = true,
  resetTrigger = 0,
  onUserInteract,
  reducedMotion = false,
  showPhotos = false,
  onTogglePhotos,
  onClickPhoto,
  photoUrls,
}) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 7.2], fov: 42 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* Soft studio lighting designed specifically for delicate floral velvet tones */}
        <ambientLight intensity={0.85} color="#fff6ed" />

        {/* Key directional sunlight for soft cast shadows */}
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.6}
          color="#fffdf8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={18}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-bias={-0.0003}
        />

        {/* Soft fill light from opposite side */}
        <directionalLight position={[-4, 3, 2]} intensity={0.7} color="#fce7f3" />

        {/* Subtle rim light from behind for glowing petal silhouettes */}
        <directionalLight position={[0, 4, -5]} intensity={1.1} color="#ffffff" />

        {/* Under-light for soft shadows under wrapper */}
        <pointLight position={[0, -2, 2]} intensity={0.4} color="#fef3c7" />

        {/* The 3D Rose Bouquet with photo sticks */}
        <Bouquet
          count={flowerCount}
          colorTheme={colorTheme}
          showPhotos={showPhotos}
          onTogglePhotos={onTogglePhotos}
          onClickPhoto={onClickPhoto}
          photoUrls={photoUrls}
        />

        {/* Lush falling rose petals and leaves in background */}
        <FallingPetals
          count={75}
          colorTheme={colorTheme}
          reducedMotion={reducedMotion}
        />

        {/* Contact shadow beneath bouquet */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.45}
          scale={7}
          blur={2.2}
          far={4}
          color="#4a1525"
        />

        {/* Camera controller & OrbitControls */}
        <CameraManager
          resetTrigger={resetTrigger}
          autoRotate={autoRotate}
          onUserInteract={onUserInteract}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
});
