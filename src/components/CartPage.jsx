import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Checkout successful!");
    localStorage.removeItem("cart");
    setCartItems([]);
    navigate("/customer-home");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
              <div className="flex items-center gap-4">
                <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p>Qty: {item.quantity}</p>
                  <p className="text-green-700 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => handleRemove(idx)} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700">Remove</button>
            </div>
          ))}
          <div className="text-right font-bold text-lg">Total: ${totalPrice.toFixed(2)}</div>
          <button onClick={handleCheckout} className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">Checkout</button>
        </div>
      )}
    </div>
  );
}
