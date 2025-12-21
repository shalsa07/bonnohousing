'use client'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useState } from 'react'
import ExperienceModel from './ExperienceModel'
import ExpereinceControls from './ExpereinceControls'
import LoadingComponent from '../../LoadingComponent'
import { createXRStore, useXR, XR, XRDomOverlay } from '@react-three/xr'
import Experience360s from './Experience360s'
import ExperienceLighting from './ExperienceLighting'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import ExperienceLoader from './ExperienceLoader'
import ExperienceUIAR from '../experience-ui/ExperienceUIAR'
import ARPlacementSystem from './ARPlacementSystem'
import XRSessionManager from './XRSessionManager'

export default function ExperienceWrapper({ data, store }) {
    const { experienceState, experienceDispatch } = useExperienceContext()

    const [ARStatus, setARStatus] = useState({})
    const enterArMode = (params) => {

    }

    // console.log('ExperienceWrapper:',experienceState?.ARMode)

    // Don't render XR components during SSR
    if (!store) {
        return (
            <Canvas>
                <Suspense fallback={<ExperienceLoader />}>
                    <ExperienceLighting />
                    {experienceState?.modelMode && <ExperienceModel data={data} />}
                    {experienceState?._360Mode && <Experience360s data={data} />}
                    <ExpereinceControls data={data} />
                </Suspense>
            </Canvas>
        )
    }

    return (
        <Canvas>
            <Suspense
                fallback={<ExperienceLoader />}
            >
                <XR store={store}>
                    <XRSessionManager setARStatus={setARStatus} />
                    <ARPlacementSystem />
                    <ExperienceLighting />
                    {experienceState?.modelMode && <ExperienceModel data={data} />}
                    {experienceState?._360Mode && <Experience360s data={data} />}
                    <ExpereinceControls data={data} />
                    <XRDomOverlay>
                        <ExperienceUIAR experienceDispatch={experienceDispatch} experienceState={experienceState} ARStatus={ARStatus} store={store} data={data} />
                    </XRDomOverlay>
                </XR>
            </Suspense>
        </Canvas>
    )
}