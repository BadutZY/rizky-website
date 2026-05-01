import { useState, useMemo, useRef } from 'react';
import { ExternalLink, Filter, ArrowUpRight, Code2, Star, RefreshCw, AlertCircle, Loader2, Gamepad2, GitFork } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectModal from './ProjectModal';
import ModProjectModal from './ModProjectModal';
import ModCard from './ModCard';
import GameCard from './GameCard';
import GameProjectModal from './GameProjectModal';
import type { ModProject } from './ModCard';
import type { GameProject } from './GameCard';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import { useModrinthProjects, timeAgo } from '@/hooks/useModrinthProjects';

// Project images
import modImg from '@/assets/project/website/modrinth.png';
import boxImg from '@/assets/project/website/box-siege-website.png';
import eqnoxImg from '@/assets/project/website/eqnox-website.png';
import jktImg from '@/assets/project/website/jkt48-website.png';
import fritzyImg from '@/assets/project/website/fritzy-force-website.png';
import taskImg from '@/assets/project/website/task-manager.png';
import classImg from '@/assets/project/website/class-website.png';
import portoImg from '@/assets/project/website/rizky-website.png';
import fritzyF from '@/assets/project/website/fritzyforce-website.png';
import ChainedT from '@/assets/project/website/chained.png';
import valoGuess from '@/assets/project/website/valo-guess-who.png';
import jktGuess from '@/assets/project/website/jkt48guesswho.png';
import SpawnAllIcon from '@/assets/project/mod/icon.png';
import jktStream from '@/assets/project/website/jkt48-stream.png';

import equinoxLogo from '@/assets/game/logo-member/eqnox.jpg';
import badutZy from '@/assets/game/logo-member/BadutZY.jpg';
import ariAja from '@/assets/game/logo-member/Ari.jpg';
import swimmingFox from '@/assets/game/logo-member/SwimmingFOX.jpg';

// Game assets
import boxSiegeVideo from '@/assets/project/game/boxsiege.mp4';
import boxSiegeFile from '@/assets/game/file/BoxSiege.zip?url';

// Mod assets
import spawnAllJar from '@/assets/mod/file/spawn-all-1.0.0.jar?url';
import spawnAllMd from '@/assets/mod/markdown/spawnall.md?raw';

interface RegularProject {
  id: number;
  title: string;
  category: string;
  lang: string;
  image: string;
  link: string;
  description: string;
  fullDescription: string;
}

interface ContributionProject {
  id: number;
  title: string;
  category: 'Website';
  isContribution: true;
  lang: string;
  image: string;
  link: string;
  description: string;
  fullDescription: string;
  role?: string;
}

type AnyProject = RegularProject | ModProject | GameProject;

// Game projects
const GAME_PROJECTS: GameProject[] = [
  // My Game
];

// Contribution Game projects
const CONTRIBUTION_GAME_PROJECTS: GameProject[] = [
  {
    id: 300,
    title: 'Box Siege',
    category: 'Game',
    isContribution: true,
    role: 'Game Developer',
    developerTeam: {
      name: 'Equinox Interactive',
      logo: equinoxLogo,
      website: 'https://equinox-website-seven.vercel.app/',
      members: [
        {
          avatar: badutZy,
          name: 'BadutZY',
          role: 'Game Programmer',
          socials: [
            { platform: 'github', url: 'https://github.com/BadutZY' },
            { platform: 'instagram', url: 'https://www.instagram.com/rzky.mp_36/' },
            { platform: 'website', url: 'https://rizky-website.vercel.app/' },
          ],
        },
        {
          avatar: ariAja,
          name: 'Ari8Bit',
          role: 'Sound Designer',
          socials: [
            { platform: 'github', url: 'https://github.com/AriAja17' },
            { platform: 'youtube', url: 'https://www.youtube.com/@AriAja17' },
            { platform: 'website', url: 'https://ariaja.pages.dev/' },
          ],
        },
        {
          avatar: swimmingFox,
          name: 'SwimmingFox',
          role: 'Sprite Artist',
          socials: [
            { platform: 'github', url: 'https://github.com/Marrwertz' },
            { platform: 'instagram', url: 'https://www.instagram.com/swimmingfoxx_/' },
          ],
        },
      ],
    },
    lang: 'C# / Unity',
    image: boxImg,
    video: boxSiegeVideo,
    link: 'https://box-siege.vercel.app/',
    downloadFile: boxSiegeFile,
    description: 'PvP Co-op game',
    fullDescription:
      'Immerse yourself in the ultimate PvP co-op 2D experience with Box Siege, exclusively available for Windows PC.',
    genre: ['PvP'],
    platform: ['Windows'],
    engine: 'Unity',
    version: '1.5-beta',
    fileSize: '100 MB',
    features: [
      'Built entirely with Unity & C#',
      'Developed by a small indie team',
    ],
    minSpecs: {
      os: 'Windows 10+',
      processor: 'Dual Core 2GHz',
      memory: '6 GB RAM',
      graphics: '512MB VRAM',
      storage: '500 MB available space',
    },
  },
];

