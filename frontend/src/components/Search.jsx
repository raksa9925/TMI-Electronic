import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get ?q=phone from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/products/search?name=${searchQuery}`
        );

        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Search failed:", error);
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchQuery]);

  return (
    <div className="pt-24 px-5 pb-10 bg-gray-100 dark:bg-gray-900 min-h-screen">

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Searching...
        </p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/detail/${p.id}`, { state: p })}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            >
              {p.image_url && (
                <div className="overflow-hidden h-[200px] w-full flex items-center justify-center">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-contain transform hover:scale-110 transition duration-300"
                  />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 truncate">
                  {p.name}
                </h3>
                <p className="text-green-600 font-semibold text-lg">
                  ${p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}