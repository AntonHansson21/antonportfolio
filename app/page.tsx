import PixelCursor from "@/components/PixelCursor";
import StarField from "@/components/StarField";
import GridOverlay from "@/components/GridOverlay";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Global ambient layers */}
      <div className="scanline-sweep" />
      <StarField />
      <GridOverlay />
      <PixelCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
