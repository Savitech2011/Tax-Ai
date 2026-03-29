import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';

export const VoiceFace = ({ onClose }: { onClose: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const eyeX = useSpring(mouseX, springConfig);
  const eyeY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer" onClick={onClose}>
      <motion.div 
        className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 shadow-[0_0_50px_rgba(255,100,0,0.5)] relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="w-6 h-12 bg-white rounded-full"
              style={{
                x: eyeX,
                y: eyeY,
              }}
              animate={{ scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
