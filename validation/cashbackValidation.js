const Joi = require('joi');

// Validation for fetching cashback history
const cashbackHistoryValidation = Joi.object({
  userId: Joi.string().required(),
});

module.exports = { cashbackHistoryValidation };
