const mongoose = require('mongoose');
const Scehma = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: [true, 'cannot be empty']},
    lastName: {type: String, required: [true, 'cannot be empty']},
    email: {type: String, required: [true, 'cannot be empty'], unique: true},
    password: {type: String, required: [true, 'cannot be empty']}
});

//replace plaintext password with hashed password before saving the document in the database

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) 
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

//implement a method compare the lgoin password and the hash store din the database

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);