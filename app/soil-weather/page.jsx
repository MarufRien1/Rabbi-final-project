'use client';

import React, { useState } from "react";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import OpacityIcon from "@mui/icons-material/Opacity";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Division data
const divisions = [
  { name: "Dhaka", soil: "Loamy, Fertile", ph: 6.5, moisture: "23%", nutrients: "N, P, K", temp: "28°C", humidity: "70%", wind: "10 km/h", rain: "15%", img: "/dhaka.png" },
  { name: "Chittagong", soil: "Clay Loam", ph: 6.3, moisture: "30%", nutrients: "N, P, K", temp: "27°C", humidity: "75%", wind: "12 km/h", rain: "20%", img: "/chatto.png" },
  { name: "Khulna", soil: "Sandy Loam", ph: 6.6, moisture: "22%", nutrients: "N, P, K", temp: "29°C", humidity: "68%", wind: "11 km/h", rain: "12%", img: "/khulna.jpg" },
  { name: "Rajshahi", soil: "Alluvial", ph: 6.4, moisture: "20%", nutrients: "N, P, K", temp: "30°C", humidity: "65%", wind: "10 km/h", rain: "10%", img: "/rajshahi.jpg" },
  { name: "Sylhet", soil: "Clay Loam, High Organic Matter", ph: 6.7, moisture: "28%", nutrients: "N, P, K", temp: "26°C", humidity: "80%", wind: "12 km/h", rain: "25%", img: "/sly.png" },
  { name: "Barishal", soil: "Silty Clay Loam", ph: 6.5, moisture: "25%", nutrients: "N, P, K", temp: "28°C", humidity: "72%", wind: "11 km/h", rain: "18%", img: "/barasial.jpg" },
  { name: "Rangpur", soil: "Alluvial, Medium Fertility", ph: 6.3, moisture: "24%", nutrients: "N, P, K", temp: "29°C", humidity: "70%", wind: "10 km/h", rain: "14%", img: "/rangpur.jpg" },
  { name: "Mymensingh", soil: "Loamy, Fertile", ph: 6.5, moisture: "26%", nutrients: "N, P, K", temp: "27°C", humidity: "71%", wind: "10 km/h", rain: "16%", img: "/myn.jpg" },
];

// Crop suggestions
const cropAdvice = {
  Dhaka: ["Rice", "Wheat", "Vegetables"],
  Chittagong: ["Banana", "Tea", "Vegetables"],
  Khulna: ["Potato", "Mustard", "Vegetables"],
  Rajshahi: ["Mango", "Lentils", "Wheat"],
  Sylhet: ["Tea", "Pineapple", "Vegetables"],
  Barishal: ["Rice", "Vegetables", "Sugarcane"],
  Rangpur: ["Potato", "Wheat", "Vegetables"],
  Mymensingh: ["Rice", "Vegetables", "Corn"],
};

// Tips with variations
const tips = {
  soil: [
    "Maintain soil pH between 6.0-6.8 for most crops. Organic compost can improve fertility.",
    "Ensure your soil is healthy by checking nutrients regularly. Loamy soil is ideal.",
    "Balanced soil is key! Consider adding compost or manure for better yield."
  ],
  moisture: [
    "Irrigate according to soil moisture. Avoid overwatering.",
    "Check the soil before watering; moisture levels vary by division.",
    "Proper water management ensures healthy crops and avoids root rot."
  ],
  ph: [
    "Acidic soil? Add lime. Alkaline soil? Use sulfur to balance pH.",
    "pH affects nutrient absorption. Maintain it between 6-7 for most crops.",
    "Regular soil testing helps to adjust pH correctly."
  ],
  rain: [
    "Check weather forecast. Reduce irrigation if rain is expected.",
    "Rainwater harvesting can be beneficial for dry seasons.",
    "Heavy rain? Ensure proper drainage to prevent waterlogging."
  ]
};