// Mod projects
const STATIC_MOD_PROJECTS: ModProject[] = [
  {
    id: 200,
    title: 'Spawn All MOD',
    category: 'Mod',
    lang: 'Java / Fabric',
    image: SpawnAllIcon,
    modIcon: SpawnAllIcon,
    link: 'https://github.com/BadutZY/spawn-all-mod-template',
    description: 'All spawn eggs can be spawn in the spawner.',
    modDescription: 'All spawn eggs can be spawn in the spawner.',
    fullDescription: 'All spawn eggs can be spawn in the spawner.',
    markdownFile: spawnAllMd,
    downloads: 0,
    likes: 0,
    tags: ['Client & Server', 'Game Mechanics'],
    loaders: ['Fabric'],
    versions: ['1.21.4'],
    status: 'private',
    staticDownloads: [
      {
        name: 'Spawn All',
        version_number: '1.0.0',
        game_versions: ['1.21.4'],
        loaders: ['Fabric'],
        filename: 'spawn-all-1.0.0.jar',
        filePath: spawnAllJar,
        release_type: 'beta',
      },  
    ],
  } as ModProject,
];

// Contribution Website projects
const CONTRIBUTION_PROJECTS: ContributionProject[] = [
  { id: 100, title: 'Equinox Interactive', category: 'Website', isContribution: true, lang: 'TypeScript / React / Tailwind', image: eqnoxImg, link: 'https://equinox-website-seven.vercel.app/', fullDescription: 'Website from the team that I created with my friend to make games.', description: 'Company Website', role: 'Game & Web Developer' },
  { id: 101, title: 'Box Siege', category: 'Website', isContribution: true, lang: 'HTML / CSS / JS', image: boxImg, link: 'https://box-siege.vercel.app/', fullDescription: 'website to introduce games.', description: 'Game Website', role: 'Game & Web Developer' },
  { id: 102, title: 'Chained Together', category: 'Website', isContribution: true, lang: 'TypeScript / React / Tailwind', image: ChainedT, link: 'https://chained-together.vercel.app/', fullDescription: 'website for e-commerce.', description: 'E-Commerce website', role: 'Web Developer' },
];

