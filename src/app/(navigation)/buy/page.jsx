'use client';

import { useState } from 'react';
import PagesWrapper from '@/components/PagesWrapper';
import LoanPrequalificationModal from '@/components/forms/LoanPrequalificationModal';
import Link from 'next/link';

export default function BuyPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <PagesWrapper>
                <div className="flex flex-col items-center overflow-y-auto h-full w-full p-8 bg-gradient-to-br from-blue-50 to-white">
                    <div className="max-w-3xl text-center">
                        <h1 className="text-5xl font-light text-gray-900 mb-6">
                            Buy Your Dream Home
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Explore our collection of quality homes available for purchase.
                            From modern apartments to spacious family houses, find the perfect property for you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Quality Construction</h3>
                                <p className="text-gray-600">
                                    All our properties are built to the highest standards with premium materials.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Flexible Financing</h3>
                                <p className="text-gray-600">
                                    We offer various financing options to help you secure your dream home.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Prime Locations</h3>
                                <p className="text-gray-600">
                                    Properties in desirable locations across Mahalapye West, Mowana Ward and other areas.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Expert Support</h3>
                                <p className="text-gray-600">
                                    Our team guides you through every step of the buying process.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/houses"
                                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Browse Available Properties
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Apply for Financing
                            </button>
                        </div>

                        <p className="mt-8 text-sm text-gray-500">
                            Questions? <Link href="/contacts" className="text-blue-600 hover:underline">Contact us</Link> for more information.
                        </p>
                    </div>
                </div>
            </PagesWrapper>

            <LoanPrequalificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyType="buy"
            />
        </>
    );
}
