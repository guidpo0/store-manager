const {
  UNPROCESSABLE_ENTITY_STATUS, INTERNAL_SERVER_ERROR_STATUS, NOT_FOUND_STATUS,
} = require('../helpers/HTTPCodes');

const SalesErrorController = (err, _req, res, _next) => {
  if (err.isJoi) {
    const error = { code: 'invalid_data', message: 'Wrong product ID or invalid quantity' };
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({ err: error });
  }
  if (err.code === 'invalid_data') {
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({ err });
  }
  if (['not_found', 'stock_problem'].includes(err.code)) {
    return res.status(NOT_FOUND_STATUS).json({ err });
  }
  const serverError = { code: 'internal_error', message: 'Erro de servidor' };
  res.status(INTERNAL_SERVER_ERROR_STATUS).json({ err: serverError });
};

module.exports = SalesErrorController;
