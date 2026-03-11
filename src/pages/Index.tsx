import { useState } from 'react';
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
import LoadingScreen from '@/components/LoadingScreen';
import Equipment from '@/components/Equipment';
import EquipmentLoadingScreen from '@/components/EquipmentLoadingScreen';
import WifeSection from '@/components/WifeSection';
import WifeLoadingScreen from '@/components/WifeLoadingScreen';
import UnlockAllLoadingScreen from '@/components/UnlockAllLoadingScreen';
import { useEasterEgg } from '@/hooks/useEasterEgg';

const Index = () => {
  const { isUnlocked, unlock } = useEasterEgg();
  const [isLoading, setIsLoading] = useState(true);
  const [showEquipment, setShowEquipment] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [showWife, setShowWife] = useState(false);
  const [wifeLoading, setWifeLoading] = useState(false);
  const [unlockAllLoading, setUnlockAllLoading] = useState(false);
  const [birthdayGuessed, setBirthdayGuessed] = useState(false);

  const allSecretsUnlocked = isUnlocked && showEquipment && showWife;

  const handleEasterEgg = (type?: string) => {
    if (type === 'equipment') setEquipmentLoading(true);
    else if (type === 'wife') setWifeLoading(true);
    else if (type === 'unlockall') setUnlockAllLoading(true);
    else unlock();
  };

  const handleEquipmentLoadComplete = () => {
    setEquipmentLoading(false); setShowEquipment(true);
    setTimeout(() => { document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' }); }, 300);
  };

  const handleWifeLoadComplete = () => {
    setWifeLoading(false); setShowWife(true);
    setTimeout(() => { document.getElementById('wife')?.scrollIntoView({ behavior: 'smooth' }); }, 300);
  };

  const handleUnlockAllComplete = () => {
    setUnlockAllLoading(false); unlock(); setShowEquipment(true); setShowWife(true); setBirthdayGuessed(true);
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 300);
  };

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <VideoButton visible={isUnlocked} />
      <ThemeToggle visible={isUnlocked} />
      <Header showEquipment={showEquipment} />
      <ScrollTransition />
      {equipmentLoading && <EquipmentLoadingScreen onComplete={handleEquipmentLoadComplete} />}
      {wifeLoading && <WifeLoadingScreen onComplete={handleWifeLoadComplete} />}
      {unlockAllLoading && <UnlockAllLoadingScreen onComplete={handleUnlockAllComplete} />}
      <main className="relative z-10">
        <Hero />
        <About onEasterEggUnlock={handleEasterEgg} easterEggUnlocked={isUnlocked} showWifeButton={showWife} onBirthdayGuessed={() => setBirthdayGuessed(true)} birthdayGuessed={birthdayGuessed} />
        <Skills showSecret={birthdayGuessed} onEasterEggUnlock={handleEasterEgg} allSecretsUnlocked={allSecretsUnlocked} easterEggUnlocked={isUnlocked} equipmentUnlocked={showEquipment} wifeUnlocked={showWife} />
        <Projects />
        {showEquipment && <Equipment />}
        {showWife && <WifeSection />}
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
