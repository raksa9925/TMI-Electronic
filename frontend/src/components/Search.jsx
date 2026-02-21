import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const location = useLocation();

  // Read query from URL ?q=phone
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load all products from localStorage
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    // Filter by name (case-insensitive)
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setProducts(filtered);
  }, [searchQuery]); // re-run if URL query changes

  return (
    <div className="pt-24 px-5 pb-10 bg-gray-100 dark:bg-gray-900 min-h-screen">

      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition relative"
            >
              {p.image && (
                <div className="overflow-hidden h-[200px] w-full flex items-center justify-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain transform hover:scale-110 transition duration-300 ease-in-out"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                  {p.name}
                </h3>
                <p className="text-green-600 font-semibold text-lg">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
