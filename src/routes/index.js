import { Router } from "express";
import products from "root/routes/product.route.js";
import carts from "root/routes/cart.route.js";
import admin from "root/routes/admin.routes.js"

const router = Router();

/**
 * Get de Home Page
 */
router.get("/", (req, res) => {
  res.send(`<div style='height: 100%; width: 100%; text-align: center; font-size: 2em'>
        <h1>!Bienvenido a la API de Mega-Stock!</h1>
        <p>Para ver los productos ve a <a href="http://localhost:8080/api/products">/api/products</a></p>
        <p>Para ver los carritos ve a <a href="http://localhost:8080/api/carts">/api/carts</a></p>
        </div>`);
});

router.use("/api/products", products);
router.use("/api/carts", carts);
router.use("/api/admin", admin);

export default router;
