import express from "express";
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

router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsManager.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/product", async (req, res) => {
  try {
    const productBody = req.body;
    const resultAddProduct = await productsManager.addProduct(productBody);
    res.status(200).json(resultAddProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/product/update", async (req, res) => {
  try {
    const { id } = req.query;
    const productBody = req.body;
    const resultUpdatedProduct = await productsManager.updateProduct(id, productBody)
    res.status(200).json(resultUpdatedProduct)
  } catch (error) {
    res.status(500).send(error.message)
  }
});

router.delete("/product/delete", async (req, res) => {
  try {
    const { id } = req.query;
    const newProducts = await productsManager.deleteProduct(id);
    res.status(200).send(newProducts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
