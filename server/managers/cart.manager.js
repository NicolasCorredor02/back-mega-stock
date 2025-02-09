import carts from "../db/carts.json" with { type: "json"};

const getAllCarts = async () => {
  return await carts.length ? carts : null;
};

export { getAllCarts }
