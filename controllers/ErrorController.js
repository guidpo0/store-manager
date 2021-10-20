const { UNPROCESSABLE_ENTITY } = require('../helpers/HTTPCodes');

const ErrorController = (err, _req, res, _next) => {
  if (err.isJoi) {
    const { message } = err.details[0]; 
    const error = { code: 'invalid_data', message };
    return res.status(UNPROCESSABLE_ENTITY).json({ error });
  }
  // const status = statusByErrorCode[err.code] || 500;
  // res.status(status).json({ error: { message: err.message } });
};

module.exports = ErrorController;
