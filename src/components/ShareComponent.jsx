'use client';

import { useState } from 'react';
import { IoShareSocialOutline } from 'react-icons/io5';
import { 
  FiCopy, 
  FiMail, 
  FiMessageCircle,
  FiX 
} from 'react-icons/fi';
import { 
  IoLogoWhatsapp, 
  IoLogoFacebook, 
  IoLogoTwitter,
  IoCheckmark
} from 'react-icons/io5';

/**
 * ShareComponent
 * Allows users to share building/house models with friends
 * 
 * @param {string} buildingId - Required. The ID of the building to share
 * @param {string} buildingTitle - Optional. Title to include in share message
 */
export default function ShareComponent({ buildingId, buildingTitle = 'this property' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate shareable URL
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/houses/${buildingId}`
    : '';

  const shareMessage = `Check out ${buildingTitle} on PalaMolo Properties!`;

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share via WhatsApp
  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  // Share via Facebook
  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Share via Twitter/X
  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Share via Email
  const shareEmail = () => {
    const subject = encodeURIComponent(shareMessage);
    const body = encodeURIComponent(`I thought you might be interested in this property:\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Share via SMS
  const shareSMS = () => {
    const body = encodeURIComponent(`${shareMessage} ${shareUrl}`);
    window.location.href = `sms:?&body=${body}`;
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
        aria-label="Share this property"
      >
        <IoShareSocialOutline className="text-xl" />
        <span className="font-medium text-sm">Share</span>
      </button>

      {/* Share Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <FiX className="text-2xl" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Property</h2>
              <p className="text-gray-600 text-sm">Share {buildingTitle} with friends and family</p>
            </div>

            {/* Copy Link Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <IoCheckmark /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FiCopy /> Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Share via
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* WhatsApp */}
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <IoLogoWhatsapp className="text-2xl" />
                  <span className="font-medium">WhatsApp</span>
                </button>

                {/* Email */}
                <button
                  onClick={shareEmail}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FiMail className="text-2xl" />
                  <span className="font-medium">Email</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={shareFacebook}
                  className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <IoLogoFacebook className="text-2xl" />
                  <span className="font-medium">Facebook</span>
                </button>

                {/* SMS */}
                <button
                  onClick={shareSMS}
                  className="flex items-center gap-3 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  <FiMessageCircle className="text-2xl" />
                  <span className="font-medium">SMS</span>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={shareTwitter}
                  className="flex items-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors col-span-2"
                >
                  <IoLogoTwitter className="text-2xl" />
                  <span className="font-medium">Twitter / X</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
