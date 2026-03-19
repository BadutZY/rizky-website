import { RefObject } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GlobalParallaxBackgroundProps {
  containerRef: RefObject<HTMLDivElement>;
}

const GlobalParallaxBackground = ({ containerRef }: GlobalParallaxBackgroundProps) => {
  const { scrollYProgress } = useScroll({ container: containerRef });

  const layerOneY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const layerTwoY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);
  const layerThreeY = useTransform(scrollYProgress, [0, 1], ['0%', '-34%']);
  const layerRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 2.5]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div className="absolute -inset-[25%]" style={{ y: layerOneY }}>
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, hsl(var(--primary) / 0.14), transparent 42%), radial-gradient(circle at 85% 70%, hsl(var(--foreground) / 0.08), transparent 44%)',
          }}
        />
      </motion.div>

      <motion.div className="absolute -inset-[30%]" style={{ y: layerTwoY, rotate: layerRotate }}>
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              'radial-gradient(circle at 70% 15%, hsl(var(--primary) / 0.16), transparent 36%), radial-gradient(circle at 30% 85%, hsl(var(--primary) / 0.12), transparent 38%)',
            filter: 'blur(6px)',
          }}
        />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: layerThreeY }}>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground) / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.35) 1px, transparent 1px)',
            backgroundSize: '90px 90px',
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--background) / 0.22) 0%, hsl(var(--background) / 0.45) 55%, hsl(var(--background) / 0.7) 100%)',
        }}
      />
    </div>
  );
};

export default GlobalParallaxBackground;
