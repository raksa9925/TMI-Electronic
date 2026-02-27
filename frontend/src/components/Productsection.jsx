import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Auto refresh every 5 seconds
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10 mt-[50px]">
        Loading products...
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10 mt-[50px]">
        No products found
      </p>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-900 py-10 px-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/detail/${p.id}`, { state: p })}
            className="bg-white dark:bg-gray-700 rounded-lg shadow hover:scale-105 transition cursor-pointer flex flex-col"
          >
            <div className="p-4 flex justify-center">
              <img
                src={p.image_url || "/placeholder.png"} // fallback if no image
                alt={p.name}
                className="max-h-[180px] object-contain"
              />
            </div>

            <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold truncate dark:text-gray-100">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Price: ${p.price}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  navigate(`/detail/${p.id}`, { state: p });
                }}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-[6px] rounded"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSection;