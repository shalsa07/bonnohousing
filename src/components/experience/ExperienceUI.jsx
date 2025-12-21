'use client'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { settings } from '@/libs/settings';
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from "react-icons/fa6";
import Image from 'next/image';
import OnOffStateWrapper from '../OnOffStateWrapper';
import ExperienceInfoWrapper from './ExperienceInfoWrapper';
import ExperienceSummaryWrapper from './ExperienceSummaryWrapper';
import { useRouter } from 'next/navigation';
import RollOverStateWrapper from '../RollOverStateWrapper';
import { GoChevronLeft } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import OnOffStateWrapper2 from '../OnOffStateWrapper2';
import RollOverStateWrapper2 from '../RollOverStateWrapper2';
import SignInBtn2 from '../SignInBtn2';
import OnOffStateWrapper3 from '../OnOffStateWrapper3';

const LeftUIWrapper = ({children}) => {
  return(
    <div className='flex flex-col gap-1 h-full w-48 overflow-y-auto'>
        <div className='flex flex-col h-fit gap-1 overflow-y-auto'>
            <div className='flex flex-col h-fit gap-1 overflow-y-auto'>
                {children}
            </div>
        </div>
    </div>
  )
}

const ViewModeButtons = ({ options }) => {
  const { experienceState, experienceDispatch } = useExperienceContext();

  return (
    <div className="middle-btn-ui flex flex-col absolute z-10 mx-auto top-12 left-0 right-0 w-fit h-fit items-center justify-center text-white">
      <div className='flex uppercase rounded-full overflow-hidden items-center justify-center w-fit h-fit'>
        {options?.map((i, index) => (
          <div className="flex w-fit h-fit items-center justify-center" key={index}>
            {index === 0 ? (
              <OnOffStateWrapper
                state={experienceState?.modelMode || experienceState?._360Mode}
                src={settings.btnsImages.btnVR}
              />
            ) : (
              <OnOffStateWrapper
                state={experienceState?.ARMode}
                src={settings.btnsImages.btnAR}
              />
            )}
          </div>
        ))}
      </div>
      <div className='select-none text-4xl font-extralight md:py-2'>
        {experienceState?.modelMode && 'MODEL'}
        {experienceState?._360Mode && '360s'}
      </div>
      <div className='flex items-center'>
        <div onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE._360_VIEW })}>
          <OnOffStateWrapper
            state={experienceState?._360Mode}
            src={settings.btnsImages.btn360}
          />
        </div>
        <div onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.MODEL_VIEW })}>
          <OnOffStateWrapper
            state={experienceState?.modelMode}
            src={settings.btnsImages.btnModel}
          />
        </div>
        <div onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.MODEL_VIEW })}>
          <OnOffStateWrapper
            src={settings.btnsImages.btnDesign}
            state={experienceState?.popupMode}
          />
        </div>
      </div>
      <span className='flex w-2/3 text-center text-xs flex-wrap'>
        Press and drag with your mouse or finger to rotate the model
      </span>
    </div>
  );
};

