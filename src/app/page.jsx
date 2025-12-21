import LoadApplicationForm from "@/components/forms/LoadApplicationForm";
import LandingPageCarousel from "@/components/LandingPageCarousel";
import LandingPageTextCmponent from "@/components/LandingPageTextCmponent";
import Image from "next/image";
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="main-wrapper h-screen flex w-screen flex-col overflow-y-scroll">
      <LandingPageCarousel />
      <LandingPageTextCmponent />
      <LoadApplicationForm />
    </main>
  );
}
