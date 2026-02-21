import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Your cart is empty
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-bold dark:text-white">{item.name}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold dark:text-white">Total: ${total}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
