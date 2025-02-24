import { Environment, OrbitControls, Text } from "@react-three/drei";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { KanaSpots } from "./KanaSpots";
import { useGameStore } from "../store";
import { Kicker } from "./Kicker";
import { Stage } from "./Stage";

export const Experience = () => {
  const currentKana = useGameStore((state) => state.currentKana);

  return (
    <>
      <OrbitControls />
      {/* LIGHTS */}
      <Environment preset="sunset" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.3}
        castShadow
        color={"#9e69da"}
      />

      {/* BACKGROUND */}

      {currentKana && (
        <Text position={[0, -1, -20]}>
          {currentKana.name.toUpperCase()}
          <meshStandardMaterial color="black" opacity={0.6} transparent />
        </Text>
      )}

      <group position-y={-1}>
        <Kicker />
        {/* FLOOR */}
        <RigidBody colliders={false} type="fixed" name="void">
          <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[90, 90]} />
            <meshBasicMaterial color="#e3daf7" toneMapped={false} />
          </mesh>
          <CuboidCollider position={[0, -3.5, 0]} args={[50, 0.1, 50]} sensor />
        </RigidBody>

        {/* STAGE */}
        <Stage position-y={-0.92} />
        <RigidBody
          colliders={false}
          type="fixed"
          position-y={-0.5}
          friction={2}
        >
          <CylinderCollider args={[1 / 2, 5]} />
        </RigidBody>

        {/* CHARACTER */}
        <CharacterController />

        {/* KANA */}
        <KanaSpots />
      </group>
    </>
  );
};
