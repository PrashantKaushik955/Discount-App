const Joi = require('joi');

// Product Purchase Validation
const buyProductValidation = Joi.object({
  productId: Joi.string().required(),
});

module.exports = { buyProductValidation };
