const { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR } = require('../helpers/HTTPCodes');

const ErrorController = (err, _req, res, _next) => {
  if (err.isJoi) {
    const { message } = err.details[0]; 
    const error = { code: 'invalid_data', message };
    return res.status(UNPROCESSABLE_ENTITY).json({ error });
  }
  if (err.code === 'invalid_data') {
    return res.status(UNPROCESSABLE_ENTITY).json({ error: err });
  }
  const serverError = { code: 'internal_error', message: 'Erro de servidor' };
  res.status(INTERNAL_SERVER_ERROR).json({ error: serverError });
};

module.exports = ErrorController;
