const express = require("express");
const pool = require("./config/db");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");


// =====================
// HOME (DASHBOARD)
// =====================
app.get("/", async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT p.id, p.name, p.price, s.quantity
      FROM products p
      JOIN stocks s ON p.id = s.product_id
    `);

    const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
    const totalPurchases = await pool.query("SELECT COUNT(*) FROM purchases");

    const totalRevenue = await pool.query(`
      SELECT COALESCE(SUM(total_price),0) AS revenue
      FROM purchases
      WHERE status != 'CANCELLED'
    `);

    res.render("products", {
      products: products.rows,
      stats: {
        totalProducts: totalProducts.rows[0].count,
        totalPurchases: totalPurchases.rows[0].count,
        totalRevenue: totalRevenue.rows[0].revenue
      }
    });

  } catch (err) {
    console.error(err);
    res.send("Database error");
  }
});


// =====================
// PURCHASE PAGE
// =====================
app.get("/purchase", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.render("purchase", { products: result.rows });
});


// =====================
// PROCESS PURCHASE
// =====================
app.post("/purchase", async (req, res) => {
  let { product_id, qty } = req.body;

  qty = parseInt(qty);

  try {
    const stockResult = await pool.query(
      "SELECT quantity FROM stocks WHERE product_id = $1",
      [product_id]
    );

    const stock = stockResult.rows[0].quantity;

    if (stock < qty) {
      return res.send("Stock tidak cukup");
    }

    const productResult = await pool.query(
      "SELECT price FROM products WHERE id = $1",
      [product_id]
    );

    const price = productResult.rows[0].price;
    const total = price * qty;

    await pool.query(
      "INSERT INTO purchases(product_id, qty, total_price) VALUES ($1,$2,$3)",
      [product_id, qty, total]
    );

    await pool.query(
      "UPDATE stocks SET quantity = quantity - $1 WHERE product_id = $2",
      [qty, product_id]
    );

    res.redirect("/purchases");

  } catch (err) {
    console.error(err);
    res.send("Error saat pembelian");
  }
});


// =====================
// LIST PURCHASES
// =====================
app.get("/purchases", async (req, res) => {
  const result = await pool.query(`
    SELECT pu.*, p.name
    FROM purchases pu
    JOIN products p ON p.id = pu.product_id
    ORDER BY pu.id DESC
  `);

  res.render("purchases", { purchases: result.rows });
});


// =====================
// CANCEL PURCHASE
// =====================
app.get("/cancel/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const purchase = await pool.query(
      "SELECT * FROM purchases WHERE id = $1",
      [id]
    );

    if (purchase.rows.length === 0) {
      return res.send("Data tidak ditemukan");
    }

    const data = purchase.rows[0];

    if (data.status === "CANCELLED") {
      return res.redirect("/purchases");
    }

    await pool.query(
      "UPDATE purchases SET status = 'CANCELLED' WHERE id = $1",
      [id]
    );

    await pool.query(
      "UPDATE stocks SET quantity = quantity + $1 WHERE product_id = $2",
      [data.qty, data.product_id]
    );

    res.redirect("/purchases");

  } catch (err) {
    console.error(err);
    res.send("Error cancel purchase");
  }
});


// =====================
// SERVER
// =====================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});