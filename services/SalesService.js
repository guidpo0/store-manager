const ProductsModel = require('../models/ProductsModel');
const SalesModel = require('../models/SalesModel');

const create = async (products) => {
  let existingProduct = true;
  await products.forEach(async ({ productId }) => {
    const idQuery = await ProductsModel.getById(productId);
    if (!idQuery) existingProduct = false;
  });
  if (!existingProduct) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong Product Id or invalid quantity',
      },
    };
  }
  return SalesModel.create(products);
};

const getAll = async () => SalesModel.getAll();

const getById = async (_id) => {
  const sale = await SalesModel.getById(_id);
  if (!sale) {
    return {
      err: {
        code: 'not_found',
        message: 'Sale not found',
      },
    };
  }
  return sale;
};

const update = async ({ _id, itensSold }) => {
  const sale = await SalesModel.update({ _id, itensSold });
  if (!sale) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      },
    };
  }
  return sale;
};

const remove = async (id) => {
  const sale = await SalesModel.remove(id);
  if (!sale) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      },
    };
  }
  return sale;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
