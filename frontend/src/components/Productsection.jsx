import { useNavigate } from "react-router-dom";

function ProductSection({ products = [] }) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
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
                src={p.image}
                alt={p.name}
                className="max-h-[180px] object-contain"
              />
            </div>

            <div className="px-4 pb-4 flex-1">
              <h3 className="font-semibold truncate dark:text-gray-100">{p.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Price: ${p.price}
              </p>
              <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded">
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
