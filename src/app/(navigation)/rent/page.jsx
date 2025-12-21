'use client';

import { useState } from 'react';
import PagesWrapper from '@/components/PagesWrapper';
import LoanPrequalificationModal from '@/components/forms/LoanPrequalificationModal';
import Link from 'next/link';

export default function RentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <PagesWrapper>
                <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-gradient-to-br from-green-50 to-white">
                    <div className="max-w-3xl text-center">
                        <h1 className="text-5xl font-light text-gray-900 mb-6">
                            Rent Your Ideal Property
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Discover rental properties that suit your lifestyle.
                            From short-term to long-term rentals, find your perfect home today.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Flexible Terms</h3>
                                <p className="text-gray-600">
                                    Choose from various rental periods that fit your needs.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Well-Maintained</h3>
                                <p className="text-gray-600">
                                    All rental properties are regularly maintained to high standards.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Great Locations</h3>
                                <p className="text-gray-600">
                                    Properties in convenient locations with easy access to amenities.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Process</h3>
                                <p className="text-gray-600">
                                    Fast and efficient rental application and approval process.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/houses"
                                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Browse Rental Properties
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Apply to Rent
                            </button>
                        </div>

                        <p className="mt-8 text-sm text-gray-500">
                            Questions? <Link href="/contacts" className="text-green-600 hover:underline">Contact us</Link> for more information.
                        </p>
                    </div>
                </div>
            </PagesWrapper>

            <LoanPrequalificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyType="rent"
            />
        </>
    );
}
