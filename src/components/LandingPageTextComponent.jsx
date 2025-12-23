'use client'

import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaArrowRight, FaFacebook, FaWhatsapp, FaThinkPeaks, FaYoutube, FaTiktok, FaInstagram, FaChevronUp } from 'react-icons/fa'
import { useSiteContext } from '@/libs/contextProviders/siteContext'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { settings, siteLauyout } from '@/libs/settings'
import { buildingDB } from '@/libs/blgDB'
import Link from 'next/link'
import RollOverStateWrapper from './RollOverStateWrapper'
import PresidentCarousel from './PresidentCarousel'
import GoogleLocationComponent from './GoogleLocationComponent'
const socialsCss = `hover:text-white transition-colors text-3xl hover:scale-110 duration-300 ease-linear bg-${settings.bonnoGreen} hover:bg-${settings.bonnoBlue}`
// const socialsCss = 'hover:text-white transition-colors text-3xl hover:scale-110 duration-300 ease-linear'

const mapSource = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11972.094248531412!2d26.808146631612036!3d-23.138156477213528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eb0a1ef3ab6df67%3A0xe1729cb3f5f12fc2!2sKo%20Digalaseng!5e1!3m2!1sen!2szm!4v1766475931218!5m2!1sen!2szm";

const heroImages = [
    {
        image: '/hero/bonno/0002.webp',
        title: 'Modern Residential',
        category: 'Exterior Visualization'
    },
    {
        image: '/hero/bonno/0005.webp',
        title: 'Contemporary Villa',
        category: 'Exterior Visualization'
    },
    {
        image: '/hero/bonno/0008.webp',
        title: 'Urban Apartment',
        category: 'Interior Visualization'
    },
    {
        image: '/hero/bonno/0002.webp',
        title: 'Modern Residential',
        category: 'Exterior Visualization'
    },
    {
        image: '/hero/bonno/0005.webp',
        title: 'Contemporary Villa',
        category: 'Exterior Visualization'
    },
    {
        image: '/hero/bonno/0008.webp',
        title: 'Urban Apartment',
        category: 'Interior Visualization'
    }
];

const socialsButtons = [
    { name: 'facebook', icon: <FaFacebook />, link: 'https://www.facebook.com/' },
    { name: 'whatsapp', icon: <FaWhatsapp />, link: 'https://www.whatsapp.com/' },
    { name: 'youtube', icon: <FaYoutube />, link: 'https://www.youtube.com/' },
    { name: 'tiktok', icon: <FaTiktok />, link: 'https://www.tiktok.com/' },
    { name: 'instagram', icon: <FaInstagram />, link: 'https://www.instagram.com/' },
]

function LinkCard({ i,index }) {
    const [onHover,setOnHover]=useState(false)
    // console.log('LinkCard:',i)
    return (
        <div className='flex flex-col relative items-center justify-center w-full md:w-1/3 md:h-full h-[60vh] overflow-hidden '>
            <div 
                onMouseEnter={()=>setOnHover(true)}
                onMouseLeave={()=>setOnHover(false)}
                className='flex relative flex-4 w-full items-center justify-center'
            >
                <img 
                    className='h-full hover:brightness-50 brightness-90 duration-300 ease-linear w-full object-cover' 
                    src={i?.renders?.[0]?.url} alt="building hero image" 
                />
                    <Link 
                        href={`/houses/${i?._id}`} 
                        className={`${onHover ?'flex' : 'hidden'} transition-all duration-300 ease-linear absolute uppercase items-center justify-center tracking-tight m-auto font-extralight text-sm z-10 text-gray-300 cursor-pointer rounded-full md:w-60 w-40 h-12 text-center ${settings.bonnoBlue}`}
                    >
                        explore
                    </Link>
            </div>
            <div className='flex py-2 flex-col px-4 text-gray-500 flex-1 w-full overflow-hidden gap-2'>
                <div className='flex h-14 w-full gap-2'>
                    <div className='flex items-start text-7xl h-full flex-1'>
                        <div className='flex text-7xl h-full items-start flex-1'>{i?.buildingSummary?.['beds']}</div>
                        <div className='flex ml-2 h-full flex-wrap text-2xl tracking-tight uppercase leading-5 flex-2'>bedroomed house</div>
                    </div>
                        
                    <div className='flex items-start h-full tracking-tight uppercase leading-5 text-2xl border-l-2 border-gray-400 pl-4 flex-2'>{i?.buildingTitle?.split(':')?.[1]}</div>
                </div>
                {/* <h1 className='flex flex-1 uppercase text-2xl'>{i?.buildingTitle}</h1> */}
                <p className='flex h-12 leading-4 text-sm truncate text-wrap'>{i?.desc}...</p>
            </div>

            {/* <Link href={`/projects/${i?._id}`} className={`absolute bottom-5 uppercase items-center justify-center tracking-tight text-center font-extralight text-sm w-fit mx-auto z-10 text-gray-800 cursor-pointer rounded-full ${settings.bonnoBlueFaint}`}>
                <RollOverStateWrapper src={{ hover: './assets/thumbnal_explore_btn_ov.png', default: './assets/thumbnal_explore_btn_ov.png' }} />
            </Link> */}
        </div>
    )
}