// Website projects
const REGULAR_PROJECTS: RegularProject[] = [
  { id: 1, title: 'JKT48 Remake', category: 'Website', lang: 'HTML / CSS / JS', image: jktImg, link: 'https://jkt48-website.vercel.app/', fullDescription: 'A fan-made website for JKT48 featuring member profiles, event schedules, news updates.', description: 'Fan site' },
  { id: 2, title: 'JKT48 Stream', category: 'Website', lang: 'TypeScript / React / Tailwind / Supabase', image: jktStream, link: 'https://jkt48-stream.vercel.app', fullDescription: 'This is a fan-made website created for watch JKT48 Videos.', description: 'Fanbase website' },
  { id: 3, title: 'Task Manager', category: 'Website', lang: 'HTML / CSS / JS / Local Storage', image: taskImg, link: 'https://task-web-snowy.vercel.app/', fullDescription: 'Website to remind me about unfinished tasks.', description: 'Task manager' },
  { id: 4, title: 'Class Website', category: 'Website', lang: 'TypeScript / React / Tailwind', image: classImg, link: 'https://xi-rpl-2.vercel.app/', fullDescription: 'Website for my class schedule and duty schedule.', description: 'Class website' },
  { id: 5, title: 'Rizky Website', category: 'Website', lang: 'TypeScript / React / Tailwind / Supabase', image: portoImg, link: 'https://rizky-website.vercel.app/', fullDescription: 'Portfolio website to showcase projects.', description: 'Portfolio Website' },
  { id: 6, title: 'Fritzy Force Website', category: 'Website', lang: 'TypeScript / React / Tailwind / Supabase', image: fritzyF, link: 'https://fritzyforce.vercel.app/', fullDescription: 'Remake of Fritzy Force Website.', description: 'Fanbase Website' },
  { id: 7, title: 'Valorant Guess Who', category: 'Website', lang: 'TypeScript / React / Tailwind / Supabase', image: valoGuess, link: 'https://valorantguesswho.vercel.app/', fullDescription: 'A fun guessing game based on Valorant agents, weapon, maps, and abilities.', description: 'Game Website' },
  { id: 8, title: 'JKT48 Member Guess Who', category: 'Website', lang: 'TypeScript / React / Tailwind / Supabase', image: jktGuess, link: 'https://jkt48guesswho.vercel.app/', fullDescription: 'A fun guessing game based on JKT48 members.', description: 'Game Website' },
];

const FEATURED_ID = 2;

const categories = [
  { key: 'all',     label: 'All Projects' },
  { key: 'Website', label: 'Website' },
  { key: 'Mod',     label: 'Mod' },
  { key: 'Game',    label: 'Game' },
];

function isMod(p: AnyProject): p is ModProject {
  return p.category === 'Mod';
}

function isGame(p: AnyProject): p is GameProject {
  return p.category === 'Game';
}

