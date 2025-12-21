'use client'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect, useState } from 'react'
import ExperienceModel from './ExperienceModel'
import ExperienceControls from './ExperienceControls'
import LoadingComponent from '../LoadingComponent'
import { createXRStore, XR, XRDomOverlay } from '@react-three/xr'
import Experience360s from './Experience360s'
import ExperienceLighting from './ExperienceLighting'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import ExperienceLoader from './ExperienceLoader'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import ExperienceUIAR from './ExperienceUIAR'
import { degToRad } from 'three/src/math/MathUtils'

export default function ExperienceWrapper({
    data, options, styleBtnCss, activeBtnIndex, handleModeClick,styleTopCss,styleCss,setExpandContainer,expandContainer,handleHideLevelClick,handleSnapPoint,
    rotationZ, scaleModel, scaleModels, handleModelScale,handleRotationZ,handleARModeClick,activate,style360BtnCss,handle360Click
}) {
    const [store] = useState(() => createXRStore())
    const {experienceState,experienceDispatch}=useExperienceContext()
 
    useEffect(() => {
        const handleARMode = async () => {
            const session = store.getState().session;
            try {
                if (experienceState?.ARMode) {
                    if (!session) {
                        console.log('Entering AR mode');
                        await store.enterAR();
                    }
                } else {
                    if (session) {
                        console.log('Exiting AR mode');
                        await session.end();
                    }
                }
            } catch (error) {
                console.error('Failed to toggle AR mode:', error);
            }
        }

        handleARMode()
    }, [experienceState?.ARMode, store])

    // console.log('ExperienceWrapper:',data?.arPosition,experienceState?.ARMode)

  return (
    <div className='w-full h-screen'>
        <Canvas>
            <Suspense 
                fallback={<ExperienceLoader/>}
            >
                <XR store={store}>
                    {experienceState.ARMode && (
                        <XRDomOverlay>
                            {/* 3D OPTIONS BUTTONS */}
                            <ExperienceUIAR
                                data={data}
                                options={options}
                                styleTopCss={styleTopCss} 
                                styleCss={styleCss} 
                                styleBtnCss={styleBtnCss} 
                                setExpandContainer={setExpandContainer}
                                expandContainer={expandContainer}
                                activeBtnIndex={activeBtnIndex}
                                handleHideLevelClick={handleHideLevelClick}
                                handleSnapPoint={handleSnapPoint}
                                handleModeClick={handleModeClick}
                                experienceState={experienceState}
                                experienceDispatch={experienceDispatch}
                                scaleModel={scaleModel}
                                scaleModels={scaleModels}
                                rotationZ={rotationZ}
                                handleModelScale={handleModelScale}
                                handleRotationZ={handleRotationZ}
                                handleARModeClick={handleARModeClick}
                                activate={activate}
                                style360BtnCss={style360BtnCss}
                            />
                        </XRDomOverlay>
                    )}
                    <ExperienceLighting/>
                    {(experienceState.modelMode || experienceState.ARMode) && <group
                        scale={experienceState.ARMode ? [scaleModel, scaleModel, scaleModel] : [1, 1, 1]}
                        rotation-y={experienceState.ARMode ? degToRad(rotationZ) : 0}
                        position={experienceState.ARMode ? [0, -1, -20] : [0, 0, 0]}
                    >
                        <ExperienceModel data={data} />
                    </group>}
                    {experienceState?._360Mode && <Experience360s 
                        experienceState={experienceState} 
                        data={data}
                    />}
                    {!experienceState?.ARMode && <ExperienceControls 
                        data={data}
                    />}
                </XR>
            </Suspense>
        </Canvas>
    </div>
  )
}