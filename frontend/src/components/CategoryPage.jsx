import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      const all = JSON.parse(localStorage.getItem("products")) || [];
      setProducts(all.filter(p => p.categoryId === Number(id)));
    };

    loadProducts();
    window.addEventListener("productsUpdated", loadProducts);
    return () => window.removeEventListener("productsUpdated", loadProducts);
  }, [id]);

  // Navigate to detail page with state
  const goToDetail = (product) => {
    navigate(`/detail/${product.id}`, { state: product });
  };

  return (
    <div className="pt-24 px-5 pb-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No products in this category
        </p>
      ) : (
        <div className="grid grid-cols-2 m:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              onClick={() => goToDetail(p)}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
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
              <div className="px-4 pb-4 flex-1">
              <h3 className="font-semibold truncate dark:text-gray-100">{p.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Price: ${p.price}
              </p>
              <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded">
                Buy
              </button>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
