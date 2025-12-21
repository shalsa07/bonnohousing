'use client'
import React, { useEffect, useState } from 'react'
import ExperienceUI from '@/components/experience/ExperienceUI'
import dynamic from 'next/dynamic'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { set } from 'mongoose'

const ExperienceWrapper=dynamic(() => import('@/components/experience/ExperienceWrapper'))

async function getData(id) {
  const res = await fetch(`${url}/${id}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default function ExperienceWorld({data}) {
    const [expandContainer,setExpandContainer]=useState(false)
    const {experienceState,experienceDispatch}=useExperienceContext()
    const [activeBtnIndex,setActiveBtnIndex]=useState(0)
    const [objectHiddenState,setObjectHiddenState]=useState([])
    const [levelList,setLevelList]=useState(data?.hideLevel || [])
    const [rotationZ,setRotationZ]=useState(0)
    const [scaleModel,setScaleModel]=useState(1)
    const [activate,setActivate]=useState(false)
    const [arSupported,setARSupported]=useState(false)
    const [virtaulizationState,setVirtaulizationState]=useState(false)
    const [leftUiClose,setLeftUiClose]=useState(false)
    const [levelActive,setLevelActive]=useState(false)

    const scaleModels=[1,0.40,0.15]
    const options=['vr','ar']
    const styleTopCss='btn-wrapper flex h-fit rounded-xl w-full bg-slate-500/50 items-center justify-center p-1 text-white gap-2 shadow'
    const styleCss='btn-wrapper flex flex-col h-fit rounded-3xl w-full bg-slate-400/35 items-center justify-center p-1 text-white gap-1 select-none'
    const styleBtnCss=`flex relative cursor-pointer items-center justify-center select-none border-2 border-gray-400 p-1 bg-slate-900/75 ${expandContainer ? 'text-xs' : 'text-sm'} shadow text-sm capitalize rounded-full cursor-pointer w-full min-h-10`
    const style360BtnCss=`flex relative cursor-pointer items-center justify-center select-none border-2 border-gray-400 bg-slate-900/75 ${expandContainer ? 'text-xs' : 'text-sm'} shadow capitalize rounded-full cursor-pointer w-full min-h-10  overflow-hidden`

    useEffect(() => {
      setLevelList(data?.hideLevel || []);
    }, [data?.hideLevel]);

    const handleModeClick=(index)=>{
        // console.log('handleModeClick',index)
        setActiveBtnIndex(index)
        index==0 && experienceDispatch({type:ACTIONS_EXPERIENCE._360_VIEW})
        index==1 && experienceDispatch({type:ACTIONS_EXPERIENCE.MODEL_VIEW})
        // index==2 && experienceDispatch({type:ACTIONS_EXPERIENCE.AR_VIEW})
    }

    const handleARModeClick=(index)=>{
        // console.log('handleModeClick',index)
        setActivate(!activate)
        experienceDispatch({type:ACTIONS_EXPERIENCE.AR_VIEW})
        setVirtaulizationState(!virtaulizationState)
    }

    const handleModelScale = (value) => {
      setScaleModel(value)
    }

    const handleRotationZ = (value) => {
      setRotationZ(value)
    }

    const handle360Click = (value) => {
    //   console.log('handle360Click',value)
      experienceDispatch({type:ACTIONS_EXPERIENCE._360_NAME,payload:value})
      experienceDispatch({type:ACTIONS_EXPERIENCE._360_VIEW})
    }

    async function checkForARSupport() {
        // 1. Check if the WebXR API is present in the browser's navigator object.
        if (!navigator.xr) {
            console.log("WebXR API is not available on this browser.");
            return false;
        }

        try {
            // 2. Check if the device supports an 'immersive-ar' session.
            const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
            return isARSupported;
        } catch (error) {
            console.error("An error occurred while checking for AR support:", error);
            return false;
        }
    }

    const hideStateList = () => {
      setObjectHiddenState(objectHiddenState?.length<2 ? [...objectHiddenState,experienceState] : [])
    }
    

    useEffect(()=>hideStateList(),[experienceState?.hideLevel?.nameOfObject])
    
    const handleHideLevelClick = (name,condition) => {
        // console.log(levelList)
        // const filteredByName = levelList?.filter(i => i?.name === name);
    
        // if (filteredByName.length > 0) {
        //     let highestPriorityItem = filteredByName[0];
        //     for (let i = 1; i < filteredByName.length; i++) {
        //         if (filteredByName[i].priority > highestPriorityItem.priority) {
        //             highestPriorityItem = filteredByName[i];
        //         }
        //     }
    
        //     setLevelList(prev => prev.filter(i => i !== highestPriorityItem));
        //     experienceDispatch({type: ACTIONS_EXPERIENCE.HIDE_LEVEL, payload: {nameOfObject: highestPriorityItem?.name, visible: false, reset: false}});
        // } 
        // else if (levelList?.length === 0) {
        //     setLevelList(data?.hideLevel);
        //     experienceDispatch({type: ACTIONS_EXPERIENCE.HIDE_LEVEL, payload: {reset: true}});
        // }
        // console.log('handleModeClick',name)
        // console.log('handleModeClick',experienceState)
        const priorityList=[]
        levelList?.map(i=>priorityList?.push(i?.priority))
        if(!Array.isArray(priorityList)) {
            new Error("Input must be an array");
        }
        // console.log('handleHideLevelClick match',levelList)
        const lowestPriorityValue=Math.min(...priorityList)
        const matchBasedOnSelection=levelList?.find(i=>i?.name==name)
        // console.log('handleHideLevelClick match',matchBasedOnSelection?.priority)
        if(matchBasedOnSelection?.priority==lowestPriorityValue){
            // console.log('adjust the list')
            // console.log('object to hide:',matchBasedOnSelection)
            setLevelList(prev=>prev.filter(i=>i?.name!==matchBasedOnSelection?.name))
            experienceDispatch({type:ACTIONS_EXPERIENCE.HIDE_LEVEL,payload:{nameOfObject:matchBasedOnSelection?.name,visible:false,reset:false}})
            // console.log('updated the list:',levelList)
            // setObjectHiddenState(!objectHiddenState)
        }
        else if(levelList?.length==0){
            // console.log('there nothing to hide, reset')
            setLevelList(data?.hideLevel)
            experienceDispatch({type:ACTIONS_EXPERIENCE.HIDE_LEVEL,payload:{reset:true}})
        }
        else{
            console.log('lowestPriorityValue doesnt macthes object')
        }
    };

    const handleSnapPoint=(snapPoint)=>{
        // console.log('handleSnapPoint:',snapPoint)
        experienceDispatch({type:ACTIONS_EXPERIENCE.SNAPPOINT,payload:snapPoint})
    }

    useEffect(()=>{
        checkForARSupport().then(res=>setARSupported(res))
    },[])

    // console.log(objectHiddenState?.length)

    return (
        <>
            {/* <div className='flex relative h-svh w-full items-center justify-center overflow-hidden'> */}
                <ExperienceWrapper 
                    options={options} 
                    styleBtnCss={styleBtnCss} 
                    data={data}
                    handleModeClick={handleModeClick}
                    activeBtnIndex={activeBtnIndex}
                    styleTopCss={styleTopCss} 
                    styleCss={styleCss} 
                    setExpandContainer={setExpandContainer}
                    expandContainer={expandContainer}
                    handleHideLevelClick={handleHideLevelClick}
                    handleSnapPoint={handleSnapPoint}
                    rotationZ={rotationZ}
                    scaleModel={scaleModel}
                    handleModelScale={handleModelScale}
                    handleRotationZ={handleRotationZ}
                    scaleModels={scaleModels}
                    handleARModeClick={handleARModeClick}
                    activate={activate}
                    style360BtnCss={style360BtnCss}
                    arSupported={arSupported}
                    handle360Click={handle360Click}
                />
                <ExperienceUI 
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
                    handleARModeClick={handleARModeClick}
                    activate={activate}
                    style360BtnCss={style360BtnCss}
                    arSupported={arSupported}
                    virtaulizationState={virtaulizationState}
                    handle360Click={handle360Click}
                    leftUiClose={leftUiClose}
                    setLeftUiClose={setLeftUiClose}
                    levelActive={levelActive}
                />
            {/* </div> */}
        </>
    )
}