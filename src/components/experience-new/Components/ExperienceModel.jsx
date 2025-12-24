'use client'
import React, { useEffect, useRef, useState } from 'react'
import ExperienceGLTFLoader from './ExperienceGLTFLoader'
import { useThree } from '@react-three/fiber'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import * as THREE from 'three'

export default function ExperienceModel({ data }) {
    const { experienceState } = useExperienceContext()
    const { scene } = useThree()
    const [updateHideLevelState, setUpdateHideLevelState] = useState(false)
    const [updatedObjectsList, setUpdateObjectList] = useState(data?.hideLevel || [])
    const ref = useRef()
    const refBase = useRef()

    useEffect(() => {
        if (!ref.current) return

        // Standard Web Mode Position
        if (data?.position && !experienceState?.ARMode) {
            const [x, y, z] = data.position.split(',').map(Number)
            // console.log(x,y,z)
            // console.log(data?.position)
            ref.current.position.set(x, y, z)
            ref.current.rotation.set(0, 0, 0) // Reset rotation in non-AR
            ref.current.visible = true
        }

        // AR Mode Position
        if (experienceState?.ARMode) {
            if (experienceState?.arModelPlaced && experienceState?.arModelPose) {
                // Apply AR Pose
                const { position, rotation } = experienceState.arModelPose
                ref.current.position.set(...position)
                ref.current.rotation.set(...rotation)
                ref.current.visible = true
            } else {
                // Hide model until placed
                ref.current.visible = false
            }
        }
    }, [data?.position, experienceState?.ARMode, experienceState?.arModelPlaced, experienceState?.arModelPose])

    useEffect(() => {
        if (!experienceState?.hidelevel) return

        const { reset, nameOfObject, visible } = experienceState.hidelevel

        // Handle reset - make all hideLevel objects visible
        if (reset) {
            data?.hideLevel?.forEach(i => {
                const obj = scene.getObjectByName(i.name)
                if (obj) {
                    obj.visible = true
                }
            })
            return
        }

        // Handle individual object visibility toggle
        if (nameOfObject) {
            const objectMatch = scene.getObjectByName(nameOfObject)
            if (objectMatch) {
                objectMatch.visible = visible
                setUpdateHideLevelState(prev => !prev)
            } else {
                console.log(`ExperienceModel: object "${nameOfObject}" not found in scene`)
            }
        }
    }, [experienceState?.hidelevel, data?.hideLevel, scene])

    // Handle material color change from ColorChangeUI
    useEffect(() => {
        if (!experienceState?.materialColorChange) return

        const { materialProperty, color } = experienceState.materialColorChange
        if (!materialProperty || !color) return

        // console.log('ExperienceModel: Attempting material color change:', { materialProperty, color })

        let foundMaterial = false
        // Traverse the scene to find materials with matching name
        scene.traverse((object) => {
            if (object.isMesh && object.material) {
                // Handle both single material and material array
                const materials = Array.isArray(object.material) ? object.material : [object.material]
                materials.forEach((material) => {
                    // Log all material names for debugging
                    if (material.name) {
                        console.log('ExperienceModel: Found material:', material.name)
                    }
                    if (material.name === materialProperty) {
                        console.log('ExperienceModel: Matched material, applying color:', color)
                        material.color = new THREE.Color(color)
                        material.needsUpdate = true
                        foundMaterial = true
                    }
                })
            }
        })

        if (!foundMaterial) {
            console.warn('ExperienceModel: No material found with name:', materialProperty)
        }
    }, [experienceState?.materialColorChange, scene])

    // console.log('experienceModel',ref?.current)

    return (
        <group
            ref={ref}
        >
            {data?.supportFiles?.map((i, index) =>
                <group key={index} name={i?.name}>
                    <ExperienceGLTFLoader path={i} />
                </group>
            )}
            {data?.hideLevel?.map((i, index) =>
                <group key={index} name={i?.name}>
                    <ExperienceGLTFLoader path={i} />
                </group>
            )}
            {data?.modelsFiles?.map((i, index) =>
                <group key={index} name={i?.name}>
                    <ExperienceGLTFLoader path={i} />
                </group>
            )}
            {/* <group name={'snapPoints'}>
                {data?.roomSnaps?.map((i, index) =>
                    <ExperienceGLTFLoader key={index} path={i} name={i?.name} />
                )}
            </group> */}
        </group>
    )
}
