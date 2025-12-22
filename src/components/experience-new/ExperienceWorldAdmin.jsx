'use client'
import React, { useEffect, useState } from 'react'
import ExperienceWrapperAdmin from './Components/ExperienceWrapperAdmin'
import ExperienceUI from './experience-ui/ExperienceUI'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { createXRStore } from '@react-three/xr'
import ExperienceRendersDrawings from './experience-ui/ExperienceRendersDrawings'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { settingsBtns } from '@/libs/settings'
import { useLoader } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function ExperienceWorldAdmin({data}) {
  const [isSupported,setARSupported]=useState(null)
  const {experienceState,experienceDispatch}=useExperienceContext()
  const [levelList,setLevelList]=useState(data?.hideLevel)
  const [objectHiddenState,setObjectHiddenState]=useState([])
  const preloadStartedRef = React.useRef(false)
  const preloadedUrlsRef = React.useRef(new Set())
  const store = createXRStore({controller: false})
  const [autoRotateCountdown,setAutoRotateCountdown]=useState(10)
  const [autoRotateActive,setAutoRotateActive]=useState(false)

  const hideStateList = () => {
    setObjectHiddenState(objectHiddenState?.length<2 ? [...objectHiddenState,experienceState] : [])
  }

  // Reset experience state to initial values when component mounts (new model/project)
  useEffect(() => {
    experienceDispatch({type: ACTIONS_EXPERIENCE.RESET_ALL})
  }, [])

  const handle360Click = (value) => {
    //   console.log('handle360Click',value)
    experienceDispatch({type:ACTIONS_EXPERIENCE._360_NAME,payload:value})
    experienceDispatch({type:ACTIONS_EXPERIENCE._360_VIEW})
  }

  useEffect(()=>hideStateList(),[experienceState?.hideLevel?.nameOfObject])

  // Background preloading of 3D assets and images as soon as the
  // project experience mounts. This is non-blocking and relies on
  // browser / three.js caching so that when the Canvas scene asks for
  // these URLs later, they are already warmed up.
  useEffect(() => {
  if (!data || preloadStartedRef.current) return
  preloadStartedRef.current = true
  let cancelled = false

  const tasks = []

  const runGLTFPreload = (url) => {
    if (!url) return null
    // Prefer react-three-fiber's internal preload, which shares
    // cache with useLoader in ExperienceWorldModelLoader.
    if (useLoader.preload) {
    if (!preloadedUrlsRef.current.has(url)) {
      preloadedUrlsRef.current.add(url)
    }
      try {
        useLoader.preload(GLTFLoader, url, (loader) => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)
        })
      } catch (err) {
        if (!cancelled) {
        console.error('ExperienceWorld preload: GLTF failed', url, err)
        }
      }
      // useLoader.preload does not return a promise, so we just
      // return a resolved promise for our tracking array.
      return Promise.resolve()
    }
      // Fallback: manual GLTFLoader so at least the network is warmed.
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)
      return new Promise((resolve) => {
      loader.load(
        url,
        () => resolve(),
        undefined,
        (err) => {
        if (!cancelled) {
          console.error('ExperienceWorld preload: GLTF failed (fallback)', url, err)
        }
        resolve()
        },
      )
      })
    }

    const gltfItems = [
      ...(data?.modelsFiles || []),
      ...(data?.hideLevel || []),
      ...(data?.roomSnaps || []),
      ...(data?.supportFiles || []),
    ]

    gltfItems.forEach((item) => {
      const url = item?.url
      if (!url) return
      const p = runGLTFPreload(url)
      if (p) tasks.push(p)
    })

    if (typeof window !== 'undefined') {
      const prefetchImage = (url, label) => {
      if (!url) return
      try {
        const img = new window.Image()
        img.src = url
      } catch (err) {
        console.error('ExperienceWorld preload: image failed', label || '', url, err)
      }
    }

    ;(data?._360sImages || []).forEach((img) => prefetchImage(img?.url, '360'))
    ;(data?.renders || []).forEach((r) => prefetchImage(r?.url, 'render'))
      ;(data?.drawings || []).forEach((d) => prefetchImage(d?.url, 'drawing'))
      // Hero image used in left panel UI (non-AR and AR)
      ;(data?.heroImages || []).forEach((img) => prefetchImage(img?.url, 'ui-hero'))
      // UI button/icon sprites used by the experience UI components.
      if (settingsBtns?.btnsImages) {
      Object.values(settingsBtns.btnsImages).forEach((btn) => {
        if (!btn || typeof btn !== 'object') return
        prefetchImage(btn.default, 'ui-button-default')
        prefetchImage(btn.hover, 'ui-button-hover')
      })
    }
  }

  if (tasks.length > 0) {
    Promise.allSettled(tasks).catch((err) => {
    if (!cancelled) {
      console.error('ExperienceWorld preload: one or more GLTF preload tasks rejected', err)
    }
    })
  }

  return () => {
    cancelled = true
  }
  }, [data])
      
  const handleHideLevelClick = (name,condition) => {
    console.log('handleHideLevelClick',name,condition)
    const priorityList=[]
    levelList?.map(i=>priorityList?.push(i?.priority))
    if(!Array.isArray(priorityList)) {
      new Error("Input must be an array");
    }
    // If there is nothing left in the priority list, reset all levels to visible
    if(priorityList.length===0){
      const resetList=data?.hideLevel || []
      setLevelList(resetList)
      experienceDispatch({type:ACTIONS_EXPERIENCE.HIDE_LEVEL,payload:{reset:true}})
      experienceDispatch({type:ACTIONS_EXPERIENCE.HIDE_LEVEL_STATUS,payload:[]})
      return
    }
    // console.log('handleHideLevelClick match',levelList)
    const lowestPriorityValue=Math.min(...priorityList)
    const matchBasedOnSelection=levelList?.find(i=>i?.name==name)
    // console.log('handleHideLevelClick match',matchBasedOnSelection?.priority)
    if(matchBasedOnSelection?.priority==lowestPriorityValue){
      // Remove this level from the list of visible levels
      const updatedLevelList=(levelList || []).filter(i=>i?.name!==matchBasedOnSelection?.name)
      setLevelList(updatedLevelList)
      experienceDispatch({
        type:ACTIONS_EXPERIENCE.HIDE_LEVEL,
        payload:{nameOfObject:matchBasedOnSelection?.name,visible:false,reset:false}
      })
      // Compute which levels are currently hidden based on the updated list
      const hiddenNames=(data?.hideLevel || [])
        .filter(level=>!updatedLevelList.some(item=>item?.name===level?.name))
        .map(level=>level?.name)
      experienceDispatch({
        type:ACTIONS_EXPERIENCE.HIDE_LEVEL_STATUS,
        payload:hiddenNames
      })
    }
    else if(levelList?.length==0){
      // console.log('there nothing to hide, reset')
      const resetList=data?.hideLevel || []
      setLevelList(resetList)
      experienceDispatch({type:ACTIONS_EXPERIENCE.HIDE_LEVEL,payload:{reset:true}})
      experienceDispatch({type:ACTIONS_EXPERIENCE.HIDE_LEVEL_STATUS,payload:[]})
    }
    else{
      console.log('lowestPriorityValue doesnt macthes object')
    }
  };

  const handleSnapPoint=(snapPoint)=>{
    console.log('[ExperienceWorld] handleSnapPoint called:', {
      snapPoint,
      currentARMode: experienceState?.ARMode,
      current360Mode: experienceState?._360Mode,
      currentSnapPoint: experienceState?.snapPoint,
    })
    experienceDispatch({type:ACTIONS_EXPERIENCE.SNAPPOINT,payload:snapPoint})
  }

  // useEffect(()=>{
  //   const nav = window.navigator || {}
  //   const support=nav.xr.isSessionSupported('immersive-ar')
  //   console.log('ExperienceWorld useEffect:',support)
  //   // setARSupported(nav.xr.isSessionSupported('immersive-ar'))
  // },[window.navigator])

  // console.log('ExperienceWorld:',data)
  return (
    <div className='flex relative w-full h-[75vh] mt-16'>
      <ExperienceWrapperAdmin data={data} store={store}/>
      <ExperienceUI 
        handle360Click={handle360Click} 
        handleSnapPoint={handleSnapPoint} 
        data={data} 
        store={store} 
        handleHideLevelClick={handleHideLevelClick} 
        levelList={levelList}
      />
      {experienceState?.popupMode && <ExperienceRendersDrawings data={data}/>}
    </div>
  )
}
