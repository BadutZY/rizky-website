import React, { useState } from 'react';
import { Code, Coffee, Gamepad2, ChevronDown, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import fabricIcon from '@/assets/icons/fabric.png';
import forgeIcon from '@/assets/icons/forge.png';

interface CodeLine {
  content: React.ReactNode;
  indent?: number;
}

interface TagInfo {
  name: string;
  logo: string;
  description: string;
}

const techDescriptions: Record<string, { logo: string; description: string }> = {
  HTML: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    description: 'HyperText Markup Language (HTML) is the standard language for structuring web pages and content.',
  },
  CSS: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    description: 'Cascading Style Sheets (CSS) is used to style and layout web pages with colors, fonts, and spacing.',
  },
  JavaScript: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    description: ' JavaScript (JS) is a versatile programming language for adding interactivity and dynamic behavior to websites.',
  },
  React: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    description: 'React is a popular JavaScript library by Meta for building fast, component-based user interfaces.',
  },
  Tailwind: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    description: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom designs without writing custom CSS.',
  },
  Java: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    description: 'Java is a robust, object-oriented programming language widely used for enterprise and Minecraft modding.',
  },
  Fabric: {
    logo: fabricIcon,
    description: 'Fabric is a lightweight modding toolchain for Minecraft, known for fast updates and performance.',
  },
  Forge: {
    logo: forgeIcon,
    description: 'Forge is a well-established Minecraft modding API with a large community and extensive mod support.',
  },
  Unity: {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
    description: 'Unity is a powerful cross-platform game engine used to create 2D and 3D games for all platforms.',
  },
  'C#': {
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
    description: 'C Sharp (C#) is a modern, object-oriented language by Microsoft, primarily used with Unity for game development.',
  },
};

