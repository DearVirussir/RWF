import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Staff from '@/components/Staff';
import Cases from '@/components/Cases';
import KeyInitiatives from '@/components/KeyInitiatives';
import Gallery from '@/components/Gallery';
import Donation from '@/components/Donation';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollRevealWrapper from '@/components/ScrollRevealWrapper';
import SpecialAppeal from '@/components/SpecialAppeal';
import SpecialAppeal from '@/components/SpecialAppeal';

export default function Home() {
  return (
    <ScrollRevealWrapper>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <SpecialAppeal />
        <About />
        <Staff />
        <Cases />
        <KeyInitiatives />
        <Gallery />
        <Donation />
        <Contact />
        <Footer />
      </main>
    </ScrollRevealWrapper>
  );
}
