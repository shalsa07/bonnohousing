import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { BackSide, TextureLoader } from 'three'
import { degToRad } from 'three/src/math/MathUtils'

import LoadingComponent from '../../LoadingComponent'

// Loading spinner component for 360 texture loading
function TextureLoadingSpinner() {
  return (
    <Html center>
      <LoadingComponent />
    </Html>
  )
}

export default function Experience360s({ data }) {
  const { experienceState } = useExperienceContext()
  const { camera } = useThree()
  const [texture, setTexture] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const loaderRef = useRef(null)

  const images = data?._360sImages || []
  const fallbackURL = images[0]?.url || ''
  const currentName = experienceState?._360TextureName || images[0]?.name
  const match = images.find((image) => image.name === currentName)
  const textureURL = match?.url || fallbackURL

  // Asynchronously load each 360 texture on demand.
  // Show loading spinner while texture is being loaded.
  useEffect(() => {
    if (!textureURL) return
    if (!loaderRef.current) {
      loaderRef.current = new TextureLoader()
    }
    const loader = loaderRef.current
    let cancelled = false

    // Set loading state when starting to load a new texture
    setIsLoading(true)

    loader.load(
      textureURL,
      (newTexture) => {
        if (cancelled) {
          newTexture.dispose()
          return
        }
        newTexture.needsUpdate = true
        setTexture((oldTexture) => {
          if (oldTexture && oldTexture !== newTexture) {
            oldTexture.dispose()
          }
          return newTexture
        })
        // Clear loading state when texture is ready
        setIsLoading(false)
      },
      undefined,
      () => {
        // On error, clear loading state but keep last good texture visible
        if (!cancelled) {
          setIsLoading(false)
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [textureURL])

  // Reset camera orientation to face forward (-Z) every time 360 image changes
  useEffect(() => {
    if (!experienceState?._360Mode) return
    try {
      camera.quaternion.set(0, 0, 0, 1)
      camera.rotation.set(0, 0, 0)
    } catch (e) { }
  }, [experienceState?._360TextureName, experienceState?._360Mode, camera])

  // Show loading spinner when no texture yet or actively loading
  if (!texture || isLoading) {
    return <TextureLoadingSpinner />
  }

  return (
    <mesh
      rotation={[0, degToRad(90), 0]}
      scale={[1, 1, -1]}
    >
      <sphereGeometry args={[32, 500, 500]} />
      <meshBasicMaterial
        side={BackSide}
        map={texture}
      />
    </mesh>
  )
}
