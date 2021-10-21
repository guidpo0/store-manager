const SalesModel = require('../../models/SalesModel');
const ProductsModel = require('../../models/ProductsModel');
const { INVALID_DATA_ERROR, INVALID_QUANTITY_ERROR } = require('../../helpers/errorsCodes');

const getProductByIdToArray = (products) => Promise.all(
  products.map(({ productId }) => ProductsModel.getById(productId)),
);

const hasListsSameProductsIds = (oldItensSold, newItensSold) => {
  if (oldItensSold.length !== newItensSold.length) return false;
  return oldItensSold.every(({ productId: idActual }) => (newItensSold.find(
    ({ productId: idToUpdate }) => idActual === idToUpdate,
  )));
};

const mixArraysWithSameProductsIds = (firstArray, secondArray) => firstArray.map(
  ({ productId: idActual, quantity: quantityActual }) => {
    const { quantity: quantityToUpdate } = secondArray.find(
      ({ productId: idToUpdate }) => idActual === idToUpdate,
    );
    return { productId: idActual, quantity: quantityToUpdate - quantityActual }; 
  },
);

const validateRepeatedProducts = (itensSold) => {
  const repeated = itensSold.some(({ productId: productIdOne }, indexOne) => itensSold.some(
    ({ productId: productIdTwo }, indexTwo) => {
      if ([indexOne, itensSold.length - 1].includes(indexTwo)) return false;
      return productIdOne === productIdTwo;
    },
  ));
  if (!repeated) return { valid: true };
  return INVALID_DATA_ERROR;
};

const validateProductsIds = async (itensSold) => {
  const productsInfo = await getProductByIdToArray(itensSold);
  const areAllIdsValid = productsInfo.every((product) => product !== null);
  if (areAllIdsValid) return { valid: true };
  return INVALID_DATA_ERROR;
};

const validateSaleId = async (id) => {
  const sale = await SalesModel.getById(id);
  if (!sale) return INVALID_DATA_ERROR;
  return { valid: true };
};

const validateQuantitiesToCreate = async (itensSold) => {
  const productsInfo = await getProductByIdToArray(itensSold);
  const areAllQuantitiesValid = productsInfo.every(
    ({ quantity }, index) => quantity - itensSold[index].quantity >= 0,
  );
  if (areAllQuantitiesValid) {
    await Promise.all(productsInfo.map(({ name, quantity }, index) => {
      const { _id, quantity: saleQuantity } = itensSold[index];
      return ProductsModel.update({ _id, name, quantity: quantity - saleQuantity });
    }));
    return { valid: true };
  }
  return INVALID_QUANTITY_ERROR;
};

const validateQuantitiesToUpdate = async (id, itensSoldToUpdate) => {
  const { itensSold: itensSoldActual } = await SalesModel.getById(id);
  if (!hasListsSameProductsIds(itensSoldActual, itensSoldToUpdate)) return INVALID_DATA_ERROR;
  const itensMixed = mixArraysWithSameProductsIds(itensSoldActual, itensSoldToUpdate);
  const productsInfo = await getProductByIdToArray(itensMixed);
  const areAllQuantitiesValid = productsInfo.every(
    ({ quantity }, index) => quantity - itensMixed[index].quantity >= 0,
  );
  if (areAllQuantitiesValid) {
    await Promise.all(productsInfo.map(({ name, quantity }, index) => {
      const { _id, quantity: saleQuantity } = itensMixed[index];
      return ProductsModel.update({ _id, name, quantity: quantity - saleQuantity });
    }));
    return { valid: true };
  }
  return INVALID_QUANTITY_ERROR;
};

const validateQuantitiesToRemove = async (itensSold) => {
  const productsInfo = await getProductByIdToArray(itensSold);
  await Promise.all(productsInfo.map(({ name, quantity }, index) => {
    const { _id, quantity: saleQuantity } = itensSold[index];
    return ProductsModel.update({ _id, name, quantity: quantity + saleQuantity });
  }));
};

module.esports = {
  validateRepeatedProducts,
  validateProductsIds,
  validateSaleId,
  validateQuantitiesToCreate,
  validateQuantitiesToUpdate,
  validateQuantitiesToRemove,
};
