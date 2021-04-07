// Validation
const Joi = require('joi');

// Register Validation
const registerValidation = (data) => {

    /*const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).required()
    });*/
    
    // For testing
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).required()
    });
    console.log("Validating registration");
    return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {

    /*const schema = Joi.object({
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).required()
    });*/

    // For testing
    const schema = Joi.object({
        email: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(1).required()
    });
    
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
