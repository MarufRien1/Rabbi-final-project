import { BrowserRouter, Routes, Route } from "react-router-dom";

import AgroMartHome from "./components/AgroMartHome.jsx";
import CustomerHomePage from "./components/CustomerHomePage.jsx";
import ProductBuyPage from "./components/ProductBuyPage.jsx";
import CartPage from "./components/CartPage.jsx";

import FruitsPage from "./pages/FruitsPage.jsx";
import VegetablesPage from "./pages/VegetablesPage.jsx";
import RicePage from "./pages/RicePage.jsx";
import HoneyPage from "./pages/HoneyPage.jsx";

import FarmerSignup from "./pages/FarmerSignup.jsx";
import FarmerLogin from "./pages/FarmerLogin.jsx";
import FarmerHomepage from "./components/FarmerHomepage.jsx";
import AddNewProductPage from "./pages/AddNewProductPage.jsx";

import CustomerLogin from "./pages/CustomerLogin.jsx";
import CustomerSignup from "./pages/CustomerSignup.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";
import SoilWeatherPage from "./pages/SoilWeatherPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgroMartHome />} />
        <Route path="/customer-home" element={<CustomerHomePage />} />
        <Route path="/product/:id" element={<ProductBuyPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Locaton  */}
        <Route path="/locations" element={<LocationsPage />} />
        {/* soil */}
        <Route path="/soil-weather" element={<SoilWeatherPage />} />

        {/* Category Pages */}
        <Route path="/category/fruits" element={<FruitsPage />} />
        <Route path="/category/vegetables" element={<VegetablesPage />} />
        <Route path="/category/rice" element={<RicePage />} />
        <Route path="/category/honey" element={<HoneyPage />} />

        {/* Farmer Auth */}
        <Route path="/farmer-signup" element={<FarmerSignup />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/farmer-homepage" element={<FarmerHomepage />} />
        <Route path="/add-product" element={<AddNewProductPage />} />

        {/* Customer Auth */}
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-signup" element={<CustomerSignup />} />
      </Routes>
    </BrowserRouter>
  );
}
