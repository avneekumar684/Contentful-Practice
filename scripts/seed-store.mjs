// Usage: node scripts/seed-store.mjs   (run by `npm run seed`)
// Store content: category + product images (drawn with code, so nothing is copied from anywhere),
// 4 categories and 16 products.
import { uploadSvg, upsertEntry, fields, entryRef, assetRef, L, p, h3, ul, doc } from "./seed-helpers.mjs";

// ---------- product artwork ----------
// Each product type has a small drawing function. `c` is the main color, `d` a darker shade.
const drawings = {
  headphones: (c, d) => `<path d="M330 700V560a270 270 0 0 1 540 0v140" stroke="${d}" stroke-width="46" fill="none" stroke-linecap="round"/>
    <rect x="260" y="640" width="130" height="230" rx="55" fill="${c}"/><rect x="810" y="640" width="130" height="230" rx="55" fill="${c}"/>`,
  watch: (c, d) => `<rect x="500" y="170" width="200" height="860" rx="50" fill="${d}"/>
    <rect x="390" y="400" width="420" height="400" rx="100" fill="${c}"/><circle cx="600" cy="600" r="125" fill="#fff" fill-opacity=".85"/>
    <path d="M600 600V520M600 600l55 30" stroke="${d}" stroke-width="16" stroke-linecap="round"/>`,
  speaker: (c, d) => `<rect x="330" y="300" width="540" height="650" rx="110" fill="${c}"/>
    <circle cx="600" cy="520" r="130" fill="${d}"/><circle cx="600" cy="520" r="55" fill="${c}"/><circle cx="600" cy="800" r="70" fill="${d}"/>`,
  charger: (c, d) => `<rect x="230" y="440" width="740" height="320" rx="70" fill="${c}"/>
    <path d="M620 480l-110 140h90l-30 110 130-150h-90z" fill="#fff" fill-opacity=".9"/><rect x="860" y="560" width="40" height="80" rx="12" fill="${d}"/>`,
  mug: (c, d) => `<rect x="340" y="400" width="430" height="470" rx="50" fill="${c}"/>
    <path d="M770 480h50a80 80 0 0 1 0 220h-50" stroke="${d}" stroke-width="40" fill="none"/>
    <path d="M470 330c-30-50 30-60 0-110M580 330c-30-50 30-60 0-110" stroke="${d}" stroke-width="16" fill="none" stroke-linecap="round"/>`,
  lamp: (c, d) => `<ellipse cx="600" cy="940" rx="190" ry="40" fill="${d}"/><rect x="580" y="480" width="40" height="460" fill="${d}"/>
    <path d="M410 480L480 230h240l70 250z" fill="${c}"/>`,
  pot: (c, d) => `<path d="M420 620h360l-50 330H470z" fill="${c}"/><rect x="400" y="590" width="400" height="60" rx="20" fill="${d}"/>
    <ellipse cx="540" cy="450" rx="70" ry="150" fill="#4f9d6b" transform="rotate(-25 540 450)"/>
    <ellipse cx="670" cy="440" rx="70" ry="150" fill="#3b8456" transform="rotate(25 670 440)"/>`,
  blanket: (c, d) => `<rect x="230" y="420" width="740" height="130" rx="30" fill="${c}"/><rect x="250" y="540" width="700" height="130" rx="30" fill="${d}"/>
    <rect x="230" y="660" width="740" height="130" rx="30" fill="${c}"/>`,
  backpack: (c, d) => `<rect x="360" y="260" width="480" height="640" rx="170" fill="${c}"/><rect x="430" y="610" width="340" height="230" rx="50" fill="${d}"/>
    <path d="M470 280q130-140 260 0" stroke="${d}" stroke-width="30" fill="none"/>`,
  glasses: (c, d) => `<circle cx="430" cy="600" r="140" fill="${c}" fill-opacity=".85" stroke="${d}" stroke-width="30"/>
    <circle cx="770" cy="600" r="140" fill="${c}" fill-opacity=".85" stroke="${d}" stroke-width="30"/><path d="M570 590q30-30 60 0" stroke="${d}" stroke-width="30" fill="none"/>`,
  wallet: (c, d) => `<rect x="250" y="410" width="700" height="440" rx="60" fill="${c}"/><rect x="250" y="410" width="700" height="150" rx="60" fill="${d}"/>
    <circle cx="850" cy="640" r="45" fill="${d}"/>`,
  sneaker: (c, d) => `<path d="M220 700c0-120 60-190 150-200l120-190 90 90c60 40 160 70 280 100 80 20 120 70 120 140v60H220z" fill="${c}"/>
    <rect x="200" y="780" width="800" height="70" rx="35" fill="${d}"/>`,
  mat: (c, d) => `<circle cx="360" cy="650" r="210" fill="${c}"/><circle cx="360" cy="650" r="130" fill="${d}"/><circle cx="360" cy="650" r="50" fill="${c}"/>
    <path d="M360 440h640v420H360z" fill="${c}" fill-opacity=".9"/>`,
  bottle: (c, d) => `<rect x="520" y="200" width="160" height="110" rx="30" fill="${d}"/><rect x="450" y="290" width="300" height="660" rx="110" fill="${c}"/>
    <rect x="450" y="560" width="300" height="80" fill="${d}" fill-opacity=".35"/>`,
  dumbbell: (c, d) => `<rect x="330" y="580" width="540" height="50" rx="20" fill="${d}"/>
    <rect x="230" y="470" width="110" height="270" rx="30" fill="${c}"/><rect x="860" y="470" width="110" height="270" rx="30" fill="${c}"/>
    <rect x="150" y="520" width="90" height="170" rx="24" fill="${d}"/><rect x="960" y="520" width="90" height="170" rx="24" fill="${d}"/>`,
  band: (c, d) => `<ellipse cx="600" cy="620" rx="330" ry="270" fill="none" stroke="${c}" stroke-width="90"/>
    <rect x="490" y="500" width="220" height="240" rx="60" fill="${d}"/><rect x="520" y="540" width="160" height="150" rx="36" fill="#fff" fill-opacity=".85"/>`,
};

