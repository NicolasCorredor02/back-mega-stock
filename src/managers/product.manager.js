/* eslint-disable no-useless-catch */
import mongoose from 'mongoose'
import Product from 'root/models/product.model.js'
// import fs from 'fs/promises'
// import path from 'path'
// import { rootPath } from 'root/utils/paths.js'

// const ruteDB = path.resolve(rootPath, 'db', 'products.json')

export class ProductsManager {
  /**
   *
   * @param {string} category
   * @returns {array} All products or all products by category
   */
  static async getProducts (category) {
    try {
      const filter = category ? { category: category.toLocaleLowerCase() } : {}
      return await Product.find(filter).lean()
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} id
   * @returns {object} Object finded by id
   */
  static async getProductById (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const product = await Product.findById(id).lean()
      if (!product) throw new Error('Product not found')
      return product
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} limit
   * @param {string} category
   * @returns {array} Array with objects
   */
  static async getLimitProducts (limit, category) {
    try {
      const options = {
        limit: parseInt(limit) || 10
      }
      const filter = category ? { category: category.toLocaleLowerCase() } : {}
      return await Product.filter(filter, options).lean()
    } catch (error) {
      throw error
    }
  }

  // static async getCategories() {
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
   * @param {object} productData
   * @returns {object} new product added
   */
  static async addProduct (productData) {
    try {
      const newProduct = new Product(productData)
      await newProduct.save()
      return newProduct
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {string} id
   * @param {object} updates
   * @returns {object} objecto updated
   */
  static async updateProduct (id, updates) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      )

      if (!updatedProduct) throw new Error('Product not found')
      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {String} id
   * @returns {object} Objecto con el nuevo status
   */
  static async changeStatus (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const changedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { status: false } },
        { new: true, runValidators: true }
      )
      if (!changedProduct) throw new Error('Product not found')
      return changedProduct
    } catch (error) {
      throw error
    }
    // try {
    //   const allProducts = await this.readDB()

    //   if (!allProducts) {
    //     throw new Error('No products found')
    //   }

    //   const productToDelete = allProducts.find((p) => p.id === parseInt(id))

    //   if (!productToDelete) {
    //     throw new Error('There is no product with the supplied id')
    //   }

    //   const indice = allProducts.findIndex((p) => p.id === parseInt(id))

    //   if (indice === -1) {
    //     throw new Error('The product to be removed was not found')
    //   }

    //   const newAllProducts = [...allProducts]

    //   newAllProducts.splice(indice, 1)

    //   //   newAllProducts[indice] = {
    //   //     ...newAllProducts[indice],
    //   //     status: false,
    //   //   };

    //   const resultDeleteProduct = await this.writeDB(newAllProducts)

    //   if (!resultDeleteProduct) {
    //     throw new Error('The product to be removed was not found')
    //   }

    //   return 'Product successfully removed'
    // } catch (error) {
    //   throw error
    // }
  }

  /**
   * @param {String} id
   * @returns {object} Objecto eliminado
   */
  static async deleteProduct (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const deletedProduct = await Product.findByIdAndDelete(id)
      if (!deletedProduct) throw new Error('Product not found')
      return deletedProduct
    } catch (error) {
      throw error
    }
  }
}
