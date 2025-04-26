import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageFadeProps {
  children: ReactNode;
}

/**
 * Simple fade/slide animation wrapper for page transitions.
 * Wrap your page JSX with <PageFade>...</PageFade>.
 */
const PageFade = ({ children }: PageFadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageFade;
