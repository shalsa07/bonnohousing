'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IoBedOutline, IoCarOutline } from 'react-icons/io5'
import { LuBath } from 'react-icons/lu'
import { SiLevelsdotfyi } from 'react-icons/si'

export default function LinkCard({ project, index }) {
    //console.log('LinkCard:',project)
    return (
        <motion.div
            key={project?._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='group flex flex-col bg-white border border-neutral-100 h-full w-full hover:border-neutral-200 transition-all duration-500 hover:shadow-lg'
        >
            <Link href={`/houses/${project?._id}`} className='flex flex-col h-full w-full'>
                <div className='relative flex-6 w-full h-40 aspect-[4/3] overflow-hidden'>
                    <Image
                        src={project?.renders?.[0]?.url}
                        alt={project?.buildingTitle || 'Project'}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-105'
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                    {/* Collection Badge */}
                    {project.collections && project.collections.length > 0 && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-white/90 text-neutral-700 text-xs px-2 py-1 rounded-full font-light">
                                {project.collections[0]}
                            </span>
                        </div>
                    )}
                </div>

                <div className='p-2 flex flex-1 flex-col flex-grow'>
                    <h2 className='text-xl font-light text-neutral-500 mb-2 group-hover:text-neutral-700 transition-colors uppercase tracking-tight duration-300'>
                        {project?.buildingTitle}
                    </h2>
                    <p className='text-sm text-neutral-500 font-extralight tracking-wider uppercase mb-3'>
                        {project?.buildingType}
                    </p>

                    {/* Building Summary */}
                    {project.buildingSummary && (
                        <div className="grid grid-cols-4 gap-2 p-3 bg-neutral-50 rounded-lg">
                            <div className="text-center">
                                <IoBedOutline className="w-4 h-4 mx-auto text-neutral-500 mb-1" />
                                <span className="text-xs text-neutral-600">{project.buildingSummary.beds}</span>
                            </div>
                            <div className="text-center">
                                <LuBath className="w-4 h-4 mx-auto text-neutral-500 mb-1" />
                                <span className="text-xs text-neutral-600">{project.buildingSummary.baths}</span>
                            </div>
                            <div className="text-center">
                                <IoCarOutline className="w-4 h-4 mx-auto text-neutral-500 mb-1" />
                                <span className="text-xs text-neutral-600">{project.buildingSummary.cars}</span>
                            </div>
                            <div className="text-center">
                                <SiLevelsdotfyi className="w-4 h-4 mx-auto text-neutral-500 mb-1" />
                                <span className="text-xs text-neutral-600">{project.buildingSummary.levels}</span>
                            </div>
                        </div>
                    )}

                    {/* Subtle hover indicator */}
                    <div
                        className="mt-auto pt-2 border-t border-neutral-100 -opacity-0 group-hover:opacity-100 justify-center items-center transition-opacity duration-300"
                    >
                        <span className="text-xs text-neutral-600 font-light tracking-widest text-center uppercase">
                            View Project
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}