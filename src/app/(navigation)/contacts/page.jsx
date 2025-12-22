import PagesWrapper from '@/components/PagesWrapper';
import ContactForm from '@/components/forms/ContactForm';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function ContactsPage() {
  return (
    <PagesWrapper>
      <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left Side - Contact Information */}
        <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-light mb-4">Get in Touch</h1>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Have a question or want to learn more about our properties? We'd love to hear from you.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FiMail className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a href="mailto:info@ppsbluyari.com" className="text-blue-100 hover:text-white transition-colors">
                    pm@palamoloproperties.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FiPhone className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <a href="tel:+26774308319" className="text-blue-100 hover:text-white transition-colors">
                    +267 75 696 516
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FiMapPin className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="text-blue-100">
                    Botswana
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <h3 className="font-medium mb-3">Business Hours</h3>
              <div className="text-blue-100 space-y-1">
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 1:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="lg:w-3/5 bg-white p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-2">Send us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <ContactForm />

            {/* Additional Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Why Choose PalaMolo Property Services Botswana?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Quality Construction</h4>
                  <p>We build homes with the highest standards of quality and craftsmanship.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Flexible Financing</h4>
                  <p>Various financing options available to suit your needs.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prime Locations</h4>
                  <p>Properties in desirable locations across Botswana and Zambia.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expert Support</h4>
                  <p>Our team is here to guide you through every step of the process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PagesWrapper>
  );
}
