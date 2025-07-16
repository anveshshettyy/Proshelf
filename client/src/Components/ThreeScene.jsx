// ModelViewer.jsx
import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { MeshStandardMaterial, Color } from 'three';

function Model({ isActive }) {
  const { scene } = useGLTF('/Models/model.glb');
  const ref = useRef();
  const { mouse, invalidate } = useThree();
  const [isDragging, setIsDragging] = useState(false);

  // Memoized material to avoid re-creating it on every render
  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: new Color(0xc0c0c0),
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1,
    });
  }, []);

  // Apply material to all meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, material]);

  useEffect(() => {
    function onPointerDown() {
      setIsDragging(true);
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

  useFrame((_, delta) => {
    if (!isActive || !ref.current) return;

    if (!isDragging) {
      ref.current.rotation.y += delta * 0.3;
    } else {
      ref.current.rotation.x = mouse.y * 0.2;
      ref.current.rotation.z = mouse.x * 0.2;
    }

    invalidate();
  });

  return <primitive ref={ref} object={scene} scale={1.2} />;
}

export default function ModelViewer() {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) observer.observe(canvasRef.current);

    return () => {
      if (canvasRef.current) observer.unobserve(canvasRef.current);
    };
  }, []);

  return (
    <div ref={canvasRef} className="w-full h-[60vh] rounded-2xl overflow-hidden">
      <Canvas
        shadows
        frameloop="demand"
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={<meshStandardMaterial attach="material" color="gray" />}>
          <Environment preset="city" />
          <Model isActive={isVisible} />
        </Suspense>

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
