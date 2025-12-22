'use client';
import dynamic from 'next/dynamic';
import LoadingComponent from '../LoadingComponent';

const ExperienceWorld = dynamic(() => import('./ExperienceWorld'), {
    ssr: false,
    loading: () => (
        // <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
        //     <div className="text-white text-xl">Loading Experience...</div>
        // </div>
        <LoadingComponent />
    ),
});

export default function ExperienceWorldClient({ data }) {
    return <ExperienceWorld data={data} />;
}
