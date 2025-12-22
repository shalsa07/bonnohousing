'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IoBedOutline, IoCarOutline } from 'react-icons/io5'
import { LuBath } from 'react-icons/lu'
import { SiLevelsdotfyi } from 'react-icons/si'

export default function LinkCardDashboard({project,index,onDelete}) {
    // console.log('LinkCard:',project)
  return (
    <motion.div
        key={project?._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className='group flex flex-col bg-white border border-neutral-100 h-full w-full hover:border-neutral-200 transition-all duration-500 hover:shadow-lg'
    >
        <div className='flex flex-col h-full w-full'>
            <div className='relative flex-6 w-full h-40 aspect-[4/3] overflow-hidden'>
                {project?.renders?.length>0 && <Image
                    src={project?.renders?.[0]?.url}
                    alt={project?.buildingTitle || 'Project'}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                />}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"/>

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
                <h2 className='text-xl font-light text-neutral-900 mb-2 tracking-wide group-hover:text-neutral-700 transition-colors duration-300'>
                    {project?.buildingTitle}
                </h2>

                {/* Project Title and Building Type*/}
                <div 
                    className="flex items-center mt-auto border-t border-neutral-100 -opacity-0 group-hover:opacity-100 justify-between transition-opacity duration-300 h-10"
                >
                    <div className='flex items-center text-xs h-fit text-neutral-500 font-light tracking-wider uppercase'>
                        {project?.projectTitle}
                    </div>
                    <div className="text-xs h-fit text-neutral-400 font-light tracking-widest text-center uppercase">
                        {project?.buildingType}
                    </div>
                </div>
                {/* Link to Project and Edit button */}
                <div
                    className="flex items-center border-t border-neutral-100 -opacity-0 group-hover:opacity-100 justify-between transition-opacity duration-300 mt-2"
                >
                    <Link href={`/houses/${project?._id}`} className="text-xs h-fit text-neutral-400 mt-2 tracking-widest text-center curores-pointer capitalize font-bold underline">
                        View Project
                    </Link>
                    <div className="flex space-x-2">
                        <Link href={`/admin/projects/${project?._id}`} className="text-xs h-fit text-neutral-400  tracking-widest mt-2 cursor-pointer text-center capitalize underline font-bold">
                            Edit
                        </Link>
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="text-xs h-fit text-red-400 tracking-widest mt-2 cursor-pointer text-center capitalize underline font-bold hover:text-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  )
}