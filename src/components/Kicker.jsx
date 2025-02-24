import { useRef } from "react";
import { gameStates, useGameStore } from "../store";
import { quat, RigidBody } from "@react-three/rapier";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Kicker = () => {
  const kickerRef = useRef();

  const gameState = useGameStore((state) => state.gameState);
  const currentStage = useGameStore((state) => state.currentStage);

  useFrame((_state, delta) => {
    if (!kickerRef.current) {
      return;
    }

    const curRotation = quat(kickerRef.current.rotation());
    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * 4
    );

    curRotation.multiply(incrementRotation);
    kickerRef.current.setNextKinematicRotation(curRotation);

    if (gameState !== gameStates.GAME || currentStage < 2) {
      return null;
    }
  });

  return (
    <RigidBody type="kinematicPosition" position={[0, 0.1, 0]} ref={kickerRef}>
      <group position={[3, 0, 0]}>
        <Box args={[1.5, 0.2, 0.2]}>
          <meshStandardMaterial color={"mediumpurple"} />
        </Box>
      </group>
    </RigidBody>
  );
};
