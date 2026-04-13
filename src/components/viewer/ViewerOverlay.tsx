"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ViewerOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <p className="text-xs font-mono text-gray-400 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full tracking-widest">
            Drag to rotate · Scroll to zoom
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
