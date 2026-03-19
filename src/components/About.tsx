import { useState, useEffect } from 'react';
import { ChevronDown, User, Calendar, GraduationCap, Code, MapPin, CalendarDays } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollTypingEffect } from '@/hooks/useTypingEffect';
import { motion } from 'framer-motion';
import profile from "@/assets/BadutZY.png";
import ImageWithSkeleton from '@/components/ImageWithSkeleton';

const bioData = [
  { icon: User, label: 'Name', value: 'Rizky Maulana Putra', expandable: false },
  { icon: Calendar, label: 'Age', value: '17 Years', expandable: false },
  { icon: GraduationCap, label: 'Education', value: 'SMK (Vocational High School)', expandable: true, details: 'Currently pursuing vocational education with focus on practical skills and industry readiness.' },
  { icon: Code, label: 'Major', value: 'RPL (Software Engineering)', expandable: true, details: 'Specializing in software development, web technologies, and programming fundamentals.' },
  { icon: MapPin, label: 'Location', value: 'Bogor, Indonesia', expandable: false },
];

const About = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [codeVisibleLines, setCodeVisibleLines] = useState(0);

  const aboutText = "I'm a beginner programmer learning programming languages. I strive to create engaging and functional websites, games, and mods. Every project is a new opportunity to learn and grow.";
  const { displayText, isTyping } = useScrollTypingEffect(aboutText, textVisible, 25, 500);

  useEffect(() => {
    if (textVisible && codeVisibleLines === 0) {
      let current = 0;
      const total = 7;
      const interval = setInterval(() => {
        current++;
        setCodeVisibleLines(current);
        if (current >= total) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [textVisible]);

  return (
    <section id="about" className="py-20 md:py-32 overflow-x-hidden relative" role="region" aria-labelledby="about-title">
      {/* Section Banner */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-24">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch min-h-[60vh] rounded-3xl overflow-hidden border border-border/30">
          <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, x: -40 }}
            animate={sectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
          >
            <h2 id="about-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 italic">About Me</h2>
            <div className="flex gap-1 mb-6">
              <div className="w-12 h-1 rounded-full bg-primary" />
              <div className="w-6 h-1 rounded-full bg-primary/50" />
            </div>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Get to know who I am, what I do, and the journey I'm on as a programmer.
            </p>
          </motion.div>
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={imageVisible ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.85, rotate: -3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center items-center p-8 md:p-12"
          >
            <div className="relative group">
              <motion.div animate={{ rotate: [3, -2, 3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-4 rounded-[2rem] border-2 border-primary/20" />
              <motion.div animate={{ rotate: [-2, 3, -2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-8 rounded-[2.5rem] border border-primary/10" />
              <div className="relative w-56 h-64 md:w-72 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl"
                style={{ boxShadow: '0 25px 80px hsl(30 100% 50% / 0.15), 0 0 0 1px hsl(var(--border) / 0.2)' }}>
                <ImageWithSkeleton src={profile} alt="Rizky Maulana Putra"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105"
                  style={{ transition: 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  skeletonClassName="rounded-[2rem]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Code block */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, y: 30 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <span className="w-3 h-3 rounded-full bg-destructive/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">about-me.tsx</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                {[
                  <p key="l1" className="text-muted-foreground">
                    <span className="text-primary">const</span>{' '}
                    <span className="text-foreground">aboutMe</span>{' '}
                    <span className="text-muted-foreground">=</span>{' '}
                    <span className="text-green-400">{`{`}</span>
                  </p>,
                  <p key="l2" className="text-muted-foreground">&nbsp;</p>,
                  <p key="l3" className="pl-4 text-muted-foreground">
                    <span className="text-primary/80">role</span>
                    <span className="text-muted-foreground">:</span>{' '}
                    <span className="text-accent">"Beginner Programmer"</span>,
                  </p>,
                  <p key="l4" className="pl-4 text-muted-foreground">
                    <span className="text-primary/80">passion</span>
                    <span className="text-muted-foreground">:</span>{' '}
                    <span className="text-accent">"Building engaging websites & Mods"</span>,
                  </p>,
                  <p key="l5" className="pl-4 text-muted-foreground">
                    <span className="text-primary/80">quote</span>
                    <span className="text-muted-foreground">:</span>{' '}
                    <span className="text-accent">"Don't be afraid to fail. Be afraid not to try."</span>
                  </p>,
                  <p key="l6" className="text-muted-foreground">&nbsp;</p>,
                  <p key="l7" className="text-green-400">{`}`}</p>,
                ].map((line, i) => (
                  <div key={i} className={`transition-all duration-300 ${i < codeVisibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                    {line}
                  </div>
                ))}
                {codeVisibleLines >= 7 && <span className="typing-cursor animate-fade-in" />}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8 min-h-[4.5rem]">
              {displayText}
              {isTyping && <span className="typing-cursor" />}
            </p>
          </motion.div>

          {/* Bio Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bioData.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedItem === index;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`group bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden transition-all duration-500 ${
                    item.expandable ? 'cursor-pointer hover:border-primary/40' : 'hover:border-border'
                  } ${item.expandable ? 'sm:col-span-2' : ''}`}
                  onClick={() => item.expandable && setExpandedItem(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-3 p-3.5">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">{item.label}</dt>
                      <dd className="text-sm font-semibold text-foreground truncate">{item.value}</dd>
                    </div>
                    {item.expandable && (
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                  {item.expandable && item.details && (
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-32' : 'max-h-0'}`}>
                      <p className="px-3.5 pb-3.5 text-xs text-muted-foreground leading-relaxed">{item.details}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Birthday Card - hardcoded */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: bioData.length * 0.08, duration: 0.5 }}
              className="group bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden transition-all duration-500 hover:border-border"
            >
              <div className="flex items-center gap-3 p-3.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">Birthday</dt>
                  <dd className="text-sm font-semibold text-foreground">March 6, 2009</dd>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
