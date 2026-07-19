import React from 'react';
import { motion } from 'motion/react';

interface TwoDotLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export const TwoDotLoader: React.FC<TwoDotLoaderProps> = ({ size = 'sm' }) => {
  const dotSize = size === 'sm' ? 'w-3 h-3' : (size === 'md' ? 'w-4 h-4' : 'w-6 h-6');
  const distance = size === 'sm' ? 8 : (size === 'md' ? 12 : 16);

  return (
    <div className="flex items-center justify-center relative w-12 h-6">
      <motion.div
        className={`${dotSize} bg-[#00f2ea] rounded-full absolute`}
        animate={{
          x: [distance, -distance, distance],
          scale: [1, 1.2, 1],
          zIndex: [1, 2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className={`${dotSize} bg-[#ff0050] rounded-full absolute`}
        animate={{
          x: [-distance, distance, -distance],
          scale: [1.2, 1, 1.2],
          zIndex: [2, 1, 2],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};