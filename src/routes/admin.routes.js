import { Router } from "express";
import { ProductsController } from "root/controller/product.controller.js";
import upload from "root/config/multer.js";
import handleErrorUploads from "root/middlewares/handleErrorUploads.js";

const router = Router();

//* --------------- Admin products since admin ------------------------
// Post product into DB
router.post(
  "/products/add",
  upload.array("thumbnails", 5), // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.addProduct
);

// Put product to update
router.put(
  "/products/update/:pid",
  upload.array("newThumbnails", 5), // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.updateProduct
);

// Delete product from DB
router.delete("/products/delete", ProductsController.deleteProduct);

// Get all products
router.get("/products", ProductsController.getProductsAdmin);

export default router;
