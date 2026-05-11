"use client"

import { GrainGradient } from "@paper-design/shaders-react"

interface GradientBackgroundProps {
  /** Override colors — defaults to warm fire palette */
  colors?: string[]
  intensity?: number
  softness?: number
  noise?: number
  speed?: number
  shape?: "corners" | "wave" | "dots" | "truchet" | "ripple" | "blob" | "sphere"
  style?: React.CSSProperties
  className?: string
}

export function GradientBackground({
  colors = ["hsl(14, 100%, 57%)", "hsl(45, 100%, 51%)", "hsl(340, 82%, 52%)"],
  intensity = 0.45,
  softness = 0.76,
  noise = 0,
  speed = 0.6,
  shape = "corners",
  style,
  className,
}: GradientBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack="hsl(0, 0%, 0%)"
        softness={softness}
        intensity={intensity}
        noise={noise}
        shape={shape}
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={speed}
        colors={colors}
      />
    </div>
  )
}
