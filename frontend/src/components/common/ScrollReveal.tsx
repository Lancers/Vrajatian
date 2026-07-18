import { useEffect, useRef, useState } from "react"
import { cn } from "src/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  variant?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom" | "scale-up" | "scale-down" | "blur-in" | "flip-up"
  duration?: number
  delay?: number
}

export function ScrollReveal({
  children,
  className,
  variant = "slide-up",
  duration = 800, // Increased default duration from 600ms to 800ms for smoother transitions
  delay = 0,
}: ScrollRevealProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [])

  const variantStyles = {
    fade: "opacity-0 data-[state=visible]:opacity-100",
    "slide-up": "opacity-0 translate-y-8 data-[state=visible]:opacity-100 data-[state=visible]:translate-y-0",
    "slide-down": "opacity-0 -translate-y-8 data-[state=visible]:opacity-100 data-[state=visible]:translate-y-0",
    "slide-left": "opacity-0 translate-x-8 data-[state=visible]:opacity-100 data-[state=visible]:translate-x-0",
    "slide-right": "opacity-0 -translate-x-8 data-[state=visible]:opacity-100 data-[state=visible]:translate-x-0",
    zoom: "opacity-0 scale-95 data-[state=visible]:opacity-100 data-[state=visible]:scale-100",
    "scale-up": "opacity-0 scale-90 data-[state=visible]:opacity-100 data-[state=visible]:scale-100",
    "scale-down": "opacity-0 scale-105 data-[state=visible]:opacity-100 data-[state=visible]:scale-100",
    "blur-in": "opacity-0 blur-md data-[state=visible]:opacity-100 data-[state=visible]:blur-0",
    "flip-up": "opacity-0 [transform:rotateX(-12deg)] data-[state=visible]:opacity-100 data-[state=visible]:[transform:rotateX(0deg)]",
  }

  return (
    <div
      ref={ref}
      data-state={isIntersecting ? "visible" : "hidden"}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        perspective: variant === "flip-up" ? "1000px" : undefined,
      }}
      className={cn(
        "transition-all ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
