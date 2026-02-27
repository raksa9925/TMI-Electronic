import { useEffect, useState } from "react";

export default function CategoryManagement() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const add = async () => {
    if (!name.trim()) return alert("Category name required");

    await fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchCategories();
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return alert("Category name required");

    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });

    setEditId(null);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="py-[120px] max-w-3xl mx-auto">
      {/* Add Category */}
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
          placeholder="New category"
        />
        <button
          onClick={add}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="flex justify-between items-center border p-3 mb-2 rounded-lg dark:bg-gray-800 dark:text-white"
        >
          {editId === cat.id ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 border p-2 rounded-lg dark:bg-gray-700 dark:text-white mr-2"
              />
              <button
                onClick={() => saveEdit(cat.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditId(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span>{cat.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditId(cat.id);
                    setEditName(cat.name);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}