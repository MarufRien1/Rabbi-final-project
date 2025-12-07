import React from "react";

const locations = [
  {
    id: 1,
    name: "Dhaka",
    description: "Capital city with nearby farms.",
    soil: "Alluvial soil, fertile for vegetables",
    weather: "Tropical wet and dry, avg temp 25°C",
    img: "dhaka.png",
  },
  {
    id: 2,
    name: "Chattogram",
    description: "Port city, coastal farms available.",
    soil: "Clay loam, suitable for rice and fruits",
    weather: "Humid subtropical, avg temp 27°C",
    img: "chatto.png",
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
    img: "sly.png",
  },
  {
    id: 5,
    name: "Khulna",
    description: "Rice farms and shrimp cultivation.",
    soil: "Saline and alluvial, suited for aquaculture",
    weather: "Tropical, avg temp 26°C",
    img: "khulna.jpg",
  },
  {
    id: 6,
    name: "Barishal",
    description: "Riverside farms and vegetable cultivation.",
    soil: "Alluvial, fertile for vegetables and fruits",
    weather: "Humid subtropical, avg temp 26°C",
    img: "barasial.jpg",
  },
  {
    id: 7,
    name: "Rangpur",
    description: "Potato and maize farms are common here.",
    soil: "Loamy, good for tuber crops",
    weather: "Moderate subtropical, avg temp 25°C",
    img: "rangpur.jpg",
  },
  {
    id: 8,
    name: "Mymensingh",
    description: "Known for dairy and mixed farming.",
    soil: "Clay loam, fertile for cereals and fodder",
    weather: "Tropical wet, avg temp 25°C",
    img: "myn.jpg",
  },
];

export default function LocationsPage() {
  return (
    <section id="divisions" className="min-h-screen bg-green-50 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Divisions</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition duration-300"
          >
            {loc.img ? (
              <img
                src={loc.img}
                alt={loc.name}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{loc.name}</h3>
              <p className="text-gray-600 mb-1">{loc.description}</p>
              <p className="text-gray-700 font-medium mb-1">
                <span className="font-semibold">Soil:</span> {loc.soil}
              </p>
              <p className="text-gray-700 font-medium">
                <span className="font-semibold">Weather:</span> {loc.weather}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
