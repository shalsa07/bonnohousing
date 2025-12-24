'use client'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSiteContext } from '@/libs/contextProviders/siteContext';
import { ACTIONS_SITE } from '@/libs/contextProviders/reducerSite';
import { settings } from '@/libs/settings';

export default function CarouselComponent({heroImages}) {

  const { siteState, siteDispatch } = useSiteContext()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const router = useRouter()
  
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

  // console.log(heroImages)

  return (
    <div className='w-full h-full flex items-center text-white justify-center'>
      {/* Hero Carousel */}
      <div className='flex absolute w-full h-full'>
        {heroImages.map((i, index) => (
          // (console.log(image)),
          <div
            key={index}
            className={`absolute w-full h-full brightness-50- overflow-hidden transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${i})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            aria-label={`Architectural visualization ${index + 1}`}
          >
            <div className='images-wrapper relative items-center justify-center flex w-full h-full'>
              <Image
                src={i}
                alt={`Architectural visualization ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
                className="object-cover brightness-75-"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation */}
      <div className="CarouselWrapp absolute bottom-5 left-0 right-0 z-10 flex justify-center space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ease-linear duration-300 ${currentSlide === index ? `${settings.bonnoBlue} w-10` : `${settings.bonnoBlue} w-2`
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}