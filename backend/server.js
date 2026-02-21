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

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

// ================= CLOUD STORAGE =================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shop_products",
    allowed_formats: ["jpg", "png", "jpeg"],
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
app.get("/api/categories", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/categories", (req, res) => {
  const { name } = req.body;

  if (!name?.trim())
    return res.status(400).json({ message: "Category name required" });

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name.trim()],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category created", id: result.insertId });
    }
  );
});

app.put("/api/categories/:id", (req, res) => {
  db.query(
    "UPDATE categories SET name=? WHERE id=?",
    [req.body.name, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category updated" });
    }
  );
});

app.delete("/api/categories/:id", (req, res) => {
  db.query(
    "DELETE FROM categories WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category deleted" });
    }
  );
});

// GET PRODUCTS
app.get("/api/products", (req, res) => {
  const sql = `
    SELECT p.*, c.name as categoryName
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// CREATE PRODUCT
app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price, stock, description, categoryId } = req.body;

  if (!name || !price || !stock || !categoryId)
    return res.status(400).json({ message: "Missing required fields" });

  const imageUrl = req.file ? req.file.path : null;

  db.query(
    `INSERT INTO products
     (name, price, stock, description, image_url, categoryId)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, price, stock, description || "", imageUrl, categoryId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Product created successfully",
        id: result.insertId,
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
      if (err) return res.status(500).json(err);
      if (!result.length)
        return res.status(404).json({ message: "Product not found" });

      const oldImage = result[0].image_url;
      const newImage = req.file ? req.file.path : null;
      const finalImage = newImage || oldImage;

      db.query(
        `UPDATE products
         SET name=?, price=?, stock=?, description=?, image_url=?, categoryId=?
         WHERE id=?`,
        [name, price, stock, description, finalImage, categoryId, req.params.id],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({
            message: "Product updated successfully",
            image_url: finalImage,
          });
        }
      );
    }
  );
});

// DELETE PRODUCT
app.delete("/api/products/:id", (req, res) => {
  db.query(
    "SELECT image_url FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.length)
        return res.status(404).json({ message: "Product not found" });

      const imageUrl = result[0].image_url;

      db.query(
        "DELETE FROM products WHERE id=?",
        [req.params.id],
        async (err2) => {
          if (err2) return res.status(500).json(err2);

          if (imageUrl) {
            try {
              const publicId = imageUrl.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy("shop_products/" + publicId);
            } catch (error) {
              console.log("Cloud image delete error:", error);
            }
          }

          res.json({ message: "Product deleted successfully" });
        }
      );
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
