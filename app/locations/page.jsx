import React from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TerrainIcon from "@mui/icons-material/Terrain";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/customer-home" 
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors font-medium"
          >
            <ArrowBackIcon /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-green-800 mb-4">
            Farming Locations in Bangladesh
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the diverse agricultural landscapes of Bangladesh, from the tea gardens of Sylhet to the mango orchards of Rajshahi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="h-56 bg-gray-200 relative overflow-hidden">
                {loc.img ? (
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                    <LocationOnIcon style={{ fontSize: 48, opacity: 0.5 }} />
                    <span className="mt-2 font-medium">No Image Available</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white">{loc.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">{loc.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-green-50 p-3 rounded-xl">
                    <TerrainIcon className="text-green-600 mt-1" fontSize="small" />
                    <div>
                      <span className="block text-xs font-bold text-green-800 uppercase tracking-wide">Soil Type</span>
                      <span className="text-sm text-gray-700 font-medium">{loc.soil}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-orange-50 p-3 rounded-xl">
                    <WbSunnyIcon className="text-orange-500 mt-1" fontSize="small" />
                    <div>
                      <span className="block text-xs font-bold text-orange-800 uppercase tracking-wide">Weather</span>
                      <span className="text-sm text-gray-700 font-medium">{loc.weather}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