export default function SoilWeatherPage() {
  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello! Ask me about soil, weather, or crops." }
  ]);
  const [soilImage, setSoilImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDivisionChange = (e) => {
    const div = divisions.find((d) => d.name === e.target.value);
    setSelectedDivision(div);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);

    // Simple bot logic
    let botResponse = "I'm not sure about that. Try asking about soil, crops, or weather.";
    const lowerInput = chatInput.toLowerCase();

    if (lowerInput.includes("soil")) {
      botResponse = `For ${selectedDivision.name}, the soil is ${selectedDivision.soil}. ${tips.soil[Math.floor(Math.random() * tips.soil.length)]}`;
    } else if (lowerInput.includes("crop") || lowerInput.includes("plant")) {
      botResponse = `Recommended crops for ${selectedDivision.name}: ${cropAdvice[selectedDivision.name].join(", ")}.`;
    } else if (lowerInput.includes("weather") || lowerInput.includes("rain") || lowerInput.includes("temp")) {
      botResponse = `Current weather in ${selectedDivision.name}: Temp ${selectedDivision.temp}, Rain ${selectedDivision.rain}. ${tips.rain[Math.floor(Math.random() * tips.rain.length)]}`;
    } else if (lowerInput.includes("ph")) {
      botResponse = `Soil pH is ${selectedDivision.ph}. ${tips.ph[Math.floor(Math.random() * tips.ph.length)]}`;
    }

    setTimeout(() => {
      setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 500);

    setChatInput("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSoilImage(URL.createObjectURL(file));
      // Mock analysis
      setTimeout(() => {
        setAnalysisResult({
          type: "Loamy Soil",
          health: "Good",
          recommendation: "Suitable for most vegetables. Add compost for better yield."
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Division Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header & Selector */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-green-800">Soil & Weather Insights</h2>
              <p className="text-gray-500">Select your division for detailed data</p>
            </div>
            <select 
              className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              value={selectedDivision.name}
              onChange={handleDivisionChange}
            >
              {divisions.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soil Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-4">
                <LocalFloristIcon className="text-green-600" />
                <h3 className="text-xl font-bold">Soil Condition</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><b>Type:</b> {selectedDivision.soil}</p>
                <p><b>pH Level:</b> {selectedDivision.ph}</p>
                <p><b>Moisture:</b> {selectedDivision.moisture}</p>
                <p><b>Nutrients:</b> {selectedDivision.nutrients}</p>
              </div>
            </div>

            {/* Weather Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center gap-2 mb-4">
                <WbSunnyIcon className="text-yellow-600" />
                <h3 className="text-xl font-bold">Weather Update</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><b>Temperature:</b> {selectedDivision.temp}</p>
                <p><b>Humidity:</b> {selectedDivision.humidity}</p>
                <p><b>Wind Speed:</b> {selectedDivision.wind}</p>
                <p><b>Rain Chance:</b> {selectedDivision.rain}</p>
              </div>
            </div>
          </div>

          {/* Soil Analysis Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UploadFileIcon className="text-blue-600" /> AI Soil Analysis
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="soil-upload"
              />
              <label htmlFor="soil-upload" className="cursor-pointer flex flex-col items-center">
                {soilImage ? (
                  <img src={soilImage} alt="Soil" className="h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <OpacityIcon className="text-gray-400" />
                  </div>
                )}
                <span className="text-blue-600 font-semibold">Upload Soil Image</span>
                <span className="text-xs text-gray-400 mt-1">Analyze texture & health</span>
              </label>
            </div>

            {analysisResult && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800">Analysis Result:</h4>
                <p className="text-sm text-blue-700"><b>Type:</b> {analysisResult.type}</p>
                <p className="text-sm text-blue-700"><b>Health:</b> {analysisResult.health}</p>
                <p className="text-sm text-blue-700"><b>Advice:</b> {analysisResult.recommendation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chatbot */}
        <div className="bg-white rounded-2xl shadow-md flex flex-col h-[600px]">
          <div className="p-4 border-b bg-green-600 text-white rounded-t-2xl">
            <h3 className="font-bold text-lg">AgroBot Assistant</h3>
            <p className="text-xs opacity-80">Ask about crops, soil, or weather</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === "user" 
                    ? "bg-green-600 text-white rounded-br-none" 
                    : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-green-500"
              />
              <button 
                onClick={handleChatSend}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                <SendIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
