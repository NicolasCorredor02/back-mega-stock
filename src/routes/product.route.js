import { Router } from "express";
import { ProductsController } from "root/controller/product.controller.js";
import upload from "root/config/multer.js";
import handleErrorUploads from "root/middlewares/handleErrorUploads.js";

const router = Router();

// Get limit products by category
router.get("/:category/limited/:limit", ProductsController.getLimitProducts);

// Get limit products
router.get("/limited/:limit", ProductsController.getLimitProducts);

// Get product by ID
router.get("/product/:pid", ProductsController.getProductById);

// Get all products by category
router.get("/:category", ProductsController.getProducts);

// Get categories
// router.get("/categories", ProductsController.getCategories);

// Post product into DB
router.post(
  "/add",
  upload.array("thumbnails", 5), // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.addProduct
);

// Put product to update
router.put(
  "/update/:pid",
  upload.array("newThumbnails", 5), // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.updateProduct
);

// Delete product from DB
router.delete("/delete", ProductsController.deleteProduct);

// Get all products
router.get("/", ProductsController.getProducts);

export default router;
