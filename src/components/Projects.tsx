import { useRef, useEffect, useState, useMemo } from 'react';
import { ExternalLink, ArrowUpRight, Code2, Sparkles, Filter } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ProjectModal from './ProjectModal';
import modImg from "@/assets/project/modrinth.png";
import boxImg from "@/assets/project/box-siege-website.png";
import eqnoxImg from "@/assets/project/eqnox-website.png";
import jktImg from "@/assets/project/jkt48-website.png";
import fritzyImg from "@/assets/project/fritzy-force-website.png";
import taskImg from "@/assets/project/task-manager.png";
import classImg from "@/assets/project/class-website.png";
import portoImg from "@/assets/project/portofolio.png";

const projects = [
  { id: 1, title: 'Minecraft Mods', category: 'Java', image: modImg, link: 'https://modrinth.com/user/BadutZY/mods', fullDescription: 'Several minecraft mods available on modrinth.', description: 'Several minecraft mods available on modrinth.' },
  { id: 2, title: 'Box Siege Website', category: 'Unity / C#', image: boxImg, link: 'https://box-siege.vercel.app/', fullDescription: 'Website to download games made by me and my team.', description: 'Game Website' },
  { id: 3, title: 'Equinox Interactive', category: 'Vite / React', image: eqnoxImg, link: 'https://equinox-website-seven.vercel.app/', fullDescription: 'Website from the team that I created with my friend to make games.', description: 'Company website' },
  { id: 4, title: 'JKT48 Remake', category: 'HTML / CSS / JS', image: jktImg, link: 'https://jkt48-website.vercel.app/', fullDescription: 'A fan-made website for JKT48 featuring member profiles, event schedules, news updates.', description: 'Fan site' },
  { id: 5, title: 'Fritzy Force', category: 'HTML / CSS / JS', image: fritzyImg, link: 'https://fritzy-force-website.vercel.app/', fullDescription: 'This is a fan-made website created by me for a fanbase called fritzy force.', description: 'Fanbase website' },
  { id: 6, title: 'Task Manager', category: 'JS + Local Storage', image: taskImg, link: 'https://task-web-snowy.vercel.app/', fullDescription: 'Website to remind me about unfinished tasks.', description: 'Task manager' },
  { id: 7, title: 'Class Website', category: 'Vite / React', image: classImg, link: 'https://xi-rpl-2.vercel.app/', fullDescription: 'Website for my class schedule and duty schedule.', description: 'Class website' },
  { id: 8, title: 'Portfolio', category: 'Vite / React', image: portoImg, link: '#home', fullDescription: 'Portfolio website to showcase projects.', description: 'Portfolio' },
];

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'HTML / CSS / JS', label: 'HTML / CSS / JS' },
  { key: 'Vite / React', label: 'React / Vite' },
  { key: 'Java', label: 'Java' },
  { key: 'Unity / C#', label: 'Unity / C#' },
  { key: 'JS + Local Storage', label: 'Local Storage' },
];

interface SliderRowProps {
  items: typeof projects;
  speed: number;
  direction: 'left' | 'right';
  onSelectProject: (p: typeof projects[0]) => void;
}

