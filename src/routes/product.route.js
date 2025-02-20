import { Router } from "express";
import { ProductsController } from "@/controller/product.controller.js";

const router = Router();

// Get all products or get products by category
router.get("/:category?", ProductsController.getProducts);

// Get product by ID
router.get("/product/:id", ProductsController.getProductById);

// Get limit products
router.get("/:category?/limited/:limit", ProductsController.getLimitProducts);

// Get categories
// router.get("/categories", ProductsController.getCategories);

// Post product into DB
router.post("/add", ProductsController.addProduct);

// Put product to update
router.put("/update", ProductsController.updateProduct);

// Delete product from DB
router.delete("/delete", ProductsController.deleteProduct);

export default router;
