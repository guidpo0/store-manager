const ProductsModel = require('../models/ProductsModel');

const create = async (name, quantity) => {
  const existingProduct = ProductsModel.findByName(name);
  if (existingProduct.length > 0) {
    return {
      error: {
        code: 'alreadyExists',
        message: 'Um produto já existe com esse nome',
      },
    };
  }
  return ProductsModel.create(name, quantity);
};

module.exports = {
  create,
};
