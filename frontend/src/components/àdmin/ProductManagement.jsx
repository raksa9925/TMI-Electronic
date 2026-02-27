import { useEffect, useState } from "react";

export default function ProductManagement() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
    imageFile: null
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);

  /* ================= LOAD DATA ================= */

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();

    const interval = setInterval(fetchProducts, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ================= ADD PRODUCT ================= */

  const addProduct = async () => {
    if (!form.name || !form.price || !form.categoryId || !form.stock) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    formData.append("categoryId", form.categoryId.toString()); 
    formData.append("image", form.imageFile);

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData
    });

    fetchProducts();

    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      imageFile: null,
      categoryId: ""
    });
  };

  /* ================= DELETE ================= */

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    });

    fetchProducts();
  };

  /* ================= START EDIT ================= */

  const startEdit = (product) => {
    setEditId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      categoryId: product.categoryId
    });
    setEditImageFile(null);
  };

  /* ================= SAVE EDIT ================= */

  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("price", editForm.price);
    formData.append("stock", editForm.stock);
    formData.append("description", editForm.description);
    formData.append("categoryId", Number(editForm.categoryId));

    if (editImageFile) {
      formData.append("image", editImageFile);
    }

    await fetch(`http://localhost:5000/api/products/${editId}`, {
      method: "PUT",
      body: formData
    });

    setEditId(null);
    fetchProducts();
  };

  /* ================= UI ================= */

  return (
    <div className="p-14 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Manage Products
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ADD FORM */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Add Product</h3>

          <div className="space-y-4">
            <input
              className="w-full border rounded-lg p-3"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border rounded-lg p-3"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border rounded-lg p-3"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <textarea
              className="w-full border rounded-lg p-3"
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              className="w-full border rounded-lg p-3"
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: Number(e.target.value) })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) =>
                setForm({ ...form, imageFile: e.target.files[0] })
              }
            />

            <button
              onClick={addProduct}
              className="w-full bg-orange-500 text-white py-3 rounded-lg"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="bg-white shadow-lg rounded-lg p-6 max-h-[700px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Products</h3>

          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 mb-4">

              {/* FIXED IMAGE */}
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-24 h-24 object-cover mb-2"
                />
              )}

              {editId === product.id ? (
                <>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full border p-2 mb-2"
                  />

                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="w-full border p-2 mb-2"
                  />

                  <select
                    value={editForm.categoryId}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        categoryId: Number(e.target.value)
                      })
                    }
                    className="w-full border p-2 mb-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="file"
                    onChange={(e) =>
                      setEditImageFile(e.target.files[0])
                    }
                  />

                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-bold">{product.name}</h4>
                  <p>Category: {product.categoryName}</p>
                  <p className="text-green-600">${product.price}</p>

                  <button
                    onClick={() => startEdit(product)}
                    className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}