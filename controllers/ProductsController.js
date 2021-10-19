const Joi = require('joi');
const ProductsService = require('../services/ProductsService');

const create = async (req, res, next) => {
  const { error } = Joi.object({
    name: Joi.string().min(6).required(),
    quantity: Joi.number().integer().min(1).required(),
  }).validate(req.body);
  if (error) next(error);
  const { name, quantity } = req.body;
  const newProduct = await ProductsService.create({ name, quantity });
  if (newProduct.error) return next(newProduct.error);
  return res.status(201).json(newProduct.id);
};

module.exports = {
  create,
};
