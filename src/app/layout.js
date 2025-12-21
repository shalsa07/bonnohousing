import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExperienceContextProvider from "@/libs/contextProviders/experienceContext";
import WhatsAppComponent from "@/components/WhatsAppComponent";
import AuthProvider from "@/libs/AuthProvider";
import SiteContextProvider from "@/libs/contextProviders/siteContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bonno Housing Scheme",
  description: "bonno housing scheme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <AuthProvider>
          <SiteContextProvider>
            <ExperienceContextProvider>
              <Navbar />
              <Footer />
              {children}
              {/* <WhatsAppComponent/> */}
            </ExperienceContextProvider>
          </SiteContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
