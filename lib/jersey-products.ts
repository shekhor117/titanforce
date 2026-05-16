// Mock jersey products for the store

export interface JerseyProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "home" | "away" | "training" | "retro"
  sizes: string[]
  colors: string[]
  stock: number
  rating: number
  reviews: number
  features: string[]
}

export interface CartItem extends JerseyProduct {
  cartId: string
  quantity: number
  selectedSize: string
  selectedColor: string
}

export const mockJerseys: JerseyProduct[] = [
  {
    id: "jersey-1",
    name: "Titan Force Home Jersey 2024",
    description: "Official home jersey featuring the iconic Titan Force crest and premium fabric technology for optimal comfort and performance.",
    price: 4999,
    image: "/api/placeholder/400/500",
    category: "home",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Gold"],
    stock: 50,
    rating: 4.8,
    reviews: 127,
    features: [
      "Premium breathable fabric",
      "Moisture-wicking technology",
      "Embroidered crest",
      "Durable stitching",
      "Official team branding"
    ]
  },
  {
    id: "jersey-2",
    name: "Titan Force Away Jersey 2024",
    description: "White away jersey with contrasting navy details. Perfect for away matches with enhanced visibility and comfort.",
    price: 4999,
    image: "/api/placeholder/400/500",
    category: "away",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy Trim"],
    stock: 45,
    rating: 4.7,
    reviews: 98,
    features: [
      "Lightweight breathable material",
      "Enhanced visibility",
      "Quick-dry technology",
      "Ergonomic fit",
      "Team crest embroidery"
    ]
  },
  {
    id: "jersey-3",
    name: "Titan Force Training Jersey",
    description: "Designed for training sessions with enhanced flexibility and durability. Features multiple ventilation zones.",
    price: 2499,
    image: "/api/placeholder/400/500",
    category: "training",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Navy", "Gray"],
    stock: 80,
    rating: 4.6,
    reviews: 156,
    features: [
      "Lightweight and flexible",
      "Multi-zone ventilation",
      "Durable synthetic blend",
      "Easy to wash and dry",
      "Budget-friendly"
    ]
  },
  {
    id: "jersey-4",
    name: "Titan Force Retro Jersey 1995",
    description: "Classic retro jersey inspired by the iconic 1995 design. A collector's piece for true Titan Force fans.",
    price: 3499,
    image: "/api/placeholder/400/500",
    category: "retro",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Gold"],
    stock: 25,
    rating: 4.9,
    reviews: 89,
    features: [
      "Vintage design reproduction",
      "Premium heritage material",
      "Limited edition",
      "Authentic detailing",
      "Collector's item"
    ]
  },
  {
    id: "jersey-5",
    name: "Titan Force Player Edition Jersey",
    description: "Professional-grade jersey worn by players. Includes custom number printing and enhanced performance fabric.",
    price: 6999,
    image: "/api/placeholder/400/500",
    category: "home",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Gold"],
    stock: 15,
    rating: 4.9,
    reviews: 45,
    features: [
      "Pro-grade fabric",
      "Custom number printing available",
      "Enhanced durability",
      "Professional fit",
      "Premium stitching"
    ]
  },
  {
    id: "jersey-6",
    name: "Titan Force Youth Jersey",
    description: "Perfect for young fans. Features kid-friendly sizing and the same quality as adult jerseys.",
    price: 2299,
    image: "/api/placeholder/400/500",
    category: "home",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Navy", "Gold"],
    stock: 60,
    rating: 4.7,
    reviews: 102,
    features: [
      "Kid-friendly fit",
      "Durable material",
      "Easy to care for",
      "Comfortable all day",
      "Official team branding"
    ]
  }
]

export function getProductById(id: string): JerseyProduct | undefined {
  return mockJerseys.find(p => p.id === id)
}

export function getProductsByCategory(category: JerseyProduct['category']): JerseyProduct[] {
  return mockJerseys.filter(p => p.category === category)
}

export function searchProducts(query: string): JerseyProduct[] {
  const lowerQuery = query.toLowerCase()
  return mockJerseys.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  )
}
