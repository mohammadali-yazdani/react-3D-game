import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef, useMemo, useCallback } from "react";
import { Controls } from "../App";
import Character from "./Character";
import { gameStates, playAudio, useGameStore } from "../store";
import * as THREE from "three";

export const CharacterController = () => {
  const { setCharacterState, gameState } = useGameStore();

  // کنترل‌ها
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );

  const rigidbody = useRef(null);
  const character = useRef(null);
  const isOnFloor = useRef(true);

  // ثابت‌ها
  const JUMP_FORCE = useMemo(() => 0.5, []);
  const MOVEMENT_SPEED = useMemo(() => 0.1, []);
  const MAX_VEL = useMemo(() => 3, []);
  const RUN_VEL = useMemo(() => 1, []);

  // بازنشانی موقعیت
  const resetPosition = useCallback(() => {
    if (rigidbody.current) {
      rigidbody.current.setTranslation(vec3({ x: 0, y: 1, z: 0 }));
      rigidbody.current.setLinvel(vec3({ x: 0, y: 0, z: 0 }));
    }
  }, []);

  useFrame((state, delta) => {
    if (!rigidbody.current || !character.current) return;

    const impulse = new THREE.Vector3();
    const linvel = rigidbody.current.linvel();
    let changeRotation = false;

    // پرش
    if (jumpPressed && isOnFloor.current) {
      impulse.y += JUMP_FORCE;
      isOnFloor.current = false;
    }

    // حرکت به جهات مختلف
    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (backPressed && linvel.z < MAX_VEL) {
      impulse.z += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (forwardPressed && linvel.z > -MAX_VEL) {
      impulse.z -= MOVEMENT_SPEED;
      changeRotation = true;
    }

    // اعمال حرکت
    if (impulse.length() > 0) {
      rigidbody.current.applyImpulse(impulse, true);
    }

    // تغییر حالت کاراکتر
    const isRunning =
      Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL;
    setCharacterState(isRunning ? "Run" : "Idle");

    // چرخش کاراکتر
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      character.current.rotation.y = angle;
    }

    // دنبال کردن دوربین
    const characterWorldPosition = character.current.getWorldPosition(
      new THREE.Vector3()
    );
    const targetCameraPosition = new THREE.Vector3(
      characterWorldPosition.x,
      gameState === gameStates.GAME ? 6 : 2,
      characterWorldPosition.z + 14
    );

    state.camera.position.lerp(targetCameraPosition, delta * 2);
    state.camera.lookAt(characterWorldPosition);
  });

  useEffect(() => {
    const unsubscribeStage = useGameStore.subscribe(
      (state) => state.currentStage,
      resetPosition
    );
    const unsubscribeWrongAnswers = useGameStore.subscribe(
      (state) => state.wrongAnswers,
      resetPosition
    );

    return () => {
      unsubscribeStage();
      unsubscribeWrongAnswers();
    };
  }, [resetPosition]);

  return (
    <group>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        scale={[0.5, 0.5, 0.5]}
        enabledRotations={[false, false, false]}
        onCollisionEnter={() => (isOnFloor.current = true)}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "void") {
            resetPosition();
            playAudio("fall", () => playAudio("ganbatte"));
          }
        }}
      >
        <CapsuleCollider args={[0.8, 0.4]} position={[0, 1.2, 0]} />
        <group ref={character}>
          <Character />
        </group>
      </RigidBody>
    </group>
  );
};
