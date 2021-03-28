const Joi = require('@hapi/joi');

const schema = Joi.object({
    email: Joi.string()
        .min(10)
        .max(30)
        .email(),
    
    mobile: Joi.string()
        .alphanum()
        .min(10)
        .max(30),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    });

module.exports = schema;    