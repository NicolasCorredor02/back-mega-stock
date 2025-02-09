import { Router } from "express";
import { CartManager } from "../controller/cart.controller.js";

const router = Router();
const cartsManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const resultCreateCart = await cartsManager.createCart();
    res.status(200).json(resultCreateCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const resultCartById = await cartsManager.getCartProducts(cid);
    res.status(200).json(resultCartById);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = req.body;
    const resultAddProductCart = await cartsManager.addProductCart(
        cid,
        pid,
      product
    );
    res.status(200).json(resultAddProductCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
