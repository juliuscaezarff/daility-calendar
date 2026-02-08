"use client"

import * as React from "react"
import { motion, type Transition } from "motion/react"
import { cn } from "@/lib/utils"

interface BorderTrailProps {
  className?: string;
  size?: number;
  transition?: Transition;
}

export function BorderTrail({ className, size = 100, transition }: BorderTrailProps) {
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className,
      )}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={transition}
    />
  )
}
