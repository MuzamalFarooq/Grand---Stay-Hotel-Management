const ROOM_IMAGES = {
  Standard: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33a577e1958?w=800&q=80",
  ],
  Deluxe: [
    "https://images.unsplash.com/photo-1611892440504-42a792e2848a?w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  ],
  Suite: [
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  ],
  Presidential: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  ],
};

const ROOM_NAMES = {
  Standard: [
    "Celestial Horizon", "Marble Serenity", "Golden Dawn", "Velvet Comfort",
    "Crystal Retreat", "Amber Glow", "Pearl Essence", "Ivory Haven",
    "Sapphire Calm", "Rosewood Charm", "Silver Mist", "Jade Tranquility",
    "Onyx Elegance", "Coral Breeze", "Bronze Twilight", "Opal Sanctuary",
  ],
  Deluxe: [
    "Royal Orchid", "Emerald Vista", "Platinum Suite", "Diamond Harbor",
    "Obsidian Luxe", "Champagne Terrace", "Midnight Velvet", "Sunset Panorama",
    "Arctic Aurora", "Tuscan Heritage", "Monaco Grace", "Venetian Dream",
  ],
  Suite: [
    "Imperial Grand", "Penthouse Azure", "Sovereign Crown", "Majestic Horizon",
    "Regal Palazzo", "Noble Respite", "Elite Sovereign", "Grand Monarch",
  ],
  Presidential: [
    "The Grand Palace", "Presidential Crown", "Royal Dynasty", "Imperial Legacy",
  ],
};

const AMENITIES = {
  Standard: ["WiFi", "AC", "Smart TV", "Mini Bar", "Room Service", "Safe"],
  Deluxe: ["WiFi", "AC", "55\" 4K TV", "Mini Bar", "Room Service", "Safe", "Bathtub", "Coffee Machine"],
  Suite: ["WiFi", "AC", "65\" OLED TV", "Premium Mini Bar", "Butler Service", "Safe", "Jacuzzi", "Espresso Bar", "Ocean View"],
  Presidential: ["WiFi", "AC", "85\" OLED TV", "Full Bar", "Private Butler", "Safe", "Private Jacuzzi", "Dining Room", "Panoramic View", "Private Terrace"],
};

const BED_TYPES = {
  Standard: "Queen",
  Deluxe: "King",
  Suite: "King + Sofa Bed",
  Presidential: "California King + Guest Room",
};

const DESCRIPTIONS = {
  Standard: "Elegantly appointed standard room featuring premium linens, marble bathroom, and city views. Perfect for business travelers and couples seeking refined comfort.",
  Deluxe: "Spacious deluxe accommodation with upgraded furnishings, rainfall shower, and partial ocean views. Includes complimentary minibar and priority check-in.",
  Suite: "Luxurious suite with separate living area, panoramic views, and exclusive lounge access. Features designer furnishings and personalized concierge service.",
  Presidential: "The pinnacle of luxury — expansive multi-room residence with private terrace, butler service, grand piano, and breathtaking 360-degree views.",
};

const TYPE_CONFIG = {
  Standard: { count: 16, priceRange: [15000, 22000], maxGuests: 2, sizeRange: [280, 350], ratingRange: [4.2, 4.6] },
  Deluxe: { count: 12, priceRange: [25000, 38000], maxGuests: 3, sizeRange: [400, 520], ratingRange: [4.4, 4.8] },
  Suite: { count: 8, priceRange: [45000, 75000], maxGuests: 4, sizeRange: [650, 900], ratingRange: [4.6, 4.9] },
  Presidential: { count: 4, priceRange: [95000, 150000], maxGuests: 6, sizeRange: [1200, 2000], ratingRange: [4.8, 5.0] },
};

