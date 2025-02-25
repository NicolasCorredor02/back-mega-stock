import fs from "fs/promises";
import path from "path";

const ruteDB = path.resolve("src/db/products.json");

export class ProductsManager {
  static requiredFields = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
  ];

  /**
   *
   * @returns {array} array with products
   */
  static async readDB() {
    const data = await fs.readFile(ruteDB, "utf-8");
    if (!data) return [];
    return JSON.parse(data);
  }

  /**
   *
   * @param {array} products
   * @returns {boolean}
   */
  static async writeDB(products) {
    try {
      if (!products) {
        return false;
      }

      await fs.writeFile(ruteDB, JSON.stringify(products, null, 2));

      return true;
    } catch (error) {
      throw new Error("Error when saving or updating product(s)");
    }
  }

  /**
   *
   * @param {string} category
   * @returns {array} All products or all products by category
   */
  static async getProducts(category) {
    try {
      const allProducts = await this.readDB();
      if (!allProducts) {
        throw new Error("No products found");
      }

      if (category) {
        const categoryFormated = category.toLowerCase();
        const productsByCategory = allProducts.filter(
          (p) => p.category === categoryFormated
        );

        if (!productsByCategory) {
          throw new Error("No products found for this category");
        }

        return productsByCategory;
      }

      return allProducts;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {number} id
   * @returns {object} Object finded by id
   */
  static async getProductById(id) {
    try {
      const allProducts = await this.readDB();
      console.log("Products", allProducts);

      if (!allProducts) {
        throw new Error("No products found");
      }

      const product = allProducts.find((p) => p.id === parseInt(id));

      if (!product) {
        throw new Error(`Error: Product with id: ${id}, not found.`);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {number} limit
   * @param {string} category
   * @returns {array} Array with objects
   */
  static async getLimitProducts(limit, category) {
    try {
      const allProducts = await this.readDB();
      if (!allProducts) {
        throw new Error("No products found");
      }

      if (!limit) {
        throw new Error("Error, the search limit is required");
      }

      const limitFormated = parseInt(limit);

      if (limitFormated > allProducts.length) {
        throw new Error(
          "The amount of data requested is greater than the amount of products"
        );
      }

      // Si se agrega una categoria se retornan un limite de productos de esa categoria
      if (category) {
        const productsCategory = await this.getProducts(category);

        if (limitFormated > productsCategory.length) {
          throw new Error(
            "The amount of data requested is greater than the amount of products"
          );
        }

        const productsCategoryLimited = productsCategory.slice(
          0,
          limitFormated
        );

        return productsCategoryLimited;
      }

      // Se limita el array de acuerdo a la cantidad solicitada
      const allProductsLimited = allProducts.slice(0, limitFormated);
      return allProductsLimited;
    } catch (error) {
      throw error;
    }
  }

  //static async getCategories() {
  //   console.log("Metodo getCategories iniciado");

  //   try {
  //     const allProducts = await this.readDB();
  //     console.log("All products", allProducts);

  //     if (!allProducts) {
  //       throw new Error("No products found");
  //     }
  //     // Se sacan todas las categorias de todos los objetos en un nuevo array
  //     const categories = allProducts.map((p) => p.category);
  //     console.log("All categories", categories);

  //     if (!categories || categories.length === 0) {
  //       throw new Error("Error obtaining general categories");
  //     }

  //     /**
  //      * Se aplica un new Set(array) para eliminar valores duplicados
  //      * Se usa spread operator ... para transformar cada propiedad del objeto SET en un espacio del array
  //      */
  //     const categorySingle = [...new Set(categories)];
  //     // const categoryMap = {};
  //     // categories.forEach((category) => {
  //     //   categoryMap[category] = true;
  //     // });

  //     // const categorySingle = Object.keys(categoryMap);

  //     console.log("Single category", categorySingle);

  //     if (!categorySingle || categorySingle.length === 0) {
  //       throw new Error("Error when obtaining the categories");
  //     }

  //     return categorySingle;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  /**
   *
   * @param {object} product
   * @returns {object} new product added
   */
  static async addProduct(product) {
    try {
      const allProducts = await this.readDB();

      // Validacion de existencia de los productos en la DB
      if (!allProducts) {
        throw new Error("No products found");
      }

      // Validación de los campos obligatorios
      for (const requiredField of this.requiredFields) {
        if (!(requiredField in product)) {
          throw new Error(`The ${requiredField} field is required`);
        }
      }

      const newProduct = {
        id: allProducts.length + 1,
        thumbnails: product.thumbnails,
        ...product,
      };

      allProducts.push(newProduct);

      const resultAddProduct = await this.writeDB(allProducts);

      if (!resultAddProduct) {
        throw new Error("The product to be added was not obtained");
      }

      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {number} id
   * @param {object} product
   * @returns {object} objecto updated
   */
  static async updateProduct(id, product) {
    try {
      const allProducts = await this.readDB();

      // Validacion de existencia de los productos en la DB
      if (!allProducts) {
        throw new Error("No products found");
      }

      // //Validacion si el producto viene con id para actualizar
      // if (product.id) {
      //   throw new Error("Error, product ID can not be updated");
      // }

      // Validacion de thumbnails Max 5 images
      if (product.thumbnails && product.thumbnails.length > 5) {
        throw new Error("Maximum 5 images allowed");
      }

      // Se crea una nueva copia del array de productos
      let newAllProducts = [...allProducts];

      // Validacion de que exista el producto el cual se quiere actualizar
      const indice = newAllProducts.findIndex((p) => p.id === parseInt(id));

      // Si no se encuentra el objeto, retornar un msj de error
      if (indice === -1) {
        throw new Error("The product to be updated was not found");
      }

      // // Validacion si la peticion viene con codigo para actualizar
      // if (product?.code) {
      //   // Validacion de que el codigo no este repetido
      //   if (newAllProducts.some((p) => p.code === product.code)) {
      //     throw new Error(
      //       "Failed to update the product, code already existing"
      //     );
      //   }
      // }

      // Se actualizan los datos proporsionados
      newAllProducts[indice] = {
        ...newAllProducts[indice], // Se mantienen los existentes
        ...product, // Se sobreescriben los suministrados
      };

      // Se realiza la actualizacion sobre la DB
      const resultUpdatedProduct = await this.writeDB(newAllProducts);

      if (!resultUpdatedProduct) {
        throw new Error("Product to be upgraded was not obtained");
      }

      return newAllProducts[indice];
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {number} id
   * @returns {string} messagge succes or error
   */
  static async deleteProduct(id) {
    try {
      const allProducts = await this.readDB();

      if (!allProducts) {
        throw new Error("No products found");
      }

      const productToDelete = allProducts.find((p) => p.id === parseInt(id));

      if (!productToDelete) {
        throw new Error("There is no product with the supplied id");
      }

      const indice = allProducts.findIndex((p) => p.id === parseInt(id));

      if (indice === -1) {
        throw new Error("The product to be removed was not found");
      }

      const newAllProducts = [...allProducts];

      newAllProducts.splice(indice, 1);

      //   newAllProducts[indice] = {
      //     ...newAllProducts[indice],
      //     status: false,
      //   };

      const resultDeleteProduct = await this.writeDB(newAllProducts);

      if (!resultDeleteProduct) {
        throw new Error("The product to be removed was not found");
      }

      return "Product successfully removed";
    } catch (error) {
      throw error;
    }
  }
}
