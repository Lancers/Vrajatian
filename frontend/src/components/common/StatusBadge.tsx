import { cn } from "src/lib/utils"

type StatusBadgeTone = "positive" | "neutral" | "accent"

const TONE_CLASSES: Record<StatusBadgeTone, string> = {
  positive: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  neutral: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  accent: "border-primary/30 bg-primary/10 text-primary",
}

interface StatusBadgeProps {
  label: string
  tone: StatusBadgeTone
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        TONE_CLASSES[tone]
      )}
    >
      {label}
    </span>
  )
}
