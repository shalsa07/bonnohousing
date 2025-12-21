import ScrollerWrapper from '@/components/ScrollerWrapper'
import React from 'react'

export default function ExperienceIMageViewer({data}) {
  return (
    <ScrollerWrapper>
      {data?.sort((a, b) => a.name.localeCompare(b.name))?.map((i,index)=>i?.url?.length>0 &&
        <img className='w-full h-auto object-cover' key={index} src={i?.url} alt="" />
      )}
    </ScrollerWrapper>
  )
}
