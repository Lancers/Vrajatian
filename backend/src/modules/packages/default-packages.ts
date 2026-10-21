import type { PackageResponse } from "./package.dto"

export const DEFAULT_PACKAGES: PackageResponse[] = [
  {
    id: "pkg-kerala-backwaters",
    slug: "kerala-serene-backwaters",
    title: "Kerala Backwaters & Spice Plantations",
    description: "Drift along the emerald canals of Alleppey on a private luxury houseboat, trek through fragrant cardamom estates in Munnar, and catch golden sunsets over Fort Kochi.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop",
    price: 28500,
    duration: "6 Days, 5 Nights",
    rating: 4.9,
    location: "Alleppey & Munnar, Kerala",
    region: "Kerala",
    type: "trip",
    difficulty: "Easy",
    groupSize: 8,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Private Deluxe Houseboat Cruise with Chef",
      "Tea Estate Heritage Bungalow in Munnar",
      "Spice Garden Walking Tour with Botanist",
      "Kathakali Dance & Martial Arts Evening",
      "Airport Transfers in Premium AC Car"
    ],
    exclusions: [
      "Domestic airfare / train tickets",
      "Personal expenses & spa treatments",
      "Alcoholic beverages"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Kochi & Colonial Heritage", description: "Arrive at Cochin Airport. Private transfer to your heritage hotel in Fort Kochi. Evening stroll past iconic Chinese fishing nets." },
      { day: 2, title: "Ascent into Munnar Mist", description: "Scenic drive through Cheeyappara waterfalls to high-altitude tea plantations. Check into a boutique tea estate retreat." },
      { day: 3, title: "Tea Museum & Anamudi Views", description: "Visit the Tata Tea Museum, taste single-origin brews, and take an easy hike through Eravikulam National Park." },
      { day: 4, title: "Spice Hills to Alleppey Canals", description: "Descend into Alleppey. Board your traditional teak wood Kettuvallam houseboat. Enjoy fresh Karimeen fish curry prepared onboard." },
      { day: 5, title: "Sunset Village Canoe Ride", description: "Silent village exploration via country canoe. Witness coir making, paddy fields below sea level, and local backwater life." },
      { day: 6, title: "Departure with Spices", description: "Morning breakfast onboard, transfer back to Cochin Airport with complimentary Kerala spice souvenir gift." }
    ],
    tiers: [
      { name: "Basic", price: 23500, description: "Comfort boutique homestays and standard A/C houseboat" },
      { name: "Value", price: 28500, description: "Heritage tea bungalow, premium private houseboat, all private transfers" },
      { name: "Deluxe", price: 39500, description: "5-star luxury lake resort, glass-enclosed luxury houseboat, gourmet culinary curation" }
    ],
    status: "published"
  },
  {
    id: "pkg-rajasthan-royal-heritage",
    slug: "royal-rajasthan-palaces-and-desert",
    title: "Royal Rajasthan: Palaces & Starlit Dunes",
    description: "Experience the majestic splendor of Rajput kings: private tours of Amer Fort, candlelit dinners in Udaipur Lake Palace, and camping under desert starlight in Jaisalmer.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070&auto=format&fit=crop",
    price: 38000,
    duration: "7 Days, 6 Nights",
    rating: 4.9,
    location: "Jaipur, Jodhpur & Udaipur, Rajasthan",
    region: "Rajasthan",
    type: "trip",
    difficulty: "Easy",
    groupSize: 10,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Stays in Restored Heritage Havelis",
      "Sam Sand Dunes Luxury Glamping with Folk Music",
      "Private Guided Fort & Palace Explorations",
      "Lake Pichola Sunset Boat Charter",
      "Chauffeured Air-Conditioned SUV Throughout"
    ],
    exclusions: [
      "Camera & drone permits at monuments",
      "Lunches & personal shopping",
      "Tips for local guides"
    ],
    itinerary: [
      { day: 1, title: "Pink City Arrival & Nahargarh Sunset", description: "Welcome to Jaipur with traditional garland ceremony. Evening sunset tea at Nahargarh Fort overlooking the pink cityscape." },
      { day: 2, title: "Amer Fort & City Palace Secrets", description: "Ascend to Amer Fort, marvel at the mirror work of Sheesh Mahal, and discover royal textile archives at City Palace." },
      { day: 3, title: "Blue City Jodhpur & Mehrangarh", description: "Drive across desert highways to Jodhpur. Explore the towering ramparts of Mehrangarh Fort and the indigo alleys of Navchokiya." },
      { day: 4, title: "Golden Sands of Jaisalmer", description: "Journey into Thar Desert. Arrive at luxury swiss tents in Sam dunes. Camel safari followed by Kalbelia folk performances around a bonfire." },
      { day: 5, title: "The Living Fort & White Marble Ranakpur", description: "Morning walk inside the living sandstone fort of Jaisalmer, then drive past Jain marble carvings of Ranakpur to Udaipur." },
      { day: 6, title: "City of Lakes & Romantic Pichola", description: "Tour Udaipur's majestic City Palace complex, followed by an intimate twilight boat ride across Lake Pichola." },
      { day: 7, title: "Royal Farewell", description: "Enjoy a leisurely lakeside breakfast before your transfer to Udaipur Maharana Pratap Airport." }
    ],
    tiers: [
      { name: "Basic", price: 31000, description: "Authentic royal havelis and standard desert camp" },
      { name: "Value", price: 38000, description: "Boutique heritage palace hotels, luxury swiss desert tent, private SUV" },
      { name: "Deluxe", price: 54000, description: "Oberoi/Taj heritage properties, royal tent with private plunge pool, vintage car drive" }
    ],
    status: "published"
  },
  {
    id: "pkg-himalayan-manali-trek",
    slug: "himalayan-vista-manali-trek",
    title: "Himalayan Heights: Manali & Rohtang Valley",
    description: "Breathe the crisp pine air of the Pir Panjal range. Traverse dramatic river valleys, camp under the Milky Way, and witness high-altitude glacial passes.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
    price: 22500,
    duration: "6 Days, 5 Nights",
    rating: 4.8,
    location: "Manali & Solang Valley, Himachal Pradesh",
    region: "Himachal Pradesh",
    type: "trip",
    difficulty: "Medium",
    groupSize: 12,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Alpine Pine Chalet & Glamping Tents",
      "Certified Mountaineering Expedition Guide",
      "Rohtang Pass & Atal Tunnel Permit & Drive",
      "High-Altitude Medical Kit & Oxygen",
      "All Organic Mountain Meals During Trek"
    ],
    exclusions: [
      "Travel insurance (mandatory for treks)",
      "Rental mountain boots/poles",
      "Excess baggage transfers"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Manali & Forest Acclimatization", description: "Arrive in Old Manali. Settle into a cedarwood chalet. Gentle acclimatization walk to the ancient Hadimba Temple." },
      { day: 2, title: "Solang Valley & Mountain Trails", description: "Trail hike through apple orchards to Jogini Falls, followed by panoramic alpine views across Solang Valley." },
      { day: 3, title: "Atal Tunnel to Lahaul Moonscape", description: "Cross beneath the mountains via Atal Tunnel into the dry, dramatic trans-Himalayan desert of Sissu and Lahaul." },
      { day: 4, title: "Glacial Rohtang Ascent", description: "Ascend to Rohtang Pass at 13,058 ft. Spectacular panoramas of snow-draped Himalayan peaks and glacial ribbons." },
      { day: 5, title: "Riverside Campfire & Hot Springs", description: "Descend to Vashisht natural hot springs, then celebrate your journey around a cedar campfire with Himachali folk songs." },
      { day: 6, title: "Departure", description: "Morning cafe hop in Old Manali before comfortable Volvo coach transfer toward Delhi/Chandigarh." }
    ],
    tiers: [
      { name: "Basic", price: 18000, description: "Standard alpine guesthouse, shared 4x4 transfers" },
      { name: "Value", price: 22500, description: "Boutique riverside chalet, luxury dome camp, private transfers" },
      { name: "Deluxe", price: 32000, description: "5-star mountain spa resort, heated luxury alpine suite, private naturalist guide" }
    ],
    status: "published"
  },
  {
    id: "pkg-goa-sun-sea-heritage",
    slug: "goa-luxury-coast-and-heritage",
    title: "Goa: Pristine Coastline & Latin Quarters",
    description: "Beyond the beaches: savor Portuguese culinary heritage in Fontainhas, sunset catamaran cruises, secluded white sand bays in South Goa, and beachfront boutique villas.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2074&auto=format&fit=crop",
    price: 19500,
    duration: "5 Days, 4 Nights",
    rating: 4.8,
    location: "Panaji, Candolim & Palolem, Goa",
    region: "Goa",
    type: "trip",
    difficulty: "Easy",
    groupSize: 10,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Beachfront Boutique Resort in South Goa",
      "Private Fontainhas Heritage Walk & Fado Music",
      "Luxury Sunset Sailing Catamaran Cruise",
      "Daily Chef Breakfast & Seafood Tasting Dinner",
      "Private Chauffeur Car for 5 Days"
    ],
    exclusions: [
      "Flight tickets",
      "Personal water sports (available on site)",
      "Late-night club entries"
    ],
    itinerary: [
      { day: 1, title: "Arrival & Coastal Welcome", description: "Arrive at Dabolim or Mopa airport. Private transfer to your coastal retreat in South Goa. Sunset cocktails on the beach." },
      { day: 2, title: "Latin Quarter Fontainhas & Old Goa", description: "Walk the pastel-painted lanes of Fontainhas, admire Portuguese azulejos tiles, and visit Basilica of Bom Jesus." },
      { day: 3, title: "Catamaran Sailing & Dolphin Spotting", description: "Board a private catamaran for a morning sail. Spot humpback dolphins and snorkel in secluded coves." },
      { day: 4, title: "Spice Farm & Secret South Beaches", description: "Visit a lush organic spice farm for a traditional Goan thali, followed by an afternoon relaxing on serene Butterfly Beach." },
      { day: 5, title: "Bespoke Departure", description: "Leisurely morning swim, artisanal bakery stop in Assagao, and private airport transfer." }
    ],
    tiers: [
      { name: "Basic", price: 15500, description: "Charming coastal homestay, scooter/shared car rental" },
      { name: "Value", price: 19500, description: "Boutique 4★ beachfront resort, private car, catamaran tour" },
      { name: "Deluxe", price: 34000, description: "5★ luxury heritage villa with private pool, private yacht charter" }
    ],
    status: "published"
  },
  {
    id: "pkg-andaman-islands-escape",
    slug: "andaman-islands-havelock-escape",
    title: "Andaman Islands: Havelock Reefs & Radhanagar",
    description: "Discover turquoise waters, radiant coral reefs, and bioluminescent kayak night tours on Asia's top-rated tropical beaches.",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2070&auto=format&fit=crop",
    price: 44000,
    duration: "6 Days, 5 Nights",
    rating: 4.9,
    location: "Port Blair, Havelock & Neil Islands",
    region: "Andaman & Nicobar",
    type: "trip",
    difficulty: "Medium",
    groupSize: 8,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Beachfront Cottages on Havelock Island",
      "High-Speed Catamaran Cruise (Makruzz) Transfers",
      "Guided Reef Snorkeling with Marine Biologist",
      "Sunrise Mangrove Kayak Expedition",
      "Cellular Jail Light & Sound VIP Passes"
    ],
    exclusions: [
      "Flights to Port Blair",
      "Scuba diving certification add-on",
      "Personal underwater photography packages"
    ],
    itinerary: [
      { day: 1, title: "Port Blair & Freedom History", description: "Arrive at Port Blair. Tour the historic Cellular Jail and experience the moving evening sound and light presentation." },
      { day: 2, title: "Catamaran to Havelock", description: "Board luxury catamaran across deep blue waters to Havelock Island. Settle into your beachfront eco-villa." },
      { day: 3, title: "Elephant Beach Coral Reefs", description: "Speedboat excursion to Elephant Beach. Snorkel through colorful sea fan corals and swim with tropical fish." },
      { day: 4, title: "Radhanagar Sunset Splendor", description: "Spend a relaxing afternoon on Radhanagar Beach (Beach No. 7), celebrated worldwide for its powder-white sand and fiery sunsets." },
      { day: 5, title: "Neil Island Natural Rock Bridge", description: "Day cruise to Neil Island. Explore the natural coral bridge formation, Laxmanpur Beach, and quiet coastal lagoons." },
      { day: 6, title: "Return to Port Blair & Departure", description: "Morning catamaran back to Port Blair and onward airport connection." }
    ],
    tiers: [
      { name: "Basic", price: 36000, description: "Cozy beach huts, government ferry tickets" },
      { name: "Value", price: 44000, description: "Boutique beachfront resort, premium Makruzz catamaran, guided snorkeling" },
      { name: "Deluxe", price: 62000, description: "Taj Exotica / luxury pool villa, private yacht transfer, private divemaster" }
    ],
    status: "published"
  },
  {
    id: "pkg-kashmir-paradise-valley",
    slug: "kashmir-paradise-dal-lake-gulmarg",
    title: "Kashmir: Dal Lake Shikara & Gulmarg Meadows",
    description: "Experience the heaven on earth: carved cedar houseboats on Dal Lake, gondola rides above the snow line in Gulmarg, and saffron fields in Pampore.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop",
    price: 34000,
    duration: "6 Days, 5 Nights",
    rating: 4.9,
    location: "Srinagar, Gulmarg & Pahalgam, Kashmir",
    region: "Jammu & Kashmir",
    type: "trip",
    difficulty: "Easy",
    groupSize: 10,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Royal Handcrafted Cedarwood Houseboat on Nigeen Lake",
      "Gulmarg Phase-1 Gondola Tickets",
      "Private Shikara Sunset Tour with Kahwa Tea",
      "Pahalgam Betaab Valley & Aru Valley Excursion",
      "Dedicated Private Chauffeur & Vehicle"
    ],
    exclusions: [
      "Pony rides in Gulmarg/Pahalgam",
      "Airfare to Srinagar",
      "Winter gear rental"
    ],
    itinerary: [
      { day: 1, title: "Srinagar Shikara & Mughal Gardens", description: "Arrive in Srinagar. Check into a heritage houseboat on tranquil Nigeen Lake. Evening Shikara ride floating through lotus gardens." },
      { day: 2, title: "Mughal Architecture & Old City Bazaars", description: "Visit Shalimar and Nishat Bagh gardens, followed by an artisanal pashmina weaving workshop in the downtown bazaar." },
      { day: 3, title: "Gondola High Above Gulmarg", description: "Drive up to Gulmarg. Ride the world's highest cable car through pine forests to the snow slopes of Kongdoori." },
      { day: 4, title: "Pahalgam Valley of Shepherds", description: "Scenic drive through saffron fields of Pampore to Pahalgam. Stroll along the gushing Lidder River." },
      { day: 5, title: "Betaab Valley & Himalayan Meadows", description: "Explore the postcard-perfect meadows of Betaab and Aru valleys with an afternoon picnic." },
      { day: 6, title: "Kahwa Farewell", description: "Sip spiced saffron Kahwa on your houseboat deck before your transfer to Srinagar Airport." }
    ],
    tiers: [
      { name: "Basic", price: 27000, description: "Standard houseboat, 3-star mountain hotels" },
      { name: "Value", price: 34000, description: "Super deluxe heritage houseboat, 4-star mountain lodge, gondola passes" },
      { name: "Deluxe", price: 49000, description: "The Lalit Grand Palace Srinagar, Khyber Himalayan Resort Gulmarg" }
    ],
    status: "published"
  },
  // Adventure Activities
  {
    id: "pkg-rishikesh-river-rafting",
    slug: "rishikesh-white-water-rafting",
    title: "Rishikesh White-Water Rafting & Cliff Jump",
    description: "Conquer grade III and IV rapids along the sacred Ganga, followed by an adrenaline-pumping 30ft cliff jump into emerald waters.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop",
    price: 4500,
    duration: "1 Day (6 Hours)",
    rating: 4.9,
    location: "Rishikesh, Uttarakhand",
    region: "Uttarakhand",
    type: "activity",
    difficulty: "Medium",
    groupSize: 8,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "16km Rafting from Shivpuri to NIM Beach",
      "International Standard Life Jackets & Helmets",
      "Certified River Rescue Kayakers Companion",
      "Cliff Jumping & Body Surfing Sessions",
      "Riverside Hot Lunch & Herbal Tea"
    ],
    exclusions: [
      "GoPro video footage (available for small fee)",
      "Hotel pickup/drop from Haridwar"
    ],
    itinerary: [
      { day: 1, title: "Rapids Briefing & River Descent", description: "Meet at Shivpuri base. Gear check and safety briefing. Run famous rapids including 'Roller Coaster' and 'Golf Course'. Conclude at NIM Beach with lunch." }
    ],
    tiers: [
      { name: "Basic", price: 3200, description: "12km standard rafting run" },
      { name: "Value", price: 4500, description: "16km run, cliff jumping, hot lunch included" },
      { name: "Deluxe", price: 6500, description: "24km Marine Drive expedition + GoPro video pack" }
    ],
    status: "published"
  },
  {
    id: "pkg-bir-billing-paragliding",
    slug: "bir-billing-paragliding-adventure",
    title: "Bir Billing: Tandem Paragliding Flight",
    description: "Soar with the eagles at the world's 2nd highest paragliding takeoff site. Experience 25-30 minutes of thermal soaring over the Kangra Valley.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    price: 3800,
    duration: "1 Day (3 Hours)",
    rating: 4.9,
    location: "Bir Billing, Himachal Pradesh",
    region: "Himachal Pradesh",
    type: "activity",
    difficulty: "Medium",
    groupSize: 10,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "25-30 Minute Tandem Paragliding Flight",
      "Licensed Senior Tandem Pilot",
      "4x4 Safari Jeep from Bir to Billing Launchpad (8,000 ft)",
      "HD Action Camera Video with Memory Stick",
      "Aviation Safety Insurance"
    ],
    exclusions: [
      "Heavy thermalling acrobatics surcharge"
    ],
    itinerary: [
      { day: 1, title: "Takeoff at 8,000 ft & Glide", description: "Jeep ride up to Billing ridge. Wind check and harness lock. Take flight across the Himalayan foothills and touch down safely in the Tibetan landing grounds of Bir." }
    ],
    tiers: [
      { name: "Basic", price: 2800, description: "15 minute short tandem glide" },
      { name: "Value", price: 3800, description: "30 minute cross-valley flight + HD video footage" },
      { name: "Deluxe", price: 5800, description: "Sunset thermal soaring + aerobatic maneuvers + drone footage" }
    ],
    status: "published"
  },
  // Educational Trips
  {
    id: "pkg-himalayan-ecology-camp",
    slug: "himalayan-ecology-field-study",
    title: "Himalayan Ecology & Biodiversity Field Study",
    description: "Curated learning journey for schools and universities exploring glacial hydrology, Himalayan biodiversity, and forest conservation.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    price: 18500,
    duration: "5 Days, 4 Nights",
    rating: 4.9,
    location: "Dehradun & Mussoorie, Uttarakhand",
    region: "Uttarakhand",
    type: "education",
    difficulty: "Easy",
    groupSize: 35,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "Forest Research Institute (FRI) Guided Seminar",
      "Eco-Camp Stays with Separate Faculty Tents",
      "Glacial Stream Water Quality Testing Workshop",
      "All Organic Buffet Meals with Nutritionist Check",
      "24/7 Security and Paramedic on Site"
    ],
    exclusions: [
      "Personal medical expenses",
      "Individual souvenir purchases"
    ],
    itinerary: [
      { day: 1, title: "Arrival & Orientation at FRI", description: "Arrive at Dehradun. Welcome workshop at the iconic Forest Research Institute on Himalayan forestry." },
      { day: 2, title: "Flora Identification & Canopy Walk", description: "Field excursion through Benog Wildlife Sanctuary. Students log native plant species and bird calls." },
      { day: 3, title: "Stream Hydrology Workshop", description: "Hands-on water pH and micro-fauna testing along Himalayan tributaries." },
      { day: 4, title: "Sustainable Village Immersion", description: "Interactive session with mountain farming communities on terraced agriculture and seed banks." },
      { day: 5, title: "Certification & Return", description: "Student presentation symposium, certificate distribution, and escorted transfer." }
    ],
    tiers: [
      { name: "Basic", price: 15000, description: "Standard student dorms and guided trails" },
      { name: "Value", price: 18500, description: "Deluxe eco-camp, workshop kits, certified naturalists" },
      { name: "Deluxe", price: 24000, description: "Resort accommodation, guest university lectures, drone mapping lab" }
    ],
    status: "published"
  },
  // Corporate Trips
  {
    id: "pkg-goa-leadership-retreat",
    slug: "coastal-executive-leadership-retreat",
    title: "Coastal Executive Leadership & Innovation Offsite",
    description: "Elevate strategic vision and team cohesion at a private 5-star beachfront sanctuary with dedicated tech facilities, leadership workshops, and catamaran sundowners.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    price: 48000,
    duration: "4 Days, 3 Nights",
    rating: 4.9,
    location: "South Goa",
    region: "Goa",
    type: "corporate",
    difficulty: "Easy",
    groupSize: 40,
    isFeatured: true,
    specialRequestAllowed: true,
    inclusions: [
      "5★ Beachfront Resort Buyout / Dedicated Wing",
      "High-Tech Conference Pavilion with AV & High-Speed Fiber",
      "Private Sunset Catamaran Sailing & Live Jazz Band",
      "Executive Team Building Challenges by Certified Facilitators",
      "Dedicated Airport Luxury Coach Fleet"
    ],
    exclusions: [
      "Individual executive flight upgrades",
      "Personal spa tabs"
    ],
    itinerary: [
      { day: 1, title: "Arrival & Icebreaker Beach Sundowner", description: "Executive airport reception. Private check-in. Evening keynote and welcome networking dinner on the beachfront lawn." },
      { day: 2, title: "Strategy Hackathon & Team Regatta", description: "Morning hackathon in conference pavilion. Afternoon competitive catamaran regatta fostering high-trust collaboration." },
      { day: 3, title: "Wellness & Gala Celebration", description: "Sunrise yoga and breathwork. Afternoon strategy debrief, followed by an awards gala with Goan culinary masters." },
      { day: 4, title: "Farewell & Airport Transfers", description: "Executive networking brunch and private transfers to the airport." }
    ],
    tiers: [
      { name: "Basic", price: 38000, description: "4-star business beach resort with standard conference room" },
      { name: "Value", price: 48000, description: "5-star luxury resort, private catamaran charter, gala dinner" },
      { name: "Deluxe", price: 68000, description: "Exclusive villa estate buyout, helicopter transfers, Michelin-star guest chef" }
    ],
    status: "published"
  }
]
