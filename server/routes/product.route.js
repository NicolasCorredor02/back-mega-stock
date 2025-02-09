import { Router } from "express";
import { ProductsManager } from "../controller/product.controller.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
  try {
    const products = await productsManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsManager.getProductById(pid);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const productBody = req.body;
    const resultAddProduct = await productsManager.addProduct(productBody);
    res.status(200).json(resultAddProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/", async (req, res) => {
  try {
    const { pid } = req.query;
    const productBody = req.body;
    const resultUpdatedProduct = await productsManager.updateProduct(pid, productBody)
    res.status(200).json(resultUpdatedProduct)
  } catch (error) {
    res.status(500).send(error.message)
  }
});

router.delete("/", async (req, res) => {
  try {
    const { pid } = req.query;
    const newProducts = await productsManager.deleteProduct(pid);
    res.status(200).send(newProducts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
