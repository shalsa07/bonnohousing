'use client'
import React, { useState } from 'react'
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'

export default function ExperienceUIAR({
    data,options,styleTopCss,styleCss,styleBtnCss,setExpandContainer,expandContainer,activeBtnIndex,handleHideLevelClick,handleSnapPoint,handleModeClick,experienceState,experienceDispatch, handleModelScale, handleRotationZ,scaleModel,rotationZ,scaleModels,handleARModeClick,activate
}) {

    const [objectHiddenState,setObjectHiddenState]=useState(false)
    const [levelList,setLevelList]=useState(data?.hideLevel || [])
    const [levelListUpdate,setLevelListUpdate]=useState([])

    // console.log('ExperienceUIAR:',scaleModel)

  return (
    <>
        {/* 3D OPTIONS BUTTONS */}
        <div className='flex absolute top-0 left-0 w-full h-fit items-center justify-center'>
            <div className='btn-options flex absolute gap-1 z-20 mx-auto top-20 w-fit rounded-full h-fit bg-black/75 items-center justify-center p-1 text-white'>
                {options?.map((i,index)=>
                    <div 
                        onClick={()=>handleModeClick(index)} 
                        className={styleBtnCss} key={index} 
                        style={{backgroundColor:activeBtnIndex==index ? 'gray' : 'black'}}
                    >
                        <span className='text-nowrap'>{i}</span>
                    </div>
                )}
            </div>
        </div>



        {/* AR OPTIONS BUTTONS */}
        <div className='btn-options flex absolute gap-1 z-20 right-4 top-20 w-fit rounded-full h-fit bg-black/75 items-center justify-center p-1 text-white'>
            <div 
                onClick={()=>handleARModeClick()} 
                className={`px-2 ${styleBtnCss}`} 
                style={{backgroundColor:activate ? 'red' : 'black'}}
            >
                <span className='text-nowrap'>AR</span>
                {activate}
            </div>
        </div>

        {/* VIEWS BUTTONS */}
        {experienceState?.modelMode && 
            <div className={`btns-left-container flex flex-col translate-y-1/2 top-16 gap-2 absolute z-20 my-auto left-2 md:left-2 h-fit ${expandContainer ? 'w-32' : 'w-16'} bg-black/75 rounded-3xl p-1 duration-300 ease-linear`}>
                <div className='flex flex-col gap-2 w-full h-full relative'>
                    {/* EXPAND TOGGLE BUTTON */}
                    <div onClick={()=>setExpandContainer(!expandContainer)} className='flex absolute bg-gray-300 rounded-full items-center justify-center my-auto top-0 bottom-0 -right-5 w-8 h-8 text-gray-500/75 cursor-pointer'>
                        {expandContainer ? <FaAngleLeft/> : <FaAngleRight/>}
                    </div>

                    {/* 360s BUTTONS */}
                    {data?._360sImages?.length>0 && experienceState?._360Mode && <div className={styleCss}>
                        {data?._360sImages?.map((i,index)=>
                            <div onClick={()=>handleHideLevelClick(i?.name)} className={style360BtnCss} key={index}>
                                {!expandContainer ? <div className='h-full w-full overflow-hidden'>
                                    <span className='truncate absolute z-10 m-auto text-xs text-center text-nowrap overflow-hidden'>{i?.name}</span>
                                    <img className='w-full h-full' src={i?.url} alt="" />
                                </div> : <div className='h-full w-full overflow-hidden'>
                                    <img className='w-full h-full' src={i?.url} alt="" />
                                    <span className='absolute z-10 m-auto text-xs text-center'>
                                        {i?.name}
                                    </span>
                                </div>}
                            </div>
                        )}
                    </div>}

                    {/* LEVEL HIDE BUTTONS */}
                    {data?.hideLevel?.length>0 && (experienceState?.ARMode || experienceState?.modelMode) && <div className={styleCss}>
                        {data?.hideLevel?.map((i,index)=>
                            <div onClick={()=>handleHideLevelClick(i?.name)} className={styleBtnCss} key={index}>
                                {!expandContainer ? <span className='truncate text-nowrap overflow-hidden'>{i?.name}</span> : <span className='text-center'>{i?.name}</span>}
                            </div>
                        )}
                    </div>}

                    {/* VIEWS BUTTONS */}
                    {data?.roomSnaps?.length>0 && (experienceState?.ARMode || experienceState?.modelMode) && <div className={styleCss}>
                        <div onClick={()=>handleSnapPoint('reset')} className={styleBtnCss}>
                            home
                        </div>
                        {data?.roomSnaps?.map((i,index)=>
                            <div onClick={()=>handleSnapPoint(i?.name)} className={styleBtnCss} key={index}>
                                {!expandContainer ? <span className='truncate text-nowrap overflow-hidden'>{i?.name}</span> : <span className='text-center'>{i?.name}</span>}
                            </div>
                        )}
                    </div>}

                    {/* COLOR BUTTONS */}
                    {data?.color?.length>0 && (experienceState?.ARMode || experienceState?.modelMode) && <div className={styleCss}>
                        {data?.color?.map((i,index)=>
                            <div className={styleBtnCss} key={index}>
                                {!expandContainer ? <span className='truncate text-nowrap overflow-hidden'>{i?.name}</span> : <span className='text-center'>{i?.name}</span>}
                            </div>
                        )}
                    </div>}
                </div>
            </div>
        }

         {/* VIEWS ROTATE AND SCALING BUTTONS */}
         {experienceState?.ARMode && experienceState?.modelMode && <div className='flex gap-2 p-1 absolute bottom-10 text-white left-0 right-0 mx-auto w-fit h-fit items-center justify-center bg-slate-900/75 rounded-3xl shadow'>
            <div className='flex flex-col'>
                <div className={`btn-wrapper flex flex-col max-h-16 rounded-2xl w-full bg-slate-900/35 border-slate-400 border-2 items-center justify-center p-1 text-white gap-1 select-none`}>
                    <label 
                        name="rotation"
                        className={`'btn-wrapper flex px-1 text-sm capitalize h-fit rounded-xl w-full bg-slate-500/50 items-center justify-center p-1 text-white gap-2 shadow'`}
                    >model-scale : ({scaleModel*100}%)</label>
                    {/* >model-scale : ({scaleModel[0]*100}%)</label> */}
                    <select
                        className='text-sm'
                        onChange={(e)=>handleModelScale(e.target.value)}
                        value={scaleModel}
                    >
                        {scaleModels?.map((i,index)=><option key={index} value={scaleModels[index]}>{scaleModels[index]*100}%</option>)}
                    </select> 
                </div>
            </div>
            <div className='flex flex-col'>
                <div className={`btn-wrapper flex flex-col max-h-16 rounded-2xl w-full bg-slate-900/35 border-slate-400 border-2 items-center justify-center p-1 text-white gap-1 select-none`}>
                    <label 
                        name="rotation"
                        className={`'btn-wrapper flex px-1 text-sm capitalize h-fit rounded-xl w-full bg-slate-500/50 items-center justify-center p-1 text-white gap-2 shadow'`}
                    >rotation ({rotationZ}):</label>
                    <input 
                        className='w-full h-10' 
                        type="range" 
                        id="rotation" 
                        name="rotation" 
                        min="0" 
                        max="360"
                        value={rotationZ}
                        onChange={(e)=>handleRotationZ(e.target.value)}
                    />
                </div>
            </div>
         </div>}
    </>
  )
}