const ProductsModel = require('../models/ProductsModel');

const create = async ({ name, quantity }) => {
  const products = await ProductsModel.getAll();
  const existingProduct = products.some((product) => product.name === name);
  if (existingProduct) {
    return {
      error: {
        code: 'invalid_data',
        message: 'Um produto já existe com esse nome',
      },
    };
  }
  return ProductsModel.create({ name, quantity });
};

module.exports = {
  create,
};
