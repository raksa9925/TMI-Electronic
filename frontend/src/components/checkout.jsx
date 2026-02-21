import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBuy = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Please fill all customer info");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: total,
        }),
      });

      const data = await response.json();
      console.log(data);

      alert("Order placed successfully!");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="py-[120px] max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Checkout</h2>

      <input
        type="text"
        placeholder="Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
      />

      <input
        type="text"
        placeholder="Phone"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
      />

      <textarea
        placeholder="Address"
        value={customer.address}
        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
      />

      <p className="mb-4 dark:text-white font-bold">
        Total: ${total.toFixed(2)}
      </p>

      <button
        onClick={handleBuy}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
