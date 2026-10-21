import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, Users, Search, Check, Plus, Minus, Compass, X } from "lucide-react"

import { Button } from "src/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/popover"
import { CalendarDatePicker } from "src/components/ui/calendar-date-picker"
import { cn } from "src/lib/utils"

interface DestinationOption {
  city: string
  region: string
  tag: string
  query: string
}

const POPULAR_DESTINATIONS: DestinationOption[] = [
  { city: "Jaipur", region: "Rajasthan", tag: "Heritage Palaces & Royal Forts", query: "Jaipur" },
  { city: "Alleppey & Munnar", region: "Kerala", tag: "Backwaters & High Tea Hills", query: "Kerala" },
  { city: "Udaipur", region: "Rajasthan", tag: "City of Lakes & Palaces", query: "Udaipur" },
  { city: "South Goa", region: "Goa", tag: "Pristine Sands & Portuguese Villas", query: "Goa" },
  { city: "Manali & Shimla", region: "Himachal", tag: "Alpine Escapes & Snow Peaks", query: "Himachal" },
  { city: "Varanasi", region: "Uttar Pradesh", tag: "Spiritual Ghats & Sunset Aarti", query: "Varanasi" },
  { city: "Ranthambore", region: "Rajasthan", tag: "Royal Bengal Tiger Safaris", query: "Ranthambore" },
]

