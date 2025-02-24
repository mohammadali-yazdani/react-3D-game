import {
  ContactShadows,
  Environment,
  OrbitControls,
  Text,
} from "@react-three/drei";
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
  const lastWrongKana = useGameStore((state) => state.lastWrongKana);

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

      <Text
        position={[0, -0.92, 0]}
        fontSize={1.84}
        rotation-x={-Math.PI / 2}
        font="./fonts/Poppins-ExtraBold.ttf"
      >
        {currentKana ? currentKana.name.toUpperCase() : "Kana Game"}
        <meshStandardMaterial color="white" opacity={0.6} transparent />
      </Text>

      {lastWrongKana && (
        <Text
          position={[0, -0.92, 1.2]}
          fontSize={1}
          rotation-x={-Math.PI / 2}
          font="./fonts/Poppins-ExtraBold.ttf"
        >
          {lastWrongKana.name.toUpperCase()}
          <meshStandardMaterial color="red" opacity={0.6} transparent />
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
        <ContactShadows
          frames={1}
          position={[0, -0.88, 0]}
          scale={80}
          opacity={0.42}
          far={50}
          blur={0.8}
          color="#aa9acd"
        />

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
