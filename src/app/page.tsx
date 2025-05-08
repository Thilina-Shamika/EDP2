import Header from "@/components/shared/Header";
import Hero from '@/components/shared/Hero';
import PremiumProjects from '@/components/shared/PremiumProjects';
import Mortgage from '@/components/shared/Mortgage';
import LatestLaunches from '@/components/shared/LatestLaunches';
import FullWidthSection from '@/components/shared/FullWidthSection';
import Counter from '@/components/shared/Counter';
import MediaCenter from '@/components/shared/MediaCenter';
import Footer from '@/components/shared/Footer';
import HomeForm from '@/components/shared/HomeForm';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <PremiumProjects />
      <Mortgage />
      <LatestLaunches />
      <FullWidthSection />
      <Counter />
      <MediaCenter />
      <HomeForm />
      <Footer />
    </>
  );
}
