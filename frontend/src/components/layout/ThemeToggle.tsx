import { Sun, Moon } from "lucide-react"

import { cn } from "src/lib/utils"
import { Switch } from "src/components/ui/switch"
import { useTheme } from "src/hooks/useTheme"

function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4" />
    </div>
  )
}

export default ThemeToggle
