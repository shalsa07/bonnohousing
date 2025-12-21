'use client'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { degToRad } from 'three/src/math/MathUtils'
import * as THREE from 'three'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'

export default function ExperienceControls({data}) {
  const {experienceState,experienceDispatch}=useExperienceContext()
  const {scene}=useThree()
  const refControls=useRef(null)

  useEffect(() => {
    if(experienceState?.snapPoint=='reset'){
      refControls.current.target=new THREE.Vector3()
      experienceDispatch({type:ACTIONS_EXPERIENCE.MODEL_VIEW})
    }else{
      scene.getObjectByName(experienceState?.snapPoint).traverse(i=>{
        if(i?.isMesh){
          if(i?.position && i?.rotation && refControls.current) {
            const modelPositiomRelativeToScene=i?.getWorldPosition(new THREE.Vector3())
            const modelRoationRelativeToScene=i?.getWorldQuaternion(new THREE.Quaternion())

            if(modelPositiomRelativeToScene && modelRoationRelativeToScene){
              refControls.current.target=modelPositiomRelativeToScene
              refControls.current.object.quaternion.copy(modelRoationRelativeToScene)
            }
          }else{
            console.log('snapPoint Object not yet location or present')
          }
        }
      })
    }
  }, [experienceState?.snapPoint])

  return (
    <OrbitControls
      ref={refControls}
      enablePan={false}
      minDistance={experienceState?.firstPersonView ? 0 : data?.minDistance}
      maxDistance={experienceState?.firstPersonView ? 0.5 : data?.maxDistance}
      maxPolarAngle={degToRad(90)}
      minPolarAngle={degToRad(0)}
    />
  )
}