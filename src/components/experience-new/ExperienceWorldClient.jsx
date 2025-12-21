'use client';
import dynamic from 'next/dynamic';

const ExperienceWorld = dynamic(() => import('./ExperienceWorld'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
            <div className="text-white text-xl">Loading Experience...</div>
        </div>
    ),
});

export default function ExperienceWorldClient({ data }) {
    return <ExperienceWorld data={data} />;
}
