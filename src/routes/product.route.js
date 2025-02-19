import { Router } from "express";
import { ProductsManager } from "../controller/product.controller.js";

const router = Router();
const productsManager = new ProductsManager();

// Get all products or get products by category
router.get("/:category?", async (req, res) => {
  try {
    const { category } = req.params;

    let products;

    if (category) {
      products = await productsManager.getProducts(category);
    } else {
      products = await productsManager.getProducts();
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in endpoint:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// Get product by ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({
        error: "Id is required",
        details: "El id no puede ser vacio",
      });
    }

    const product = await productsManager.getProductById(pid);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// Get limit products
router.get("/:category?/limited/:limit", async (req, res) => {
  try {
    const { category } = req.params;
    const { limit } = req.params;

    if (!limit) {
      return res.status(400).json({
        error: "Limit is required",
        details: "El limite de productos no puede ser vacio",
      });
    }

    let productsLimited;
    if (category) {
      productsLimited = await productsManager.getLimitProducts(limit, category);
    } else {
      productsLimited = await productsManager.getLimitProducts(limit);
    }

    res.status(200).json(productsLimited);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// // Get categories
// router.get("/categories", async (req, res) => {
//   try {
//     console.log("Antes de llamar a getCategories");

//     const resultCategories = await productsManager.getCategories();
//     console.log("response categories", resultCategories);

//     res.status(200).json(resultCategories);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

router.post("/", async (req, res) => {
  try {
    const productBody = req.body;

    if (!productBody) {
      return res.status(400).json({
        error: "Product is required",
        details: "El producto y sus detalles no puede ser vacio",
      });
    }
    const resultAddProduct = await productsManager.addProduct(productBody);
    res.status(200).json(resultAddProduct);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const { pid } = req.query;
    const productBody = req.body;

    if (!pid || !productBody) {
      return res.status(400).json({
        error: "Product id & details are required",
        details: "El id y los detalles no pueden ser vacios",
      });
    }

    const resultUpdatedProduct = await productsManager.updateProduct(
      pid,
      productBody
    );
    res.status(200).json(resultUpdatedProduct);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { pid } = req.query;

    if (!pid) {
      return res.status(400).json({
        error: "Product id is required",
        details: "El id no puede ser vacio",
      });
    }

    const newProducts = await productsManager.deleteProduct(pid);
    res.status(200).send(newProducts);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

export default router;
