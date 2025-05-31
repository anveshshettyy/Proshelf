import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { MeshStandardMaterial, Color } from 'three';

function Model() {
  const { scene } = useGLTF('/Models/model.glb');
  const ref = useRef();
  const { mouse } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          color: new Color(0xc0c0c0),
          metalness: 1,
          roughness: 0.2,
          envMapIntensity: 1,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    function onPointerDown(event) {
      setIsDragging(true);
      dragStart.current = { x: event.clientX, y: event.clientY };
    }
    function onPointerUp() {
      setIsDragging(false);
    }

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01; 

      if (isDragging) {
        ref.current.rotation.x = mouse.y * 0.2;
        ref.current.rotation.z = mouse.x * 0.2;
      }
    }
  });

  return <primitive ref={ref} object={scene} scale={1} />;
}

export default function ModelViewer() {
  return (
    <Canvas
      shadows
      className="w-full h-[60vh]"
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={ false } />
    </Canvas>
  );
}
