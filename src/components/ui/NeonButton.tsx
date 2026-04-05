"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
}

export function NeonButton({ children, className, variant = "primary", size = "md", ...props }: NeonButtonProps) {
  const baseClasses = "relative font-semibold inline-flex items-center justify-center overflow-hidden rounded-xl transition-all outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] border border-brand-500",
    secondary: "bg-white/5 text-white backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-brand-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    danger: "bg-red-600/80 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500",
    success: "bg-green-600/80 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] border border-green-500",
    outline: "bg-transparent text-brand-100 border border-brand-500 hover:bg-brand-900/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:animate-[shimmer_1.5s_infinite]"></div>
    </motion.button>
  );
}