const SliderRow = ({ items, speed, direction, onSelectProject }: SliderRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPos = useRef(0);
  const isDragging = useRef(false);
  const isPausedRef = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollPos = useRef(0);
  const hasDragged = useRef(false);
  const initializedRef = useRef(false);

  const CARD_WIDTH_MOBILE = 280;
  const CARD_WIDTH_DESKTOP = 360;
  const GAP = 20;

  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);

  useEffect(() => {
    const updateWidth = () => {
      setCardWidth(window.innerWidth < 640 ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const totalWidth = items.length * (cardWidth + GAP);

  const wrapPos = (pos: number) => {
    const w = totalWidth;
    return ((pos % w) + w) % w;
  };

  useEffect(() => {
    if (!initializedRef.current) {
      if (direction === 'right') scrollPos.current = totalWidth;
      initializedRef.current = true;
    }

    const animate = () => {
      if (!isPausedRef.current && !isDragging.current && scrollRef.current) {
        if (direction === 'left') {
          scrollPos.current += speed;
        } else {
          scrollPos.current -= speed;
        }
        scrollPos.current = wrapPos(scrollPos.current);
        scrollRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [totalWidth, speed, direction]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    dragScrollPos.current = scrollPos.current;
    isPausedRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = dragStartX.current - e.clientX;
    if (Math.abs(dx) > 5) hasDragged.current = true;
    scrollPos.current = wrapPos(dragScrollPos.current + dx);
    scrollRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    isPausedRef.current = false;
  };

  const displayItems = [...items, ...items, ...items];

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => { if (!isDragging.current) isPausedRef.current = true; }}
      onMouseLeave={() => { if (!isDragging.current) isPausedRef.current = false; }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
    >
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex will-change-transform"
          style={{ gap: `${GAP}px` }}
        >
          {displayItems.map((project, index) => (
            <ProjectCard
              key={`${project.id}-${index}`}
              project={project}
              index={index % items.length}
              onClick={() => { if (!hasDragged.current) onSelectProject(project); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: slidersRef, isVisible: slidersVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const row1 = useMemo(() => {
    const items = filteredProjects.length >= 4
      ? filteredProjects.slice(0, Math.ceil(filteredProjects.length / 2))
      : [...filteredProjects];
    while (items.length < 3) items.push(...filteredProjects);
    return items;
  }, [filteredProjects]);

  const row2 = useMemo(() => {
    const items = filteredProjects.length >= 4
      ? filteredProjects.slice(Math.ceil(filteredProjects.length / 2))
      : [...filteredProjects];
    while (items.length < 3) items.push(...filteredProjects);
    return items;
  }, [filteredProjects]);

  return (
    <section
      id="projects"
      className="section-padding relative overflow-hidden"
      role="region"
      aria-labelledby="projects-title"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="container relative z-10">
        <div ref={titleRef} className={`fade-in ${titleVisible ? 'show' : ''} text-center mb-4`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Featured Work</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 id="projects-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
            A collection of projects I've built — from web apps to game mods, each crafted with passion.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="container relative z-10 mt-10 mb-8">
        <div className={`flex justify-center gap-8 md:gap-16 transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {[
            { value: `${projects.length}+`, label: 'Projects' },
            { value: '5+', label: 'Technologies' },
            { value: '3+', label: 'Categories' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ transitionDelay: statsVisible ? `${i * 100}ms` : '0ms' }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter buttons */}
      <div className="container relative z-10 mb-10">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.key;
            const count = cat.key === 'all' ? projects.length : projects.filter(p => p.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`group relative inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                    : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {cat.key === 'all' && <Filter className="w-3.5 h-3.5" />}
                {cat.label}
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider Area */}
      <div ref={slidersRef} className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-5">
          <div
            className={`transition-all duration-1000 ease-out ${slidersVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'}`}
          >
            <SliderRow key={`row1-${activeFilter}`} items={row1} speed={0.4} direction="left" onSelectProject={setSelectedProject} />
          </div>
          
          <div
            className={`transition-all duration-1000 ease-out ${slidersVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'}`}
            style={{ transitionDelay: slidersVisible ? '250ms' : '0ms' }}
          >
            <SliderRow key={`row2-${activeFilter}`} items={row2} speed={0.4} direction="right" onSelectProject={setSelectedProject} />
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  onClick: () => void;
}

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    }
  };

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-[280px] sm:w-[360px] group cursor-pointer transition-transform duration-300 ease-out"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-colors duration-500">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-4 rotate-45'}`}>
            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{project.description}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
              <Code2 className="w-3 h-3" />
              {project.category}
            </span>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;