const RightPanel = ({ data, options }) => {
  const { closeBtnState, setCloseBtnState } = useExperienceContext();

  return (
    <div className={`right-btn-ui fixed ease-linear duration-300 flex overflow-y-auto z-[500] right-0 top-0 h-full ${closeBtnState ? 'w-0' : 'md:w-fit w-full'} bg-slate-600/85 flex-col text-white`}>
      <div className="flex sticky top-2 left-0 z-10 mt-2 justify-start">
        {!closeBtnState && <RollOverStateWrapper2 src={settings.btnsImages.btnClose} ftn={() => setCloseBtnState(!closeBtnState)} />}
      </div>
      <div className='flex relative flex-col top-2 h-fit items-center md:px-[80px] px-[10px]'>
        <div className='flex flex-col w-[340px]'>
          <h1 className='md:mt-4 mt-0 text-3xl uppercase'>
            {data?.buildingTitle}
          </h1>
          <ExperienceSummaryWrapper data={data} options={options} />
          <ExperienceInfoWrapper data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

const LeftPanel = ({ data, handle360Click, handleHideLevelClick, handleSnapPoint }) => {
  const { experienceState } = useExperienceContext();
  const router = useRouter();

  return (
    <div className="left-btn-ui flex flex-col gap-1 absolute z-10 top-1/3 left-0 items-end h-fit md:w-32 w-24 duration-300 ease-linear">
      <div className='flex font-bold relative gap-1 flex-col w-full h-full'>
        <div className='flex text-gray-500 md:h-16 h-12 items-center justify-end w-full'>
          <div onClick={() => router.back()} className='flex items-center justify-center md:w-16 w-12 h-full cursor-pointer bg-white p-[1.25px]'>
            <div className='flex items-center justify-center w-20 h-full -border-[1.5px] border-gray-500 '>
              <GoChevronLeft className='text-4xl' />
            </div>
          </div>
        </div>
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default function ExperienceUI({
    data,options,styleTopCss,styleCss,styleBtnCss,setExpandContainer,expandContainer,activeBtnIndex,handleHideLevelClick,handleSnapPoint,handleModeClick,handleARModeClick,activate,style360BtnCss,arSupported,virtaulizationState,handle360Click,levelActive
}) {
    const {experienceState,experienceDispatch,closeBtnState,setCloseBtnState}=useExperienceContext()

    if (experienceState.ARMode) {
        return null
    }

    const router=useRouter()
    const [objectHiddenState,setObjectHiddenState]=useState(false)
    const [levelList,setLevelList]=useState(data?.hideLevel || [])
    const [levelListUpdate,setLevelListUpdate]=useState([])
    const [hideLevelStatus,setHideLevelStatus]=useState(false)
    const [active360,setActive360]=useState(false)
    const cssOnOffBtn=`flex h-full w-8 ${hideLevelStatus ? 'bg-gray-600' : settings.luyariBlue} items-center cursor-pointer justify-center text-xs`

    // console.log('ExperienceUI:',data?._360sImages)

  return (
    <>
        {/* 3D OPTIONS BUTTONS */}
        <ViewModeButtons options={options} />

        {/* RIGHT UI */}
        <RightPanel data={data} options={options} />

        {/* LEFT UI */}
        <div className={`left-btn-ui flex flex-col gap-1 absolute z-10 top-1/3 left-0 items-end h-fit md:w-32 w-24 duration-500 ease-linear`}>
            <div className='flex font-bold relative gap-1 flex-col w-full h-full'>
                <div className='flex text-gray-500 md:h-16 h-12 items-center justify-end w-full'>
                    <div onClick={()=>router.back()} className='flex items-center justify-center md:w-16 w-12 h-full cursor-pointer bg-white p-[1.25px]'>
                        <div className='flex items-center justify-center w-20 h-full -border-[1.5px] border-gray-500 '>
                            <GoChevronLeft className='text-4xl'/>
                        </div>
                    </div>
                </div>

                {/* left menu ui */}
                {data?.renders?.[0]?.url?.length>0 &&<div className='flex relative w-full h-20 items-center justify-center'>
                    <Image src={data?.renders?.[0]?.url} alt='' fill/>
                </div>}

                {experienceState?._360Mode 
                  ? <div className='flex flex-col gap-1 relative text-gray-500 items-center ease-linear duration-300 justify-center w-full h-fit uppercase text-xs'>
                      {/* LEVEL 360 BUTTONS */}
                      {data?._360sImages?.length>0 && 
                        data?._360sImages?.map((i,index)=>
                        <div onClick={()=>handle360Click(i?.name)} className={`flex py-1 md:gap-2 gap-1 cursor-pointer w-full items-center justify-start text-gray-500 pl-1 md:pl-2 md:h-12 h-10 relative shadow ${(experienceState?._360TextureName==i?.name || active360) ? 'bg-gray-300' : 'bg-white'}`} key={index}>
                          {/* {console.log(i?.url)} */}
                          <div className='flex items-center justify-center md:w-14 w-12 relative overflow-hidden rounded-xl bg-black h-full'>
                            {/* <Image fill src={i?.url} alt="" /> */}
                            <img className='w-full h-full object-cover' src={i?.url} alt="360 image" />
                          </div>
                          <span className={`text-center md:text-xl text-base ease-linear duration-300 border-b-4 ${experienceState?._360TextureName==i?.name ? settings.luyariBlueBorder :'border-none'}`}>360</span>
                          <span className='text-center text-gray-300 md:text-xl text-base mt-3'>{index+1}</span>
                        </div>
                      )}
                    </div>
                : <LeftUIWrapper>
                    {/* LEVEL HIDE BUTTONS */}
                    <div className='flex  ease-linear duration-300 overflow-y-auto- flex-col gap-1 w-full h-fit'>
                      {data?.hideLevel?.map((i,index)=>
                        <div key={index} className='flex relative text-gray-500 items-center w-fit float-start bg-white rounded-r-full shadow h-fit uppercase text-xs'>
                          <div 
                            onClick={()=>handleHideLevelClick(i?.name,index)}
                            className='flex md:pl-4 pl-2 md:min-w-32 min-w-24 items-center  min-h-full cursor-pointer bg-white'
                          >
                            {i?.name}
                          </div>
                          <div 
                            className='flex h-fit w-full items-center -wl-10 justify-center text-xs'
                          >
                            <OnOffStateWrapper3 
                              src={settings.btnsImages.btnOn}
                              id={!experienceState?.hidelevel?.nameOfObject}
                              condition={data?.hideLevel?.[index]?.name}
                            />
                            <OnOffStateWrapper3 
                              src={settings.btnsImages.btnOff}
                              id={experienceState?.hidelevel?.nameOfObject}
                              condition={data?.hideLevel?.[index]?.name}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VIEWS BUTTONS */}
                    {data?.roomSnaps?.length>0 && <div className='flex flex-col gap-1 relative text-gray-500 items-center justify-center md:w-32 w-24 h-fit uppercase text-xs'>
                      <div onClick={()=>handleSnapPoint('reset')} className='flex cursor-pointer w-full items-center justify-start md:pl-4 pl-2 h-8 bg-white'>
                          <div className={`border-b-3 w-full text-[#] ${settings.luyariBlueBorder} ${settings.luyariTextBlue}`}>home</div>
                      </div>
                      {data?.roomSnaps?.map((i,index)=>
                        <div onClick={()=>handleSnapPoint(i?.name)} className='flex cursor-pointer w-full items-center justify-start md:pl-4 pl-2 h-8 bg-white' key={index}>
                          <span className='text-center'>{i?.name}</span>
                        </div>
                      )}
                    </div>}
                  </LeftUIWrapper>
              }
            </div>
        </div>

        {/* TITLE UI */}
        <div className={`title-wrapper flex z-20 w-fit h-fit items-center justify-center absolute md:bottom-20 bottom-20 mx-auto left-0 right-0 text-white ${experienceState?._360Mode && 'bg-gray-600/85'} p-2 z-10`}>
            {experienceState?._360Mode && <span className=' uppercase font-extralight md:text-base text-sm'>
                - {experienceState?._360TextureName?.length>0 ? experienceState?._360TextureName : data?._360sImages?.[0]?.name} -
            </span>}
        </div>

        {/* BOTTOM BTN UI */}
        <div 
            onClick={()=>setCloseBtnState(!closeBtnState)}
            className={`title-wrapper flex md:hidden w-11 h-8 rounded-t-full items-center justify-center absolute bottom-16 mx-auto left-0 right-0 bg-white text-gray-500 p-2 z-10`}
        >
            {!true ? <IoIosArrowDown className='text-4xl'/> : <IoIosArrowUp  className='text-4xl'/>}
        </div>

        {/* SIGN-IN UI */}
        {!closeBtnState && <div className={`left-wrapper top-2 absolute right-0 z-50`}>
            <SignInBtn2/>
        </div>}
    </>
  )
}