// Square 1200x1200 picture: soft gradient background + the drawing. `variant` changes the angle.
function productSvg(kind, color, dark, bg, variant) {
  const flip = variant === 2 ? `transform="translate(1200 0) scale(-1 1)"` : "";
  const ground = variant === 2 ? `<ellipse cx="600" cy="1010" rx="360" ry="34" fill="#000" fill-opacity=".12"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
    <rect width="1200" height="1200" fill="url(#bg)"/>${ground}
    <g ${flip}>${drawings[kind](color, dark)}</g></svg>`;
}

function wideSvg(c1, c2, shapes = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#g)"/><g fill="#fff">${shapes}</g></svg>`;
}
const bubbles = `<circle cx="1250" cy="260" r="260" fill-opacity=".1"/><circle cx="1400" cy="640" r="170" fill-opacity=".12"/><circle cx="980" cy="700" r="110" fill-opacity=".1"/>`;

// ---------- categories ----------
const categories = [
  { id: "pcat-electronics", name: "Electronics", slug: "electronics", description: "Audio, wearables and everyday tech.", colors: ["#1d4ed8", "#60a5fa"] },
  { id: "pcat-home", name: "Home & Living", slug: "home-living", description: "Small things that make a home feel good.", colors: ["#b45309", "#fbbf24"] },
  { id: "pcat-fashion", name: "Fashion", slug: "fashion", description: "Bags, shoes and accessories.", colors: ["#be185d", "#f9a8d4"] },
  { id: "pcat-fitness", name: "Fitness", slug: "fitness", description: "Gear for workouts and walks.", colors: ["#047857", "#6ee7b7"] },
];

