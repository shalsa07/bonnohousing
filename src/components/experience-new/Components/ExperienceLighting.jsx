import { Environment } from '@react-three/drei'
import React from 'react'
import { AmbientLight } from 'three'

export default function ExperienceLighting() {
  return (
    <>
        <Environment 
          // files={'/hdri.hdr'}
          files={['/cubemap/px.png', '/cubemap/nx.png', '/cubemap/py.png', '/cubemap/ny.png', '/cubemap/pz.png', '/cubemap/nz.png']}
        />
    </>
  )
}
