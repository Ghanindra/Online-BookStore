// CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  // fetch initial count
  const fetchCount = async () => {
    try {
      const token = localStorage.getItem("token");
      // get the full response
      const response = await axios.get("http://localhost:5023/api/user/cart", {
        headers: { Authorization: `Bearer ${token}` },
    });
      const items = response.data;           // <-- this should be your array
      if (Array.isArray(items)) {
        setCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } else {
        console.error("Expected cart payload to be an array, got:", items);
        setCount(0);
      }
    } catch (err) {
      console.error("Failed to load cart count", err);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <CartContext.Provider value={{ count, setCount, refresh: fetchCount }}>
      {children}
    </CartContext.Provider>
  );
};
