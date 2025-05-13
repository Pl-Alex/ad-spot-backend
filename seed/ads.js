export const sampleAds = (userId, categories) => [
  {
    title: "iPhone 13 Pro Max",
    description: "Like new, barely used. 128GB, Silver.",
    price: 850,
    category: categories["Electronics"],
    location: "Warsaw",
    photos: [],
    user_id: userId,
  },
  {
    title: "2-room apartment for rent",
    description: "Nice apartment in the city center.",
    price: 1200,
    category: categories["Real Estate"],
    location: "Kraków",
    photos: [],
    user_id: userId,
  },
  {
    title: "Used Toyota Corolla",
    description: "Well-maintained, year 2015, diesel.",
    price: 15000,
    category: categories["Vehicles"],
    location: "Gdańsk",
    photos: [],
    user_id: userId,
  },
];
