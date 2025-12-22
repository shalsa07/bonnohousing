'use client'
import { settings } from '@/libs/settings'
import React from 'react'
import { IoLogoWhatsapp } from 'react-icons/io5'

export default function ChatComponent() {

  const chatMessageEconded='Hello%2C%20I%20visited%20Luyari.com%20and%20I%20am%20interested%20in%20your%20services.%20I%20would%20like%20to%20chat%20with%20you%20about%20your%20services%2C'
  const chatMessage='Hello, I visited Luyari.com and I am interested in your services. I would like to chat with you about your services,'
  
  const runWhatsappLink = () => {
    if(!window) return
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${chatMessage}`)
  }
  
  return (
    <div 
      onClick={runWhatsappLink} 
      className='whatsapp-wrapper flex z-50 rounded-full items-center justify-center bg-green-500 fixed bottom-2 p-1 left-2 cursor-pointer'
    >
      <IoLogoWhatsapp className='text-5xl text-white'/>
    </div>
  )
}
