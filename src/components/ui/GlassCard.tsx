"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Wait, I need to create src/lib/utils.ts

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl glass-panel p-6 sm:p-8 overflow-hidden",
        glow && "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:shadow-[0_0_15px_rgba(168,85,247,0.4)]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-900/20 to-transparent pointer-events-none"></div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
