"use client"

import { motion } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

/** Minimal, consistent entrance animation — used sparingly per the design brief. */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
