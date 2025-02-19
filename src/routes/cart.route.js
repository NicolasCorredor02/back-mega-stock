import { Router } from "express";
import { CartManager } from "../controller/cart.controller.js";

const router = Router();
const cartsManager = new CartManager();

// Post create a cart
router.post("/", async (req, res) => {
  try {
    const resultCreateCart = await cartsManager.createCart();
    res.status(200).json(resultCreateCart);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// Get cart by id
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return req.status(400).json({
        error: "Id cart is required",
        details: "El id del cart no puede ser vacio",
      });
    }

    const resultCartById = await cartsManager.getCartProducts(cid);
    res.status(200).json(resultCartById);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// Post add product to cart by id
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = req.body;

    if (!cid || !pid) {
      return res.status(400).json({
        error: "Cart id & product id are required",
        details: "El id del cart y del producto no pueden ser vacios",
      });
    }

    const resultAddProductCart = await cartsManager.addProductCart(
      cid,
      pid,
      product
    );
    res.status(200).json(resultAddProductCart);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

export default router;
