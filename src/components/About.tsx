import { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, Calendar, GraduationCap, Code, MapPin, Terminal, Keyboard } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollTypingEffect } from '@/hooks/useTypingEffect';
import profile from "@/assets/BadutZY.png";
import EasterEggModal from '@/components/EasterEggModal';

const bioData = [
  { icon: User, label: 'Name', value: 'Rizky Maulana Putra', expandable: false },
  { icon: Calendar, label: 'Age', value: '17 Years', expandable: false },
  { icon: GraduationCap, label: 'Education', value: 'SMK (Vocational High School)', expandable: true, details: 'Currently pursuing vocational education with focus on practical skills and industry readiness.' },
  { icon: Code, label: 'Major', value: 'RPL (Software Engineering)', expandable: true, details: 'Specializing in software development, web technologies, and programming fundamentals.' },
  { icon: MapPin, label: 'Location', value: 'Bogor, Indonesia', expandable: false },
];

interface AboutProps {
  onEasterEggUnlock?: () => void;
  easterEggUnlocked?: boolean;
}

const About = ({ onEasterEggUnlock, easterEggUnlocked }: AboutProps) => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [codeVisibleLines, setCodeVisibleLines] = useState(0);
  const [mobileInput, setMobileInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showEasterEggModal, setShowEasterEggModal] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const aboutText = "I'm a beginner programmer learning programming languages. I strive to create engaging and functional websites, games, and mods. Every project is a new opportunity to learn and grow.";
  const { displayText, isTyping } = useScrollTypingEffect(aboutText, textVisible, 25, 500);

  // Code block typing animation
  const codeLineCount = 7; // number of code lines in the block
  useEffect(() => {
    if (textVisible) {
      setCodeVisibleLines(0);
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setCodeVisibleLines(current);
        if (current >= codeLineCount) clearInterval(interval);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setCodeVisibleLines(0);
    }
  }, [textVisible]);

  return (
    <section
      id="about"
      className="section-padding overflow-x-hidden relative"
      role="region"
      aria-labelledby="about-title"
    >
      <div className="container mx-auto px-5 sm:px-4 overflow-hidden">
        <div ref={sectionRef} className={`fade-in ${sectionVisible ? 'show' : ''}`}>
          <h2 id="about-title" className="section-title">About Me</h2>
          <p className="text-center text-foreground-muted mt-2 max-w-xl mx-auto text-sm md:text-base">
            Get to know who I am, what I do, and the journey I'm on.
          </p>
        </div>

        <div className="mt-10 md:mt-16 grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left: Image + decorative elements */}
          <figure
            ref={imageRef}
            className={`fade-in ${imageVisible ? 'show' : ''} flex justify-center relative`}
          >
            <div className="relative">
              {/* Decorative border frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary/30 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/15 rounded-2xl" />
              
              {/* Main image */}
              <div className="relative z-10 overflow-hidden rounded-2xl w-64 h-72 md:w-72 md:h-80 shadow-card group">
                <img
                  src={profile}
                  alt="Rizky Maulana Putra Profile Picture"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Available for projects
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-6 top-8 z-20 bg-card border border-border rounded-xl p-3 shadow-card animate-float">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
            </div>
          </figure>

          {/* Right: Text + Bio */}
          <div ref={textRef} className={`fade-in delay-200 ${textVisible ? 'show' : ''}`}>
            {/* Terminal-style header */}
            <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <span className="w-3 h-3 rounded-full bg-destructive/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-foreground-muted font-mono">about-me.tsx</span>
                {codeVisibleLines >= 5 && !easterEggUnlocked && !isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-300 text-[10px] text-primary font-mono"
                  >
                    <Keyboard className="w-3 h-3" />
                    type
                  </button>
                )}
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                {[
                  <p key="l1" className="text-foreground-muted">
                    <span className="text-primary">const</span>{' '}
                    <span className="text-foreground">aboutMe</span>{' '}
                    <span className="text-foreground-muted">=</span>{' '}
                    <span className="text-green-400">{`{`}</span>
                  </p>,
                  <p key="l2" className="pl-4 text-foreground-muted mt-1">
                    <span className="text-primary/80">role</span>
                    <span className="text-foreground-muted">:</span>{' '}
                    <span className="text-accent">"Beginner Programmer"</span>,
                  </p>,
                  <p key="l3" className="pl-4 text-foreground-muted mt-1">
                    <span className="text-primary/80">passion</span>
                    <span className="text-foreground-muted">:</span>{' '}
                    <span className="text-accent">"Building engaging websites & games"</span>,
                  </p>,
                  <p key="l4" className="pl-4 text-foreground-muted mt-1">
                    <span className="text-primary/80">motto</span>
                    <span className="text-foreground-muted">:</span>{' '}
                    <span className="text-accent">"Every project is a new opportunity to grow"</span>
                  </p>,
                  <p key="l5" className="text-green-400">{`}`}</p>,
                ].map((line, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-300 ${
                      i < codeVisibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                {codeVisibleLines >= 5 && !easterEggUnlocked && isEditing && (
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-primary/60 text-xs font-mono">{'>'}</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && mobileInput.toLowerCase() === 'kimmymywife') {
                          onEasterEggUnlock?.();
                          setMobileInput('');
                          setIsEditing(false);
                          setShowEasterEggModal(true);
                        }
                      }}
                      onBlur={() => {
                        if (!mobileInput) setIsEditing(false);
                      }}
                      className="bg-transparent border-none outline-none text-xs text-accent font-mono w-full caret-primary"
                      placeholder="type something..."
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                )}
                {codeVisibleLines >= 5 && !isEditing && (
                  <span className="typing-cursor animate-fade-in" />
                )}
              </div>
            </div>

            <p className="text-foreground-muted leading-relaxed mb-8 min-h-[4.5rem]">
              {displayText}
              {isTyping && <span className="typing-cursor" />}
            </p>

            {/* Bio grid */}
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bioData.map((item, index) => {
                const Icon = item.icon;
                const isExpanded = expandedItem === index;

                return (
                  <div
                    key={item.label}
                    className={`group bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden transition-all duration-500 ${
                      item.expandable ? 'cursor-pointer hover:border-primary/40' : 'hover:border-border'
                    } ${item.expandable ? 'sm:col-span-2' : ''} ${
                      cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: cardsVisible ? `${index * 80}ms` : '0ms' }}
                    onClick={() => item.expandable && setExpandedItem(isExpanded ? null : index)}
                  >
                    <div className="flex items-center gap-3 p-3.5">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <dt className="text-[11px] uppercase tracking-wider text-foreground-muted/70 font-medium">{item.label}</dt>
                        <dd className="text-sm font-semibold text-foreground truncate">{item.value}</dd>
                      </div>
                      {item.expandable && (
                        <ChevronDown
                          className={`w-4 h-4 text-foreground-muted transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                    {item.expandable && item.details && (
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-32' : 'max-h-0'}`}>
                        <p className="px-3.5 pb-3.5 text-xs text-foreground-muted leading-relaxed">{item.details}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <EasterEggModal isOpen={showEasterEggModal} onClose={() => setShowEasterEggModal(false)} />
    </section>
  );
};

export default About;
