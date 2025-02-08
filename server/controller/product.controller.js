import fs from "fs/promises";
import path from "path";
import { getAllProducts } from "../managers/product.manager.js";

/**
 * TODO Revisar consigna para arreglar detalles de los datos solicitados y almacenados y restante
 */
export class ProductsManager {
  #requiredFields = [
    "title",
    "description",
    "price",
    "code",
    "stock",
    "thumbnail",
  ];

  constructor() {
    this.rute = path.resolve('./server/db/');
    this.ruteComplete = path.join(this.rute, "products.json");
  }

  async updateProducts(products) {
    try {
      
      if (!products) {
        return false;
      }

      await fs.writeFile(this.ruteComplete, JSON.stringify(products, null, 2));

      return true;
    } catch (error) {
      throw new Error("Error al guardar o actualizar el/los producto(s):");
    }
  }

  async getProducts() {
    try {
      const allProducts = await getAllProducts();
      if (!allProducts) {
        throw new Error("No se encontraron productos");
      }
      return allProducts;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const allProducts = await getAllProducts();
      if (!allProducts) {
        throw new Error("No se encontraron productos");
      }

      const product = allProducts.find((p) => p.id === id);

      if (!product) {
        throw new Error(
          `Error: El producto con el id: ${id}, no se ha encontrado.`
        );
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  async addProduct(product) {
    try {
      const allProducts = await getAllProducts();

      // Validacion de existencia de los productos en la DB
      if (!allProducts) {
        throw new Error("No se encontraron productos");
      }

      // Validación de los campos obligatorios
      for (const requiredField of this.#requiredFields) {
        if (!(requiredField in product)) {
          throw new Error(`El campo ${requiredField} es obligatorio.`);
        }
      }

      // Validacion de que el codigo no este repetido
      if (allProducts.some((p) => p.code === parseInt(product.code))) {
        throw new Error(`El código ${product.code} ya esta registrado.`);
      }

      const newProduct = {
        id: allProducts.length + 1,
        state: true,
        ...product,
      };

      allProducts.push(newProduct);

      const resultAddProduct = await this.updateProducts(allProducts);

      if (!resultAddProduct) {
        throw new Error("No se obtuvo el producto a agregar");
      }

      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, product) {
    try {
      const allProducts = await getAllProducts();

      // Validacion de existencia de los productos en la DB
      if (!allProducts) {
        throw new Error("No se encontraron productos");
      }

      // TODO probar condicional
      //Validacion si el producto viene con id para actualizar
      if (product?.id) {
        throw new Error("Error, no se puede actualizar el ID de un producto");
      }

      // Validacion si la peticion viene con codigo para actualizar
      if (product?.code) {
        // Validacion de que el codigo no este repetido
        if (allProducts.some((p) => p.code === parseInt(product.code))) {
          throw new Error(
            "No se logro actualizar el producto, código ya existente"
          );
        }

        const indice = allProducts.findIndex((p) => p.id === parseInt(id));

        // Si no se encuentra el objeto, retornar el array original
        if (indice === -1) {
          throw new Error("No se encontro el producto a actualizar");
        }

        // Se crea una nueva copia del array de productos
        const newAllProducts = [...allProducts];

        // Se actualizan los datos proporsionados
        newAllProducts[indice] = {
          ...newAllProducts[indice], // Se mantienen los existentes
          ...product, // Se sobreescriben los suministrados
        };

        // Se realiza la actualizacion sobre la DB
        const resultUpdatedProduct = await this.updateProducts(newAllProducts);

        if (!resultUpdatedProduct) {
          throw new Error("No se obtuvo el producto a actualizar");
        }

        return newAllProducts[indice];
      } else {
        const indice = allProducts.findIndex((p) => p.id === parseInt(id));

        if (indice === -1) {
          throw new Error("No se encontro el producto a actualizar");
        }

        const newAllProducts = [...allProducts];

        newAllProducts[indice] = {
          ...newAllProducts[indice],
          ...product,
        };

        const resultUpdatedProduct = await this.updateProducts(newAllProducts);

        if (!resultUpdatedProduct) {
          throw new Error("No se obtuvo el producto a actualizar");
        }

        return newAllProducts[indice];
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const allProducts = await getAllProducts();

      if (!allProducts) {
        throw new Error("No se encontraron productos");
      }

      const productToDelete = allProducts.find((p) => p.id === parseInt(id));

      if (!productToDelete) {
        throw new Error("No existe un producto con el id suministrado");
      }

      const indice = allProducts.findIndex((p) => p.id === parseInt(id));

      if (indice === -1) {
        throw new Error("No se encontro el producto a eliminar");
      }

      const newAllProducts = [...allProducts];

      newAllProducts[indice] = {
        ...newAllProducts[indice],
        state: false,
      };

      const resultDeleteProduct = await this.updateProducts(newAllProducts);

      if (!resultDeleteProduct) {
        throw new Error("No se obtuvo el producto a eliminar");
      }

      return "Producto eliminado exitosamente!";
    } catch (error) {
      throw error;
    }
  }
}
