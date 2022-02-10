const {body} = require('express-validator');
const {validationResult} = require('express-validator');




exports.validateSignup = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(), 
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(), 
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max: 64})];

exports.validateLogIn =[body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 charcters and at most 64 characters').isLength({min: 8, max: 64})];


exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
        if(!errors.isEmpty()) {
            errors.array().forEach(error=>{
                req.flash('error', error.msg);
            });
            return res.redirect('back');
        } else {
            return next();
        }
}

exports.validateStory = [body('title').notEmpty().trim().escape(), body('content').isLength({min: 10}).trim().escape()];