function randomInRange(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function roundPrice(price) {
  return Math.round(price / 500) * 500;
}

export function generateRooms() {
  const rooms = [];
  let roomIndex = 0;

  for (const [roomType, config] of Object.entries(TYPE_CONFIG)) {
    const names = ROOM_NAMES[roomType];
    for (let i = 0; i < config.count; i++) {
      roomIndex++;
      const floor = Math.ceil(roomIndex / 4);
      const roomNum = `${floor}${String((roomIndex - 1) % 4 + 1).padStart(2, "0")}`;
      const nameIndex = i % names.length;

      rooms.push({
        roomNumber: roomNum,
        roomName: names[nameIndex],
        roomType,
        description: DESCRIPTIONS[roomType],
        pricePerNight: roundPrice(randomInRange(config.priceRange[0], config.priceRange[1])),
        maxGuests: config.maxGuests,
        bedType: BED_TYPES[roomType],
        sizeSqFt: randomInRange(config.sizeRange[0], config.sizeRange[1]),
        amenities: AMENITIES[roomType],
        images: ROOM_IMAGES[roomType],
        availabilityStatus: "Available",
        floor,
        rating: Number((config.ratingRange[0] + Math.random() * (config.ratingRange[1] - config.ratingRange[0])).toFixed(1)),
      });
    }
  }

  return rooms;
}

export const STAFF_DATA = [
  { name: "Alexander Whitmore", role: "General Manager", department: "Management", salary: 185000, shift: "Morning", phone: "+92 300 1110001", email: "a.whitmore@grandstay.com", joiningDate: "2019-03-15" },
  { name: "Sofia Martinez", role: "Front Desk Manager", department: "Reception", salary: 95000, shift: "Morning", phone: "+92 300 1110002", email: "s.martinez@grandstay.com", joiningDate: "2020-06-01" },
  { name: "James Chen", role: "Concierge", department: "Guest Services", salary: 72000, shift: "Afternoon", phone: "+92 300 1110003", email: "j.chen@grandstay.com", joiningDate: "2021-01-10" },
  { name: "Emily Richardson", role: "Receptionist", department: "Reception", salary: 55000, shift: "Morning", phone: "+92 300 1110004", email: "e.richardson@grandstay.com", joiningDate: "2022-04-20" },
  { name: "Marcus Johnson", role: "Night Auditor", department: "Reception", salary: 58000, shift: "Night", phone: "+92 300 1110005", email: "m.johnson@grandstay.com", joiningDate: "2021-09-05" },
  { name: "Priya Sharma", role: "Housekeeping Supervisor", department: "Housekeeping", salary: 68000, shift: "Morning", phone: "+92 300 1110006", email: "p.sharma@grandstay.com", joiningDate: "2020-11-12" },
  { name: "David Okafor", role: "Room Attendant", department: "Housekeeping", salary: 42000, shift: "Morning", phone: "+92 300 1110007", email: "d.okafor@grandstay.com", joiningDate: "2023-02-18" },
  { name: "Fatima Al-Rashid", role: "Room Attendant", department: "Housekeeping", salary: 42000, shift: "Afternoon", phone: "+92 300 1110008", email: "f.alrashid@grandstay.com", joiningDate: "2023-05-22" },
  { name: "Luca Romano", role: "Executive Chef", department: "Culinary", salary: 120000, shift: "Afternoon", phone: "+92 300 1110009", email: "l.romano@grandstay.com", joiningDate: "2019-08-30" },
  { name: "Aisha Khan", role: "Sous Chef", department: "Culinary", salary: 85000, shift: "Afternoon", phone: "+92 300 1110010", email: "a.khan@grandstay.com", joiningDate: "2021-03-14" },
  { name: "Robert Hayes", role: "Restaurant Manager", department: "Culinary", salary: 78000, shift: "Afternoon", phone: "+92 300 1110011", email: "r.hayes@grandstay.com", joiningDate: "2020-07-07" },
  { name: "Yuki Tanaka", role: "Spa Director", department: "Wellness", salary: 92000, shift: "Morning", phone: "+92 300 1110012", email: "y.tanaka@grandstay.com", joiningDate: "2020-12-01" },
  { name: "Olivia Bennett", role: "Spa Therapist", department: "Wellness", salary: 52000, shift: "Morning", phone: "+92 300 1110013", email: "o.bennett@grandstay.com", joiningDate: "2022-08-15" },
  { name: "Hassan Malik", role: "Maintenance Chief", department: "Engineering", salary: 75000, shift: "Morning", phone: "+92 300 1110014", email: "h.malik@grandstay.com", joiningDate: "2019-05-20" },
  { name: "Carlos Vega", role: "Maintenance Technician", department: "Engineering", salary: 48000, shift: "Rotating", phone: "+92 300 1110015", email: "c.vega@grandstay.com", joiningDate: "2022-01-30" },
  { name: "Nadia Petrov", role: "Security Chief", department: "Security", salary: 70000, shift: "Night", phone: "+92 300 1110016", email: "n.petrov@grandstay.com", joiningDate: "2020-02-14" },
  { name: "Thomas Wright", role: "Security Officer", department: "Security", salary: 45000, shift: "Night", phone: "+92 300 1110017", email: "t.wright@grandstay.com", joiningDate: "2023-06-10" },
  { name: "Amara Osei", role: "Events Coordinator", department: "Events", salary: 65000, shift: "Morning", phone: "+92 300 1110018", email: "a.osei@grandstay.com", joiningDate: "2021-11-25" },
  { name: "Daniel Kim", role: "Valet Supervisor", department: "Guest Services", salary: 50000, shift: "Rotating", phone: "+92 300 1110019", email: "d.kim@grandstay.com", joiningDate: "2022-10-08" },
  { name: "Isabella Rossi", role: "Finance Manager", department: "Finance", salary: 105000, shift: "Morning", phone: "+92 300 1110020", email: "i.rossi@grandstay.com", joiningDate: "2019-01-08" },
];

export const CUSTOMER_DATA = [
  { fullName: "William Anderson", email: "w.anderson@email.com", phone: "+92 321 5001001", address: "45 Clifton Road, Karachi", loyaltyPoints: 2400 },
  { fullName: "Sarah Mitchell", email: "s.mitchell@email.com", phone: "+92 321 5001002", address: "12 DHA Phase 6, Karachi", loyaltyPoints: 1850 },
  { fullName: "Ahmed Hassan", email: "a.hassan@email.com", phone: "+92 321 5001003", address: "78 Bahria Town, Islamabad", loyaltyPoints: 3200 },
  { fullName: "Emma Thompson", email: "e.thompson@email.com", phone: "+92 321 5001004", address: "23 Gulberg III, Lahore", loyaltyPoints: 950 },
  { fullName: "Raj Patel", email: "r.patel@email.com", phone: "+92 321 5001005", address: "56 Model Town, Lahore", loyaltyPoints: 4100 },
  { fullName: "Maria Garcia", email: "m.garcia@email.com", phone: "+92 321 5001006", address: "89 Emaar Canyon, Karachi", loyaltyPoints: 1600 },
  { fullName: "Oliver Brown", email: "o.brown@email.com", phone: "+92 321 5001007", address: "34 F-7 Markaz, Islamabad", loyaltyPoints: 2750 },
  { fullName: "Ayesha Malik", email: "a.malik@email.com", phone: "+92 321 5001008", address: "67 PECHS Block 2, Karachi", loyaltyPoints: 1200 },
  { fullName: "James Wilson", email: "j.wilson@email.com", phone: "+92 321 5001009", address: "91 Defence Phase 5, Karachi", loyaltyPoints: 5300 },
  { fullName: "Fatima Noor", email: "f.noor@email.com", phone: "+92 321 5001010", address: "15 Johar Town, Lahore", loyaltyPoints: 800 },
];

export const SERVICES_DATA = [
  { name: "Swedish Massage", category: "Spa", description: "Classic full-body relaxation massage", price: 8500, duration: "60 min" },
  { name: "Deep Tissue Massage", category: "Spa", description: "Therapeutic massage for muscle tension", price: 10500, duration: "75 min" },
  { name: "Aromatherapy Facial", category: "Spa", description: "Rejuvenating facial with essential oils", price: 7500, duration: "45 min" },
  { name: "Couples Spa Package", category: "Spa", description: "Side-by-side massage and champagne", price: 22000, duration: "120 min" },
  { name: "Fine Dining Experience", category: "Dining", description: "7-course tasting menu at La Maison", price: 15000, duration: "3 hours" },
  { name: "Champagne Breakfast", category: "Dining", description: "In-room gourmet breakfast with champagne", price: 5500, duration: "90 min" },
  { name: "Airport Transfer", category: "Transport", description: "Luxury sedan airport pickup/dropoff", price: 4500, duration: "45 min" },
  { name: "City Tour", category: "Transport", description: "Private guided city tour in luxury vehicle", price: 12000, duration: "4 hours" },
  { name: "Laundry Express", category: "Laundry", description: "Same-day dry cleaning and pressing", price: 2500, duration: "24 hours" },
  { name: "Personal Shopping", category: "Concierge", description: "Personal shopper for luxury retail", price: 8000, duration: "3 hours" },
];

export const INVENTORY_DATA = [
  { itemName: "Egyptian Cotton Sheets (King)", category: "Linens", quantity: 120, unit: "sets", reorderLevel: 30, supplier: "LuxLinens Co.", unitCost: 4500, lastRestocked: "2026-06-01" },
  { itemName: "Bath Towels (Premium)", category: "Linens", quantity: 200, unit: "pieces", reorderLevel: 50, supplier: "LuxLinens Co.", unitCost: 1200, lastRestocked: "2026-06-01" },
  { itemName: "Shampoo & Conditioner Set", category: "Toiletries", quantity: 350, unit: "sets", reorderLevel: 80, supplier: "AromaLux", unitCost: 850, lastRestocked: "2026-05-28" },
  { itemName: "Mini Bar - Premium Whiskey", category: "Minibar", quantity: 48, unit: "bottles", reorderLevel: 12, supplier: "SpiritSelect", unitCost: 6500, lastRestocked: "2026-06-10" },
  { itemName: "Mini Bar - Sparkling Water", category: "Minibar", quantity: 180, unit: "bottles", reorderLevel: 40, supplier: "AquaPure", unitCost: 250, lastRestocked: "2026-06-12" },
  { itemName: "All-Purpose Cleaner", category: "Cleaning", quantity: 45, unit: "bottles", reorderLevel: 15, supplier: "CleanPro", unitCost: 380, lastRestocked: "2026-06-05" },
  { itemName: "Truffle Oil (Restaurant)", category: "Kitchen", quantity: 12, unit: "bottles", reorderLevel: 4, supplier: "Gourmet Imports", unitCost: 8500, lastRestocked: "2026-05-20" },
  { itemName: "A4 Paper Reams", category: "Office", quantity: 25, unit: "reams", reorderLevel: 8, supplier: "OfficeMax", unitCost: 650, lastRestocked: "2026-06-01" },
];
