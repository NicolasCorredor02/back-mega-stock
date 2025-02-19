import products from "../db/products.json" with { type: "json"};

const getAllProducts = async () => {
    return await products.length ? products : null;
};

export { getAllProducts };