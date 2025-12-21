'use client'
import React, { Suspense } from 'react'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import { useLoader } from '@react-three/fiber'

function GLTFModel({ path }) {
    const model = useLoader(GLTFLoader, path.url, (loader) => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)
    })

    // Safety check for model
    if (!model?.scene) {
        console.warn('ExperienceGLTFLoader: No scene found in model:', path.url)
        return null
    }

    return (
        <group name={path?.name || 'unnamed-model'}>
            <primitive object={model.scene}/>
        </group>
    )
}

export default function ExperienceGLTFLoader({path,name}) {
    // console.log('ExpWorldObj ExpWorldGltfLoader -',name)

    // Safety check for path
    if (!path?.url) {
        console.warn('ExperienceGLTFLoader: No valid path.url provided:', path)
        return null
    }

    return (
        <Suspense fallback={
            <mesh
                name={name || ''}
            >
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial 
                    color="gray" 
                    transparent opacity={0.3} 
                />
            </mesh>
        }>
            <GLTFModel path={path} />
        </Suspense>
    )
}