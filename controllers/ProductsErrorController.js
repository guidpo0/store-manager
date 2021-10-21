const {
  UNPROCESSABLE_ENTITY_STATUS, INTERNAL_SERVER_ERROR_STATUS,
} = require('../helpers/HTTPCodes');

const ProductsErrorController = (err, _req, res, _next) => {
  if (err.isJoi) {
    const { message } = err.details[0]; 
    const error = { code: 'invalid_data', message };
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({ err: error });
  }
  if (err.code === 'invalid_data') {
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({ err });
  }
  const serverError = { code: 'internal_error', message: 'Erro de servidor' };
  res.status(INTERNAL_SERVER_ERROR_STATUS).json({ err: serverError });
};

module.exports = ProductsErrorController;
