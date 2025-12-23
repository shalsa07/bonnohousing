'use client'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import WhatsAppComponent from './WhatsAppComponent';
import RollOverStateWrapper from './RollOverStateWrapper';
import { settings, siteLauyout } from '@/libs/settings';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import SignInBtn from './SignInBtn';
import { useSiteContext } from '@/libs/contextProviders/siteContext';
import { ACTIONS_SITE } from '@/libs/contextProviders/reducerSite';

export default function PresidentCarousel() {

  const { siteState, siteDispatch } = useSiteContext()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const router = useRouter()

  // Portfolio projects
  const heroImages = [
    {
      image: '/assets/president_duma_boko_img_001.webp',
      title: 'Modern Residential',
      category: 'Exterior Visualization'
    },
    {
      image: '/assets/president_duma_boko_img_002.webp',
      title: 'Contemporary Villa',
      category: 'Exterior Visualization'
    }
  ];

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

  // Intersection observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section refs
    Object.keys(sectionRefs.current).forEach(key => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.keys(sectionRefs.current).forEach(key => {
        if (sectionRefs.current[key]) {
          observer.unobserve(sectionRefs.current[key]);
        }
      });
    };
  }, []);

  // Register a section ref
  const registerSectionRef = (id, el) => {
    if (el && !sectionRefs.current[id]) {
      sectionRefs.current[id] = el;
    }
  };

  const handleSignInClick = (params) => {
    signIn()
  }

  const handleExploreClick = (params) => {
    // router.push('/projects')
    siteDispatch({ type: ACTIONS_SITE.CAROUSEL_CLOSE })
  }


  // console.log(heroImages)

  return (
    (false ? <div className='president-wrapper relative w-fit h-fit'>
      {/* Hero Carousel */}
      <div className='flex z-10 absolute w-fit h-fit'>
        {heroImages.map((i, index) => (
          // (console.log(image)),
          <div
            key={index}
            className={`absolute w-fit h-fit brightness-50 overflow-hidden transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${i})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            aria-label={`Architectural visualization ${index + 1}`}
          >
            <div className='images-wrapper relative items-center justify-center flex w-fit h-fit'>
              <img
                src={i?.image}
                alt={`Architectural visualization ${index + 1}`}
                className="object-cover w-full h-auto"
              />
              {/* <Image
                src={i?.image}
                alt={`Architectural visualization ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
                className="object-cover brightness-75"
              /> */}
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation */}
      <div className="CarouselWrapp absolute bottom-22 left-0 right-0 z-10 flex justify-center space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ease-linear duration-300 ${currentSlide === index ? 'bg-white w-10 ' : 'bg-white/40 w-2'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>:<div className={`h-fit w-fit duration-1000 ease-linear transition-all `}>
        <img className='w-full h-auto object-cover' src={heroImages[currentSlide]?.image} alt="" />
    </div>)
  )
}