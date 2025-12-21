"use client";
import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber'
import { BackSide, TextureLoader } from 'three'
import { degToRad } from 'three/src/math/MathUtils';

export default function Experience360s({data,experienceState}) {
  const { camera } = useThree()
  const [texture, setTexture] = useState(null)
  const textureLoader = new TextureLoader();

  const getFilteredTexture = () => {
    if (!data?._360sImages) return null
    return data?._360sImages.find(image => image.name === experienceState?._360TextureName) || data?._360sImages[0];
  }

  const filteredTexture = getFilteredTexture();
  const textureURL = filteredTexture?.url;

  useEffect(() => {
    if (textureURL) {
      textureLoader.load(textureURL, (newTexture) => {
        setTexture(newTexture);
      });
    }
  }, [textureURL, experienceState?._360TextureName]);

  // Reset camera orientation to face forward every time 360 image changes
  useEffect(() => {
    if (!experienceState?._360Mode) return
    try {
      camera.quaternion.set(0, 0, 0, 1)
      camera.rotation.set(0, 0, 0)
    } catch (e) {}
  }, [experienceState?._360TextureName, experienceState?._360Mode, camera])

  if (!texture) {
    return null; // Or a loading indicator
  }

  return (
    <mesh
      rotation={[0, degToRad(90), 0]}
      scale={[1,1,-1]}
    >
      <sphereGeometry args={[32,500,500]}/>
      <meshBasicMaterial 
        side={BackSide} 
        map={texture}
      />
    </mesh>
  )
}
