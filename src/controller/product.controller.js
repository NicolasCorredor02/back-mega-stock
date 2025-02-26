import { ProductsManager } from "root/managers/product.manager.js";
import createHttpError from "http-errors";
import fs from "fs/promises";
import path from "path";
import { rootPath } from "root/utils/paths.js";

// Ruta para almacenar y guardar las imagenes de los productos
// const projectRoot = path.resolve(__dirname, "../../");
const ruteImages = path.resolve(rootPath, "uploads");

// Ruta de la imgen por default para productos que se crean sin imagenes
const defaultImageRute = path.resolve(rootPath, "assets", "default", "images");

/**
 * TODO actualizar la validacion de los id como con updateProduct
 */

export class ProductsController {
  static async getProducts(req, res, next) {
    try {
      const { category } = req.params;

      // let products;
      let context = {};

      if (category) {
        context = {
          category,
          products: await ProductsManager.getProducts(category),
        };
      }
      context = {
        products: await ProductsManager.getProducts(),
      };

      return res.render("products", context);

      // if (category) {
      //   products =  await ProductsManager.getProducts(category);
      // } else {
      //   products = await ProductsManager.getProducts();
      // }
      // res.status(200).json(products);
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

      if (!files || files.length === 0) {
        thumbnails = [`${defaultImageRute}/default-product.webp`];
      } else {
        // Mapeo de las rutas de las imagenes
        thumbnails = files.map((file) => `${ruteImages}/${file.filename}`);
      }

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
    const files = req.files;
    let newUploadFiles = files ? files.map((file) => file.path) : []; // Array para guardar los nombres de los uploads existentes

    try {
      const { pid } = req.params;
      const productBody = req.body;
      const deleteImages = JSON.parse(productBody.deleteImages || "[]"); // URLS de las imagenes a eliminar
      const allProducts = await ProductsManager.readDB(); //Data actual de productos en DB

      // Validación del ID
      if (!pid || pid.trim() === "" || isNaN(pid) || parseInt(pid) <= 0) {
        throw createHttpError(400, "Invalid ID");
      }

      //Validacion si el producto viene con id para actualizar
      if (productBody.id) {
        throw createHttpError(404, "Error, product ID can not be updated");
      }

      // Validacion si la peticion viene con codigo para actualizar
      if (productBody.code) {
        // Validacion de que el codigo no este repetido
        const existingProduct = allProducts.find(
          (p) => p.code === productBody.code
        );
        if (existingProduct) {
          throw createHttpError(
            404,
            `The code ${productBody.code} is already registered`
          );
        }
      }

      // Encontrar indice del producto a actualizar
      const productIndex = allProducts.findIndex((p) => p.id === parseInt(pid));

      if (productIndex === -1) {
        throw createHttpError(404, "Product not found");
      }

      // Se almacena el producto especifico que se quiere actualizar
      const currentProduct = { ...allProducts[productIndex] };

      // Antes de eliminar archivos: Este código asegura que solo se eliminen imágenes válidas, evitando errores comunes como índices inválidos o rutas inexistentes
      const imagesToDelete = deleteImages
        .filter((item) => !isNaN(item)) // Filtra índices numéricos para obtener solo elementos que pueden ser numeros o lo son ya
        .map((index) => currentProduct.thumbnails[index]) // Obtiene rutas reales convierte el indice resultante anteriormente en la ruta correspondiente al array thumbnails del producto a actualizar
        .filter((path) => path !== undefined); // Elimina índices inválidos que no existan en el array de thumbnails del producto, retornando un valor undefind
      // Solo quedara un array con las rutas de los indices correspondientes

      // Eliminacion fisica de imagenes sobre la carpeta uploads
      await Promise.all(
        imagesToDelete.map(async (imgPath) => {
          console.log("imgPath:", imgPath);
          console.log(path.basename(imgPath));

          try {
            const fileName = path.basename(imgPath);
            await fs.unlink(path.join(ruteImages, fileName)); // Se toma el path de la imgen en ciclo
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        })
      );

      // Eliminacion de rutas thumbnails sobre el producto actual
      currentProduct.thumbnails = currentProduct.thumbnails.filter(
        (imgPath, index) =>
          !deleteImages.includes(index.toString()) && // Se usa toString() ya que desde la solicitud el array de deleteImages viene como String y aca se tienen en cuenta los indices para eliminar
          !deleteImages.includes(imgPath) && // Aca se validan las URLs de las imagenes que vienen en el array de deleteImages en caso de coincidir con las URLs del producto a actualizar
          !deleteImages.includes(path.basename("default-product.webp"))
      );

      // Añadir nuevas imagenes
      if (files && files.length > 0) {
        newUploadFiles = files.map((file) => file.path);
        const newImages = files.map((file) => `${ruteImages}/${file.filename}`);

        // Validacion del maximo de 5 imagenes
        const totalImages = currentProduct.thumbnails.length + newImages.length;
        if (totalImages > 5) {
          throw createHttpError(400, "Maximum 5 images per product");
        }

        currentProduct.thumbnails = [
          ...currentProduct.thumbnails,
          ...newImages,
        ];
      }

      // Actualizacion de otros campos
      const updatedProduct = {
        ...currentProduct,
        ...productBody,
        price: productBody.price
          ? parseFloat(productBody.price)
          : currentProduct.price,
        stock: productBody.stock
          ? parseInt(productBody.stock)
          : currentProduct.stock,
      };

      // Eliminacion del array deleteImages que se usa para especificar las imagenes a eliminar desde la peticion Http
      delete updatedProduct.deleteImages;

      const resultUpdatedProduct = await ProductsManager.updateProduct(
        pid,
        updatedProduct
      );
      res.status(200).json(resultUpdatedProduct);
    } catch (error) {
      if (newUploadFiles.length > 0) {
        await Promise.all(
          newUploadFiles.map(async (filePath) => {
            try {
              await fs.unlink(filePath);
            } catch (unlinkError) {
              console.error("Error deleting new image(s):", unlinkError);
            }
          })
        );
      }
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
