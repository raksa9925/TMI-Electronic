import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto py-14">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/products"
          className="bg-blue-600 text-white p-4 rounded text-center hover:bg-blue-800"
        >
          ➕ Manage Products
        </Link>

        <Link
          to="/admin/categories"
          className="bg-green-600 text-white p-4 rounded text-center hover:bg-green-800"
        >
          🗂 Manage Categories
        </Link>

        <Link
          to="/admin/orders"
          className="bg-purple-600 text-white p-4 rounded text-center hover:bg-purple-800"
        >
          📦 Manage Orders
        </Link>

        <Link
          to="/"
          className="bg-gray-600 text-white p-4 rounded text-center hover:bg-gray-800"
        >
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
