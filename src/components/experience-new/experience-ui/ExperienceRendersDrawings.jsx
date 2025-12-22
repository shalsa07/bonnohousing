'use client'
import React from 'react'
import Image from 'next/image'
import { IoClose } from "react-icons/io5";
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience';
import { useExperienceContext } from '@/libs/contextProviders/experienceContext';
import ImageNotFoundPlaceholder from '@/components/ImageNotFoundPlaceholder';

// Simple, scrollable poster-style layout matching the provided UI using public images
// Simple, scrollable poster-style layout matching the provided UI using public images
export default function ExperienceRendersDrawings({ data, options, images = {}, onClose }) {
    const { experienceDispatch } = useExperienceContext()
    const hero = data?.renders?.[0]?.url || ''
    const plans = data?.drawings?.find(({ name }) => name == 'Plans')?.url || ''
    const elevations = data?.drawings?.find(({ name }) => name == 'Elevations')?.url || ''

    // console.log(data?.hero?.heroImages?.[0]?.url)

    return (
        <div className='absolute top-0 left-0 inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 text-stone-900'>
            {/* Close Controls */}
            <div className='flex z-10 absolute right-3 top-3 gap-2'>
                {/* Close Button */}
                <div
                    className='flex cursor-pointer justify-center border-2 border-gray-400 bg-black/40 text-white items-center w-10 h-10 rounded-full shadow'
                    onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.POPUP_CLOSE })}
                >
                    <IoClose className='text-3xl' />
                </div>
            </div>

            <div className='w-full max-w-6xl h-full h-[calc(100%-40px)]- overflow-y-auto rounded-xl- ring-1 ring-stone-500 shadow-2xl bg-[#b59b7a]/30'>
                {/* Outer poster margin frame (beige border look) */}
                <div className='rounded-xl- bg-white p-4 md:p-8 relative'>

                    {/* Header row */}
                    <div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start'>
                        <div className='md:col-span-9 h-full'>
                            <div className='relative w-full aspect-[16/9] overflow-hidden rounded-lg h-full shadow-lg ring-1 ring-stone-300'>
                                {data?.hero?.heroImages?.length > 0 ? <Image src={data?.hero?.heroImages?.[0]?.url} alt='Exterior render' fill className='object-cover' priority /> : <ImageNotFoundPlaceholder />}
                            </div>
                        </div>
                        <div className='md:col-span-3 text-stone-800 flex flex-col gap-2'>
                            <div className='flex items-center gap-2 text-stone-700'>
                                <div className='h-6 w-6 rounded-full bg-stone-700/90' />
                                <p className='tracking-widest text-xs uppercase'>{data?.buildingType}</p>
                            </div>

                            <h1 className='mt-2 md:mt-3 text-2xl md:text-3xl font-semibold tracking-tight'>
                                {data?.buildingTitle}
                            </h1>

                            <div className='mt-3 text-sm leading-relaxed text-stone-700'>
                                <p className="leading-relaxed">{data?.desc || 'For families seeking a well-organized, functional, and comfortable home. Practicalnsure that essential needs are easily accessible while providing quiesupport rest. The design embraces zoning strategies, ensuring that socia functional spaces meet the diverse needs of a modern household.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Floor plan row */}
                    {plans?.length > 0 || elevations?.length > 0 && <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
                        <div className='flex flex-col gap-2'>
                            <h3 className='uppercase tracking-wide text-xs text-stone-600'>plans</h3>
                            <div className='relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 ring-1 ring-stone-300'>
                                {plans?.length > 0 ? <Image src={plans} alt='Ground floor plan' fill className='object-cover' /> : <ImageNotFoundPlaceholder />}
                            </div>
                            {data?.drawings?.find(d => d.name === 'Plans')?.description && (
                                <p className="text-xs text-stone-600 mt-2">
                                    {data?.drawings?.find(d => d.name === 'Plans')?.description}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h3 className='uppercase tracking-wide text-xs text-stone-600'>elevations</h3>
                            <div className='relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 ring-1 ring-stone-300'>
                                {elevations?.length > 0 && <Image src={elevations} alt='First floor plan' fill className='object-cover' />}
                            </div>
                            {data?.drawings?.find(d => d.name === 'Elevations')?.description && (
                                <p className="text-xs text-stone-600 mt-2">
                                    {data?.drawings?.find(d => d.name === 'Elevations')?.description}
                                </p>
                            )}
                        </div>
                    </div>}

                    {/* Overview + Why choose (Left as is, assuming these come from static data or 'hero' props not specified for edit, but user said 'images uploaded under drawings and hero featured'. Main overview was not explicitly asked to be editable but fits the pattern. I'll stick to the specific request for now to avoid over-engineering, but keeping the structure.) */}
                    <div className='mt-6 flex justify-between gap-6 text-xs leading-relaxed text-stone-700'>
                        <div className='flex justify-between h-full w-full overflow-y-auto'>
                            <div className='flex max-w-1/2 flex-col px-2'>
                                {/* <h4 className='uppercase underline text-stone-800 mb-1'>plans</h4> */}
                                <p>
                                    {data?.drawings?.['plans']?.description && 'For families seeking a well-organized, functional, and comfortable home. Practicalnsure that essential needs are easily accessible while providing quiesupport rest. The design embraces zoning strategies, ensuring that socia functional spaces meet the diverse needs of a modern household.'}
                                </p>
                            </div>
                            <div className='flex max-w-1/2 flex-col px-2'>
                                {/* <h4 className='uppercase underline text-stone-800 mb-1'>elevations</h4> */}
                                <p>
                                    {data?.drawings?.['elevations']?.description && 'For families seeking a well-organized, functional, and comfortable home. Practicalnsure that essential needs are easily accessible while providing quiesupport rest. The design embraces zoning strategies, ensuring that socia functional spaces meet the diverse needs of a modern household.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lifestyle images row */}
                    <div className='mt-8 flex flex-wrap'>
                        {data?.hero?.heroFeatured?.slice(0, 3)?.map((item, idx) => (
                            <div key={idx} className='flex flex-col h-auto w-1/3 p-2'>
                                <div className='relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow ring-1 ring-stone-300 bg-stone-200'>
                                    {item?.url?.length > 0 ? <Image src={item?.url} alt={item?.name} fill className='object-cover' /> : <ImageNotFoundPlaceholder />}
                                </div>
                                <h5 className='mt-3 font-medium text-stone-700 uppercase text-sm underline'>{item?.name}</h5>

                                <div className='mt-1 flex-grow'>
                                    <p className="text-xs text-stone-700">
                                        {item?.description || "Calm tones, tactile textures, and clean lines create a welcoming, timeless feel. Large openings connect interiors to outdoor greenery, blurring boundaries and enhancing well-being."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
