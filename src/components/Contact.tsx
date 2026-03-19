import { Youtube, Instagram, Github, ArrowUpRight, Globe } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const ModrinthIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M12.252.004a11.78 11.768 0 0 0-8.92 3.73 11 10.999 0 0 0-2.17 3.11 11.37 11.359 0 0 0-1.16 5.169c0 1.42.17 2.5.6 3.77.24.759.77 1.899 1.17 2.529a12.3 12.298 0 0 0 8.85 5.639c.44.05 2.54.07 2.76.02.2-.04.22.1-.26-1.7l-.36-1.37-1.01-.06a8.5 8.489 0 0 1-5.18-1.8 5.34 5.34 0 0 1-1.3-1.26c0-.05.34-.28.74-.5a37.572 37.545 0 0 1 2.88-1.629c.03 0 .5.45 1.06.98l1 .97 2.07-.43 2.06-.43 1.47-1.47c.8-.8 1.48-1.5 1.48-1.52 0-.09-.42-1.63-.46-1.7-.04-.06-.2-.03-1.02.18-.53.13-1.2.3-1.45.4l-.48.15-.53.53-.53.53-.93.1-.93.07-.52-.5a2.7 2.7 0 0 1-.96-1.7l-.13-.6.43-.57c.68-.9.68-.9 1.46-1.1.4-.1.65-.2.83-.33.13-.099.65-.579 1.14-1.069l.9-.9-.7-.7-.7-.7-1.95.54c-1.07.3-1.96.53-1.97.53-.03 0-2.23 2.48-2.63 2.97l-.29.35.28 1.03c.16.56.3 1.16.31 1.34l.03.3-.34.23c-.37.23-2.22 1.3-2.84 1.63-.36.2-.37.2-.44.1-.08-.1-.23-.6-.32-1.03-.18-.86-.17-2.75.02-3.73a8.84 8.839 0 0 1 7.9-6.93c.43-.03.77-.08.78-.1.06-.17.5-2.999.47-3.039-.01-.02-.1-.02-.2-.03Zm3.68.67c-.2 0-.3.1-.37.38-.06.23-.46 2.42-.46 2.52 0 .04.1.11.22.16a8.51 8.499 0 0 1 2.99 2 8.38 8.379 0 0 1 2.16 3.449 6.9 6.9 0 0 1 .4 2.8c0 1.07 0 1.27-.1 1.73a9.37 9.369 0 0 1-1.76 3.769c-.32.4-.98 1.06-1.37 1.38-.38.32-1.54 1.1-1.7 1.14-.1.03-.1.06-.07.26.03.18.64 2.56.7 2.78l.06.06a12.07 12.058 0 0 0 7.27-9.4c.13-.77.13-2.58 0-3.4a11.96 11.948 0 0 0-5.73-8.578c-.7-.42-2.05-1.06-2.25-1.06Z" />
  </svg>
);

const CurseForgeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"} aria-hidden="true">
    <path d="M18.326 9.2145S23.2261 8.4418 24 6.1882h-7.5066V4.4H0l2.0318 2.3576V9.173s5.1267-.2665 7.1098 1.2372c2.7146 2.516-3.053 5.917-3.053 5.917L5.0995 19.6c1.5465-1.4726 4.494-3.3775 9.8983-3.2857-2.0565.65-4.1245 1.6651-5.7344 3.2857h10.9248l-1.0288-3.2726s-7.918-4.6688-.8336-7.1127z" />
  </svg>
);

const gridSocialLinks = [
  { icon: Youtube, href: 'https://www.youtube.com/@badutzy', label: 'YouTube', username: '@badutzy', color: 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' },
  { icon: Instagram, href: 'https://www.instagram.com/rzky.mp_36/', label: 'Instagram', username: '@rzky.mp_36', color: 'hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30' },
  { icon: XIcon, href: 'https://x.com/BadutZYY_', label: 'X', username: '@BadutZYY_', isCustomIcon: true, color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30' },
  { icon: ModrinthIcon, href: 'https://modrinth.com/user/BadutZY', label: 'Modrinth', username: '@BadutZY', isCustomIcon: true, color: 'hover:bg-[#00AF5C]/10 hover:text-[#00AF5C] hover:border-[#00AF5C]/30' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@badutzy._', label: 'TikTok', username: '@badutzy._', isCustomIcon: true, color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30' },
  { icon: CurseForgeIcon, href: 'https://www.curseforge.com/members/badutzy', label: 'CurseForge', username: '@badutzy', isCustomIcon: true, color: 'hover:bg-[#F16436]/10 hover:text-[#F16436] hover:border-[#F16436]/30' },
];

const githubLink = { icon: Github, href: 'https://github.com/BadutZY', label: 'GitHub', username: '@BadutZY', color: 'hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/30' };

const SocialCard = ({ link, index, isVisible, className }: { link: typeof gridSocialLinks[0]; index: number; isVisible: boolean; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = link.icon;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 ${link.color} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : '0ms' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${link.label} - ${link.username}`}
    >
      <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-transparent">
        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground transition-colors duration-300">{link.label}</div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">{link.username}</div>
      </div>
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-primary/10 text-primary translate-x-0 opacity-100' : 'opacity-0 -translate-x-2'}`}>
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </a>
  );
};

const Contact = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.1, true);
  const { ref: socialRef, isVisible: socialVisible } = useScrollAnimation(0.1, true);

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Section Banner */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-24">
        <div ref={sectionRef} className={`rounded-3xl overflow-hidden border border-border/30 bg-card/30 p-8 md:p-12 lg:p-16 text-center transition-all duration-700 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">Get In Touch</h2>
          <div className="flex gap-1 justify-center mb-6">
            <div className="w-12 h-1 rounded-full bg-primary" />
            <div className="w-6 h-1 rounded-full bg-primary/50" />
          </div>
          <p className="text-muted-foreground max-w-md mx-auto text-base md:text-lg leading-relaxed">
            Feel free to reach out through any of my social platforms. I'm always open to new connections!
          </p>
        </div>
      </div>

      {/* Social Grid */}
      <div ref={socialRef} className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
          {gridSocialLinks.map((link, i) => (
            <SocialCard key={link.label} link={link} index={i} isVisible={socialVisible} />
          ))}
        </div>
        <div className="max-w-2xl mx-auto flex justify-center">
          <div className="w-full sm:w-[calc(50%-0.5rem)]">
            <SocialCard link={githubLink} index={gridSocialLinks.length} isVisible={socialVisible} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
