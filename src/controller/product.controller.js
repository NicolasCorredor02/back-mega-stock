import { ProductsManager } from "@/managers/product.manager.js";

export class ProductsController {
  static async getProducts(req, res) {
    try {
      const { category } = req.params;

      let products;

      if (category) {
        products = await ProductsManager.getProducts(category);
      } else {
        products = await ProductsManager.getProducts();
      }
      res.status(200).json(products);
    } catch (error) {
      console.error("Error in endpoint:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({
          error: "Id is required",
          details: "El id no puede ser vacio",
        });
      }

      // Verificar que sea un número válido
      const numId = parseInt(id);
      if (isNaN(numId) || numId <= 0) {
        return res.status(400).json({
          error: "Invalid limit",
          details: "El id debe ser un número positivo",
        });
      }

      const product = await ProductsManager.getProductById(id);

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  static async getLimitProducts(req, res) {
    try {
      const { category } = req.params;
      const { limit } = req.params;

      if (!limit || limit.trim() === "") {
        return res.status(400).json({
          error: "Limit is required",
          details: "El limite de productos no puede ser vacio",
        });
      }

      // Verificar que sea un número válido
      const numLimit = parseInt(limit);
      if (isNaN(numLimit) || numLimit <= 0) {
        return res.status(400).json({
          error: "Invalid limit",
          details: "El límite debe ser un número positivo",
        });
      }

      let productsLimited;
      if (category) {
        productsLimited = await ProductsManager.getLimitProducts(
          limit,
          category
        );
      } else {
        productsLimited = await ProductsManager.getLimitProducts(limit);
      }

      res.status(200).json(productsLimited);
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  // static async getCategories(req, res) {
  //   try {
  //     console.log("Antes de llamar a getCategories");
  //     const resultCategories = await ProductsManager.getCategories();
  //     console.log("response categories", resultCategories);
  //     res.status(200).json(resultCategories);
  //   } catch (error) {
  //     res.status(500).send(error.message);
  //   }
  // }

  static async addProduct(req, res) {
    try {
      const productBody = req.body;

      if (!productBody) {
        return res.status(400).json({
          error: "Product is required",
          details: "El producto y sus detalles no puede ser vacio",
        });
      }
      const resultAddProduct = await ProductsManager.addProduct(productBody);
      res.status(200).json(resultAddProduct);
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { pid } = req.query;
      const productBody = req.body;

      if (!pid || pid.trim() === "" || !productBody) {
        return res.status(400).json({
          error: "Product id & details are required",
          details: "El id y los detalles no pueden ser vacios",
        });
      }

      // Verificar que sea un número válido
      const numPid = parseInt(pid);
      if (isNaN(numPid) || numPid <= 0) {
        return res.status(400).json({
          error: "Invalid limit",
          details: "El id debe ser un número positivo",
        });
      }

      const resultUpdatedProduct = await ProductsManager.updateProduct(
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
  }

  static async deleteProduct(req, res) {
    try {
      const { pid } = req.query;

      if (!pid || pid.trim() === "") {
        return res.status(400).json({
          error: "Product id is required",
          details: "El id no puede ser vacio",
        });
      }

      // Verificar que sea un número válido
      const numPid = parseInt(pid);
      if (isNaN(numPid) || numPid <= 0) {
        return res.status(400).json({
          error: "Invalid limit",
          details: "El límite debe ser un número positivo",
        });
      }

      const newProducts = await ProductsManager.deleteProduct(pid);
      res.status(200).json({
        success: true,
        message: newProducts,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
}
