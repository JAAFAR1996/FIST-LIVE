import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";

function FishModel({ ...props }) {
  // This would load a real GLTF model
  // For now, we use a placeholder or simple geometry
  const mesh = useRef<any>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={mesh} {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color="#06b6d4" 
        roughness={0.2} 
        metalness={0.8}
        emissive="#06b6d4"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <FishModel scale={1.5} />
      </Float>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  );
}

export function EnhancedAquariumScene() {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <h3 className="font-bold text-lg">استعراض ثلاثي الأبعاد</h3>
        <p className="text-sm text-muted-foreground">حرك الماوس للتفاعل مع الحوض</p>
      </div>
    </div>
  );
}
