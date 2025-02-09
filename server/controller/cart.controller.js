import fs from "fs/promises";
import path from "path";
import { getAllCarts } from "../managers/cart.manager.js";
import { ProductsManager } from "./product.controller.js";

export class CartManager {
  #requiredFields = ["quantity"];

  constructor() {
    this.rute = path.resolve("./server/db/");
    this.ruteComplete = path.join(this.rute, "carts.json");
    this.productManager = new ProductsManager();
  }

  async updateCarts(carts) {
    try {
      if (!carts) {
        return false;
      }

      await fs.writeFile(this.ruteComplete, JSON.stringify(carts, null, 2));

      return true;
    } catch (error) {
      throw new Error("Error al crear o actualizar el/los carrito(s)");
    }
  }

  async createCart() {
    try {
      const allCarts = await getAllCarts();
      if (!allCarts) {
        throw new Error("No se encontraron carritos");
      }
      const newCart = {
        id: allCarts.length + 1,
        products: [],
      };

      allCarts.push(newCart);

      const resultCreateCart = await this.updateCarts(allCarts);

      if (!resultCreateCart) {
        throw new Error("No se logro crear el carrito");
      }

      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCartProducts(id) {
    try {
      const allCarts = await getAllCarts();
      if (!allCarts) {
        throw new Error("No se encontraron carritos");
      }

      // Se obtiene el carrito a buscar
      const cart = allCarts.find((c) => c.id === parseInt(id));

      if (!cart) {
        throw new Error(`Error: el carrito con el id ${id} no existe`);
      }

      // Si el carrito no tiene productos o está vacío
      if (!cart.products || cart.products.length === 0) {
        return {
          ...cart,
          products: [], // Se retorna un array vacío
        };
      }

      // Funcion para transformar el array de productos, que tiene solo los id a un array con los productos completos
      const cartProducts = async () => {
        // Se usa Promise.all para resolver todas las promesas del map
        const result = await Promise.all(
          cart.products.map(async (p) => {
            // Se retorna el producto obtenido
            const product = await this.productManager.getProductById(
              parseInt(p.id)
            );
            return {
              product: { ...product },
              quantity: p.quantity || 0,
            };
          })
        );

        if (!result) {
          throw new Error(
            "No se encontraron productos con el/los id(s) del carrito"
          );
        }
        return result;
      };

      const resultCartProducts = {
        ...cart,
        products: await cartProducts(),
      };

      if (!resultCartProducts) {
        throw new Error("Error al retornar carrito con informacion solicitada");
      }

      return resultCartProducts;
    } catch (error) {
      throw error;
    }
  }

  async addProductCart(idCart, idProduct, product) {
    try {
      const allCarts = await getAllCarts();

      if (!allCarts) {
        throw new Error("No se encontraron carritos");
      }

      if (!idCart) {
        throw new Error("El id del carrito es obligatorio!");
      }

      if (!idProduct) {
        throw new Error("El id del producto es obligatorio!");
      }

      // Validacion de los campos requeridos para agregar el producto
      for (const requiredField of this.#requiredFields) {
        if (!(requiredField in product)) {
          throw new Error(`El campo ${requiredField} es obligatorio.`);
        }
      }

      // Validacion para saber si el id del carrito existe
      if (!allCarts.find((c) => c.id === parseInt(idCart))) {
        throw new Error(`El carrito con el id ${idCart} no existe`);
      }

      // Se busca el indice del carrito
      const indiceCart = allCarts.findIndex((c) => c.id === parseInt(idCart));

      // Si no se encuentra el objeto, retorna un msj de error
      if (indiceCart === -1) {
        throw new Error(
          "No se encontro el carrito al cual se quiere agregar el producto"
        );
      }

      // Validacion de que el producto que se quiere agregar exista en la base de productos
      const productExist = await this.productManager.getProductById(
        parseInt(idProduct)
      );
      if (!productExist) {
        throw new Error(`Error, el producto con el ${idProduct} no existe`);
      }

      // Se formatea el producto ya que puede venir como String
      const productFormated = {
        id: parseInt(idProduct),
        quantity: parseInt(product.quantity),
      };

      // Se obtiene el carrito al que se quiere agregar productos
      const cart = allCarts.find((c) => c.id === parseInt(idCart));

      let newCart = { ...cart }; // Se crea una copia del carrito
      let productFound = false; // Variable para rastrear si el producto se encuentra en el carrito

      // Validacion sobre el producto a agregar y en caso de existir, aumentar la cantidad en 1
      for (const [indice, p] of cart.products.entries()) {
        if (p.id === parseInt(idProduct)) {
          productFound = true;

          // Se crea una copia de los productos del carrito
          const newProducts = [...cart.products];

          // Se actualizan los datos proporsionados
          newProducts[indice] = {
            ...newProducts[indice], // Se mantienen los existentes
            quantity: newProducts[indice].quantity + 1, // Se aumenta la cantidad en 1 ya que existe
          };

          // Se actualiza el carrito
          newCart = {
            ...cart,
            products: newProducts,
          };

          break; // Se finaliza el for...of ya que se encontro un producto con el mismo ID
        }
      }

      // Si no se ecuentra el producto, se agrega al carrito
      if (!productFound) {
        newCart.products.push(productFormated);
      }

      const newAllCarts = [...allCarts];

      // Se actualizan los datos proporsionados
      newAllCarts[indiceCart] = {
        ...newCart, // Se sobreescriben los datos del carrito actualizado
      };

      const resultUpdateCart = await this.updateCarts(newAllCarts);

      if (!resultUpdateCart) {
        throw new Error(
          "Error, no se obtuvo el carrito y/o producto a agregar"
        );
      }

      return newAllCarts[indiceCart];
    } catch (error) {
      throw error;
    }
  }
}