const ModCardSkeleton = () => (
  <div className="relative flex items-center gap-4 md:gap-5 w-full rounded-2xl border border-border/40 bg-card/60 p-4 md:p-5 animate-pulse">
    <div className="flex-shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 rounded-xl bg-muted" />
    <div className="flex-1 min-w-0 space-y-2.5">
      <div className="h-4 w-40 rounded-md bg-muted" />
      <div className="h-3 w-64 rounded-md bg-muted/70" />
      <div className="flex gap-1.5 pt-1">
        <div className="h-5 w-14 rounded-md bg-muted/60" />
        <div className="h-5 w-14 rounded-md bg-muted/60" />
        <div className="h-5 w-14 rounded-md bg-muted/60" />
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [selectedRegularProject, setSelectedRegularProject] = useState<RegularProject | null>(null);
  const [selectedModProject, setSelectedModProject] = useState<ModProject | null>(null);
  const [selectedGameProject, setSelectedGameProject] = useState<GameProject | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: featuredRef, isVisible: featuredVisible } = useScrollAnimation();
  const { ref: filterRef, isVisible: filterVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

  const [titleShown, setTitleShown] = useState(false);
  const [featuredShown, setFeaturedShown] = useState(false);
  const [filterShown, setFilterShown] = useState(false);
  const [gridShown, setGridShown] = useState(false);

  if (titleVisible && !titleShown) setTitleShown(true);
  if (featuredVisible && !featuredShown) setFeaturedShown(true);
  if (filterVisible && !filterShown) setFilterShown(true);
  if (gridVisible && !gridShown) setGridShown(true);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Modrinth live data
  const { data: modrinthData, isLoading, isError, refetch } = useModrinthProjects('BadutZY');

  const modrinthModProjects: ModProject[] = useMemo(() => {
    if (!modrinthData) return [];
    return modrinthData
      .map((p, i) => ({
        id: 1000 + i,
        title: p.title,
        category: 'Mod' as const,
        lang: ['Java', ...p.loaders].join(' / '),
        image: p.icon_url ?? modImg,
        modIcon: p.icon_url ?? modImg,
        link: `https://modrinth.com/mod/${p.slug}`,
        slug: p.slug,
        description: p.description,
        modDescription: p.description,
        fullDescription: p.description,
        markdownFile: p.body || undefined,
        downloads: p.downloads,
        likes: p.followers,
        updatedAgo: timeAgo(p.date_modified),
        tags: p.categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
        loaders: p.loaders,
        versions: p.game_versions,
        status: 'public' as const,
      } as ModProject))
      .sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
  }, [modrinthData]);

  const allModProjects: ModProject[] = useMemo(() => {
    if (isLoading) return STATIC_MOD_PROJECTS;
    return [...modrinthModProjects, ...STATIC_MOD_PROJECTS];
  }, [modrinthModProjects, isLoading]);

  const allProjects: AnyProject[] = useMemo(
    () => [...REGULAR_PROJECTS, ...(CONTRIBUTION_PROJECTS as unknown as RegularProject[]), ...allModProjects, ...GAME_PROJECTS, ...CONTRIBUTION_GAME_PROJECTS],
    [allModProjects]
  );

  const featuredProject = useMemo(
    () => REGULAR_PROJECTS.find((p) => p.id === FEATURED_ID) ?? REGULAR_PROJECTS[0],
    []
  );

  const filteredProjects = useMemo(
    () => activeFilter === 'all' ? allProjects : allProjects.filter((p) => p.category === activeFilter),
    [activeFilter, allProjects]
  );

  function handleProjectClick(project: AnyProject) {
    if (isMod(project)) setSelectedModProject(project);
    else if (isGame(project)) setSelectedGameProject(project);
    else setSelectedRegularProject(project as RegularProject);
  }

  const modProjects   = filteredProjects.filter(isMod);
  const gameProjects  = filteredProjects.filter((p) => isGame(p) && !(p as GameProject).isContribution);
  const contributionGameProjects = filteredProjects.filter((p) => isGame(p) && !!(p as GameProject).isContribution);
  const regularProjects = filteredProjects.filter((p) => !isMod(p) && !isGame(p) && !(p as unknown as ContributionProject).isContribution);
  const contributionProjects = (activeFilter === 'all' || activeFilter === 'Website') ? CONTRIBUTION_PROJECTS : [];

  const countFor = (key: string) =>
    key === 'all'
      ? allProjects.length
      : allProjects.filter((p) => p.category === key).length;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-20 md:py-32 relative overflow-hidden"
      role="region"
      aria-labelledby="projects-title"
    >
      {/* Section title */}
      <motion.div style={{ y: sectionY }} className="container mx-auto px-6 md:px-10 lg:px-20 mb-12 md:mb-16">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleShown ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 id="projects-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">
            My Projects
          </h2>
          <div className="flex gap-1 mb-6">
            <div className="w-12 h-1 rounded-full bg-primary" />
            <div className="w-6 h-1 rounded-full bg-primary/50" />
          </div>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
            A collection of projects I've built, from web apps to game mods, each crafted with passion.
          </p>
        </motion.div>
      </motion.div>

      {/* Featured */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mb-12 md:mb-16">
        <motion.div
          ref={featuredRef}
          initial={{ opacity: 0, y: 40 }}
          animate={featuredShown ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Featured Project</span>
            </div>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <motion.div
            className="group relative w-full rounded-3xl overflow-hidden cursor-pointer"
            style={{ border: '1px solid hsl(var(--primary) / 0.25)' }}
            whileHover={{ borderColor: 'hsl(var(--primary) / 0.5)', boxShadow: '0 0 40px -8px hsl(var(--primary) / 0.3)', y: -4, transition: { duration: 0.4 } }}
            onClick={() => handleProjectClick(featuredProject)}
          >
            {/* Mobile */}
            <div className="md:hidden flex flex-col">
              <div className="relative w-full aspect-video overflow-hidden">
                <ImageWithSkeleton
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-active:grayscale-0 group-active:scale-[1.03] transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-card/80 backdrop-blur-md border border-primary/20 text-foreground">
                    <Code2 className="w-3 h-3 text-primary" />{featuredProject.category}
                  </span>
                </div>
              </div>
              <div className="bg-card px-5 py-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {featuredProject.lang.split(' / ').map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-primary/10 text-primary border border-primary/20">{tech}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">{featuredProject.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{featuredProject.fullDescription}</p>
                <div className="flex gap-2">
                  <motion.div className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground" whileTap={{ scale: 0.97 }}>
                    View Project <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-border/60 text-muted-foreground bg-background/40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:block relative w-full aspect-[16/6] overflow-hidden">
              <ImageWithSkeleton
                src={featuredProject.image}
                alt={featuredProject.title}
                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-12 py-10 max-w-2xl">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {featuredProject.lang.split(' / ').map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">{tech}</span>
                  ))}
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">{featuredProject.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-md">{featuredProject.fullDescription}</p>
                <motion.div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground w-fit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Project <ArrowUpRight className="w-4 h-4" />
                </motion.div>
              </div>
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-card/70 backdrop-blur-md border border-border/40 text-foreground">
                  <Code2 className="w-3.5 h-3.5 text-primary" />{featuredProject.category}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* All Projects */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={featuredShown ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">All Projects</span>
          <div className="flex-1 h-px bg-border/40" />
        </motion.div>

        {/* Filter */}
        <motion.div
          ref={filterRef}
          initial={{ opacity: 0, y: 20 }}
          animate={filterShown ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-wrap gap-2 md:gap-3 mb-10"
        >
          {categories.map((cat) => {
            const isActive = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`group inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                    : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                  }`}
              >
                {cat.key === 'all' && <Filter className="w-3.5 h-3.5" />}
                {cat.key === 'Game' && <Gamepad2 className="w-3.5 h-3.5" />}
                {cat.label}
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                    ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {isLoading && cat.key !== 'all' && cat.key !== 'Website' && cat.key !== 'Game'
                    ? '...'
                    : countFor(cat.key)}
                </span>
              </button>
            );
          })}
        </motion.div>

        <div ref={gridRef}>
          {/* ── WEBSITE section (first in "all" view) ─────────── */}
          {regularProjects.length > 0 && (
            <>
              {activeFilter === 'all' && (modProjects.length > 0 || gameProjects.length > 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={gridShown ? { opacity: 1 } : {}}
                  className="flex items-center gap-2 mb-6"
                >
                  <span className="text-xs font-semibold text-muted-foreground/70 tracking-widest uppercase">Websites</span>
                  <div className="flex-1 h-px bg-border/30" />
                </motion.div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                {regularProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: gridShown ? index * 0.08 : 0,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="group relative aspect-video rounded-2xl overflow-hidden border border-border/40 cursor-pointer hover:border-primary/30 hover:-translate-y-1"
                    style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.6s, box-shadow 0.6s' }}
                    onClick={() => handleProjectClick(project)}
                  >
                    <ImageWithSkeleton
                      src={(project as RegularProject).image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-background/75 backdrop-blur-sm flex flex-col justify-between text-center group-hover:opacity-0 group-hover:backdrop-blur-0"
                      style={{ transition: 'opacity 0.7s, backdrop-filter 0.7s', padding: '10px 12px 16px' }}
                    >
                      {/* Top spacer */}
                      <div />

                      {/* Middle: title + description */}
                      <div className="flex flex-col items-center gap-1 px-1">
                        <h4 className="text-sm font-bold text-foreground leading-tight">{project.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {(project as RegularProject).description}
                        </p>
                      </div>

                      {/* Bottom: lang badges */}
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {(project as RegularProject).lang.split(' / ').map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-primary/10 text-primary border border-primary/20 leading-tight">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                      style={{ transition: 'opacity 0.7s' }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0"
                      style={{ transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                    >
                      <h4 className="text-sm font-bold text-foreground mb-1">{project.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{project.category}</span>
                        <a
                          href={(project as RegularProject).link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {contributionProjects.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={gridShown ? { opacity: 1 } : {}}
                className="flex items-center gap-2 mb-6"
              >
                <GitFork className="w-3.5 h-3.5 text-primary/70" />
                <span className="text-xs font-semibold text-muted-foreground/70 tracking-widest uppercase">Contribution Websites</span>
                <div className="flex-1 h-px bg-border/30" />
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  {contributionProjects.length} collab
                </span>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                {contributionProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: gridShown ? index * 0.08 : 0,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="group relative aspect-video rounded-2xl overflow-hidden border border-primary/20 cursor-pointer hover:border-primary/50 hover:-translate-y-1"
                    style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.6s, box-shadow 0.6s' }}
                    onClick={() => setSelectedRegularProject(project as unknown as RegularProject)}
                  >
                    <ImageWithSkeleton
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent" style={{ transition: 'background 0.7s' }} />

                    <div
                      className="absolute inset-0 bg-background/75 backdrop-blur-sm flex flex-col justify-between text-center group-hover:opacity-0 group-hover:backdrop-blur-0"
                      style={{ transition: 'opacity 0.7s, backdrop-filter 0.7s', padding: '10px 12px 16px' }}
                    >
                      <div className="flex justify-start">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          <GitFork className="w-2.5 h-2.5" />
                          Contribution
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-1 px-1">
                        <h4 className="text-sm font-bold text-foreground leading-tight">{project.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                        {project.role && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary/80 mt-0.5">
                            <GitFork className="w-2.5 h-2.5" /> {project.role}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap justify-center gap-1.5">
                        {project.lang.split(' / ').map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-primary/10 text-primary border border-primary/20 leading-tight">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                      style={{ transition: 'opacity 0.7s' }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0"
                      style={{ transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                    >
                      <h4 className="text-sm font-bold text-foreground mb-1">{project.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-primary/70 flex items-center gap-1">
                          <GitFork className="w-3 h-3" />{project.role ?? 'Contributor'}
                        </span>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {(modProjects.length > 0 || isLoading) && (activeFilter === 'all' || activeFilter === 'Mod') && (
            <div className="flex flex-col gap-3 mb-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={gridShown ? { opacity: 1 } : {}}
                className="flex items-center gap-2 mb-1"
              >
                <span className="text-xs font-semibold text-primary/70 tracking-widest uppercase">Mods</span>
                <div className="flex-1 h-px bg-border/30" />

                <div className="flex items-center gap-1.5">
                  {isLoading && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-primary/5 text-muted-foreground border border-border/40">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Syncing from Modrinth
                    </span>
                  )}
                  {isError && (
                    <button
                      onClick={() => refetch()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Failed to sync
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </motion.div>

              {isLoading && (
                <>
                  <ModCardSkeleton />
                  <ModCardSkeleton />
                </>
              )}

              {!isLoading && modProjects.map((project, index) => (
                <ModCard
                  key={project.id}
                  project={project as ModProject}
                  index={index}
                  isVisible={gridShown}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          )}

          {(gameProjects.length > 0 || contributionGameProjects.length > 0) && (activeFilter === 'all' || activeFilter === 'Game') && (
            <div className="mb-10">
              {/* Regular Games */}
              {gameProjects.length > 0 && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={gridShown ? { opacity: 1 } : {}}
                    className="flex items-center gap-2 mb-5"
                  >
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-primary tracking-widest uppercase">Games</span>
                    </div>
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold
                      bg-primary/10 text-primary border border-primary/20">
                      {gameProjects.length} {gameProjects.length === 1 ? 'game' : 'games'}
                    </span>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
                    {gameProjects.map((project, index) => (
                      <GameCard
                        key={project.id}
                        project={project as GameProject}
                        index={index}
                        isVisible={gridShown}
                        onClick={() => handleProjectClick(project)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Contribution Games */}
              {contributionGameProjects.length > 0 && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={gridShown ? { opacity: 1 } : {}}
                    className="flex items-center gap-2 mb-5"
                  >
                    <GitFork className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-xs font-semibold text-muted-foreground/70 tracking-widest uppercase">Contribution Games</span>
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {contributionGameProjects.length} collab
                    </span>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {contributionGameProjects.map((project, index) => (
                      <GameCard
                        key={project.id}
                        project={project as GameProject}
                        index={index}
                        isVisible={gridShown}
                        onClick={() => handleProjectClick(project)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        project={selectedRegularProject}
        onClose={() => setSelectedRegularProject(null)}
      />
      <ModProjectModal
        project={selectedModProject}
        onClose={() => setSelectedModProject(null)}
      />
      <GameProjectModal
        project={selectedGameProject}
        onClose={() => setSelectedGameProject(null)}
      />
    </section>
  );
};

export default Projects;