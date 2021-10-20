const ProductsModel = require('../models/ProductsModel');

const create = async ({ name, quantity }) => {
  const products = await ProductsModel.getAll();
  const existingProduct = products.some((product) => product.name === name);
  if (existingProduct) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Product already exists',
      },
    };
  }
  return ProductsModel.create({ name, quantity });
};

const getAll = async () => ProductsModel.getAll();

const getById = async (_id) => {
  const product = await ProductsModel.getById();
  if (existingProduct) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Product already exists',
      },
    };
  }
  return ProductsModel.create({ name, quantity });
};

module.exports = {
  create,
  getAll,
  getById,
};
