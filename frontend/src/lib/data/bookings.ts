export interface Booking {
  id: string
  ref: string
  destination: string
  image: string
  startDate: string
  endDate: string
  travelers: number
  price: number
  status: "upcoming" | "completed" | "cancelled"
}

export const bookings: Booking[] = [
  {
    id: "1",
    ref: "VR-2026-001",
    destination: "Kerala Backwaters",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2070&auto=format&fit=crop",
    startDate: "2026-08-15",
    endDate: "2026-08-22",
    travelers: 2,
    price: 54000,
    status: "upcoming",
  },
  {
    id: "2",
    ref: "VR-2026-002",
    destination: "Himalayan Trek — Manali",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
    startDate: "2026-09-10",
    endDate: "2026-09-18",
    travelers: 4,
    price: 128000,
    status: "upcoming",
  },
  {
    id: "3",
    ref: "VR-2026-003",
    destination: "Rajasthan Heritage Tour",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop",
    startDate: "2026-03-01",
    endDate: "2026-03-10",
    travelers: 3,
    price: 89500,
    status: "completed",
  },
  {
    id: "4",
    ref: "VR-2026-004",
    destination: "Goa Beach Retreat",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2074&auto=format&fit=crop",
    startDate: "2026-01-05",
    endDate: "2026-01-09",
    travelers: 6,
    price: 72000,
    status: "completed",
  },
  {
    id: "5",
    ref: "VR-2026-005",
    destination: "Varanasi Spiritual Tour",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop",
    startDate: "2026-11-20",
    endDate: "2026-11-25",
    travelers: 2,
    price: 31000,
    status: "upcoming",
  },
  {
    id: "6",
    ref: "VR-2026-006",
    destination: "Andaman Islands Escape",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2070&auto=format&fit=crop",
    startDate: "2026-05-12",
    endDate: "2026-05-18",
    travelers: 2,
    price: 92000,
    status: "cancelled",
  },
]