// ---------- products ----------
// kind = which drawing to use, color/dark = product colors, bg = picture background.
const products = [
  // Electronics
  { id: "prod-headphones", cat: "pcat-electronics", kind: "headphones", color: "#1e293b", dark: "#0f172a", bg: ["#dbeafe", "#bfdbfe"],
    name: "Aurora Wireless Headphones", brand: "Northwind", price: 129, compare: 179, rating: 4.7, reviews: 312, stock: true, featured: true, badge: "Sale",
    tags: ["audio", "wireless", "noise-cancelling"], short: "Over-ear headphones with active noise cancelling and 40 hours of battery.",
    details: ["Active noise cancelling with transparency mode", "40 hours of playback, 10 minutes of charge gives 5 hours", "Soft memory-foam ear cushions"] },
  { id: "prod-watch", cat: "pcat-electronics", kind: "watch", color: "#0ea5e9", dark: "#1e293b", bg: ["#e0f2fe", "#bae6fd"],
    name: "Pulse Smart Watch", brand: "Northwind", price: 199, rating: 4.5, reviews: 188, stock: true, featured: true, badge: "New",
    tags: ["wearable", "fitness", "gps"], short: "Tracks steps, sleep and heart rate with a bright always-on display.",
    details: ["Built-in GPS for runs and rides", "7 day battery life", "Water resistant up to 50 meters"] },
  { id: "prod-speaker", cat: "pcat-electronics", kind: "speaker", color: "#f97316", dark: "#7c2d12", bg: ["#ffedd5", "#fed7aa"],
    name: "Boombox Mini Speaker", brand: "Soundly", price: 59, compare: 79, rating: 4.4, reviews: 241, stock: true, featured: false, badge: "Sale",
    tags: ["audio", "wireless", "outdoor"], short: "Pocket-size Bluetooth speaker with surprisingly big sound.",
    details: ["12 hours of playtime", "Splash proof body", "Pair two speakers for stereo sound"] },
  { id: "prod-charger", cat: "pcat-electronics", kind: "charger", color: "#6366f1", dark: "#312e81", bg: ["#e0e7ff", "#c7d2fe"],
    name: "VoltGo Portable Charger", brand: "Soundly", price: 39, rating: 4.2, reviews: 97, stock: false, featured: false, badge: "",
    tags: ["power", "travel"], short: "10,000 mAh power bank that charges a phone up to three times.",
    details: ["USB-C in and out", "Fast charge 20W", "Slim enough for a jacket pocket"] },

  // Home & Living
  { id: "prod-mugs", cat: "pcat-home", kind: "mug", color: "#e11d48", dark: "#881337", bg: ["#ffe4e6", "#fecdd3"],
    name: "Stoneware Mug Set (4)", brand: "Hearth", price: 34, rating: 4.8, reviews: 156, stock: true, featured: true, badge: "",
    tags: ["kitchen", "gift", "ceramic"], short: "Four hand-glazed stoneware mugs that feel great in your hands.",
    details: ["Dishwasher and microwave safe", "350 ml each", "Each mug has a slightly different glaze"] },
  { id: "prod-lamp", cat: "pcat-home", kind: "lamp", color: "#f59e0b", dark: "#78350f", bg: ["#fef3c7", "#fde68a"],
    name: "Glow Desk Lamp", brand: "Hearth", price: 49, compare: 65, rating: 4.6, reviews: 120, stock: true, featured: true, badge: "Sale",
    tags: ["lighting", "office"], short: "Dimmable LED desk lamp with three color temperatures.",
    details: ["Touch dimmer with memory", "Warm, neutral and cool light", "Low profile base"] },
  { id: "prod-plant", cat: "pcat-home", kind: "pot", color: "#c2410c", dark: "#7c2d12", bg: ["#ecfccb", "#d9f99d"],
    name: "Terra Plant Pot", brand: "Hearth", price: 24, rating: 4.3, reviews: 64, stock: true, featured: false, badge: "",
    tags: ["plants", "decor"], short: "Terracotta pot with a drainage hole and matching saucer.",
    details: ["20 cm wide", "Unglazed, so roots can breathe", "Saucer included"] },
  { id: "prod-blanket", cat: "pcat-home", kind: "blanket", color: "#7c3aed", dark: "#4c1d95", bg: ["#ede9fe", "#ddd6fe"],
    name: "Cloud Throw Blanket", brand: "Hearth", price: 42, rating: 4.9, reviews: 410, stock: true, featured: false, badge: "Bestseller",
    tags: ["cozy", "gift"], short: "Super soft knitted throw for the sofa or the foot of the bed.",
    details: ["130 x 170 cm", "Machine washable", "100% recycled fibers"] },

  // Fashion
  { id: "prod-backpack", cat: "pcat-fashion", kind: "backpack", color: "#0f766e", dark: "#134e4a", bg: ["#ccfbf1", "#99f6e4"],
    name: "Trail Canvas Backpack", brand: "Wander", price: 79, compare: 99, rating: 4.6, reviews: 205, stock: true, featured: true, badge: "Sale",
    tags: ["bag", "travel", "laptop"], short: "Roomy canvas backpack with a padded 15 inch laptop sleeve.",
    details: ["22 liter capacity", "Water-repellent canvas", "Padded shoulder straps"] },
  { id: "prod-sunglasses", cat: "pcat-fashion", kind: "glasses", color: "#475569", dark: "#0f172a", bg: ["#fef9c3", "#fde68a"],
    name: "Coastline Sunglasses", brand: "Wander", price: 54, rating: 4.1, reviews: 73, stock: true, featured: false, badge: "New",
    tags: ["accessories", "summer"], short: "Polarized lenses in a light, flexible frame.",
    details: ["100% UV protection", "Polarized lenses", "Hard case included"] },
  { id: "prod-wallet", cat: "pcat-fashion", kind: "wallet", color: "#92400e", dark: "#451a03", bg: ["#f5f5f4", "#e7e5e4"],
    name: "Slim Leather Wallet", brand: "Wander", price: 44, rating: 4.5, reviews: 132, stock: true, featured: false, badge: "",
    tags: ["accessories", "leather", "gift"], short: "Minimal leather wallet with space for 8 cards and some cash.",
    details: ["Full-grain leather", "RFID blocking lining", "Gets better with age"] },
  { id: "prod-sneakers", cat: "pcat-fashion", kind: "sneaker", color: "#2563eb", dark: "#1e3a8a", bg: ["#dbeafe", "#e0e7ff"],
    name: "Stride Running Sneakers", brand: "Wander", price: 89, compare: 120, rating: 4.7, reviews: 288, stock: true, featured: true, badge: "Sale",
    tags: ["shoes", "running"], short: "Cushioned everyday running shoes with a breathable knit upper.",
    details: ["Responsive foam midsole", "Breathable knit upper", "Fits true to size"] },

  // Fitness
  { id: "prod-mat", cat: "pcat-fitness", kind: "mat", color: "#16a34a", dark: "#14532d", bg: ["#dcfce7", "#bbf7d0"],
    name: "Flow Yoga Mat", brand: "Peak", price: 36, rating: 4.6, reviews: 175, stock: true, featured: false, badge: "",
    tags: ["yoga", "studio"], short: "6 mm non-slip mat that is easy on knees and wrists.",
    details: ["Non-slip on both sides", "Includes carrying strap", "Wipes clean"] },
  { id: "prod-bottle", cat: "pcat-fitness", kind: "bottle", color: "#0891b2", dark: "#164e63", bg: ["#cffafe", "#a5f3fc"],
    name: "Summit Water Bottle", brand: "Peak", price: 27, rating: 4.8, reviews: 530, stock: true, featured: true, badge: "Bestseller",
    tags: ["hydration", "insulated"], short: "Insulated steel bottle that keeps drinks cold for 24 hours.",
    details: ["750 ml", "Cold 24 hours, hot 12 hours", "Leak-proof lid"] },
  { id: "prod-dumbbells", cat: "pcat-fitness", kind: "dumbbell", color: "#dc2626", dark: "#450a0a", bg: ["#fee2e2", "#fecaca"],
    name: "Adjustable Dumbbell Pair", brand: "Peak", price: 149, compare: 189, rating: 4.4, reviews: 88, stock: true, featured: false, badge: "Sale",
    tags: ["strength", "home-gym"], short: "Swap weights in seconds, from 2 to 12 kg each.",
    details: ["Replaces 6 pairs of dumbbells", "Quick-lock dial", "Storage tray included"] },
  { id: "prod-band", cat: "pcat-fitness", kind: "band", color: "#db2777", dark: "#500724", bg: ["#fce7f3", "#fbcfe8"],
    name: "Loop Fitness Band", brand: "Peak", price: 19, rating: 4.3, reviews: 61, stock: true, featured: false, badge: "",
    tags: ["strength", "travel"], short: "Resistance band for warm-ups, stretching and glute work.",
    details: ["Natural latex", "Three resistance levels available", "Folds flat in a bag"] },
];

