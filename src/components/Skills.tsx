import React, { useState, useRef, useEffect } from 'react';
import { Code, Coffee, Gamepad2, ChevronDown, ChevronRight, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import fabricIcon from '@/assets/icons/fabric.png';
import forgeIcon from '@/assets/icons/forge.png';
import EasterEggModal from '@/components/EasterEggModal';
import AlreadyUnlockedModal from '@/components/AlreadyUnlockedModal';

interface CodeLine {
  content: React.ReactNode;
  indent?: number;
}

interface SkillItem {
  icon: typeof Code;
  title: string;
  description: string;
  progress: number;
  tags: string[];
  file: string;
  isSecret?: boolean;
  buildCode: () => CodeLine[];
}

const techDescriptions: Record<string, { logo: string; description: string }> = {
  HTML: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', description: 'HyperText Markup Language (HTML) is the standard language for structuring web pages and content.' },
  CSS: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', description: 'Cascading Style Sheets (CSS) is used to style and layout web pages with colors, fonts, and spacing.' },
  JavaScript: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', description: 'JavaScript (JS) is a versatile programming language for adding interactivity and dynamic behavior to websites.' },
  React: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', description: 'React is a popular JavaScript library by Meta for building fast, component-based user interfaces.' },
  Tailwind: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', description: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom designs without writing custom CSS.' },
  Java: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', description: 'Java is a robust, object-oriented programming language widely used for enterprise and Minecraft modding.' },
  Fabric: { logo: fabricIcon, description: 'Fabric is a lightweight modding toolchain for Minecraft, known for fast updates and performance.' },
  Forge: { logo: forgeIcon, description: 'Forge is a well-established Minecraft modding API with a large community and extensive mod support.' },
  Unity: { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg', description: 'Unity is a powerful cross-platform game engine used to create 2D and 3D games for all platforms.' },
  'C#': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg', description: 'C Sharp (C#) is a modern, object-oriented language by Microsoft, primarily used with Unity for game development.' },
  'Command Prompt': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg', description: 'Command Prompt (CMD) is a Windows command-line interpreter for executing commands and scripts.' },
  'Powershell': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg', description: 'PowerShell is a cross-platform task automation solution with a command-line shell and scripting language.' },
  'Git': { logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', description: 'Git is a distributed version control system for tracking changes in source code during software development.' },
};

const baseSkills: SkillItem[] = [
  {
    icon: Code, title: 'Web Developer', description: 'Create dynamic and interactive websites with HTML, CSS, and JavaScript.', progress: 45,
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind'], file: 'web-dev.tsx',
    buildCode: (): CodeLine[] => [
      { content: <><span className="text-primary">interface</span> <span className="text-foreground font-semibold">WebDev</span> <span className="text-green-400">{'{'}</span></>, indent: 0 },
      { content: <><span className="text-primary/80">frameworks</span><span className="text-muted-foreground">:</span> <span className="text-accent">["React", "Tailwind"]</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">languages</span><span className="text-muted-foreground">:</span> <span className="text-accent">["HTML", "CSS", "JS"]</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">tools</span><span className="text-muted-foreground">:</span> <span className="text-accent">["VS Code"]</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">platform</span><span className="text-muted-foreground">:</span> <span className="text-accent">["GitHub"]</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <span className="text-green-400">{'}'}</span>, indent: 0 },
    ],
  },
  {
    icon: Coffee, title: 'Minecraft Modding', description: 'Item stack size modification, unbreakable block override, uncraftable item crafting, etc with Java.', progress: 75,
    tags: ['Java', 'Fabric', 'Forge'], file: 'mc-modding.java',
    buildCode: (): CodeLine[] => [
      { content: <><span className="text-primary">public class</span> <span className="text-foreground font-semibold">MinecraftMod</span> <span className="text-green-400">{'{'}</span></>, indent: 0 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">engine</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"Fabric", "Forge"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">language</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"Java"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">tools</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"Intellij IDEA"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">String</span> <span className="text-foreground">platform</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"Modrinth", "Curseforege"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <span className="text-green-400">{'}'}</span>, indent: 0 },
    ],
  },
  {
    icon: Gamepad2, title: 'Game Developer', description: 'Create simple PvP Co-op games with Unity and C#.', progress: 25,
    tags: ['Unity', 'C#'], file: 'game-dev.cs',
    buildCode: (): CodeLine[] => [
      { content: <><span className="text-primary">public class</span> <span className="text-foreground font-semibold">GameDev</span> <span className="text-muted-foreground"> : </span><span className="text-green-400">MonoBehaviour</span> <span className="text-green-400">{'{'}</span></>, indent: 0 },
      { content: <><span className="text-primary/80">private string</span> <span className="text-foreground">engine</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"Unity"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">private string</span> <span className="text-foreground">language</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"C#"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">private string</span> <span className="text-foreground">tools</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"Visual Studio"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <><span className="text-primary/80">private string</span> <span className="text-foreground">genre</span> <span className="text-muted-foreground">=</span> <span className="text-accent">"PvP Co-op"</span><span className="text-muted-foreground">;</span></>, indent: 1 },
      { content: <span className="text-green-400">{'}'}</span>, indent: 0 },
    ],
  },
];

const TechTag = ({ name, isOpen, onToggle }: { name: string; isOpen: boolean; onToggle: () => void }) => {
  const info = techDescriptions[name];
  return (
    <button onClick={onToggle} className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-medium rounded-lg bg-muted text-foreground border transition-all duration-300 hover:border-primary/40 hover:text-primary cursor-pointer ${isOpen ? 'border-primary/60 text-primary' : 'border-border/50'}`}>
      {info && <img src={info.logo} alt={`${name} logo`} className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />}
      <span>{name}</span>
      {isOpen ? <ChevronDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary transition-transform" /> : <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary transition-transform" />}
    </button>
  );
};

const SecretTerminal = ({ onEasterEggUnlock, easterEggUnlocked, equipmentUnlocked, wifeUnlocked, allSecretsUnlocked }: {
  onEasterEggUnlock?: (type?: string) => void; easterEggUnlocked?: boolean; equipmentUnlocked?: boolean; wifeUnlocked?: boolean; allSecretsUnlocked?: boolean;
}) => {
  const [terminalBooted, setTerminalBooted] = useState(false);
  const [bootPhase, setBootPhase] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showEasterEggModal, setShowEasterEggModal] = useState(false);
  const [showAlreadyUnlocked, setShowAlreadyUnlocked] = useState(false);
  const [alreadyUnlockedCode, setAlreadyUnlockedCode] = useState('');
  const [showUnlockAllAlert, setShowUnlockAllAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase(1), 600);
    const t2 = setTimeout(() => { setBootPhase(2); setTerminalBooted(true); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (allSecretsUnlocked && !hasShownAlert) {
      setHasShownAlert(true);
      setTimeout(() => setShowUnlockAllAlert(true), 500);
      setTimeout(() => setShowUnlockAllAlert(false), 6000);
    }
  }, [allSecretsUnlocked, hasShownAlert]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const input = inputValue.toLowerCase().trim();
      if (input === 'crackthecode') {
        if (easterEggUnlocked) { setAlreadyUnlockedCode('crackthecode'); setShowAlreadyUnlocked(true); }
        else { onEasterEggUnlock?.(); setShowEasterEggModal(true); }
        setInputValue('');
      } else if (input === 'badutzyspec') {
        if (equipmentUnlocked) { setAlreadyUnlockedCode('badutzyspec'); setShowAlreadyUnlocked(true); }
        else { onEasterEggUnlock?.('equipment'); }
        setInputValue('');
      } else if (input === 'badutzywife') {
        if (wifeUnlocked) { setAlreadyUnlockedCode('badutzywife'); setShowAlreadyUnlocked(true); }
        else { onEasterEggUnlock?.('wife'); }
        setInputValue('');
      } else if (input === 'unlock all the secret code') {
        if (allSecretsUnlocked) { setAlreadyUnlockedCode('unlock all the secret code'); setShowAlreadyUnlocked(true); }
        else { onEasterEggUnlock?.('unlockall'); }
        setInputValue('');
      } else { setInputValue(''); }
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 font-mono text-xs md:text-sm relative min-h-[240px] md:min-h-[320px] bg-[hsl(var(--card))] cursor-text" onClick={() => terminalBooted && inputRef.current?.focus()}>
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/70" />
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[10px] md:text-xs text-muted-foreground">secret.bdt</span>
        </div>
        {bootPhase === 0 && <div className="flex items-center justify-center h-40"><div className="w-2 h-4 bg-primary/60 animate-pulse" /></div>}
        {bootPhase >= 1 && (
          <div className={`transition-all duration-500 ${bootPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <p className="text-muted-foreground/70 text-[10px] md:text-xs">BadutZY badutprompt [version 17.0.639.8310]</p>
            <p className="text-muted-foreground/70 text-[10px] md:text-xs mb-4">(c) BadutZY Studio. All rights reserved.</p>
          </div>
        )}
        {bootPhase >= 2 && (
          <div className={`transition-all duration-500 ${bootPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            {showUnlockAllAlert && (
              <div className="mb-3 p-2 rounded-lg border border-green-500/50 bg-green-500/10 animate-fade-in">
                <p className="text-[10px] md:text-xs text-green-500 font-mono">✓ All secrets unlocked! You can now use "unlock all the secret code" to unlock everything on future visits.</p>
              </div>
            )}
            <div className="flex items-center gap-0">
              <span className="text-primary/80 text-[10px] md:text-xs whitespace-nowrap">web:\badutzy\secret{'>'} </span>
              <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="bg-transparent border-none outline-none text-xs text-accent font-mono w-full" placeholder="" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
            </div>
          </div>
        )}
      </div>
      <EasterEggModal isOpen={showEasterEggModal} onClose={() => setShowEasterEggModal(false)} />
      <AlreadyUnlockedModal isOpen={showAlreadyUnlocked} onClose={() => setShowAlreadyUnlocked(false)} codeName={alreadyUnlockedCode} />
    </>
  );
};

const AnimatedNumber = ({ target, duration = 1000, isError, animKey }: { target: number; duration?: number; isError?: boolean; animKey: number }) => {
  const [current, setCurrent] = useState(0);
  const [showError, setShowError] = useState(false);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    const from = prevTargetRef.current;
    if (isError) {
      setShowError(false);
      const startTime = Date.now();
      const animDuration = 1200;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(from + (100 - from) * eased));
        if (progress < 1) requestAnimationFrame(animate);
        else { prevTargetRef.current = 100; setTimeout(() => setShowError(true), 400); }
      };
      requestAnimationFrame(animate);
    } else {
      setShowError(false);
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(from + (target - from) * eased));
        if (progress < 1) requestAnimationFrame(animate);
        else prevTargetRef.current = target;
      };
      requestAnimationFrame(animate);
    }
  }, [target, duration, isError, animKey]);

  if (isError && showError) {
    return <span className="text-xs md:text-sm font-bold text-destructive font-mono tabular-nums flex items-center gap-1 animate-fade-in"><AlertTriangle className="w-3.5 h-3.5" />ERROR 404</span>;
  }
  return <span className={`text-xs md:text-sm font-bold font-mono tabular-nums ${isError && current >= 100 ? 'text-destructive' : 'text-primary'}`}>{current}%</span>;
};

const ProficiencyBar = ({ isSecret, progress, animKey }: { isSecret: boolean; progress: number; animKey: number }) => {
  const [barWidth, setBarWidth] = useState(0);
  const [isRed, setIsRed] = useState(false);
  const prevWidthRef = useRef(0);

  useEffect(() => {
    const from = prevWidthRef.current;
    setIsRed(false);
    if (isSecret) {
      const startTime = Date.now();
      const duration = 1200;
      let frame: number;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setBarWidth(Math.round(from + (100 - from) * eased));
        if (p < 1) frame = requestAnimationFrame(animate);
        else { prevWidthRef.current = 100; setTimeout(() => setIsRed(true), 400); }
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    } else {
      const startTime = Date.now();
      const duration = 1000;
      let frame: number;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setBarWidth(Math.round(from + (progress - from) * eased));
        if (p < 1) frame = requestAnimationFrame(animate);
        else prevWidthRef.current = progress;
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }
  }, [isSecret, progress, animKey]);

  const bgStyle = isRed
    ? 'repeating-linear-gradient(90deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.4) 10px, hsl(var(--destructive)) 20px)'
    : 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))';

  return <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: bgStyle, transition: isSecret && isRed ? 'background 0.5s ease' : 'none' }} />;
};

interface SkillsProps {
  showSecret?: boolean; onEasterEggUnlock?: (type?: string) => void; allSecretsUnlocked?: boolean;
  easterEggUnlocked?: boolean; equipmentUnlocked?: boolean; wifeUnlocked?: boolean;
}

const Skills = ({ showSecret, onEasterEggUnlock, allSecretsUnlocked, easterEggUnlocked, equipmentUnlocked, wifeUnlocked }: SkillsProps) => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState(0);
  const [openTag, setOpenTag] = useState<string | null>(null);
  const [displayTag, setDisplayTag] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const prevVisibleRef = useRef(false);

  useEffect(() => {
    if (contentVisible && !prevVisibleRef.current) setAnimKey(k => k + 1);
    prevVisibleRef.current = contentVisible;
  }, [contentVisible]);

  const skills: SkillItem[] = React.useMemo(() => {
    const list = [...baseSkills];
    if (showSecret) {
      list.push({
        icon: ShieldAlert, title: 'Secret List', description: 'Hidden easter egg codes discovered throughout the portfolio.', progress: 100,
        tags: ['Command Prompt', 'Powershell', 'Git'], file: 'secret.bdt', isSecret: true, buildCode: (): CodeLine[] => [],
      });
    }
    return list;
  }, [showSecret]);

  const active = skills[activeTab];
  const Icon = active.icon;
  const codeLines = active.buildCode();

  React.useEffect(() => {
    if (active.isSecret) return;
    setVisibleLines(0);
    const total = codeLines.length;
    let current = 0;
    const interval = setInterval(() => { current++; setVisibleLines(current); if (current >= total) clearInterval(interval); }, 120);
    return () => clearInterval(interval);
  }, [tabKey, activeTab, active.isSecret]);

  React.useEffect(() => {
    Object.values(techDescriptions).forEach((info) => { const img = new Image(); img.src = info.logo; });
  }, []);

  const secretCodes = [
    { code: 'crackthecode', desc: 'Unlock hidden features' },
    { code: 'badutzyspec', desc: 'Reveal PC specifications' },
    { code: 'badutzywife', desc: 'Meet Kimmy section' },
  ];

  const currentAnimKey = animKey + tabKey;

  return (
    <section id="skills" className="section-padding relative overflow-hidden" role="region" aria-labelledby="skills-title">
      <div className="container max-w-5xl px-4">
        <div ref={titleRef} className={`fade-in ${titleVisible ? 'show' : ''} text-center`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">What I Know</span>
          </div>
          <h2 id="skills-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">My <span className="text-gradient">Skills</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">Here's what I've been learning and working with so far.</p>
        </div>

        <div ref={contentRef} className={`mt-10 md:mt-14 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="bg-card rounded-xl md:rounded-2xl border border-border/50 shadow-card overflow-visible">
            <div className="flex items-center bg-muted/50 border-b border-border overflow-x-auto scrollbar-hide rounded-t-xl md:rounded-t-2xl">
              {skills.map((skill, index) => {
                const TabIcon = skill.icon;
                return (
                  <button key={skill.title} onClick={() => { setActiveTab(index); setOpenTag(null); setTabKey(k => k + 1); }}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 text-sm font-medium border-r border-border whitespace-nowrap transition-all duration-300 flex-shrink-0 ${activeTab === index ? 'bg-card text-primary border-b-2 border-b-primary' : 'text-muted-foreground hover:text-foreground hover:bg-card/50'} ${skill.isSecret ? 'text-destructive/80' : ''}`}>
                    <TabIcon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${skill.isSecret ? 'text-destructive' : ''}`} strokeWidth={1.5} />
                    <span className="font-mono text-[11px] md:text-xs">{skill.file}</span>
                    {skill.isSecret && <Lock className="w-2.5 h-2.5 text-destructive/60" />}
                  </button>
                );
              })}
            </div>

            <div className="grid md:grid-cols-[1fr_1px_1fr]">
              {active.isSecret ? (
                <SecretTerminal onEasterEggUnlock={onEasterEggUnlock} easterEggUnlocked={easterEggUnlocked} equipmentUnlocked={equipmentUnlocked} wifeUnlocked={wifeUnlocked} allSecretsUnlocked={allSecretsUnlocked} />
              ) : (
                <div className="p-4 md:p-6 font-mono text-xs md:text-sm relative min-h-[240px] md:min-h-[320px]">
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/70" />
                    <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70" />
                    <span className="ml-2 text-[10px] md:text-xs text-muted-foreground">{active.file}</span>
                  </div>
                  <div className="space-y-0">
                    {codeLines.map((line, i) => (
                      <div key={`${activeTab}-${i}`} className={`flex gap-3 md:gap-4 transition-all duration-300 ${i < visibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-muted-foreground/40 select-none w-4 md:w-5 text-right text-[10px] md:text-xs leading-7 md:leading-7 flex-shrink-0">{i + 1}</span>
                        <div className="leading-7 md:leading-7" style={{ paddingLeft: `${(line.indent || 0) * 20}px` }}>{line.content || <span>&nbsp;</span>}</div>
                      </div>
                    ))}
                    {visibleLines >= codeLines.length && (
                      <div className="flex gap-3 md:gap-4 animate-fade-in">
                        <span className="text-muted-foreground/40 select-none w-4 md:w-5 text-right text-[10px] md:text-xs leading-7 md:leading-7 flex-shrink-0">{codeLines.length + 1}</span>
                        <span className="typing-cursor leading-7 md:leading-7" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="hidden md:block bg-border" />

              <div className="p-4 md:p-6 flex flex-col justify-between border-t md:border-t-0 border-border">
                <div>
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center ${active.isSecret ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${active.isSecret ? 'text-destructive' : 'text-primary'}`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-foreground">{active.title}</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono">{active.file}</p>
                    </div>
                  </div>

                  {active.isSecret ? (
                    <div className="mb-4 md:mb-6">
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-3">{active.description}</p>
                      <div className="space-y-2">
                        {secretCodes.map((sc) => (
                          <div key={sc.code} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/30">
                            <span className="text-[10px] md:text-xs font-mono text-destructive/80">▸</span>
                            <code className="text-[10px] md:text-xs font-mono text-accent">{sc.code}</code>
                            <span className="text-[10px] md:text-[11px] text-muted-foreground ml-auto">{sc.desc}</span>
                          </div>
                        ))}
                        {allSecretsUnlocked && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-green-500/50 shadow-[0_0_8px_hsl(120_60%_50%/0.1)]">
                            <span className="text-[10px] md:text-xs font-mono text-green-500">▸</span>
                            <code className="text-[10px] md:text-xs font-mono text-green-500">unlock all the secret code</code>
                            <span className="text-[10px] md:text-[11px] text-green-500/70 ml-auto">Unlock everything on refresh</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4 md:mb-6">{active.description}</p>
                  )}

                  <div className="mb-4 md:mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Proficiency</span>
                      <AnimatedNumber target={active.progress} isError={active.isSecret} duration={1000} animKey={currentAnimKey} />
                    </div>
                    <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                      <ProficiencyBar isSecret={!!active.isSecret} progress={active.progress} animKey={currentAnimKey} />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2 block">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {active.tags.map((tag) => (
                      <TechTag key={tag} name={tag} isOpen={openTag === tag} onToggle={() => {
                        const newTag = openTag === tag ? null : tag;
                        if (newTag) setDisplayTag(newTag);
                        setOpenTag(newTag);
                        if (!newTag) setTimeout(() => setDisplayTag(null), 300);
                      }} />
                    ))}
                  </div>
                  <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: openTag && techDescriptions[openTag] && active.tags.includes(openTag) ? '200px' : '0px', opacity: openTag && techDescriptions[openTag] && active.tags.includes(openTag) ? 1 : 0, marginTop: openTag && techDescriptions[openTag] && active.tags.includes(openTag) ? '12px' : '0px' }}>
                    {(() => {
                      const shownTag = openTag || displayTag;
                      if (!shownTag || !techDescriptions[shownTag] || !active.tags.includes(shownTag)) return null;
                      return (
                        <div className="p-3 rounded-lg bg-muted/60 border border-border/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <img src={techDescriptions[shownTag].logo} alt={`${shownTag} logo`} className="w-4 h-4" />
                            <span className="text-xs font-semibold text-foreground">{shownTag}</span>
                          </div>
                          <p className="text-[10px] md:text-[11px] leading-relaxed text-muted-foreground">{techDescriptions[shownTag].description}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 bg-muted/30 border-t border-border text-[9px] md:text-[11px] font-mono text-muted-foreground/60 rounded-b-xl md:rounded-b-2xl">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${active.isSecret ? 'bg-destructive animate-pulse' : 'bg-green-500'}`} />
                  {active.isSecret ? 'CLASSIFIED' : 'Ready'}
                </span>
                <span>Ln {active.isSecret ? '??' : codeLines.length}, Col 1</span>
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
