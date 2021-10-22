module.exports = {
  INVALID_DATA_ERROR: {
    err: {
      code: 'invalid_data',
      message: 'Wrong Product Id or invalid quantity',
    },
  },
  INVALID_SALE_ERROR: {
    err: {
      code: 'invalid_data',
      message: 'Wrong sale ID format',
    },
  },
  NOT_FOUND_ERROR: {
    err: {
      code: 'not_found',
      message: 'Sale not found',
    },
  },
  INVALID_QUANTITY_ERROR: {
    err: {
      code: 'stock_problem',
      message: 'Such amount is not permitted to sell',
    },
  },
};
