import React from "react";

const locations = [
  {
    id: 1,
    name: "Dhaka",
    description: "Capital city with nearby farms.",
    soil: "Alluvial soil, fertile for vegetables",
    weather: "Tropical wet and dry, avg temp 25°C",
    img: "/dhaka.png",
  },
  {
    id: 2,
    name: "Chattogram",
    description: "Port city, coastal farms available.",
    soil: "Clay loam, suitable for rice and fruits",
    weather: "Humid subtropical, avg temp 27°C",
    img: "/chatto.png",
  },
  {
    id: 3,
    name: "Rajshahi",
    description: "Famous for mango orchards.",
    soil: "Red loam, perfect for orchards",
    weather: "Hot and dry, avg temp 28°C",
    img: "",
  },
  {
    id: 4,
    name: "Sylhet",
    description: "Tea gardens and hilly farms.",
    soil: "Silty loam, acidic for tea cultivation",
    weather: "Tropical monsoon, avg temp 24°C",
    img: "/sly.png",
  },
  {
    id: 5,
    name: "Khulna",
    description: "Rice farms and shrimp cultivation.",
    soil: "Saline and alluvial, suited for aquaculture",
    weather: "Tropical, avg temp 26°C",
    img: "/khulna.jpg",
  },
  {
    id: 6,
    name: "Barishal",
    description: "Riverside farms and vegetable cultivation.",
    soil: "Alluvial, fertile for vegetables and fruits",
    weather: "Humid subtropical, avg temp 26°C",
    img: "/barasial.jpg",
  },
  {
    id: 7,
    name: "Rangpur",
    description: "Tobacco and vegetable farming.",
    soil: "Sandy loam, good for tobacco and potatoes",
    weather: "Subtropical, avg temp 23°C",
    img: "/rangpur.jpg",
  },
  {
    id: 8,
    name: "Mymensingh",
    description: "Rich agricultural land for rice and jute.",
    soil: "Loamy soil, highly fertile",
    weather: "Tropical monsoon, avg temp 25°C",
    img: "/myn.jpg",
  },
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
        Farming Locations in Bangladesh
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-green-100"
          >
            <div className="h-48 bg-gray-200">
              {loc.img ? (
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-green-700">{loc.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{loc.description}</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Soil:</span> {loc.soil}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Weather:</span> {loc.weather}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
