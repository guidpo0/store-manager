const Joi = require('joi');
const SalesService = require('../services/SalesService');
const { CREATED, OK } = require('../helpers/HTTPCodes');

const create = async (req, res, next) => {
  const { error } = Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    }),
  ).validate(req.body);
  if (error) return next(error);
  const { body } = req;
  const { _id, itensSold, err: productDoesntExistsError } = await SalesService.create(body);
  if (productDoesntExistsError) return next(productDoesntExistsError);
  return res.status(OK).json({ _id, itensSold });
};

// const getAll = async (_req, res, _next) => {
//   const products = await ProductsService.getAll();
//   return res.status(OK).json({ products });
// };

// const getById = async (req, res, next) => {
//   const { id } = req.params;
//   const product = await ProductsService.getById(id);
//   const { err } = product;
//   if (err) return next(err);
//   return res.status(OK).json(product);
// };

// const update = async (req, res, next) => {
//   const { error } = Joi.object({
//     name: Joi.string().min(5).required(),
//     quantity: Joi.number().integer().min(1).required(),
//   }).validate(req.body);
//   if (error) return next(error);
//   const { name, quantity } = req.body;
//   const { id } = req.params;
//   const { _id, err: invalidId } = await ProductsService.update({ _id: id, name, quantity });
//   if (invalidId) return next(invalidId);
//   return res.status(OK).json({ _id, name, quantity });
// };

// const remove = async (req, res, next) => {
//   const { id } = req.params;
//   const product = await ProductsService.remove(id);
//   const { err } = product;
//   if (err) return next(err);
//   return res.status(OK).json(product);
// };

module.exports = {
  create,
  // getAll,
  // getById,
  // update,
  // remove,
};
