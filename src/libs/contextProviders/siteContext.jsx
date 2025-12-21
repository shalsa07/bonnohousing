'use client'

import React, { createContext, useContext, useReducer, useState } from 'react'
import { INITIAL_EXPERIENCE_STATE, reducerSiteFunction } from './reducerSite'

export const SiteContext=createContext()  

export default function SiteContextProvider({children}) {
    const [closeBtnState,setCloseBtnState]=useState(true)
    // const [leftUiClose,setLeftUiClose]=useState(false)
    const [siteState,siteDispatch]=useReducer(reducerSiteFunction,INITIAL_EXPERIENCE_STATE)
  return (
    <SiteContext.Provider
        value={{
          siteState,siteDispatch,
          closeBtnState,setCloseBtnState,
          // leftUiClose,setLeftUiClose
        }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export const useSiteContext=()=>{
    const context = useContext(SiteContext)
    if (!context) {
        throw new Error('useSiteContext must be used within an SiteContextProvider')
    }
    return context
}