function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getFutureDateString(daysAhead: number): string {
  const target = new Date()
  target.setDate(target.getDate() + daysAhead)
  const y = target.getFullYear()
  const m = String(target.getMonth() + 1).padStart(2, "0")
  const d = String(target.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function Hero() {
  const navigate = useNavigate()

  // 1. Destination State (shadcn Popover like CalendarDatePicker)
  const [destination, setDestination] = useState("Jaipur, Rajasthan")
  const [destSearch, setDestSearch] = useState("")
  const [isDestOpen, setIsDestOpen] = useState(false)

  // 2. Dates State (shadcn CalendarDatePicker)
  const [checkIn, setCheckIn] = useState(() => getFutureDateString(7))
  const [checkOut, setCheckOut] = useState(() => getFutureDateString(11))

  // 3. Guests State (shadcn Popover like CalendarDatePicker)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)

  function handleCheckInChange(val: string) {
    setCheckIn(val)
    if (val && checkOut && val >= checkOut) {
      const [y, m, d] = val.split("-").map(Number)
      const target = new Date(y, m - 1, d)
      target.setDate(target.getDate() + 3)
      const ty = target.getFullYear()
      const tm = String(target.getMonth() + 1).padStart(2, "0")
      const td = String(target.getDate()).padStart(2, "0")
      setCheckOut(`${ty}-${tm}-${td}`)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) {
      params.set("q", destination.trim())
      params.set("destination", destination.trim())
    }
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    const totalGuests = adults + children
    params.set("guests", String(totalGuests))
    params.set("rooms", String(rooms))

    navigate(`/destinations?${params.toString()}`)
  }

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (d) =>
      d.city.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.region.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.tag.toLowerCase().includes(destSearch.toLowerCase())
  )

  const guestSummary = `${adults + children} Guest${adults + children > 1 ? "s" : ""}, ${rooms} Room${rooms > 1 ? "s" : ""}`

  return (
    <section className="relative bg-background pt-6 sm:pt-10 pb-16">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Giant Hero Title matching reference image */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[132px] font-black tracking-tight text-foreground leading-none mb-6 sm:mb-8 select-none"
        >
          Vrajatian
        </motion.h1>

        {/* Hero Landscape Card with Floating Embedded Capsule */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[500px] sm:min-h-0 sm:aspect-[21/9] bg-muted border border-border/80"
        >
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=85"
            alt="Luxurious Indian Heritage Stay"
            className="absolute inset-0 h-full w-full object-cover brightness-[0.97]"
          />

          {/* Floating Capsule Search Bar directly overlaid at the bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-3 sm:inset-x-6 md:inset-x-10 bottom-3 sm:bottom-6 z-30"
          >
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl sm:rounded-full p-2 border border-neutral-200/90 shadow-2xl transition-all"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 sm:gap-2">
                {/* Field 1: Destination Selector (shadcn Popover anchored exactly like Check-in) */}
                <Popover open={isDestOpen} onOpenChange={setIsDestOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "relative flex-1 px-4 py-2 hover:bg-neutral-50 rounded-xl sm:rounded-full transition-colors cursor-pointer text-left select-none",
                        isDestOpen && "bg-neutral-50 ring-1 ring-neutral-300"
                      )}
                    >
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer">
                        Destination
                      </label>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="w-full text-xs font-bold text-neutral-900 truncate">
                          {destination || "Where to? (e.g. Jaipur, Kerala)"}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="w-80 sm:w-96 rounded-3xl bg-white border border-neutral-200 shadow-2xl p-3 z-50 overflow-hidden"
                  >
                    <div className="px-1 pb-2 border-b border-neutral-100 flex items-center gap-2">
                      <Search size={14} className="text-neutral-400" />
                      <input
                        type="text"
                        value={destSearch}
                        onChange={(e) => setDestSearch(e.target.value)}
                        placeholder="Search destination, region..."
                        autoFocus
                        className="w-full text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-400"
                      />
                      {destSearch && (
                        <button
                          type="button"
                          onClick={() => setDestSearch("")}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 px-2 pb-1.5 flex items-center gap-1">
                        <Compass size={11} /> Handpicked Destinations
                      </p>
                      <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
                        {filteredDestinations.map((item) => {
                          const isSelected = destination.includes(item.city)
                          return (
                            <button
                              key={item.city}
                              type="button"
                              onClick={() => {
                                setDestination(`${item.city}, ${item.region}`)
                                setIsDestOpen(false)
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                                isSelected
                                  ? "bg-sky-50 text-sky-950 font-bold"
                                  : "hover:bg-neutral-50 text-neutral-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                                  <MapPin size={13} className="text-sky-700" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold leading-tight">
                                    {item.city}, {item.region}
                                  </p>
                                  <p className="text-[10px] text-neutral-500 font-normal">
                                    {item.tag}
                                  </p>
                                </div>
                              </div>
                              {isSelected && <Check size={14} className="text-sky-600 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="hidden sm:block h-8 w-px bg-neutral-200 shrink-0" />

                {/* Field 2: Check-in Date (shadcn CalendarDatePicker) */}
                <CalendarDatePicker
                  label="Check-in"
                  selectedDate={checkIn}
                  onDateChange={handleCheckInChange}
                  minDate={getTodayString()}
                />

                <div className="hidden sm:block h-8 w-px bg-neutral-200 shrink-0" />

                {/* Field 3: Check-out Date (shadcn CalendarDatePicker) */}
                <CalendarDatePicker
                  label="Check-out"
                  selectedDate={checkOut}
                  onDateChange={(val) => setCheckOut(val)}
                  minDate={checkIn || getTodayString()}
                />

                <div className="hidden sm:block h-8 w-px bg-neutral-200 shrink-0" />

                {/* Field 4: Person / Guests Selector (shadcn Popover anchored exactly like Check-out) */}
                <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "relative flex-1 px-4 py-2 hover:bg-neutral-50 rounded-xl sm:rounded-full transition-colors cursor-pointer text-left select-none",
                        isGuestsOpen && "bg-neutral-50 ring-1 ring-neutral-300"
                      )}
                    >
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer">
                        Person
                      </label>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="w-full text-xs font-bold text-neutral-900 truncate">
                          {guestSummary}
                        </span>
                      </div>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    sideOffset={8}
                    className="w-72 rounded-3xl bg-white border border-neutral-200 shadow-2xl p-4 z-50 space-y-4"
                  >
                    <p className="text-xs font-extrabold text-neutral-900">Rooms &amp; Travelers</p>

                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-neutral-800">Adults</p>
                        <p className="text-[10px] text-neutral-400">Ages 13 and above</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                          className="h-7 w-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          disabled={adults >= 10}
                          onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                          className="h-7 w-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-800">Children</p>
                        <p className="text-[10px] text-neutral-400">Ages 0 to 12</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={children <= 0}
                          onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                          className="h-7 w-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{children}</span>
                        <button
                          type="button"
                          disabled={children >= 6}
                          onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                          className="h-7 w-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-800">Rooms</p>
                        <p className="text-[10px] text-neutral-400">Suites / Rooms</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={rooms <= 1}
                          onClick={() => setRooms((prev) => Math.max(1, prev - 1))}
                          className="h-7 w-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{rooms}</span>
                        <button
                          type="button"
                          disabled={rooms >= 5}
                          onClick={() => setRooms((prev) => Math.min(5, prev + 1))}
                          className="h-7 w-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setIsGuestsOpen(false)}
                      className="w-full rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold h-9 text-xs transition-colors"
                    >
                      Done
                    </Button>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <Button
                  type="submit"
                  className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-7 py-2 h-11 text-xs shadow-md shrink-0 gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <Search size={14} />
                  <span>Search</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
