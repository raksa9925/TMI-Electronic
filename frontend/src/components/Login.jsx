import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const adminUser = {
    phone: "0123456789",
    password: "fgsgerhdtt"
  };

  // Check if admin is already logged in
  useEffect(() => {
    const loggedInAdmin = localStorage.getItem("adminLoggedIn");
    if (loggedInAdmin === "true") {
      navigate("/admin"); // redirect immediately if already logged in
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Please enter phone and password");
      return;
    }

    // Check if admin
    if (phone === adminUser.phone && password === adminUser.password) {
      localStorage.setItem("adminLoggedIn", "true"); // Save login in localStorage
      alert("Admin logged in!");
      navigate("/admin");
    } else {
      localStorage.removeItem("adminLoggedIn"); // remove admin flag if wrong login
      alert("User logged in!");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
