'use client'
import React, { useEffect, useRef, useState } from 'react'
import ExperienceGLTFLoader from './ExperienceGLTFLoader'
import { useThree } from '@react-three/fiber'
import GUI from 'lil-gui'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import * as THREE from 'three'

export default function ExperienceModel({data}) {
    const {experienceState}=useExperienceContext()
    const {scene}=useThree()
    const [updateHideLevelState, setUpdateHideLevelState]=useState(false)
    const [updatedObjectsList, setUpdateObjectList]=useState(data?.hideLevel || [])
    const ref = useRef()

    useEffect(() => {
        const gui = new GUI()
        gui.add(ref.current.position, 'x', -100,100)
        gui.add(ref.current.position, 'y', -100,100)
        gui.add(ref.current.position, 'z', -100,100)
        
        return () => {
            gui.destroy()
        }
    }, [])

    useEffect(() => {
        if (data?.position) {
            const [x, y, z] = data.position.split(',').map(Number)
            ref.current.position.set(x, y, z)
        }
    }, [data?.position])

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
                console.log(`ExperienceModelEdit: object "${nameOfObject}" not found in scene`)
            }
        }
    }, [experienceState?.hidelevel, data?.hideLevel, scene])

    // Handle material color change from ColorChangeUI
    useEffect(() => {
        if (!experienceState?.materialColorChange) return

        const { materialProperty, color } = experienceState.materialColorChange
        if (!materialProperty || !color) return

        // Traverse the scene to find materials with matching name
        scene.traverse((object) => {
            if (object.isMesh && object.material) {
                const materials = Array.isArray(object.material) ? object.material : [object.material]
                materials.forEach((material) => {
                    if (material.name === materialProperty) {
                        material.color = new THREE.Color(color)
                        material.needsUpdate = true
                    }
                })
            }
        })
    }, [experienceState?.materialColorChange, scene])

  return (
    <group 
        ref={ref}
    >
        {data?.supportFiles?.map((i,index)=>
            <group key={index} name={i?.name}>
                <ExperienceGLTFLoader path={i}/>
            </group>
        )}
        {data?.hideLevel?.map((i,index)=>
            <group key={index} name={i?.name}>
                <ExperienceGLTFLoader path={i}/>
            </group>
        )}
        {data?.modelsFiles?.map((i,index)=>
            <group key={index}  name={i?.name}>
                <ExperienceGLTFLoader path={i}/>
            </group>
        )}
        <group name={'snapPoints'}>
            {data?.roomSnaps?.map((i,index)=>
                <ExperienceGLTFLoader key={index} path={i} name={i?.name}/>
            )}
        </group>
    </group>
  )
}
