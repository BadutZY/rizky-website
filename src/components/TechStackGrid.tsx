import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import fabricIcon from '@/assets/icons/fabric.png';
import forgeIcon from '@/assets/icons/forge.png';

const techLogos = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', alt: 'HTML5' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', alt: 'CSS3' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', alt: 'Bootstrap' },
  { src: 'https://skillicons.dev/icons?i=tailwind', alt: 'Tailwind CSS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', alt: 'JavaScript' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', alt: 'C#' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg', alt: 'Unity' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', alt: 'Java' },
  { src: fabricIcon, alt: 'Fabric' },
  { src: forgeIcon, alt: 'Forge' },
  { src: 'https://skillicons.dev/icons?i=gradle', alt: 'Gradle' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', alt: 'TypeScript' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React' },
  { src: 'https://skillicons.dev/icons?i=vite', alt: 'Vite' },
  { src: 'https://skillicons.dev/icons?i=nodejs', alt: 'Node.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', alt: 'PHP' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg', alt: 'Laravel' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', alt: 'MySQL' },
  { src: 'https://skillicons.dev/icons?i=supabase', alt: 'Supabase' },
];

const TechStackGrid = () => {
  const { ref, isVisible } = useScrollAnimation(0.1, true);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container max-w-3xl px-4 mx-auto">
        <div ref={ref} className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Tech Stack</h3>
          <p className="text-muted-foreground text-sm md:text-base">Technologies I've worked with</p>
        </div>
        <div className={`flex flex-wrap justify-center gap-6 md:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {techLogos.map((logo, i) => (
            <div
              key={logo.alt}
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1"
              style={{ transitionDelay: isVisible ? `${i * 40}ms` : '0ms' }}
            >
              <img src={logo.src} alt={logo.alt} className="w-7 h-7 md:w-8 md:h-8 object-contain" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {logo.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackGrid;
