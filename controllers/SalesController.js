const Joi = require('joi');
const SalesService = require('../services/SalesService');
const { OK_STATUS } = require('../helpers/HTTPCodes');

const create = async (req, res, next) => {
  const { error: JoiError } = Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    }),
  ).validate(req.body);
  if (JoiError) return next(JoiError);
  const { body } = req;
  const { _id, itensSold, err: serviceError } = await SalesService.create(body);
  if (serviceError) return next(serviceError);
  return res.status(OK_STATUS).json({ _id, itensSold });
};

const getAll = async (_req, res, _next) => {
  const sales = await SalesService.getAll();
  return res.status(OK_STATUS).json({ sales });
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const sale = await SalesService.getById(id);
  const { err } = sale;
  if (err) return next(err);
  return res.status(OK_STATUS).json(sale);
};

const update = async (req, res, next) => {
  const { error } = Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    }),
  ).validate(req.body);
  if (error) return next(error);
  const { body } = req;
  const { id } = req.params;
  const { _id, err: invalidId } = await SalesService.update({ _id: id, itensSold: body });
  if (invalidId) return next(invalidId);
  return res.status(OK_STATUS).json({ _id, itensSold: body });
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const sale = await SalesService.remove(id);
  const { err } = sale;
  if (err) return next(err);
  return res.status(OK_STATUS).json(sale);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
