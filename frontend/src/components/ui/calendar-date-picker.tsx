import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "src/lib/utils"

interface CalendarDatePickerProps {
  label: string
  selectedDate: string // "YYYY-MM-DD"
  onDateChange: (date: string) => void
  minDate?: string // "YYYY-MM-DD"
  placeholder?: string
  className?: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function parseISODate(iso: string) {
  if (!iso) return null
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function formatDisplay(iso: string) {
  const date = parseISODate(iso)
  if (!date) return "Select date"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function CalendarDatePicker({
  label,
  selectedDate,
  onDateChange,
  minDate,
  placeholder = "Select date",
  className,
}: CalendarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Current viewing month & year
  const initialDate = parseISODate(selectedDate) || (minDate ? parseISODate(minDate) : null) || new Date()
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  const minParsed = useMemo(() => (minDate ? parseISODate(minDate) : null), [minDate])
  const selectedParsed = useMemo(() => (selectedDate ? parseISODate(selectedDate) : null), [selectedDate])

  // Compute days in month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const days = []

    // Empty lead slots
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(viewYear, viewMonth, d))
    }

    return days
  }, [viewYear, viewMonth])

  function handlePrevMonth(e: React.MouseEvent) {
    e.stopPropagation()
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  function handleNextMonth(e: React.MouseEvent) {
    e.stopPropagation()
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  function handleSelect(date: Date) {
    onDateChange(toISODate(date))
    setIsOpen(false)
  }

  function handleQuickSelect(daysFromToday: number) {
    const target = new Date()
    target.setDate(target.getDate() + daysFromToday)
    if (minParsed && target < minParsed) return
    onDateChange(toISODate(target))
    setViewYear(target.getFullYear())
    setViewMonth(target.getMonth())
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "relative flex-1 px-4 py-2 hover:bg-neutral-50 rounded-xl sm:rounded-full transition-colors cursor-pointer text-left select-none",
            isOpen && "bg-neutral-50 ring-1 ring-neutral-300",
            className
          )}
        >
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer">
            {label}
          </label>
          <div className="flex items-center gap-2 mt-0.5">
            <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="w-full text-xs font-bold text-neutral-900 truncate">
              {selectedDate ? formatDisplay(selectedDate) : placeholder}
            </span>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-80 p-4 bg-white border border-neutral-200 rounded-3xl shadow-2xl"
      >
        {/* Month & Year Header with Arrows */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span className="text-xs font-extrabold text-neutral-900 tracking-tight">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="h-7 w-7 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="h-7 w-7 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
          {DAY_NAMES.map((d) => (
            <span key={d} className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="h-8 w-8" />
            }

            const isSelected =
              selectedParsed &&
              date.getFullYear() === selectedParsed.getFullYear() &&
              date.getMonth() === selectedParsed.getMonth() &&
              date.getDate() === selectedParsed.getDate()

            const isPast =
              minParsed &&
              new Date(date.getFullYear(), date.getMonth(), date.getDate()) <
                new Date(minParsed.getFullYear(), minParsed.getMonth(), minParsed.getDate())

            const isToday =
              date.getDate() === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear()

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={Boolean(isPast)}
                onClick={() => handleSelect(date)}
                className={cn(
                  "h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-neutral-900 text-white font-bold shadow-sm"
                    : isPast
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900",
                  isToday && !isSelected && "border border-neutral-300 font-bold text-sky-700"
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>

        {/* Quick select presets */}
        <div className="flex items-center justify-between gap-1.5 pt-3 mt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => handleQuickSelect(0)}
            className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(1)}
            className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(7)}
            className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            +1 Week
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(14)}
            className="text-[10px] font-bold text-sky-700 hover:text-sky-900 px-2 py-1 rounded-md hover:bg-sky-50 transition-colors"
          >
            +2 Weeks
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
