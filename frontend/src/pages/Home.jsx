import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import AuthSection from '../components/home/AuthSection';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <AuthSection />
      <Footer />
    </div>
  );
};

export default Home;
