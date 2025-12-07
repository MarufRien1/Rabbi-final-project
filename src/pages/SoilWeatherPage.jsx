import React, { useState } from "react";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import OpacityIcon from "@mui/icons-material/Opacity";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Division data
const divisions = [
  { name: "Dhaka", soil: "Loamy, Fertile", ph: 6.5, moisture: "23%", nutrients: "N, P, K", temp: "28°C", humidity: "70%", wind: "10 km/h", rain: "15%", img: "dhaka.png" },
  { name: "Chittagong", soil: "Clay Loam", ph: 6.3, moisture: "30%", nutrients: "N, P, K", temp: "27°C", humidity: "75%", wind: "12 km/h", rain: "20%", img: "chatto.png" },
  { name: "Khulna", soil: "Sandy Loam", ph: 6.6, moisture: "22%", nutrients: "N, P, K", temp: "29°C", humidity: "68%", wind: "11 km/h", rain: "12%", img: "khulna.jpg" },
  { name: "Rajshahi", soil: "Alluvial", ph: 6.4, moisture: "20%", nutrients: "N, P, K", temp: "30°C", humidity: "65%", wind: "10 km/h", rain: "10%", img: "rajshahi.jpg" },
  { name: "Sylhet", soil: "Clay Loam, High Organic Matter", ph: 6.7, moisture: "28%", nutrients: "N, P, K", temp: "26°C", humidity: "80%", wind: "12 km/h", rain: "25%", img: "sly.png" },
  { name: "Barishal", soil: "Silty Clay Loam", ph: 6.5, moisture: "25%", nutrients: "N, P, K", temp: "28°C", humidity: "72%", wind: "11 km/h", rain: "18%", img: "barasial.jpg" },
  { name: "Rangpur", soil: "Alluvial, Medium Fertility", ph: 6.3, moisture: "24%", nutrients: "N, P, K", temp: "29°C", humidity: "70%", wind: "10 km/h", rain: "14%", img: "rangpur.jpg" },
  { name: "Mymensingh", soil: "Loamy, Fertile", ph: 6.5, moisture: "26%", nutrients: "N, P, K", temp: "27°C", humidity: "71%", wind: "10 km/h", rain: "16%", img: "myn.jpg" },
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
    "Rainfall affects soil moisture; adjust watering accordingly.",
    "Plan your crops according to upcoming rainfall predictions."
  ],
  fertilizer: [
    "Use NPK fertilizers as per soil nutrient level and crop type.",
    "Fertilizer timing is crucial. Follow recommended doses.",
    "Avoid overfertilizing; it can harm both plants and soil."
  ],
  crop: [
    (division) => `Recommended crops for ${division}: ${cropAdvice[division].join(", ")}.`,
    (division) => `For ${division}, you can grow: ${cropAdvice[division].join(", ")}.`,
    (division) => `${division} is suitable for these crops: ${cropAdvice[division].join(", ")}.`
  ],
  default: [
    "Ensure proper sunlight, water, and nutrients for healthy crops.",
    "Regular monitoring of soil and weather helps optimize crop yield.",
    "Good agricultural practices lead to better harvests."
  ]
};

// Helper to get random variation
const getRandom = (arr, division=null) => {
  const choice = arr[Math.floor(Math.random() * arr.length)];
  return typeof choice === "function" ? choice(division) : choice;
};

export default function SoilWeatherPage() {
  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (!input && !file) return;

    const userMessage = { type: "user", text: input, file: file ? file.name : null };
    setMessages([...messages, userMessage]);
    setInput("");
    setFile(null);

    let replyText = "";
    if (file) {
      replyText = `Received your file "${file.name}". We'll analyze it soon.`;
    } else {
      const question = input.toLowerCase();
      if (question.includes("soil")) replyText = getRandom(tips.soil);
      else if (question.includes("moisture")) replyText = getRandom(tips.moisture);
      else if (question.includes("ph")) replyText = getRandom(tips.ph);
      else if (question.includes("rain")) replyText = getRandom(tips.rain);
      else if (question.includes("fertilizer")) replyText = getRandom(tips.fertilizer);
      else if (question.includes("crop")) replyText = getRandom(tips.crop, selectedDivision.name);
      else replyText = getRandom(tips.default);
    }

    const botMessage = { type: "bot", text: replyText };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-green-200 to-green-100 pb-10">
      {/* Navbar */}
      <header className="bg-white shadow-lg py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white text-2xl">
            <LocalFloristIcon />
          </span>
          <h1 className="text-2xl font-bold text-green-800">AgroMart - Soil & Weather</h1>
        </div>
      </header>

      {/* Division Selector + Info */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-green-900">Soil and Weather by Division</h2>
        <div className="flex flex-wrap gap-3 mb-8">
          {divisions.map((div) => (
            <button
              key={div.name}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 shadow hover:scale-105 ${
                selectedDivision.name === div.name
                  ? "bg-green-700 text-white shadow-lg"
                  : "bg-white border text-green-900 hover:bg-green-100"
              }`}
              onClick={() => setSelectedDivision(div)}
            >
              {div.name}
            </button>
          ))}
        </div>

        <section className="bg-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-shadow duration-300">
          <img
            src={selectedDivision.img}
            alt={selectedDivision.name}
            className="w-full md:w-1/2 h-100 object-cover rounded-2xl"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-2xl mb-3 text-green-800">{selectedDivision.name}</h3>

            <div className="mb-4">
              <h4 className="font-semibold mb-1 text-green-700">Soil Info:</h4>
              <ul className="list-disc list-inside text-slate-700">
                <li>Type: {selectedDivision.soil}</li>
                <li>pH Level: {selectedDivision.ph}</li>
                <li>Moisture: {selectedDivision.moisture}</li>
                <li>Nutrients: {selectedDivision.nutrients}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-1 text-green-700">Weather Info:</h4>
              <ul className="list-disc list-inside text-slate-700">
                <li>
                  Temperature: {selectedDivision.temp} <WbSunnyIcon className="inline ml-1 text-yellow-400" />
                </li>
                <li>
                  Humidity: {selectedDivision.humidity} <OpacityIcon className="inline ml-1 text-blue-400" />
                </li>
                <li>Wind Speed: {selectedDivision.wind}</li>
                <li>Rain Forecast: {selectedDivision.rain}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Soil & Weather Help Chat */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl shadow-xl mt-6">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Soil & Weather Help</h2>

          <div className="border rounded-2xl p-4 h-64 overflow-y-auto mb-4 flex flex-col gap-3 bg-green-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.type === "user" ? "bg-green-200 self-end" : "bg-white self-start shadow"
                }`}
              >
                {msg.file && <p className="italic text-sm text-gray-600">[File uploaded: {msg.file}]</p>}
                {msg.text && <p className="text-gray-800">{msg.text}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <label className="p-3 bg-green-100 rounded-2xl cursor-pointer hover:bg-green-200 transition-colors">
              <UploadFileIcon />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <button
              onClick={handleSend}
              className="px-5 py-3 bg-green-600 text-white rounded-2xl flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <SendIcon /> Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
