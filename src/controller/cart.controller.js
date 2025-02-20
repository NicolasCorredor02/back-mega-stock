import { CartsManager } from "@/managers/cart.manager.js";

export class CartsController {
  static async createCart(req, res) {
    try {
      const resultCreateCart = await CartsManager.createCart();
      res.status(200).json(resultCreateCart);
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  static async getCart(req, res) {
    try {
      const { cid } = req.params;

      if (!cid) {
        return req.status(400).json({
          error: "Id cart is required",
          details: "El id del cart no puede ser vacio",
        });
      }

      const resultCartById = await CartsManager.getCart(cid);
      res.status(200).json(resultCartById);
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  static async addProductCart(req, res) {
    try {
      const { cid } = req.params;
      const product = req.body;

      if (!cid || !product) {
        return res.status(400).json({
          error: "Cart id & product are required",
          details: "El id del cart y el producto no pueden ser vacios",
        });
      }

      const resultAddProductCart = await CartsManager.addProductCart(
        cid,
        product
      );
      res.status(200).json(resultAddProductCart);
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
}
