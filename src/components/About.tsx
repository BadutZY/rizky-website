import { useState, useEffect } from 'react';
import { ChevronDown, User, Calendar, GraduationCap, Terminal, Code, MapPin, Heart, CalendarDays } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollTypingEffect } from '@/hooks/useTypingEffect';
import profile from "@/assets/BadutZY.png";

const bioData = [
  { icon: User, label: 'Name', value: 'Rizky Maulana Putra', expandable: false },
  { icon: Calendar, label: 'Age', value: '17 Years', expandable: false },
  { icon: GraduationCap, label: 'Education', value: 'SMK (Vocational High School)', expandable: true, details: 'Currently pursuing vocational education with focus on practical skills and industry readiness.' },
  { icon: Code, label: 'Major', value: 'RPL (Software Engineering)', expandable: true, details: 'Specializing in software development, web technologies, and programming fundamentals.' },
  { icon: MapPin, label: 'Location', value: 'Bogor, Indonesia', expandable: false },
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface AboutProps {
  onEasterEggUnlock?: (type?: string) => void;
  easterEggUnlocked?: boolean;
  showWifeButton?: boolean;
  onBirthdayGuessed?: () => void;
  birthdayGuessed?: boolean;
}

const About = ({ onEasterEggUnlock, easterEggUnlocked, showWifeButton, onBirthdayGuessed, birthdayGuessed }: AboutProps) => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [codeVisibleLines, setCodeVisibleLines] = useState(0);
  const [selectedDate, setSelectedDate] = useState<{ day: string; month: string; year: string }>({ day: '', month: '', year: '2009' });
  const [dateSet, setDateSet] = useState(false);
  const [greenBorder, setGreenBorder] = useState(false);
  const [showUnlockNotice, setShowUnlockNotice] = useState(false);
  const [dateError, setDateError] = useState('');

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

  const handleDateSubmit = () => {
    if (!selectedDate.day || !selectedDate.month || !selectedDate.year) return;

    const day = parseInt(selectedDate.day);
    const month = parseInt(selectedDate.month);

    // Validation
    if (month < 1 || month > 12) {
      setDateError('Month must be between 1 and 12');
      return;
    }
    if (day < 1 || day > 31) {
      setDateError('Day must be between 1 and 31');
      return;
    }

    setDateError('');
    setDateSet(true);

    // Unlock for Rizky: March 6, 2009 OR Kimmy: March 8, 2010
    const isRizky = day === 6 && month === 3 && selectedDate.year === '2009';
    const isKimmy = day === 8 && month === 3 && selectedDate.year === '2010';

    if (isRizky || isKimmy) {
      setGreenBorder(true);
      setTimeout(() => {
        setShowUnlockNotice(true);
        onBirthdayGuessed?.();
      }, 1500);
      setTimeout(() => {
        setGreenBorder(false);
        setShowUnlockNotice(false);
      }, 5000);
    }
  };


  const displayMonthName = dateSet && selectedDate.month
    ? monthNames[parseInt(selectedDate.month) - 1] || selectedDate.month
    : null;

  return (
    <section
      id="about"
      className="section-padding overflow-x-hidden relative"
      role="region"
      aria-labelledby="about-title"
    >
      <div className="container mx-auto px-5 sm:px-4 overflow-hidden">
        <div ref={sectionRef} className={`fade-in ${sectionVisible ? 'show' : ''} text-center`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Who Am I</span>
          </div>
          <h2 id="about-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">About <span className="text-gradient">Me</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Get to know who I am, what I do, and the journey I'm on.
          </p>
        </div>

        <div className="mt-10 md:mt-16 grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <figure
            ref={imageRef}
            className={`fade-in ${imageVisible ? 'show' : ''} flex justify-center relative`}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary/30 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/15 rounded-2xl" />

              <div className="relative z-10 overflow-hidden rounded-2xl w-64 h-72 md:w-72 md:h-80 shadow-card group">
                <img
                  src={profile}
                  alt="Rizky Maulana Putra Profile Picture"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Available for projects
                  </p>
                </div>
              </div>

              {showWifeButton && (
                <button
                  onClick={() => {
                    document.getElementById('wife')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center gap-2 animate-fade-in-up"
                >
                  <Heart className="w-4 h-4" />
                  See my wife
                </button>
              )}

              <div className="absolute -right-6 top-8 z-20 bg-card border border-border rounded-xl p-3 shadow-card animate-float">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
            </div>
          </figure>

          <div ref={textRef} className={`fade-in delay-200 ${textVisible ? 'show' : ''}`}>
            <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <span className="w-3 h-3 rounded-full bg-destructive/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-foreground-muted font-mono">about-me.tsx</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                {[
                  <p key="l1" className="text-foreground-muted">
                    <span className="text-primary">const</span>{' '}
                    <span className="text-foreground">aboutMe</span>{' '}
                    <span className="text-foreground-muted">=</span>{' '}
                    <span className="text-green-400">{`{`}</span>
                  </p>,
                  <p key="l2" className="text-foreground-muted">&nbsp;</p>,
                  <p key="l3" className="pl-4 text-foreground-muted">
                    <span className="text-primary/80">role</span>
                    <span className="text-foreground-muted">:</span>{' '}
                    <span className="text-accent">"Beginner Programmer"</span>,
                  </p>,
                  <p key="l4" className="pl-4 text-foreground-muted">
                    <span className="text-primary/80">passion</span>
                    <span className="text-foreground-muted">:</span>{' '}
                    <span className="text-accent">"Building engaging websites & Mods"</span>,
                  </p>,
                  <p key="l5" className="pl-4 text-foreground-muted">
                    <span className="text-primary/80">quote</span>
                    <span className="text-foreground-muted">:</span>{' '}
                    <span className="text-accent">"Don't be afraid to fail. Be afraid not to try."</span>
                  </p>,
                  <p key="l6" className="text-foreground-muted">&nbsp;</p>,
                  <p key="l7" className="text-green-400">{`}`}</p>,
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
                {codeVisibleLines >= 7 && (
                  <span className="typing-cursor animate-fade-in" />
                )}
              </div>
            </div>

            <p className="text-foreground-muted leading-relaxed mb-8 min-h-[4.5rem]">
              {displayText}
              {isTyping && <span className="typing-cursor" />}
            </p>

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

              {/* Birthday Card */}
              <div
                className={`group bg-card/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-700 ${
                  greenBorder ? 'border-green-500/70 shadow-[0_0_15px_hsl(120_60%_50%/0.15)]' : dateError ? 'border-destructive/70 shadow-[0_0_15px_hsl(0_60%_50%/0.15)]' : 'border-border/50 hover:border-primary/40'
                } ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: cardsVisible ? `${bioData.length * 80}ms` : '0ms' }}
              >
                <div className="flex items-center gap-3 p-3.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <dt className="text-[11px] uppercase tracking-wider text-foreground-muted/70 font-medium">Birthday</dt>
                    <dd className="text-sm font-semibold text-foreground">
                      {dateSet
                        ? `${displayMonthName} ${selectedDate.day}, ${selectedDate.year}`
                        : 'Set my birthday'}
                    </dd>
                  </div>
                </div>
                {!dateSet && (
                  <div className="px-3.5 pb-3.5">
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="MM"
                        min="1"
                        max="12"
                        value={selectedDate.month}
                        onChange={(e) => { setSelectedDate(prev => ({ ...prev, month: e.target.value })); setDateError(''); }}
                        className="w-14 px-2 py-1.5 rounded-lg bg-muted border border-border/50 text-xs text-foreground font-mono text-center outline-none focus:border-primary/50 transition-colors"
                      />
                      <span className="text-foreground-muted/50 text-xs">/</span>
                      <input
                        type="number"
                        placeholder="DD"
                        min="1"
                        max="31"
                        value={selectedDate.day}
                        onChange={(e) => { setSelectedDate(prev => ({ ...prev, day: e.target.value })); setDateError(''); }}
                        className="w-14 px-2 py-1.5 rounded-lg bg-muted border border-border/50 text-xs text-foreground font-mono text-center outline-none focus:border-primary/50 transition-colors"
                      />
                      <span className="text-foreground-muted/50 text-xs">/</span>
                      <select
                        value={selectedDate.year}
                        onChange={(e) => setSelectedDate(prev => ({ ...prev, year: e.target.value }))}
                        className="w-[4.5rem] px-2 py-1.5 rounded-lg bg-muted border border-border/50 text-xs text-foreground font-mono text-center outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
                      >
                        <option value="2009">2009</option>
                        <option value="2010">2010</option>
                      </select>
                    </div>
                    {dateError && (
                      <p className="text-[10px] text-destructive font-mono mt-2 animate-fade-in">{dateError}</p>
                    )}
                    <button
                      onClick={handleDateSubmit}
                      disabled={!selectedDate.day || !selectedDate.month}
                      className="mt-2.5 w-full py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs text-primary font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Set
                    </button>
                  </div>
                )}
                {showUnlockNotice && (
                  <div className="px-3.5 pb-3.5 animate-fade-in">
                    <p className="text-[10px] text-green-500 font-mono">secret.bdt has been unlocked in My Skills!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
