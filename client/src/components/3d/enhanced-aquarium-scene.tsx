import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";

interface FishProps {
  color: string;
  offset: number;
  radius?: number;
}

function NeonFish({ color, offset, radius = 2.6 }: FishProps) {
  const mesh = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.65 + offset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 1.4) * 0.35;

    if (mesh.current) {
      mesh.current.position.set(x, y, z);
      mesh.current.rotation.y = Math.atan2(-Math.sin(t) * radius, Math.cos(t) * radius);
    }
  });

  return (
    <mesh ref={mesh} castShadow>
      <coneGeometry args={[0.45, 1.4, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.15}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#0b1624", 8, 15]} />
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 6, 4]} intensity={1.1} color="#30cfd0" />
      <pointLight position={[-4, 3, -4]} intensity={0.8} color="#8360c3" />

      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <NeonFish color="#06b6d4" offset={0} />
        <NeonFish color="#8b5cf6" offset={1.3} radius={2} />
        <NeonFish color="#22c55e" offset={2.7} radius={3.2} />
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6, 0.2, 64]} />
        <meshStandardMaterial
          color="#0d2138"
          roughness={1}
          metalness={0.1}
          emissive="#0b1624"
          emissiveIntensity={0.6}
        />
      </mesh>

      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} height={300} />
        <Vignette darkness={0.6} />
      </EffectComposer>
    </>
  );
}

export function EnhancedAquariumScene() {
  return (
    <div className="w-full h-[500px] relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <Canvas camera={{ position: [0, 1, 8], fov: 45 }} shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
        <h3 className="font-bold text-lg">استعراض ثلاثي الأبعاد</h3>
        <p className="text-sm text-muted-foreground">حرّك الماوس لرؤية حركة الأسماك</p>
      </div>
    </div>
  );
}
