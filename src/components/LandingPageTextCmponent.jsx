'use client'

import React, { useState } from 'react'
import { FaChevronDown, FaArrowRight, FaFacebook, FaWhatsapp, FaThinkPeaks, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'
import { useSiteContext } from '@/libs/contextProviders/siteContext'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { settings, siteLauyout } from '@/libs/settings'
import { buildingDB } from '@/libs/blgDB'
import Link from 'next/link'
import RollOverStateWrapper from './RollOverStateWrapper'

const socialsCss = 'hover:text-white transition-colors text-3xl hover:scale-110 duration-300 ease-linear'

function LinkCard({ i }) {
    const [onHover, setOnHover] = useState(false)
    return (
        <Link href={`/projects/${i?._id}`} onMouseEnter={() => setOnHover(true)} onMouseLeave={() => setOnHover(false)} className='flex relative items-center justify-center w-full h-[100vh] md:w-1/3 md:h-full overflow-hidden'>
            <img className={`absolute m-auto w-full brightness-75 z-10 ${onHover ? 'scale-0' : 'scale-100'} duration-300 ease-linear cursor-pointer h-full object-cover`} src={i?.renders?.[0]?.url} alt="" />
            <img className={`absolute m-auto w-full brightness-75 duration-500 ease-linear cursor-pointer h-full object-cover`} src={i?.renders?.[1]?.url} alt="" />
            <div className='flex flex-col items-end h-fit px-20 text-center text-white justify-center absolute bottom-4 m-auto z-10'>
                <h1 className='text-3xl md:text-3xl text-wrap font-bold uppercase tracking-widest mb-2'>{i?.buildingTitle}</h1>
                <span className='text-sm duration-300 ease-linear md:text-lg text-wrap mt-2 font-serif italic text-white/90 mb-4 max-w-2xl mx-auto drop-shadow-md'>
                    {i?.desc}
                </span>
            </div>
        </Link>
    )
}

export default function LandingPageTextCmponent() {
    const { siteState } = useSiteContext()
    const { experienceDispatch } = useExperienceContext()
    // console.log(siteState)
    return (
        (!siteState?.landingPageCarouselPopup &&
            <div className='h-100vh flex w-full flex-col'>
                <div className="font-sans text-neutral-900 bg-white selection:bg-black selection:text-white overflow-y-scroll">
                </div>

                {/* --- HERO SECTION --- */}
                <header className="relative md:h-screen flex flex-col items-center justify-center md:overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="./hero/bonno/0002.webp"
                            alt="PPSBluyari Hero"
                            className="w-full h-full object-cover grayscale opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className='w-full h-full flex flex-col items-center justify-start md:justify-center bg-gray-600/90 z-10'>
                        <div className="flex relative z-10 mt-5 text-center px-6 w-fit h-fit mx-auto flex-col md:flex-row gap-5 ">
                            <div className='w-auto mt-20 md:mt-0 h-full brightness-75'>
                                <img className='w-auto h-full' src={siteLauyout.presidentSection.image} alt="" />
                            </div>
                            <div className='max-w-[477px] h-full px-5 flex flex-col justify-center items-start md:items-center'>
                                <h1 className="text-[32px] md:text-6xl lg:text-4xl italic uppercase tracking-tight text-wrap leading-none font-light text-white text-left drop-shadow-lg">
                                    {/* {siteLauyout.presidentSection.text.title} */}
                                    <h1>
                                        <span className="font-extralight">BUILDING BLOCKS FOR </span>
                                        <span className={`font-bold ${settings.bonnoTextBlue}`}>HOME OWNERSHIP AND </span>
                                        <span className={`font-bold ${settings.bonnoTextGreen}`}>COMMUNITY GROWTH...</span>
                                    </h1>
                                </h1>
                                <p className="flex flex-col mt-1 items-start md:text-xl text-wrap text-white/90 mb-4 max-w-2xl mx-auto drop-shadow-md gap-3">
                                    {/* {siteLauyout.presidentSection.text.body} */}
                                    <span className='text-start italic text-[18px]'><span className='font-bold'>President Advocate Duma Gideon Boko's flagship initiative</span> targets 100,000 housing units distributed equally across all constituencies, ensuring dignified living and community development nationwide.</span>
                                    <span className='text-start text-[12px]'>The programme operates through multiple schemes serving income brackets from P4,400 annually to P282,120, including home improvement loans up to P60,000 and turnkey development loans up to P90,000.</span>
                                    <span className='text-start text-[12px]'>Our platform connects the Bonno National Housing Programme’s stakeholders — government, investors, developers, and homebuyers through immersive marketing experiences, transparent investment insights, development data dashboard and user-friendly tools.</span>
                                    <span className='text-start italic text-[18px]'>“A digital frontier for property development and ownership”</span>
                                </p>
                                <div
                                    onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.TOGGLE_LOAN_FORM, payload: true })}
                                    className="h-auto w-fit mb-5"
                                >
                                    <RollOverStateWrapper src={{ hover: './assets/register_your_interest_btn_off.png', default: './assets/register_your_interest_btn_ov.png' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex fixed z-20 flex-col right-0 top-0 bottom-0 my-auto h-fit w-fit'>
                        {siteLauyout.socialsLinks.map((social, index) => (
                            <div className='flex flex-col w-fit h-fit items-center justify-center' key={index}>
                                <RollOverStateWrapper src={{ hover: social.hover, default: social.default }} />
                            </div>
                        ))}
                    </div>

                    {/* <div className="absolute z-10 bottom-5 animate-bounce text-white">
                        <FaChevronDown size={32} />
                    </div> */}
                </header >

                {/* --- INTRO SECTION --- */}
                <section section className="py-12 px-5 bg-white " >
                    <div className="flex flex-col gap-3 w-ful px-2 md:w-[460px] mx-auto text-center">
                        <h2 className="text-3xl md:text-3xl italic text-wrap font-bold uppercase tracking-widest w-full">
                            <span className={`font-bold ${settings.bonnoTextBlue}`}>Vision.</span> <span className={`font-bold ${settings.bonnoTextGreen}`}>Mission.</span> <span className={`font-bold text-gray-700`}>Vision.</span>
                        </h2>
                        <div className="w-12 h-1 bg-black mx-auto mb-2"></div>
                        <p className="text-[12px] leading-relaxed text-neutral-600">
                            <span className='font-bold text-gray-700'>The <span className={`font-bold ${settings.bonnoTextBlue}`}>Bonno</span> <span className={`font-bold ${settings.bonnoTextGreen}`}>Housing</span> <span>Scheme </span>is a premier property development innitiative bridging the gap between luxury living, social responsibility, and industrial growth.</span>
                        </p>
                        <p className="text-[12px] italic leading-relaxed text-neutral-600">
                            <span className={`font-bold ${settings.bonnoTextBlue}`}>“We don’t just build structures;</span> <span className={`font-bold ${settings.bonnoTextGreen}`}>we create ecosystems where communities thrive and economies grow.” </span>
                        </p>
                    </div>
                </section >

                {/* --- CARUSAL SECTION --- */}
                < section className="bg-neutral-50 mb-5" >
                    {/* Tier 1: Zambia */}
                    <div div id="residential" className="flex relative h-[80vh] overflow-x-scroll" >
                        {siteLauyout?.conecptSection?.images?.map((i, index) =>
                            <div className='flex relative items-center justify-center min-w-[100vw] h-full' key={index}>
                                <img className='w-full brightness-75 h-full object-cover' src={i} alt="" />
                            </div>
                        )
                        }
                    </div >
                </section >

                {/* --- BUILDING SELECTOR --- */}
                < section className="bg-neutral-50" >
                    {/* Tier 1: Zambia */}
                    < div id="residential" className="flex md:flex-row flex-col relative h-fit md:h-[100vh] bottom-16" >
                        {buildingDB?.map((i, index) =>
                            <LinkCard key={index} i={i} />
                        )}
                    </div >
                </section >

                {/* --- FOOTER --- */}
                {/* < footer className="bg-black text-white py-16 border-t border-neutral-900" >
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="text-3xl font-black tracking-[0.3em] uppercase mb-8">
                            bonno housing scheme
                        </div>
                        <div className="flex justify-center gap-8 mb-6 text-xs font-bold tracking-widest uppercase text-neutral-500">
                            <a href="#" className="hover:text-white duration-300 ease-linear transition-colors">Home</a>
                            <a href="#" className="hover:text-white duration-300 ease-linear transition-colors">Contact</a>
                        </div>
                        <div className="flex justify-center gap-8 mb-6 text-xs font-bold tracking-widest uppercase text-neutral-500">
                            <a href="#" className={socialsCss}>
                                <FaFacebook />
                            </a>
                            <a href="#" className={socialsCss}>
                                <FaWhatsapp />
                            </a>
                            <a href="#" className={socialsCss}>
                                <FaTiktok />
                            </a>
                            <a href="#" className={socialsCss}>
                                <FaInstagram />
                            </a>
                            <a href="#" className={socialsCss}>
                                <FaYoutube />
                            </a>
                        </div>
                        <p className="text-neutral-600 text-xs tracking-wide">
                            &copy; 2025 PPSBluyari Property Development. All Rights Reserved.
                        </p>
                    </div>
                </footer > */}

            </div >
        ))
}
