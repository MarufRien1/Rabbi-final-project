'use client';

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import OpacityIcon from "@mui/icons-material/Opacity";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

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
  const router = useRouter();
  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello! Ask me about soil, weather, or crops." }
  ]);
  const [soilImage, setSoilImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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
    <div className="min-h-screen bg-[#f2f7f5] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors font-medium"
          >
            <ArrowBackIcon /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Division Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header & Selector */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-3xl font-bold text-green-800">Soil & Weather Insights</h2>
                <p className="text-gray-500 mt-1">Real-time agricultural data for your region</p>
              </div>
              <div className="relative">
                <select 
                  className="appearance-none bg-green-50 px-6 py-3 pr-10 rounded-xl font-semibold text-green-800 outline-none focus:ring-2 focus:ring-green-500 cursor-pointer border border-green-100"
                  value={selectedDivision.name}
                  onChange={handleDivisionChange}
                >
                  {divisions.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} Division</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-green-800">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Soil Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <LocalFloristIcon />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Soil Condition</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="text-gray-500">Type</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.soil}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="text-gray-500">pH Level</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.ph}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="text-gray-500">Moisture</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.moisture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nutrients</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.nutrients}</span>
                  </div>
                </div>
              </div>

              {/* Weather Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                    <WbSunnyIcon />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Weather Update</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="text-gray-500">Temperature</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.temp}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="text-gray-500">Humidity</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.humidity}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="text-gray-500">Wind Speed</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.wind}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rain Chance</span>
                    <span className="font-semibold text-gray-800">{selectedDivision.rain}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Soil Analysis Upload */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900">
                <div className="p-2 bg-blue-200 rounded-lg text-blue-700">
                  <UploadFileIcon />
                </div>
                AI Soil Analysis
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:bg-blue-100/50 transition cursor-pointer bg-white/50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      id="soil-upload"
                    />
                    <label htmlFor="soil-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                      {soilImage ? (
                        <img src={soilImage} alt="Soil" className="h-40 object-cover rounded-xl shadow-md mb-4" />
                      ) : (
                        <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <OpacityIcon className="text-blue-500 text-3xl" />
                        </div>
                      )}
                      <span className="text-blue-700 font-bold text-lg">Upload Soil Image</span>
                      <span className="text-sm text-blue-400 mt-2">Analyze texture & health instantly</span>
                    </label>
                  </div>
                </div>

                {analysisResult && (
                  <div className="flex-1 w-full bg-white p-6 rounded-2xl shadow-sm border border-blue-100 animate-fade-in">
                    <h4 className="font-bold text-blue-900 text-lg mb-4 border-b pb-2">Analysis Result</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Soil Type</span>
                        <p className="text-blue-800 font-medium">{analysisResult.type}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Health Status</span>
                        <p className="text-green-600 font-bold">{analysisResult.health}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Recommendation</span>
                        <p className="text-gray-600 text-sm leading-relaxed">{analysisResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Chatbot */}
          <div className="bg-white rounded-3xl shadow-lg flex flex-col h-[650px] border border-gray-100 overflow-hidden sticky top-6">
            <div className="p-6 bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <SmartToyIcon />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AgroBot Assistant</h3>
                  <p className="text-xs text-green-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0 text-green-600">
                      <SmartToyIcon fontSize="small" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-green-600 text-white rounded-br-none" 
                      : "bg-white border border-gray-100 text-gray-700 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0 text-gray-500">
                      <PersonIcon fontSize="small" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                  placeholder="Ask about crops, soil..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                />
                <button 
                  onClick={handleChatSend}
                  disabled={!chatInput.trim()}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SendIcon fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
