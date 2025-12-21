'use client'
import { useXRHitTest } from '@react-three/xr'
import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import * as THREE from 'three'

export default function ARPlacementSystem({ arModelPlaced, setArModelPlaced }) {
    const reticleRef = useRef()
    const { experienceState, experienceDispatch } = useExperienceContext()
    const { camera } = useThree()

    // Using a ref to track the latest hit matrix for placement
    const latestHitMatrix = useRef(new THREE.Matrix4())
    const hasHit = useRef(false)

    // Reset AR states when entering/exiting AR mode
    useEffect(() => {
        if (!experienceState?.ARMode) {
            // Reset logic if needed, but the session manager handles main resets
        }
    }, [experienceState?.ARMode])

    useXRHitTest((hitMatrix, hit) => {
        // If model is already placed, we don't need the reticle or hit test updates
        if (experienceState?.arModelPlaced) {
            if (reticleRef.current) reticleRef.current.visible = false
            return
        }

        // Apply matrix to reticle
        if (reticleRef.current) {
            reticleRef.current.visible = true
            reticleRef.current.position.setFromMatrixPosition(hitMatrix)
            reticleRef.current.rotation.setFromRotationMatrix(hitMatrix)
        }

        // Store latest hit
        latestHitMatrix.current.copy(hitMatrix)

        // Notify UI that a surface has been detected (show Place button)
        if (!hasHit.current) {
            hasHit.current = true
            experienceDispatch({
                type: ACTIONS_EXPERIENCE.AR_PLACEMENT_DETECTED,
                payload: true
            })
        }
    })

    // Listen for placement request
    // We'll use a side effect: when arModelPlaced becomes true in the context (triggered by UI),
    // we calculate the final pose and save it.
    // However, the UI sets the state, so we need to react to that state change or provide a method.
    // A cleaner way relies on the UI just setting a flag "REQUEST_PLACE" but we have "AR_MODEL_PLACED".

    // Actually, simpler: The UI component sets 'AR_MODEL_PLACED' to true.
    // This component sees that change, takes the *current* reticle position, calculates orientation, and sets 'SET_AR_MODEL_POSE'.

    useEffect(() => {
        if (experienceState?.arModelPlaced && experienceState?.arPlacementDetected && !experienceState?.arModelPose) {
            // Calculate Position
            const position = new THREE.Vector3()
            position.setFromMatrixPosition(latestHitMatrix.current)

            // Calculate Rotation (Face Camera, but only Y axis)
            const cameraPos = new THREE.Vector3()
            camera.getWorldPosition(cameraPos)

            // Vector from object to camera
            const direction = new THREE.Vector3().subVectors(cameraPos, position)
            direction.y = 0 // Flatten to XZ plane
            direction.normalize()

            // Calculate Y rotation
            const angleY = Math.atan2(direction.x, direction.z)

            // Create Euler rotation
            const rotation = [0, angleY, 0] // [x, y, z]

            // Dispatch Pose
            experienceDispatch({
                type: ACTIONS_EXPERIENCE.SET_AR_MODEL_POSE,
                payload: {
                    position: [position.x, position.y, position.z],
                    rotation: rotation
                }
            })

            // Hide reticle
            if (reticleRef.current) reticleRef.current.visible = false
        }
    }, [experienceState?.arModelPlaced, experienceDispatch, camera, experienceState?.arPlacementDetected, experienceState?.arModelPose])

    // Only run this system in AR Mode and Model Mode
    if (!experienceState?.ARMode || !experienceState?.modelMode) return null

    return (
        <mesh ref={reticleRef} rotation-x={-Math.PI / 2} visible={false}>
            <ringGeometry args={[0.1, 0.25, 32]} />
            <meshStandardMaterial color="white" />
        </mesh>
    )
}
