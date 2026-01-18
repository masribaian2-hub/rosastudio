const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pic", express.static(path.join(__dirname, "pic")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/", express.static(path.join(__dirname, "html")));

const db = new sqlite3.Database("product.db");

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT,
    description TEXT
  )
`);

app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post("/products", (req, res) => {
  const { name, price, image, description } = req.body;

  db.run(
    "INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)",
    [name, price, image, description],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put("/products/:id", (req, res) => {
  const { name, price, image, description } = req.body;
  const id = req.params.id;

  db.run(
    "UPDATE products SET name=?, price=?, image=?, description=? WHERE id=?",
    [name, price, image, description, id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ message: "Product updated successfully" });
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM products WHERE id=?", [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ message: "Product deleted successfully" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
