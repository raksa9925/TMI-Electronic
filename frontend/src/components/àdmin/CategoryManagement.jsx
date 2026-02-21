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
      body: JSON.stringify({ name })
    });

    setName("");
    fetchCategories();
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName })
    });

    setEditId(null);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE"
    });

    fetchCategories();
  };

  return (
    <div className="py-[120px] max-w-3xl mx-auto">

      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
          placeholder="New category"
        />
        <button
          onClick={add}
          className="bg-orange-500 text-white px-4 py-3 rounded-lg"
        >
          Add
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="flex justify-between border p-3 mb-2">
          {editId === cat.id ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2"
              />
              <button onClick={() => saveEdit(cat.id)}>Save</button>
            </>
          ) : (
            <>
              <span>{cat.name}</span>
              <div>
                <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}>Edit</button>
                <button onClick={() => deleteCategory(cat.id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
