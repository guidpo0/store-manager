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
  const product = await ProductsModel.getById(_id);
  if (!product) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    };
  }
  return product;
};

const update = async ({ _id, name, quantity }) => {
  const product = await ProductsModel.update({ _id, name, quantity });
  if (!product) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    };
  }
  return product;
};

const remove = async (id) => {
  const product = await ProductsModel.remove(id);
  if (!product) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    };
  }
  return product;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