// ---------- run ----------
console.log("Category images...");
for (const c of categories) await uploadSvg(`img-${c.id}`, `${c.name} category`, wideSvg(c.colors[0], c.colors[1], bubbles));
await uploadSvg("img-promo-sale", "Sale promotion", wideSvg("#7c2d12", "#f59e0b", bubbles));
await uploadSvg("img-promo-learn", "Learning promotion", wideSvg("#1e1b4b", "#6366f1", bubbles));

console.log("Product images (2 per product)...");
for (const pr of products) {
  await uploadSvg(`img-${pr.id}-1`, `${pr.name}, front`, productSvg(pr.kind, pr.color, pr.dark, pr.bg, 1));
  await uploadSvg(`img-${pr.id}-2`, `${pr.name}, side`, productSvg(pr.kind, pr.color, pr.dark, pr.bg, 2));
}

console.log("Product categories...");
for (const c of categories) {
  await upsertEntry("productCategory", c.id, {
    ...fields({ name: c.name, slug: c.slug, description: c.description }),
    image: L(assetRef(`img-${c.id}`)),
  });
}

console.log("Products...");
for (const pr of products) {
  await upsertEntry("product", pr.id, {
    ...fields({
      name: pr.name,
      slug: pr.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      sku: pr.id.replace("prod-", "SKU-").toUpperCase(),
      brand: pr.brand,
      price: pr.price,
      compareAtPrice: pr.compare,
      shortDescription: pr.short,
      description: doc(p(pr.short), h3("Highlights"), ul(...pr.details)),
      tags: pr.tags,
      rating: pr.rating,
      reviewCount: pr.reviews,
      inStock: pr.stock,
      featured: pr.featured,
      badge: pr.badge || undefined,
    }),
    images: L([assetRef(`img-${pr.id}-1`), assetRef(`img-${pr.id}-2`)]),
    category: L(entryRef(pr.cat)),
  });
}

console.log("Store done.");
