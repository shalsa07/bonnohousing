'use client'

import React, { createContext, useContext, useReducer, useState } from 'react'
import { INITIAL_EXPERIENCE_STATE, reducerExperienceFunction } from './reducerExperience'

export const ExperienceContext=createContext()  

export default function ExperienceContextProvider({children}) {
    const [closeBtnState,setCloseBtnState]=useState(false)
    // const [leftUiClose,setLeftUiClose]=useState(false)
    const [experienceState,experienceDispatch]=useReducer(reducerExperienceFunction,INITIAL_EXPERIENCE_STATE)
  return (
    <ExperienceContext.Provider
        value={{
          experienceState,experienceDispatch,
          closeBtnState,setCloseBtnState,
          // leftUiClose,setLeftUiClose
        }}
    >
      {children}
    </ExperienceContext.Provider>
  )
}

export const useExperienceContext=()=>{
    const context = useContext(ExperienceContext)
    if (!context) {
        throw new Error('useExperienceContext must be used within an ExperienceContextProvider')
    }
    return context
}
