import { motion } from 'framer-motion';

const ScrollIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.5 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
  >
    <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-mono">Scroll</span>
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"
    />
  </motion.div>
);

export default ScrollIndicator;
