import HeroSection from '@/components/home/HeroSection';
import FeaturedHighlights from '@/components/home/FeaturedHighlights';
import SelectedWorks from '@/components/home/SelectedWorks';
import ArchiveSection from '@/components/home/ArchiveSection';
import ArtistIdentity from '@/components/home/ArtistIdentity';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <HeroSection />
      <FeaturedHighlights />
      <SelectedWorks />
      <ArchiveSection />
      <ArtistIdentity />
    </main>
  );
}
