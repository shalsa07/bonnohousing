'use client'
import { Staatliches } from 'next/font/google';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function OnOffStateWrapper2({src,ftn,state}) {
    const [isOn, setIsOn] = useState(false);

    const handleState = () => {
      setIsOn(state)
    }
    
    useEffect(()=>{
      handleState()
    },[state])

    console.log('RollOverStateWrapper:',state)
  return (
    <div 
      // onClick={() => setIsOn(!isOn)}
      className='flex w-fit h-fit items-center justify-center cursor-pointer relative'
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <img className='md:w-auto w-[10px] h-full' src={state ? src?.hover : src?.default} alt=""/>
    </div>
  )
}