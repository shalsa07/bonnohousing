'use client';

import { useEffect, useState } from 'react';
import { FiPhone, FiX, FiArrowLeft } from 'react-icons/fi';
import { IoLogoWhatsapp, IoChatbubblesOutline } from 'react-icons/io5';
import { BiMessageDetail, BiCopy } from 'react-icons/bi';

export default function ChatOptionsModal({ isOpen, onClose, phoneNumber }) {
  const [stage, setStage] = useState('choice'); // 'choice', 'contact', 'message'
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset modal when closed
  const handleClose = () => {
    setStage('choice');
    setFormData({ name: '', surname: '', phone: '', email: '', message: '' });
    setErrors({});
    setSubmitStatus(null);
    onClose();
  };

  // Format phone number for URLs
  const formattedPhone = phoneNumber.replace(/\s+/g, '');

  // Handle copy number
  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      alert('Phone number copied to clipboard!');
    } catch (err) {
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

  // Contact options for Stage 2a
  const contactOptions = [
    {
      icon: FiPhone,
      label: 'Call',
      description: 'Make a phone call',
      href: `tel:${formattedPhone}`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: IoLogoWhatsapp,
      label: 'WhatsApp',
      description: 'Message on WhatsApp',
      href: `https://wa.me/${formattedPhone}?text=Hello%2C%20I%27m%20interested%20in%20your%20properties`,
      color: 'from-green-500 to-green-600',
      target: '_blank',
    },
    {
      icon: BiMessageDetail,
      label: 'SMS',
      description: 'Send a text message',
      href: `sms:${formattedPhone}`,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BiCopy,
      label: 'Copy Number',
      description: 'Copy to clipboard',
      onClick: handleCopyNumber,
      color: 'from-gray-500 to-gray-600',
    },
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! We\'ll get back to you soon.'
        });
        setFormData({ name: '', surname: '', phone: '', email: '', message: '' });
        setTimeout(() => handleClose(), 3000);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-200">
          {stage !== 'choice' && (
            <button
              onClick={() => setStage('choice')}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-xl text-gray-600" />
            </button>
          )}
          <h2 className="text-2xl font-light text-gray-900 text-center">
            {stage === 'choice' && 'How can we help?'}
            {stage === 'contact' && 'Contact Us'}
            {stage === 'message' && 'Send a Message'}
          </h2>
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <FiX className="text-2xl text-gray-500" />
          </button>
        </div>

        {/* Stage 1: Choice Screen */}
        {stage === 'choice' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setStage('contact')}
              className="w-full p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FiPhone className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Call Us</h3>
                  <p className="text-sm text-gray-600">Contact via phone or WhatsApp</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setStage('message')}
              className="w-full p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <IoChatbubblesOutline className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Send Message</h3>
                  <p className="text-sm text-gray-600">Fill out a quick form</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Stage 2a: Contact Options */}
        {stage === 'contact' && (
          <>
            <div className="px-6 py-4 bg-gray-50">
              <p className="text-center text-2xl font-medium text-gray-900 tracking-wide">
                {phoneNumber}
              </p>
            </div>
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

                const baseClasses = "group p-4 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

                if (option.onClick) {
                  return (
                    <button key={index} onClick={option.onClick} className={baseClasses}>
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
          </>
        )}

        {/* Stage 2b: Message Form */}
        {stage === 'message' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name *"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loading}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Surname *"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.surname ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loading}
                />
                {errors.surname && <p className="mt-1 text-xs text-red-600">{errors.surname}</p>}
              </div>
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (Optional)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Your message (min 10 characters) *"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
