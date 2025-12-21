import { useXR, XROrigin } from '@react-three/xr'
import React, { useEffect } from 'react'

export default function XRSessionManager({setARStatus}) {
    const ARSession=useXR()
    useEffect(()=>{
        ARSession?.session && setARStatus(ARSession?.session)
        if(ARSession){
            ARSession?.orgin?.set([0,0,-20])
            // console.log(ARSession?.orgin)
        }
    },[ARSession])
    // console.log(ARSession?.origin)
  return (
    <>
        <XROrigin
            // scale={0.24} 
            position-z={0} 
            position-y={0} 
        />
    </>
  )
}
