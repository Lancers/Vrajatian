export interface ItineraryDay {
  day: number
  title: string
  description: string
}

export interface TravelPackage {
  id: string
  title: string
  description: string
  image: string
  price: number
  duration: string
  rating: number
  location: string
  region: string
  difficulty: "Easy" | "Medium" | "Hard"
  groupSize: number
  inclusions: string[]
  itinerary: ItineraryDay[]
}

export const DEFAULT_PACKAGES: TravelPackage[] = [
  {
    id: "pkg-kerala-backwaters",
    title: "Kerala Backwaters",
    description:
      "Drift through the palm-fringed backwaters of Alleppey aboard a private houseboat, spice-garden hikes in Munnar, and sunset at Kovalam beach.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2070&auto=format&fit=crop",
    price: 27000,
    duration: "7 Days, 6 Nights",
    rating: 4.9,
    location: "Alleppey, Kerala",
    region: "Kerala",
    difficulty: "Easy",
    groupSize: 12,
    inclusions: [
      "Private Houseboat Stay",
      "All Meals Onboard",
      "Munnar Tea Garden Tour",
      "Airport & Rail Transfers",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Kochi", description: "Transfer to Alleppey and check in to your private houseboat for a welcome cruise." },
      { day: 2, title: "Backwater Cruise", description: "Glide past coconut groves and paddy fields, stopping at village markets along the way." },
      { day: 3, title: "Munnar Tea Estates", description: "Drive up to Munnar's rolling tea plantations and visit a working tea factory." },
      { day: 4, title: "Spice Garden Trail", description: "Guided walk through cardamom and pepper plantations in the Western Ghats." },
      { day: 5, title: "Thekkady Wildlife", description: "Boat safari on Periyar Lake spotting elephants and langurs." },
      { day: 6, title: "Kovalam Beach", description: "Relax on the red-cliffed shores of Kovalam with an Ayurvedic massage." },
      { day: 7, title: "Departure", description: "Final morning at leisure before transfer to Trivandrum airport." },
    ],
  },
  {
    id: "pkg-himachal-manali",
    title: "Himalayan Trek — Manali",
    description:
      "Trek through pine forests and alpine meadows above Manali, cross the Rohtang Pass, and camp beneath snow-capped peaks in Himachal Pradesh.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
    price: 32500,
    duration: "8 Days, 7 Nights",
    rating: 4.8,
    location: "Manali, Himachal Pradesh",
    region: "Himachal Pradesh",
    difficulty: "Hard",
    groupSize: 10,
    inclusions: [
      "Mountain Camp & Guesthouse Stays",
      "All Trekking Permits",
      "Experienced Mountain Guide",
      "Rohtang Pass Excursion",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Manali", description: "Acclimatize in Old Manali and gear check with your trekking crew." },
      { day: 2, title: "Solang Valley", description: "Warm-up trek through Solang Valley with views of the Pir Panjal range." },
      { day: 3, title: "Rohtang Pass", description: "Cross the high-altitude Rohtang Pass into the Lahaul valley." },
      { day: 4, title: "Alpine Meadows", description: "Trek through rhododendron forests into open alpine meadows." },
      { day: 5, title: "Base Camp", description: "Reach the high-altitude base camp beneath snow-capped peaks." },
      { day: 6, title: "Summit Ridge Walk", description: "Guided ridge walk for panoramic views of the Himalayas at sunrise." },
      { day: 7, title: "Descent to Manali", description: "Trek back down through the valley, overnight in a riverside guesthouse." },
      { day: 8, title: "Departure", description: "Free morning for local market shopping before departure." },
    ],
  },
  {
    id: "pkg-rajasthan-heritage",
    title: "Rajasthan Heritage Tour",
    description:
      "Explore the pink lanes of Jaipur, the lake palaces of Udaipur, and the golden sands of Jaisalmer on a royal heritage circuit through Rajasthan.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop",
    price: 35000,
    duration: "9 Days, 8 Nights",
    rating: 4.9,
    location: "Jaipur & Udaipur, Rajasthan",
    region: "Rajasthan",
    difficulty: "Easy",
    groupSize: 15,
    inclusions: [
      "Heritage Haveli & Palace Stays",
      "Daily Breakfast & Dinner",
      "Amber Fort & City Palace Tours",
      "Desert Camel Safari",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", description: "Check in to a heritage haveli and stroll through the old walled city." },
      { day: 2, title: "Amber Fort", description: "Morning tour of Amber Fort followed by the City Palace and Jantar Mantar." },
      { day: 3, title: "Jaipur to Udaipur", description: "Scenic drive south to the lake city of Udaipur." },
      { day: 4, title: "Lake Palace & Ghats", description: "Boat ride on Lake Pichola and sunset at the palace ghats." },
      { day: 5, title: "Udaipur to Jodhpur", description: "Travel to the Blue City and explore the imposing Mehrangarh Fort." },
      { day: 6, title: "Jodhpur to Jaisalmer", description: "Drive into the Thar Desert to the golden sandstone city of Jaisalmer." },
      { day: 7, title: "Desert Safari", description: "Camel safari and overnight camping under the stars in the Sam Dunes." },
      { day: 8, title: "Jaisalmer Fort", description: "Explore the living fort city and its ornate merchant havelis." },
      { day: 9, title: "Departure", description: "Transfer back to Jodhpur airport for onward travel." },
    ],
  },
  {
    id: "pkg-goa-beach",
    title: "Goa Beach Retreat",
    description:
      "Unwind on the golden beaches of North and South Goa, with beach shacks, water sports, and Portuguese heritage walks through Old Goa.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2074&auto=format&fit=crop",
    price: 18500,
    duration: "5 Days, 4 Nights",
    rating: 4.6,
    location: "Goa",
    region: "Goa",
    difficulty: "Easy",
    groupSize: 14,
    inclusions: [
      "Beachfront Resort Stay",
      "Daily Breakfast",
      "Water Sports Session",
      "Old Goa Heritage Walk",
    ],
    itinerary: [
      { day: 1, title: "Welcome to Goa", description: "Check in to your beachfront resort and relax on Candolim beach." },
      { day: 2, title: "North Goa Beaches", description: "Beach-hop between Baga, Anjuna, and Vagator with a sunset flea market visit." },
      { day: 3, title: "Water Sports & Cruise", description: "Parasailing and jet-skiing followed by an evening Mandovi river cruise." },
      { day: 4, title: "Old Goa Heritage", description: "Guided walk through the Basilica of Bom Jesus and Se Cathedral." },
      { day: 5, title: "Departure", description: "Final beach morning before transfer to the airport." },
    ],
  },
  {
    id: "pkg-varanasi-spiritual",
    title: "Varanasi Spiritual Tour",
    description:
      "Witness the sacred Ganga Aarti, sunrise boat rides along the ghats, and guided temple walks through one of the world's oldest living cities.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop",
    price: 14500,
    duration: "4 Days, 3 Nights",
    rating: 4.7,
    location: "Varanasi, Uttar Pradesh",
    region: "Uttar Pradesh",
    difficulty: "Easy",
    groupSize: 10,
    inclusions: [
      "Riverside Heritage Hotel Stay",
      "Sunrise Ganga Boat Ride",
      "Evening Aarti Ceremony Viewing",
      "Sarnath Excursion",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Varanasi", description: "Check in and witness the evening Ganga Aarti ceremony at Dashashwamedh Ghat." },
      { day: 2, title: "Sunrise Boat Ride", description: "Dawn boat ride along the ghats followed by a walk through the old city lanes." },
      { day: 3, title: "Sarnath Excursion", description: "Visit the Buddhist site of Sarnath and the Archaeological Museum." },
      { day: 4, title: "Departure", description: "Final temple visit before transfer to the airport." },
    ],
  },
  {
    id: "pkg-andaman-islands",
    title: "Andaman Islands Escape",
    description:
      "Snorkel over coral reefs in Havelock, kayak through mangroves, and relax on the pristine white sands of Radhanagar Beach.",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2070&auto=format&fit=crop",
    price: 46000,
    duration: "6 Days, 5 Nights",
    rating: 4.8,
    location: "Havelock Island, Andaman",
    region: "Andaman & Nicobar",
    difficulty: "Medium",
    groupSize: 8,
    inclusions: [
      "Beach Resort Stay",
      "Ferry Transfers Between Islands",
      "Guided Snorkeling Trip",
      "Mangrove Kayaking",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Port Blair", description: "Visit the Cellular Jail and its light-and-sound show in the evening." },
      { day: 2, title: "Ferry to Havelock", description: "Morning ferry to Havelock Island and check in near Radhanagar Beach." },
      { day: 3, title: "Coral Reef Snorkeling", description: "Guided snorkeling trip over Havelock's coral reefs." },
      { day: 4, title: "Mangrove Kayaking", description: "Paddle through quiet mangrove creeks at sunrise." },
      { day: 5, title: "Radhanagar Beach", description: "Free day to relax on Asia's finest beach before the sunset." },
      { day: 6, title: "Departure", description: "Ferry back to Port Blair for your onward flight." },
    ],
  },
  {
    id: "pkg-gujarat-kutch",
    title: "Rann of Kutch Experience",
    description:
      "Walk the shimmering white salt desert under a full moon, explore Kutch's handicraft villages, and visit the Statue of Unity along the Narmada.",
    image: "https://images.unsplash.com/photo-1601922046210-9edb2b4c9d8e?q=80&w=2070&auto=format&fit=crop",
    price: 22000,
    duration: "5 Days, 4 Nights",
    rating: 4.7,
    location: "Bhuj, Gujarat",
    region: "Gujarat",
    difficulty: "Easy",
    groupSize: 12,
    inclusions: [
      "Rann Utsav Tent Stay",
      "White Desert Sunset Excursion",
      "Handicraft Village Tour",
      "Statue of Unity Visit",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Bhuj", description: "Check in to a traditional tent resort near the Rann of Kutch." },
      { day: 2, title: "White Desert Sunset", description: "Jeep safari to the salt flats for a full-moon sunset over the Rann." },
      { day: 3, title: "Handicraft Villages", description: "Visit the artisan villages of Bhujodi and Nirona, known for weaving and lacquer art." },
      { day: 4, title: "Statue of Unity", description: "Drive to Kevadia to view the Statue of Unity along the Narmada river." },
      { day: 5, title: "Departure", description: "Final morning at leisure before transfer to Ahmedabad." },
    ],
  },
]

const STORAGE_KEY = "vrajatian_packages"

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PACKAGES))
  }
}

export const getPackages = (): TravelPackage[] => {
  initializeStorage()
  return JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
}

export const savePackage = (pkg: TravelPackage): TravelPackage[] => {
  initializeStorage()
  const packages = getPackages()
  const index = packages.findIndex((p) => p.id === pkg.id)
  if (index !== -1) {
    packages[index] = pkg
  } else {
    packages.push(pkg)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages))
  return packages
}

export const deletePackage = (id: string): TravelPackage[] => {
  initializeStorage()
  const updated = getPackages().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export const getPackageById = (id: string): TravelPackage | undefined => {
  return getPackages().find((p) => p.id === id)
}
