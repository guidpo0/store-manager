const {
  UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, NOT_FOUND,
} = require('../helpers/HTTPCodes');

const SalesErrorController = (err, _req, res, _next) => {
  if (err.isJoi) {
    const error = { code: 'invalid_data', message: 'Wrong product ID or invalid quantity' };
    return res.status(UNPROCESSABLE_ENTITY).json({ err: error });
  }
  if (err.code === 'invalid_data') {
    return res.status(UNPROCESSABLE_ENTITY).json({ err });
  }
  if (err.code === 'not_found') {
    return res.status(NOT_FOUND).json({ err });
  }
  const serverError = { code: 'internal_error', message: 'Erro de servidor' };
  res.status(INTERNAL_SERVER_ERROR).json({ err: serverError });
};

module.exports = SalesErrorController;
