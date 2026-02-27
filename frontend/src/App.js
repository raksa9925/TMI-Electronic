import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/home";
import Navbar from "./components/Navbar";
import SearchPage from "./components/Search";
import CategoryPage from "./components/CategoryPage";
import Detail from "./components/detail";
import Contect from "./components/Contect";
import Cart from "./components/cart";

import AdminDashboard from "./components/àdmin/AdminDashboard";
import ProductManagement from "./components/àdmin/ProductManagement";
import CategoryManagement from "./components/àdmin/CategoryManagement";
import OrderManagement from "./components/àdmin/OrderManagement";

function App() {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const isAdmin = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar
          search={search}
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} />}
          />
          <Route
            path="/login"
            element={isAdmin ? <Navigate to="/admin" /> : <Login />}
          />
          <Route path="/home" element={<Home />} />

          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/productsearch" element={<SearchPage />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/contect" element={<Contect />} />

          {/* Admin (protected) */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/products"
            element={isAdmin ? <ProductManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/categories"
            element={isAdmin ? <CategoryManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/orders"
            element={isAdmin ? <OrderManagement /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
