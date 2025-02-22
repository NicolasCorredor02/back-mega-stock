import { ProductsManager } from "root/managers/product.manager.js";
import createHttpError from "http-errors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta para almacenar y guardar las imagenes
const projectRoot = path.resolve(__dirname, "../../");
const ruteImages = path.join(projectRoot, "src/uploads");

export class ProductsController {
  static async getProducts(req, res, next) {
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
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        throw createHttpError(404, "Id is required");
      }

      // Verificar que sea un número válido
      const numId = parseInt(id);
      if (isNaN(numId) || numId <= 0) {
        throw createHttpError(404, "ID must be a positive number");
      }

      const product = await ProductsManager.getProductById(id);

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getLimitProducts(req, res) {
    try {
      const { category } = req.params;
      const { limit } = req.params;

      if (!limit || limit.trim() === "") {
        throw createHttpError(404, "Limit is required");
      }

      // Verificar que sea un número válido
      const numLimit = parseInt(limit);
      if (isNaN(numLimit) || numLimit <= 0) {
        throw createHttpError(404, "ID must be a positive number");
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

  // static async getCategories(req, res, next) {
  //   try {
  //     console.log("Antes de llamar a getCategories");
  //     const resultCategories = await ProductsManager.getCategories();
  //     console.log("response categories", resultCategories);
  //     res.status(200).json(resultCategories);
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async addProduct(req, res, next) {
    let uploadFiles = []; // Array para guardar los nombres de los uploads existentes

    try {
      const productBody = req.body;
      const files = req.files; // Data de las images
      const allProducts = await ProductsManager.readDB(); //Data actual de productos en DB

      if (!productBody) {
        throw createHttpError(404, "Product and product details are required");
      }

      // Se guardan los nombres de los files temp
      uploadFiles = files.map((file) => file.path);

      // Validacion de que el codigo no este repetido
      if (allProducts.some((p) => p.code === productBody.code)) {
        throw createHttpError(
          404,
          `The code ${productBody.code} is already registered`
        );
      }

      //Verificar que el producto tenga un valor minimo de stock
      const numStock = parseInt(productBody.stock);
      if (isNaN(numStock) || numStock <= 0) {
        throw createHttpError(
          404,
          "The quantity in stock must be a minimum of 1"
        );
      }

      let thumbnails;

      if (files || files.length === 0) {
        // Mapeo de las rutas de las imagenes
        thumbnails = files.map((file) => `${ruteImages}/${file.filename}`);
      }

      thumbnails = [`${ruteImages}/default.webp`];

      // Se crea el product Data con los datos del body y el nuevo array de thumbnails
      const productData = {
        ...productBody,
        price: parseFloat(productBody.price),
        stock: parseInt(productBody.stock),
        status: true,
        thumbnails: thumbnails,
      };

      const resultAddProduct = await ProductsManager.addProduct(productData);
      res.status(200).json(resultAddProduct);
    } catch (error) {
      // Si hay error se elminan los archivos que se hayan subido a la carpeta uploads
      if (uploadFiles.length > 0) {
        await Promise.all(
          uploadFiles.map(async (filePath) => {
            try {
              await fs.unlink(filePath); // Eliminar file fisico
            } catch (unlinkError) {
              console.error("Error deleting file:", unlinkError);
            }
          })
        );
      }
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { pid } = req.query;
      const productBody = req.body;

      if (!pid || pid.trim() === "" || !productBody) {
        throw createHttpError(404, "Product id & details are required");
      }

      // Verificar que sea un número válido
      const numPid = parseInt(pid);
      if (isNaN(numPid) || numPid <= 0) {
        throw createHttpError(404, "ID must be a positive number");
      }

      const resultUpdatedProduct = await ProductsManager.updateProduct(
        pid,
        productBody
      );
      res.status(200).json(resultUpdatedProduct);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { pid } = req.query;

      if (!pid || pid.trim() === "") {
        throw createHttpError(404, "ID is required");
      }

      // Verificar que sea un número válido
      const numPid = parseInt(pid);
      if (isNaN(numPid) || numPid <= 0) {
        throw createHttpError(404, "ID must be a positive number");
      }

      const newProducts = await ProductsManager.deleteProduct(pid);
      res.status(200).json({
        success: true,
        message: newProducts,
      });
    } catch (error) {
      next(error);
    }
  }
}
