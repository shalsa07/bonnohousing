'use client'
import { useState } from 'react'
import { IoHeadsetOutline } from 'react-icons/io5'
import ChatOptionsModal from './modals/ChatOptionsModal'
import { settings } from '@/libs/settings';

export default function ChatComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const phoneNumber = '+267 75 696 516';
  
  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)} 
        className={`flex z-50 rounded-full items-center justify-center ${settings.bonnoGreen} ${settings.bonnoHoverBlue} fixed bottom-24 p-1 right-2 cursor-pointer transition-colors shadow-lg hover:shadow-xl`}
        aria-label="Contact us"
      >
        <IoHeadsetOutline className='text-5xl text-white'/>
      </div>

      <ChatOptionsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phoneNumber={phoneNumber}
      />
    </>
  )
}
