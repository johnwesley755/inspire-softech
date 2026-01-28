import HeroSection from '../components/home/HeroSection';
import TrendingSection from '../components/home/TrendingSection';
import EditorialSection from '../components/home/EditorialSection';
import CategoryGrid from '../components/home/CategoryGrid';
import VideoSection from '../components/home/VideoSection';
import NewsletterSection from '../components/home/NewsletterSection';

import TopRatedSection from '../components/home/TopRatedSection';

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <TrendingSection />
      <TopRatedSection />
      <EditorialSection />
      <CategoryGrid />
      <VideoSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
