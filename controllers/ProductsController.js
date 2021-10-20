const Joi = require('joi');
const ProductsService = require('../services/ProductsService');
const { CREATED } = require('../helpers/HTTPCodes');

const create = async (req, res, next) => {
  const { error } = Joi.object({
    name: Joi.string().min(5).required(),
    quantity: Joi.number().integer().min(1).required(),
  }).validate(req.body);
  if (error) next(error);
  const { name, quantity } = req.body;
  const { id, error: alreadyExistsError } = await ProductsService.create({ name, quantity });
  if (alreadyExistsError) next(alreadyExistsError);
  return res.status(CREATED).json({ id, name, quantity });
};

module.exports = {
  create,
};
