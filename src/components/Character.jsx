/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useGameStore } from "../store";

export default function Character(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("./models/male/model.gltf");
  const { actions } = useAnimations(animations, group);

  const characterState = useGameStore((state) => state.characterState);

  useEffect(() => {
    const action = actions[characterState];
    if (action) {
      action.reset().fadeIn(0.2).play();
      return () => {
        action.fadeOut(0.2);
      };
    }
  }, [characterState, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Root003" scale={0.64}>
          <primitive object={nodes.LeftFootCtrl} />
          <primitive object={nodes.RightFootCtrl} />
          <primitive object={nodes.HipsCtrl} />
          <skinnedMesh
            name="characterMedium"
            geometry={nodes.characterMedium.geometry}
            material={materials["skin.001"]}
            skeleton={nodes.characterMedium.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./models/male/model.gltf");
