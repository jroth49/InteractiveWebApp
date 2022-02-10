const model = require('../models/user');
const Story = require('../models/story');
const rsvp = require('../models/rsvp');

exports.new = (req, res)=>{
        return res.render('./signup');
};

exports.create = (req, res, next)=>{
    //res.send('Created a new story');
        let user = new model(req.body);//create a new story document
        if(user.email) {
            user.email = user.email.toLowerCase();
        }
        user.save()//insert the document to the database
        .then(user=> res.redirect('/login'))
        .catch(err=>{
            if(err.name === 'ValidationError' ) {
                req.flash('error', err.message);  
                return res.redirect('./users/signup');
            }

            if(err.code === 11000) {
                req.flash('error', 'Email has been used');  
                return res.redirect('./users/signup');
            }
            next(err);
        }); 
 
    
};

exports.getUserLogin = (req, res, next) => {
        res.render('./login');
}

exports.login = (req, res, next)=>{
        let email = req.body.email;
        if(email) {
            email = email.toLowerCase();
        }
        let password = req.body.password;
        model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'wrong email address');  
                res.redirect('/users/login');
                } else {
                user.comparePassword(password)
                .then(result=>{
                    if(result) {
                        req.session.user = user._id;
                        req.flash('success', 'You have successfully logged in');
                        res.redirect('/users/profile');
                    } else {
                        req.flash('error', 'wrong password');      
                        res.redirect('/users/login');
                    }
                });     
            }     
        })
        .catch(err => next(err));
        
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Story.find({author: id})]) 
    .then(results=> {
        const [user, stories] = results;
        res.render('./profile', {user, stories});
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



