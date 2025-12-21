'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { FaAngleLeft, FaAngleRight, FaPlay, FaPause } from 'react-icons/fa6'

export default function ScrollerWrapper({children}) {
    const scrollbtn=['left','right']
    const refWrapper=useRef(null)
    const [scrollIndex, setScrollIndex] = useState(0)
    const [heightChange, setHeightChange] = useState(false)
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false) // Start with auto-scroll disabled
    const [initialDelayComplete, setInitialDelayComplete] = useState(false)
    const autoScrollTimerRef = useRef(null)
    const initialDelayTimerRef = useRef(null)

    useEffect(() => {
        // Ensure window is defined before accessing it
        if (typeof window === 'undefined') {
            return; // Skip execution on the server
        }

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height;
                // Safely access window.innerHeight only on the client
                setHeightChange(window.innerHeight > (refWrapper.current?.clientHeight || 0)); // Added || 0 for safety
            }
        });

        if (refWrapper.current) {
            observer.observe(refWrapper.current);
        }

        return () => {
            if (refWrapper.current) {
                observer.unobserve(refWrapper.current);
            }
        };
    }, []); // Removed `window` from dependency array, as it's a global object

    // Function to handle manual scrolling
    const handleClick = useCallback((condition) => {
        // Disable auto-scrolling when user manually scrolls
        setAutoScrollEnabled(false)
        setInitialDelayComplete(true) // Mark initial delay as complete since user has interacted

        // Clear any existing timers
        if (autoScrollTimerRef.current) {
            clearTimeout(autoScrollTimerRef.current)
        }

        if (initialDelayTimerRef.current) {
            clearTimeout(initialDelayTimerRef.current)
        }

        // Update scroll index
        setScrollIndex(condition === 'left'
            ? scrollIndex === 0 ? refWrapper.current?.children?.length - 1 : scrollIndex - 1
            : scrollIndex === refWrapper.current?.children?.length - 1 ? 0 : scrollIndex + 1
        )

        // Re-enable auto-scrolling after 10 seconds of inactivity
        autoScrollTimerRef.current = setTimeout(() => {
            setAutoScrollEnabled(true)
        }, 10000)
    }, [scrollIndex])

    // Auto-scrolling effect
    useEffect(() => {
        if (!autoScrollEnabled) return

        const interval = setInterval(() => {
            // Auto-scroll to the next slide
            setScrollIndex(prevIndex => {
                const childrenCount = refWrapper.current?.children?.length || 0
                return prevIndex === childrenCount - 1 ? 0 : prevIndex + 1
            })
        }, 5000)

        // Clean up interval on unmount or when autoScrollEnabled changes
        return () => clearInterval(interval)
    }, [autoScrollEnabled])

    // Initial delay effect - start auto-scrolling after 15 seconds
    useEffect(() => {
        // Set a timer to enable auto-scrolling after 15 seconds
        initialDelayTimerRef.current = setTimeout(() => {
            setAutoScrollEnabled(true)
            setInitialDelayComplete(true)
        }, 15000)

        // Clean up the timer if the component unmounts
        return () => {
            if (initialDelayTimerRef.current) {
                clearTimeout(initialDelayTimerRef.current)
            }
        }
    }, []) // Run only once on mount

    // Cleanup effect for the timeout when component unmounts
    useEffect(() => {
        return () => {
            if (autoScrollTimerRef.current) {
                clearTimeout(autoScrollTimerRef.current)
            }
        }
    }, [])

    // console.log('ScrollerWrapper:',refWrapper.current?.clientHeight)

    return (
        <>
            <div ref={refWrapper} style={{transform:`translateX(-${100*scrollIndex}%)`}} className={`flex relative w-full h-full duration-500 z-50 ease-linear`}>
                {children}
            </div>
            {scrollbtn.map((item)=>
                <button
                    key={item}
                    className={`flex z-10 absolute my-auto items-center hover:bg-black/25 ${autoScrollEnabled ? 'bg-black/50' : 'bg-black/70'} duration-300 ease-linear border-1 border-white rounded-full cursor-pointer justify-center w-fit h-fit p-4 md:text-2xl text-lg top-2 bottom-2 text-white ${item==='left' ? 'md:left-4 left-2' : 'md:right-4 right-2'}`}
                    onClick={()=>{handleClick(item)}}
                    aria-label={item === 'left' ? 'Navigate to previous slide' : 'Navigate to next slide'}
                >
                    {item==='left' ? <FaAngleLeft /> : <FaAngleRight />}
                </button>
            )}

            {/* Initial delay indicator */}
            {!initialDelayComplete && (
                <div className="absolute bottom-24 left-4 z-10 bg-black/70 text-white rounded-md px-2 py-1 text-xs">
                    Auto-play in 15s
                </div>
            )}

            {/* Play/Pause button */}
            <button
                className="absolute bottom-24 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                onClick={() => {
                    setAutoScrollEnabled(prev => !prev);
                    setInitialDelayComplete(true); // Mark initial delay as complete when user manually controls playback

                    // Clear initial delay timer if it exists
                    if (initialDelayTimerRef.current) {
                        clearTimeout(initialDelayTimerRef.current);
                    }
                }}
                // aria-label={autoScrollEnabled ? "Pause auto-scroll" : "Play auto-scroll"}
            >
                {autoScrollEnabled ? <FaPause size={16} /> : <FaPlay size={16} />}
            </button>

            {/* Scroll indicators */}
            <div className={`${heightChange ? 'bottom-16' : 'bottom-24'} absolute left-1/2 transform -translate-x-1/2 flex space-x-2`}>
                {Array.from({ length: refWrapper.current?.children?.length || 0 }).map((_, i) => (
                    <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                            i === scrollIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                        onClick={() => {
                            setScrollIndex(i);
                            setAutoScrollEnabled(false);
                            setInitialDelayComplete(true); // Mark initial delay as complete

                            // Clear any existing timers
                            if (autoScrollTimerRef.current) {
                                clearTimeout(autoScrollTimerRef.current);
                            }

                            if (initialDelayTimerRef.current) {
                                clearTimeout(initialDelayTimerRef.current);
                            }

                            // Re-enable auto-scrolling after 10 seconds of inactivity
                            autoScrollTimerRef.current = setTimeout(() => {
                                setAutoScrollEnabled(true);
                            }, 10000);
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </>
    )
}