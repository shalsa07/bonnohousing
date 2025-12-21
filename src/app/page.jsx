import LoadApplicationForm from "@/components/forms/LoadApplicationForm";
import LandingPageCarousel from "@/components/LandingPageCarousel";
import LandingPageTextCmponent from "@/components/LandingPageTextCmponent";
import Image from "next/image";
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';

import Link from "next/link";
import clientPromise from "@/libs/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let buildings = [];
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");
    const rawBuildings = await db.collection('buildings').find({}).sort({ createdAt: -1 }).toArray();
    buildings = JSON.parse(JSON.stringify(rawBuildings));
  } catch (e) {
    console.error("Failed to fetch buildings", e);
  }

  return (
    <main className="main-wrapper h-screen flex w-screen flex-col overflow-y-scroll">
      <LandingPageCarousel />
      <LandingPageTextCmponent initialBuildings={buildings} />
      <LoadApplicationForm />
    </main>
  );
}
