require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products/search", (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let sql = `
    SELECT p.*, c.name AS categoryName
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE 1=1
  `;

  const params = []; 

  if (name) {
    sql += " AND p.name LIKE ?";
    params.push(`%${name}%`);
  }

  if (category) {
    sql += " AND c.name LIKE ?";
    params.push(`%${category}%`);
  }

  if (minPrice) {
    sql += " AND p.price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    sql += " AND p.price <= ?";
    params.push(maxPrice);
  }

  sql += " ORDER BY p.id DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.log("SEARCH ERROR:", err);
      return res.status(500).json({ error: err });
    }

    res.json(results);
  });
});

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/* ================= CLOUDINARY STORAGE ================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shop_products", 
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});
const upload = multer({ storage });

// ================= DATABASE =================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "shopdb",
  decimalNumbers: true,
});

// ================= CATEGORY ROUTES =================
app.get("/api/categories", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/categories", (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Category name required" });
  }

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name.trim()],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Category created", id: result.insertId });
    }
  );
});

// UPDATE CATEGORY
app.put("/api/categories/:id", (req, res) => {
  const { name } = req.body;
  const id = req.params.id;

  if (!name?.trim()) return res.status(400).json({ message: "Name required" });

  db.query("UPDATE categories SET name=? WHERE id=?", [name.trim(), id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Category updated" });
  });
});

// DELETE CATEGORY
app.delete("/api/categories/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM categories WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Category deleted" });
  });
});

// ================= PRODUCT ROUTES =================

// GET ALL PRODUCTS
app.get("/api/products", (req, res) => {
  const sql = `
    SELECT p.*, c.name AS categoryName
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET PRODUCTS BY CATEGORY 
app.get("/api/products/category/:id", (req, res) => {
  const categoryId = req.params.id;

  const sql = `
    SELECT p.*, c.name AS categoryName
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE p.categoryId = ?
    ORDER BY p.id DESC
  `;

  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.log("CATEGORY ERROR:", err);
      return res.status(500).json({ error: err });
    }

    res.json(results);
  });
});

// CREATE PRODUCT 
app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price, stock, description, categoryId } = req.body;

  if (!name || !price || !stock || !categoryId) {
    return res.status(400).json({
      message: "Name, price, stock, category required",
    });
  }

  const imageUrl = req.file ? req.file.path : null;

  db.query(
    `INSERT INTO products
     (name, price, stock, description, image_url, categoryId)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      Number(price),
      Number(stock),
      description || "",
      imageUrl,
      Number(categoryId),
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Product created",
        productId: result.insertId,
        image_url: imageUrl,
      });
    }
  );
});

// UPDATE PRODUCT
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const { name, price, stock, description, categoryId } = req.body;

  db.query(
    "SELECT image_url FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (!result.length)
        return res.status(404).json({ message: "Product not found" });

      const oldImage = result[0].image_url;
      const newImage = req.file ? req.file.path : oldImage;

      db.query(
        `UPDATE products
         SET name=?, price=?, stock=?, description=?, image_url=?, categoryId=?
         WHERE id=?`,
        [
          name,
          Number(price),
          Number(stock),
          description || "",
          newImage,
          Number(categoryId),
          req.params.id,
        ],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: "Product updated successfully" });
        }
      );
    }
  );
});

// DELETE PRODUCT
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT image_url FROM products WHERE id=?",
    [id],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.length)
        return res.status(404).json({ message: "Product not found" });

      const imageUrl = result[0].image_url;

      db.query("DELETE FROM products WHERE id=?", [id], async (err2) => {
        if (err2) return res.status(500).json(err2);

        if (imageUrl) {
          try {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy("shop_products/" + publicId);
          } catch (e) {
            console.log("Cloudinary delete error:", e);
          }
        }

        res.json({ message: "Product deleted" });
      });
    }
  );
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});