export default function LandingPageTextComponent() {
    const { siteState } = useSiteContext()
    const { experienceDispatch } = useExperienceContext()

    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoScrollPaused, setAutoScrollPaused] = useState(false);
    const [buildings, setBuildings] = useState(buildingDB || []); // Initialize with static data or empty array

      // Fetch buildings from API
      const fetchBuildings = async () => {
        try {
            const response = await fetch('/api/buildings');
            if (response.ok) {
                const data = await response.json();
                // Ensure we have an array (handle pagination response structure if needed, usually data.buildings or just data)
                // The API /api/buildings returns { buildings: [...], pagination: {...} }
                const buildingsList = data.buildings || [];
                if (buildingsList.length > 0) {
                     setBuildings(buildingsList);
                }
            } else {
                console.error('Failed to fetch buildings');
            }
        } catch (error) {
            console.error('Error fetching building data:', error);
        }
      };
    
      // Load buildings on component mount
      useEffect(() => {
        fetchBuildings();
      }, []);

      // Auto-scroll for hero carousel
        useEffect(() => {
          if (autoScrollPaused) return;
      
          const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
          }, 5000);
      
          return () => clearInterval(interval);
        }, [autoScrollPaused, heroImages.length]);
      
        // Handle manual navigation
        const goToSlide = (index) => {
          setCurrentSlide(index);
          setAutoScrollPaused(true);
      
          // Resume auto-scroll after 15 seconds
          setTimeout(() => {
            setAutoScrollPaused(false);
          }, 15000);
        };

        const scrollButton = () => {  }

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
                                {/* <img className='w-auto h-full' src={siteLauyout.presidentSection.image} alt="" /> */}
                                <PresidentCarousel />
                            </div>
                            <div className='min-w-[320px] max-w-[640px] h-full px-5 flex flex-col justify-center items-start md:items-center'>
                                <h1 className="text-[32px] md:text-6xl lg:text-4xl italic uppercase tracking-tight text-wrap leading-none font-light text-white text-left drop-shadow-lg">
                                    {/* {siteLauyout.presidentSection.text.title} */}
                                    <div className='flex flex-col'>
                                        <span className="font-extralight w-full">BUY, INVERT OR RENT </span>
                                        
                                        <span className={`font-bold uppercase justify-around ${settings.bonnoTextBlue}`}>A HOUSE IN His Excellency The President’s HOME TOWN </span>
                                        <span className={`font-bold ${settings.bonnoTextGreen}`}>OF MAHALAPYE...</span>
                                    </div>
                                    {/* <div>
                                        <span className="font-extralight">BUILDING BLOCKS FOR </span>
                                        <span className={`font-bold ${settings.bonnoTextBlue}`}>HOME OWNERSHIP AND </span>
                                        <span className={`font-bold ${settings.bonnoTextGreen}`}>COMMUNITY GROWTH...</span>
                                    </div> */}
                                </h1>
                                <p className="flex flex-col mt-1 items-start text-wrap text-white/90 mb-4 max-w-3xl mx-auto drop-shadow-md gap-3">
                                    {/* {siteLauyout.presidentSection.text.body} */}
                                    <span className='text-start italic text-[18px]'><span className='font-bold'>President Advocate Duma Gideon Boko's flagship initiative</span> targets 100,000 housing units distributed equally across all constituencies, ensuring dignified living and community development nationwide.</span>
                                    <span className='text-start text-[12px]'>The programme operates through multiple schemes serving income brackets from P4,400 annually to P282,120, including home improvement loans up to P60,000 and turnkey development loans up to P90,000.</span>
                                    <span className='text-start text-[12px]'>Our platform connects the Bonno National Housing Programme’s stakeholders — government, investors, developers, and homebuyers through immersive marketing experiences, transparent investment insights, development data dashboard and user-friendly tools.</span>
                                    <span className='text-start italic text-[18px]'>“A digital frontier for property development and ownership”</span>
                                </p>
                                <Link
                                    href="/houses"
                                    className="h-auto w-fit mb-5"
                                >
                                    <RollOverStateWrapper src={{ hover: './assets/new_explore_btn_off.png', default: './assets/new_explore_btn_ov.png' }} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* --- SOCIALS SECTION --- */}
                    <div className='flex fixed z-20 flex-col right-0 top-0 bottom-0 my-auto h-fit w-fit'>
                        `{socialsButtons.map((social, index) => (
                            <div className={`flex flex-col md:w-16 w-12 md:h-16 h-12 items-center justify-center ${settings.bonnoHoverBlue} transition-colors duration-200 ease-linear ${settings.bonnoGreen}`} key={index}>
                                <Link className='text-white text-xl md:text-3xl' href={social.link}>
                                    {social?.icon}
                                </Link>
                            </div>
                        ))}`

                        {/* `{siteLauyout.socialsLinks.map((social, index) => (
                            <div className='flex flex-col w-fit h-fit items-center justify-center' key={index}>
                                <RollOverStateWrapper src={{ hover: social.hover, default: social.default }} />
                            </div>
                        ))}` */}
                    </div>

                    <div onClick={()=>scrollButton()} className="absolute z-10 left-4 md:bottom-18 bottom-6 animate-bounce text-white">
                        {false? <FaChevronUp size={32} /> : <FaChevronDown size={32} />}
                    </div>
                </header >

                {/* --- INTRO SECTION --- */}
                <section className="py-12 px-5 bg-white " >
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
                        <div
                            onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.TOGGLE_LOAN_FORM, payload: true })}
                            className="h-auto w-fit mb-5"
                        >
                            <RollOverStateWrapper src={{ hover: './assets/register_your_interest_btn_off.png', default: './assets/register_your_interest_btn_ov.png' }} />
                        </div>
                    </div>
                </section >

                {/* --- CARUSAL SECTION --- */}
                <section className="bg-neutral-50" >
                    {/* Tier 1: Zambia */}
                    <div id="residential" className="flex relative h-[80vh] overflow-x-scroll" >
                        {siteLauyout?.conecptSection?.images?.map((i, index) =>
                            <div className='flex relative items-center justify-center min-w-[100vw] h-full' key={index}>
                                <img className='w-full brightness-75 h-full object-cover' src={i} alt="" />
                            </div>
                        )}
                    </div >
                </section >

                {/* --- BUILDING SELECTOR --- */}
                <section>
                    < div id="residential" className="flex md:flex-row flex-col relative h-fit md:h-[calc(100vh-144px)] bg-gray-50" >
                        {buildings?.map((i, index) =>
                            <LinkCard key={index} index={index} i={i} />
                        )}
                    </div >
                </section >

                {/* --- GOOGLE SITE LOCATION SELECTOR --- */}
                <section className='mb-16'>
                    {/* < div id="residential" className="flex md:flex-row flex-col relative h-fit mb-16" >
                        <img className='w-full h-auto' src="/assets/map_location.jpg" alt="" />
                    </div > */}
                    <GoogleLocationComponent 
                        src={mapSource} 
                        className="h-[105vh] md:h-[100vh] w-full"
                    />
                </section >

            </div >
        )
    )
}
