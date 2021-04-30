// Validation
const Joi = require('joi');

// Register Validation
const registerValidation = (data) => {

    console.log(data);

    /*const schema = Joi.object({
        name: Joi.string().min(1).required(),
        surname: Joi.string().required(),
        institution: Joi.string().min(1).optional(),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(8).required()
    });*/
    
    // For testing
    const schema = Joi.object({
        name: Joi.string().min(1),
        surname: Joi.string().min(1),
        institution: Joi.string().min(1).optional(),
        email: Joi.string().min(1).required(),
        password: Joi.string().min(1).required()
    });
    console.log("Validating registration");
    return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(1).required()
    });

    console.log("Validating login");
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
