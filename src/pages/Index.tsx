import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ThemeToggle from '@/components/ThemeToggle';
import VideoButton from '@/components/VideoButton';
import ScrollTransition from '@/components/ScrollTransition';
import ParticleBackground from '@/components/ParticleBackground';
import { useEasterEgg } from '@/hooks/useEasterEgg';

const Index = () => {
  const { isUnlocked, unlock } = useEasterEgg();

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <VideoButton visible={isUnlocked} />
      <ThemeToggle visible={isUnlocked} />
      <Header />
      <ScrollTransition />
      <main className="relative z-10">
        <Hero />
        <About onEasterEggUnlock={unlock} easterEggUnlocked={isUnlocked} />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
