import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === Number(id));
        setProduct(found);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  const handleBuy = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        image: product.image_url,
        name: product.name,
        price: product.price,
        detail: product.description,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
    navigate("/cart");
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Product Detail</h1>

        <img
          src={product.image_url}
          alt={product.name}
          className="h-[250px] w-full rounded-xl object-cover shadow-md"
        />

        <div className="mt-4">
          <p className="text-xl dark:text-white font-bold">{product.name}</p>
          <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            ${product.price}
          </p>
          <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
            {product.description}
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detail;