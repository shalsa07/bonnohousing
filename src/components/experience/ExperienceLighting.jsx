import { Environment } from '@react-three/drei'
import React from 'react'

export default function ExperienceLighting() {
  return (
    <>
        <Environment files={'/hdri.hdr'}/>
    </>
  )
}
