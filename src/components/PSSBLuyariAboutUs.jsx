import React from 'react'
import { FaQuoteLeft } from 'react-icons/fa'

export default function PSSBLuyariAboutUs() {
  return (
    <div className="about-us-text flex flex-col h-full w-full items-start font-sans text-neutral-600 bg-white selection:bg-black selection:text-white overflow-y-auto"> 
      <div className='flex flex-col w-full h-fit'>
        {/* --- HEADER IMAGE --- */}
        <section className="relative h-[60vh] flex items-center justify-center bg-neutral-100 overflow-hidden mt-10">
          <div className="absolute inset-0 z-0">
            {/* <img 
              src="https://placehold.co/1920x800/e5e5e5/999999?text=Our+Vision" 
              alt="PPSBluyari Architecture" 
              className="w-full h-full object-cover grayscale opacity-80"
            /> */}
          </div>
          <div className="relative z-10 bg-white/90 p-12 max-w-3xl text-center shadow-sm">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Who We Are
            </h1>
            <div className="w-16 h-1 bg-black mx-auto"></div>
          </div>
        </section>

        {/* --- MAIN CONTENT (3 PARAGRAPHS) --- */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Paragraph 1: Intro */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <h2 className="text-2xl font-bold uppercase tracking-widest w-full md:w-1/3 shrink-0">
                Building Beyond Boundaries
              </h2>
              <p className="flex flex-col text-lg md:text-xl text-neutral-600 leading-relaxed font-light w-full md:w-2/3 gap-4">
                <p>Bonno Housing Development is a joint venture between <em className="font-serif text-black">PalaMolo Property Services Botswana</em> and <em className="font-serif text-black">Tredinnick Companies</em>—two developer-led firms united by a shared belief that housing must do more than shelter people; it must <strong className="text-black">strengthen communities and unlock long-term value.</strong></p>

                <p>Building beyond boundaries means going further than conventional development. It means designing housing that respects its social context, responds to its environment, and remains adaptable as cities and villages evolve. Our developments are not isolated projects; they are part of a broader vision to shape sustainable human settlements across Botswana and the Southern African region.</p>

                <p>This partnership brings together local insight and international development experience, enabling us to deliver projects that are <strong className="text-black">context-aware, scalable, and future-ready</strong>.</p>
              </p>
              {/* <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light w-full md:w-2/3">
                PPSBluyari is a dynamic property development firm rooted in Southern Africa, dedicated to reshaping the region's architectural and economic landscape. We are not just builders; we are <em className="font-serif text-black">visionaries</em> committed to bridging the gap between exclusive luxury and essential national infrastructure. Our presence spans borders and sectors, driven by a singular mission: to create sustainable environments where <strong className="text-black">communities thrive</strong> and <strong className="text-black">economies grow</strong>.
              </p> */}
            </div>

            <hr className="border-neutral-200" />

            {/* Paragraph 2: Values */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <h2 className="text-2xl font-bold uppercase tracking-widest w-full md:w-1/3 shrink-0">
                What We Stand For
              </h2>
              <div className="flex flex-col w-full md:w-2/3 text-lg md:text-xl text-neutral-600 leading-relaxed font-light mb-8 gap-4">
                <p><strong className="text-black">We stand for purpose-driven development.</strong></p>
                <p>Every Bonno project is guided by three core principles:</p>

                <ul className='flex flex-col gap-2'>
                  <li className='font-serif ml-2 italic'>1. Integrity in delivery – what we promise is what we build.</li>
                  <li className='font-serif ml-2 italic'>2. Design with intent – homes are planned to be functional, dignified, and enduring.</li>
                  <li className='font-serif ml-2 italic'>3. Long-term value – for homeowners, communities, and the nation.</li>
                </ul>

                <p>We believe housing should be accessible without compromising quality, aspirational without being excessive, and efficient without losing its human character. Our approach balances <em className="font-serif text-black">commercial discipline with social responsibility</em>, ensuring that each development contributes meaningfully to national housing objectives and local economic growth.</p>

                <p>Above all, we believe that well-planned housing is nation-building.</p>

                {/* <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light mb-8">
                  We believe that true development is inclusive. Our philosophy rests on three pillars: <strong className="text-black uppercase text-sm tracking-wider">Innovation, Quality, & Social Responsibility</strong>. We stand for the homeowner seeking a bespoke sanctuary in Zambia, the family needing dignity and security through the Bonno Housing Scheme, and the industrialist driving Botswana’s economy in the SEZA Logistics City.
                </p> */}

                <div className="bg-neutral-100/20 p-8 border-l-4 border-black relative">
                  <FaQuoteLeft className="text-neutral-300 absolute top-4 left-4 text-2xl" />
                  <p className="font-serif italic text-lg text-neutral-800 pl-6 relative z-10">
                    "In every project, we uphold uncompromising standards of construction and design, ensuring that our footprint leaves a lasting legacy of prosperity and empowerment."
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* Paragraph 3: Portfolio Summary */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <h2 className="text-2xl font-bold uppercase tracking-widest w-full md:w-1/3 shrink-0">
                Our Diverse Portfolio
              </h2>
              <div className="w-full md:w-2/3 flex flex-col gap-4 text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
                <p>Our portfolio spans residential housing, mixed-use developments, and property-led infrastructure initiatives, delivered through both private-sector and public-aligned partnerships.</p>

                <p>Through PalaMolo Property Services Botswana and Tredinnick companies, the joint venture draws on experience across:</p>

                <ul className='flex flex-col gap-4'>
                  <li className='font-serif ml-4 italic'>1. Affordable and middle-income housing</li>
                  <li className='font-serif ml-4 italic'>2. Master-planned residential communities</li>
                  <li className='font-serif ml-4 italic'>3. Property development aligned with government and institutional stakeholders</li>
                  <li className='font-serif ml-4 italic'>4. Scalable developments adaptable to urban, peri-urban, and village contexts</li>
                </ul>

                <p>This diversity allows Bonno Housing Development to respond to varying market needs while maintaining a consistent standard of quality, governance, and execution. Each project is approached with the same discipline—clear planning, robust delivery structures, and a focus on long-term performance.</p>

                {/* <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
                  Our work is defined by its versatility and scale. From the <em className="font-serif text-black">signature elegance</em> of our private residential estates in <strong>Zambia</strong> to the massive operational scope of the <strong>700-hectare Francistown SEZA</strong> precinct, we demonstrate that high-end design and large-scale utility can coexist. By partnering with governments on initiatives like the <strong>Bonno Housing Scheme</strong>, we actively participate in solving national challenges, proving that property development is a powerful catalyst for social change and industrial progress.
                </p> */}
              </div>
            </div>

          </div>
        </section>

        {/* --- VISUAL BREAK --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 h-64 md:h-96 w-full">
          <div className="relative group overflow-hidden">
            <div className='flex relative w-full h-full gap-10 flex-col items-center justify-center'>
              <img src="https://placehold.co/600x800/1a1a1a/ffffff?text=Luxury" alt="Luxury" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale" />
              <div className="absolute inset-0 mb-32 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold tracking-[0.2em] uppercase border border-white px-4 py-2">Zambia</span>
              </div>
            </div>
          </div>
          <div className="relative group overflow-hidden">
            <div className='flex relative w-full h-full gap-10 flex-col items-center justify-center'>
              <img src="https://placehold.co/600x800/333333/ffffff?text=Community" alt="Community" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale" />
              <div className="absolute inset-0 mb-32 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold tracking-[0.2em] uppercase border border-white px-4 py-2">Bonno Scheme</span>
              </div>
            </div>
          </div>
          <div className="relative group overflow-hidden">
            <div className='flex relative w-full h-full gap-10 flex-col items-center justify-center'>
              <img src="https://placehold.co/600x800/000000/ffffff?text=Industry" alt="Industry" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale" />
              <div className="absolute inset-0 mb-32 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold tracking-[0.2em] uppercase border border-white px-4 py-2">SEZA Industrial</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
