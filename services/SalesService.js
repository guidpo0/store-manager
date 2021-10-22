const SalesModel = require('../models/SalesModel');
const ProductsModel = require('../models/ProductsModel');
const {
  INVALID_DATA_ERROR,
  INVALID_SALE_ERROR,
  NOT_FOUND_ERROR,
} = require('../helpers/errorsCodes');
const {
  validateProductsIds,
  validateSaleId,
  validateQuantitiesToCreate,
  validateQuantitiesToUpdate,
} = require('./validators/salesValidators');

const create = async (products) => {
  const { err: idError } = await validateProductsIds(products);
  if (idError) return { err: idError };

  const { err: quantityError } = await validateQuantitiesToCreate(products);
  if (quantityError) return { err: quantityError };
  return SalesModel.create(products);
};

const getAll = () => SalesModel.getAll();

const getById = async (_id) => {
  const sale = await SalesModel.getById(_id);
  if (!sale) return NOT_FOUND_ERROR;
  return sale;
};

const update = async ({ _id, itensSold }) => {
  const { err: productIdError } = await validateProductsIds(itensSold);
  if (productIdError) return { err: productIdError };

  const { err: saleIdError } = await validateSaleId(_id);
  if (saleIdError) return { err: saleIdError }; 

  const { err: quantityError } = await validateQuantitiesToUpdate(_id, itensSold);
  if (quantityError) return { err: quantityError };

  const sale = await SalesModel.update({ _id, itensSold });
  if (!sale) return INVALID_DATA_ERROR;
  return sale;
};

const remove = async (id) => {
  const sale = await SalesModel.remove(id);
  if (!sale) return INVALID_SALE_ERROR;

  const { itensSold } = sale;
  const productsInfo = await Promise.all(
    itensSold.map(({ productId }) => ProductsModel.getById(productId)),
  );
  await Promise.all(productsInfo.map(({ name, quantity }, index) => {
    const { productId, quantity: saleQuantity } = itensSold[index];
    return ProductsModel.update({ _id: productId, name, quantity: quantity + saleQuantity });
  }));
  return sale;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
