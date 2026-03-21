import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import BackToTop from '@/components/BackToTop';

interface DetailPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DetailPageLayout = ({ children, title }: DetailPageLayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastSection = sessionStorage.getItem('last_active_section') || 'hero';
  const returnUrl = `/#${lastSection}`;

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={returnUrl}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-mono text-sm">Back</span>
          </Link>
          <span className="text-sm font-bold text-foreground tracking-wide">{title}</span>
          <div className="w-16" />
        </div>
      </header>
      <main className="relative z-10 pt-20">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default DetailPageLayout;
