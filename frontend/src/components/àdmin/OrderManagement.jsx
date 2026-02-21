import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch Orders ----------------
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      // 🔥 Ensure numeric values are numbers
      const formattedOrders = data.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        items: order.items?.map((item) => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })) || [],
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- Update Order Status ----------------
  const handleStatusUpdate = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      await fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Status Badge ----------------
  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] || ""
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // ---------------- Revenue Calculation ----------------
  const calculateTotalRevenue = () => {
    return orders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  return (
  <div className="max-w-6xl mx-auto py-[120px] px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Manage Orders</h1>
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Store
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold dark:text-white">
            {orders.length}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${calculateTotalRevenue().toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Pending Orders
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">All Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No orders yet
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2 dark:border-gray-700"
                    >
                      <div>
                        <p className="font-medium dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × $
                          {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold dark:text-white">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <p className="text-lg dark:text-white">
                    <strong>Total:</strong>{" "}
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </p>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value)
                    }
                    disabled={loading}
                    className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
