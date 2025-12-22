'use client';

import { useEffect } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import { IoLogoWhatsapp } from 'react-icons/io';
import { BiMessageDetail, BiCopy } from 'react-icons/bi';

export default function ContactOptionsModal({ isOpen, onClose, phoneNumber }) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Format phone number for URLs (remove spaces and special chars)
  const formattedPhone = phoneNumber.replace(/\s+/g, '');

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      // Show success feedback
      alert('Phone number copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = phoneNumber;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Phone number copied to clipboard!');
      } catch (err) {
        alert('Failed to copy number');
      }
      document.body.removeChild(textArea);
    }
  };

  const contactOptions = [
    {
      icon: FiPhone,
      label: 'Call',
      description: 'Make a phone call',
      href: `tel:${formattedPhone}`,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      icon: IoLogoWhatsapp,
      label: 'WhatsApp',
      description: 'Message on WhatsApp',
      href: `https://wa.me/${formattedPhone}?text=Hello%2C%20I%27m%20interested%20in%20your%20properties`,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      target: '_blank',
    },
    {
      icon: BiMessageDetail,
      label: 'SMS',
      description: 'Send a text message',
      href: `sms:${formattedPhone}`,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
    },
    {
      icon: BiCopy,
      label: 'Copy Number',
      description: 'Copy to clipboard',
      onClick: handleCopyNumber,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-light text-gray-900">
            Contact Us
          </h2>
          <p className="text-gray-600 mt-1">Choose your preferred method</p>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <FiX className="text-2xl text-gray-500" />
          </button>
        </div>

        {/* Phone Number Display */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-center text-2xl font-medium text-gray-900 tracking-wide">
            {phoneNumber}
          </p>
        </div>

        {/* Contact Options Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            const content = (
              <>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                  <Icon className="text-2xl text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{option.label}</h3>
                <p className="text-xs text-gray-600">{option.description}</p>
              </>
            );

            const baseClasses = "group relative p-4 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

            if (option.onClick) {
              return (
                <button
                  key={index}
                  onClick={option.onClick}
                  className={baseClasses}
                >
                  {content}
                </button>
              );
            }

            return (
              <a
                key={index}
                href={option.href}
                target={option.target}
                rel={option.target ? 'noopener noreferrer' : undefined}
                className={baseClasses}
              >
                {content}
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-500">
            Available Monday - Friday: 8AM - 5PM | Saturday: 9AM - 1PM
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
