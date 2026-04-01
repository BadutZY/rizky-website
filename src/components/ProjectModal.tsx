import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, Code2 } from "lucide-react";

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  link: string;
  fullDescription?: string;
  image?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (project) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      window.addEventListener("keydown", handleEscape);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else {
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [project]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!project) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`absolute inset-0 bg-background/85 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-3xl flex flex-col bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8"
        }`}
        style={{ maxHeight: 'min(91vh, 860px)' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-background/60 backdrop-blur-md border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Fixed image header */}
        {project.image && (
          <div className="relative flex-shrink-0 overflow-hidden bg-muted" style={{ aspectRatio: '16/8' }}>
            <img
              src={project.image}
              alt={project.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                isVisible ? "scale-100" : "scale-110"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        )}

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)/0.3) transparent' }}
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <Code2 className="w-3.5 h-3.5" />
                {project.category}
              </span>
            </div>

            <h3
              id="modal-title"
              className="text-2xl md:text-3xl font-bold text-foreground mb-3"
            >
              {project.title}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base">
              {project.fullDescription || project.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                View Project <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleClose}
                className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;