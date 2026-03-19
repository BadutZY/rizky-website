import { useState, useMemo, useRef } from 'react';
import { ExternalLink, Filter } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectModal from './ProjectModal';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import modImg from "@/assets/project/modrinth.png";
import boxImg from "@/assets/project/box-siege-website.png";
import eqnoxImg from "@/assets/project/eqnox-website.png";
import jktImg from "@/assets/project/jkt48-website.png";
import fritzyImg from "@/assets/project/fritzy-force-website.png";
import taskImg from "@/assets/project/task-manager.png";
import classImg from "@/assets/project/class-website.png";
import portoImg from "@/assets/project/portofolio.png";
import fritzyF from "@/assets/project/fritzyforce-website.png";
import CurseF from "@/assets/project/curseforge.png";

const projects = [
  { id: 1, title: 'Minecraft Mods', category: 'Mod', lang: 'Java / Forge / Fabric', image: modImg, link: 'https://modrinth.com/user/BadutZY/mods', fullDescription: 'Several minecraft mods available on modrinth.', description: 'Minecraft mods available on Modrinth.' },
  { id: 2, title: 'Box Siege Website', category: 'Game', lang: 'C# / Unity', image: boxImg, link: 'https://box-siege.vercel.app/', fullDescription: 'Website to download games made by me and my team.', description: 'Game Website' },
  { id: 3, title: 'Equinox Interactive', category: 'Website', lang: 'Vite / TypeScript / React / Tailwind', image: eqnoxImg, link: 'https://equinox-website-seven.vercel.app/', fullDescription: 'Website from the team that I created with my friend to make games.', description: 'Company website' },
  { id: 4, title: 'JKT48 Remake', category: 'Website', lang: 'HTML / CSS / JS', image: jktImg, link: 'https://jkt48-website.vercel.app/', fullDescription: 'A fan-made website for JKT48 featuring member profiles, event schedules, news updates.', description: 'Fan site' },
  { id: 5, title: 'Fritzy Force', category: 'Website', lang: 'HTML / CSS / JS', image: fritzyImg, link: 'https://fritzy-force-website.vercel.app/', fullDescription: 'This is a fan-made website created by me for a fanbase called fritzy force.', description: 'Fanbase website' },
  { id: 6, title: 'Task Manager', category: 'Website', lang: 'HTML / CSS / JS / Local Storage', image: taskImg, link: 'https://task-web-snowy.vercel.app/', fullDescription: 'Website to remind me about unfinished tasks.', description: 'Task manager' },
  { id: 7, title: 'Class Website', category: 'Website', lang: 'Vite / TypeScript / React / Tailwind', image: classImg, link: 'https://xi-rpl-2.vercel.app/', fullDescription: 'Website for my class schedule and duty schedule.', description: 'Class website' },
  { id: 8, title: 'Portfolio', category: 'Website', lang: 'Vite / TypeScript / React / Tailwind', image: portoImg, link: '#home', fullDescription: 'Portfolio website to showcase projects.', description: 'Portfolio' },
  { id: 9, title: 'Fritzy Force Website', category: 'Website', lang: 'Vite / TypeScript / React / Tailwind / Supabase', image: fritzyF, link: 'https://fritzyforce.vercel.app/', fullDescription: 'Remake of Fritzy Force Website.', description: 'Fanbase Website' },
  { id: 10, title: 'Minecraft Mods', category: 'Mod', lang: 'Java / Forge / Fabric', image: CurseF, link: 'https://www.curseforge.com/members/badutzy/projects', fullDescription: 'Several minecraft mods available on Curseforge.', description: 'Minecraft mods available on Curseforge.' },
];

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'Website', label: 'Website' },
  { key: 'Mod', label: 'Mod' },
  { key: 'Game', label: 'Game' },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const filteredProjects = useMemo(() => activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter), [activeFilter]);

  return (
    <section ref={sectionRef} id="projects" className="py-20 md:py-32 relative overflow-hidden" role="region" aria-labelledby="projects-title">
      {/* Section Header */}
      <motion.div style={{ y: sectionY }} className="container mx-auto px-6 md:px-10 lg:px-20 mb-12 md:mb-16">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 id="projects-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">My Projects</h2>
          <div className="flex gap-1 mb-6">
            <div className="w-12 h-1 rounded-full bg-primary" />
            <div className="w-6 h-1 rounded-full bg-primary/50" />
          </div>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
            A collection of projects I've built — from web apps to game mods, each crafted with passion.
          </p>
        </motion.div>
      </motion.div>

      {/* Filter & Grid */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap gap-2 md:gap-3 mb-10"
        >
          {categories.map((cat) => {
            const isActive = activeFilter === cat.key;
            const count = cat.key === 'all' ? projects.length : projects.filter(p => p.category === cat.key).length;
            return (
              <button key={cat.key} onClick={() => setActiveFilter(cat.key)}
                className={`group inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-glow' : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'}`}>
                {cat.key === 'all' && <Filter className="w-3.5 h-3.5" />}
                {cat.label}
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Project Grid */}
        <div ref={gridRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={gridVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-border/40 cursor-pointer hover:border-primary/30 hover:-translate-y-1"
                style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <ImageWithSkeleton
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                />

                {/* Default overlay - centered text, hides on hover */}
                <div
                  className="absolute inset-0 bg-background/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-5 group-hover:opacity-0 group-hover:backdrop-blur-0"
                  style={{ transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {project.lang.split(' / ').map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1">{project.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[80%]">{project.description}</p>
                </div>

                {/* Hover state - subtle gradient at bottom */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                  style={{ transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />

                {/* Info on hover at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0"
                  style={{ transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                >
                  <h4 className="text-sm font-bold text-foreground mb-1">{project.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{project.category}</span>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default Projects;
