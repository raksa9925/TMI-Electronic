import { useLocation, useNavigate } from "react-router-dom";

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, name, price, detail, id } = location.state || {};

  if (!name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">No product selected</p>
      </div>
    );
  }

  const handleBuy = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already in cart
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id,
        image,
        name,
        price,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
    navigate("/cart");
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-2xl p-8 mt-[-250px]">
          <h1 className="text-2xl font-bold mb-6">Product Detail</h1>

          <div className="flex gap-6 items-start">
            <img
              src={image}
              alt={name}
              className="h-[200px] w-[350px] rounded-xl object-cover shadow-md"
            />
          </div>

          <div className="mt-[10px]">
            <p className="text-xl font-bold mb-2">{name}</p>
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              ${price}
            </p>
            <p className="mt-[10px] text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {detail}
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBuy}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Buy Now
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