const skills = [
  {
    icon: Code,
    title: 'Web Developer',
    description: 'Create dynamic and interactive websites with HTML, CSS, and JavaScript.',
    progress: 45,
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind'],
    file: 'web-dev.ts',
    buildCode: (): CodeLine[] => [
      { content: <><span className="text-primary">interface</span> <span className="text-foreground font-semibold">WebDev</span> <span className="text-green-400">{'{'}</span></>, indent: 0 },
      { content: <><span className="text-primary/80">frameworks</span><span className="text-foreground-muted">:</span> <span className="text-accent">["React", "Tailwind"]</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">languages</span><span className="text-foreground-muted">:</span> <span className="text-accent">["HTML", "CSS", "JS"]</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">tools</span><span className="text-foreground-muted">:</span> <span className="text-accent">["VS Code"]</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <span className="text-green-400">{'}'}</span>, indent: 0 },
    ],
  },
  {
    icon: Coffee,
    title: 'Minecraft Modding',
    description: 'Item stack size modification, unbreakable block override, uncraftable item crafting, etc with Java.',
    progress: 75,
    tags: ['Java', 'Fabric', 'Forge'],
    file: 'mc-modding.java',
    buildCode: (): CodeLine[] => [
      { content: <><span className="text-primary">public class</span> <span className="text-foreground font-semibold">MinecraftMod</span> <span className="text-green-400">{'{'}</span></>, indent: 0 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">engine</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"Fabric", "Forge"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">language</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"Java"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">tools</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"Intellij IDEA"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">platform</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"Modrinth", "Curseforege"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <span className="text-green-400">{'}'}</span>, indent: 0 },
    ],
  },
  {
    icon: Gamepad2,
    title: 'Game Developer',
    description: 'Create simple PvP Co-op games with Unity and C#.',
    progress: 25,
    tags: ['Unity', 'C#'],
    file: 'game-dev.cs',
    buildCode: (): CodeLine[] => [
      { content: <><span className="text-primary">public class</span> <span className="text-foreground font-semibold">GameDev</span> <span className="text-green-400">{'{'}</span></>, indent: 0 },
      { content: <><span className="text-primary/80">string</span> <span className="text-foreground">engine</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"Unity"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">string</span> <span className="text-foreground">language</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"C#"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">string</span> <span className="text-foreground">genre</span> <span className="text-foreground-muted">=</span> <span className="text-accent">"PvP Co-op"</span><span className="text-foreground-muted">;</span></>, indent: 1 },
      { content: <span className="text-green-400">{'}'}</span>, indent: 0 },
    ],
  },
];

const TechTag = ({ name, isOpen, onToggle }: { name: string; isOpen: boolean; onToggle: () => void }) => {
  const info = techDescriptions[name];

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-medium rounded-lg bg-muted text-foreground border transition-all duration-300 hover:border-primary/40 hover:text-primary cursor-pointer ${
        isOpen ? 'border-primary/60 text-primary' : 'border-border/50'
      }`}
    >
      {info && (
        <img
          src={info.logo}
          alt={`${name} logo`}
          className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
        />
      )}
      <span>{name}</span>
      {isOpen ? (
        <ChevronDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary transition-transform" />
      ) : (
        <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary transition-transform" />
      )}
    </button>
  );
};

const Skills = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);
  const [openTag, setOpenTag] = useState<string | null>(null);
  const [displayTag, setDisplayTag] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [tabKey, setTabKey] = useState(0);

  const active = skills[activeTab];
  const Icon = active.icon;
  const codeLines = active.buildCode();

  // Typing animation: reveal lines one by one
  React.useEffect(() => {
    setVisibleLines(0);
    const total = codeLines.length;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleLines(current);
      if (current >= total) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [tabKey, activeTab]);

  // Preload all tech logos on mount
  React.useEffect(() => {
    Object.values(techDescriptions).forEach((info) => {
      const img = new Image();
      img.src = info.logo;
    });
  }, []);

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden"
      role="region"
      aria-labelledby="skills-title"
    >
      <div className="container max-w-5xl px-4">
        <div ref={titleRef} className={`fade-in ${titleVisible ? 'show' : ''}`}>
          <h2 id="skills-title" className="section-title">My Skills</h2>
          <p className="text-center text-foreground-muted mt-2 max-w-xl mx-auto text-sm md:text-base">
            Here's what I've been learning and working with so far.
          </p>
        </div>

        {/* IDE-style container */}
        <div
          ref={contentRef}
          className={`mt-10 md:mt-14 transition-all duration-700 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="bg-card rounded-xl md:rounded-2xl border border-border/50 shadow-card overflow-visible">
            {/* Tab bar */}
            <div className="flex items-center bg-muted/50 border-b border-border overflow-x-auto scrollbar-hide rounded-t-xl md:rounded-t-2xl">
              {skills.map((skill, index) => {
                const TabIcon = skill.icon;
                return (
                  <button
                    key={skill.title}
                    onClick={() => { setActiveTab(index); setOpenTag(null); }}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 text-sm font-medium border-r border-border whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                      activeTab === index
                        ? 'bg-card text-primary border-b-2 border-b-primary'
                        : 'text-foreground-muted hover:text-foreground hover:bg-card/50'
                    }`}
                  >
                    <TabIcon className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.5} />
                    <span className="font-mono text-[11px] md:text-xs">{skill.file}</span>
                  </button>
                );
              })}
            </div>

            {/* Content area */}
            <div className="grid md:grid-cols-[1fr_1px_1fr]">
              {/* Left: Code panel */}
              <div className="p-4 md:p-6 font-mono text-xs md:text-sm relative min-h-[240px] md:min-h-[320px]">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/70" />
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-[10px] md:text-xs text-foreground-muted">{active.file}</span>
                </div>

                <div className="space-y-0">
                  {codeLines.map((line, i) => (
                    <div
                      key={`${activeTab}-${i}`}
                      className={`flex gap-3 md:gap-4 transition-all duration-300 ${
                        i < visibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}
                    >
                      <span className="text-foreground-muted/40 select-none w-4 md:w-5 text-right text-[10px] md:text-xs leading-7 md:leading-7 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="leading-7 md:leading-7" style={{ paddingLeft: `${(line.indent || 0) * 20}px` }}>
                        {line.content || <span>&nbsp;</span>}
                      </div>
                    </div>
                  ))}
                  {visibleLines >= codeLines.length && (
                    <div className="flex gap-3 md:gap-4 animate-fade-in">
                      <span className="text-foreground-muted/40 select-none w-4 md:w-5 text-right text-[10px] md:text-xs leading-7 md:leading-7 flex-shrink-0">
                        {codeLines.length + 1}
                      </span>
                      <span className="typing-cursor leading-7 md:leading-7" />
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block bg-border" />

              {/* Right: Skill details */}
              <div className="p-4 md:p-6 flex flex-col justify-between border-t md:border-t-0 border-border">
                <div>
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-foreground">{active.title}</h3>
                      <p className="text-[10px] md:text-xs text-foreground-muted font-mono">{active.file}</p>
                    </div>
                  </div>

                  <p className="text-foreground-muted text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                    {active.description}
                  </p>

                  <div className="mb-4 md:mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-xs text-foreground-muted font-medium uppercase tracking-wider">Proficiency</span>
                      <span className="text-xs md:text-sm font-bold text-primary font-mono tabular-nums">{active.progress}%</span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: contentVisible ? `${active.progress}%` : '0%',
                          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags with logos and inline dropdown */}
                <div>
                  <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-foreground-muted/70 font-medium mb-2 block">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {active.tags.map((tag) => (
                      <TechTag
                        key={tag}
                        name={tag}
                        isOpen={openTag === tag}
                        onToggle={() => {
                          const newTag = openTag === tag ? null : tag;
                          if (newTag) setDisplayTag(newTag);
                          setOpenTag(newTag);
                          // Clear displayTag after close animation
                          if (!newTag) setTimeout(() => setDisplayTag(null), 300);
                        }}
                      />
                    ))}
                  </div>
                  {/* Inline description below tags with smooth animation */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: openTag && techDescriptions[openTag] && active.tags.includes(openTag) ? '200px' : '0px',
                      opacity: openTag && techDescriptions[openTag] && active.tags.includes(openTag) ? 1 : 0,
                      marginTop: openTag && techDescriptions[openTag] && active.tags.includes(openTag) ? '12px' : '0px',
                    }}
                  >
                    {(() => {
                      const shownTag = openTag || displayTag;
                      if (!shownTag || !techDescriptions[shownTag] || !active.tags.includes(shownTag)) return null;
                      return (
                        <div className="p-3 rounded-lg bg-muted/60 border border-border/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <img src={techDescriptions[shownTag].logo} alt={`${shownTag} logo`} className="w-4 h-4" />
                            <span className="text-xs font-semibold text-foreground">{shownTag}</span>
                          </div>
                          <p className="text-[10px] md:text-[11px] leading-relaxed text-foreground-muted">
                            {techDescriptions[shownTag].description}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 bg-muted/30 border-t border-border text-[9px] md:text-[11px] font-mono text-foreground-muted/60 rounded-b-xl md:rounded-b-2xl">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
                  Ready
                </span>
                <span>Ln {codeLines.length}, Col 1</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <span>UTF-8</span>
                <span>{active.file.split('.').pop()?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
