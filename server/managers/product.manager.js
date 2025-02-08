import products from "../db/products.json" with { type: "json"};

const getAllProducts = async () => {
    if (await products.length) {
        const productsAvalible = products.filter((p) => p.state === true)
        return productsAvalible
    } else {
        return null
    }
};

export { getAllProducts };
