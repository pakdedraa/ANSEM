import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PriceChart from '@/components/PriceChart';
import CreatorFeeTracker from '@/components/CreatorFeeTracker';
import NarrativeSection from '@/components/NarrativeSection';
import ArtGallery from '@/components/ArtGallery';
import ContractTerminal from '@/components/ContractTerminal';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-neutral-100 selection:bg-white selection:text-black">
      <Navbar />
      <Hero />
      <PriceChart />
      <CreatorFeeTracker />
      <NarrativeSection />
      <ArtGallery />
      <ContractTerminal />
      <Footer />
    </main>
  );
}
