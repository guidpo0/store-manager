const ProductsModel = require('../models/ProductsModel');

const create = async ({ name, quantity }) => {
  const products = await ProductsModel.getAll();
  const existingProduct = products.some((product) => product.name === name);
  if (existingProduct) {
    return {
      error: {
        code: 'invalid_data',
        message: 'Product already exists',
      },
    };
  }
  return ProductsModel.create({ name, quantity });
};

module.exports = {
  create,
};
