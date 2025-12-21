'use client'
import { Staatliches } from 'next/font/google';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function OnOffStateWrapper3({src,ftn,id,condition}) {
    const [isOn, setIsOn] = useState(id==condition || false);

    const stateChange = () => {
      setIsOn(id==condition || false)
    }
    

    useEffect(()=>stateChange(),[id,condition])

    console.log('RollOverStateWrapper:',id)
    console.log('RollOverStateWrapper:',condition)
  return (
    <div 
      // onClick={() => setIsOn(!isOn)}
      className='flex w-fit h-fit items-center justify-center cursor-pointer relative'
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <img className='md:w-auto w-[10px] h-full' src={isOn ? src?.hover : src?.default} alt=""/>
    </div>
  )
}