//require modules
const express = require('express');
const morgan = require('morgan');
const storyRoutes = require('./routes/storyRoutes');
const methodOverride = require('method-override');
const { initCollection } = require('./models/story');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');
app.set('views', 'views');

//connect to database
mongoose.connect('mongodb://localhost:27017/demos', {usedNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));



//COOKIES

app.use(session({
    secret: 'ssdlfkfsdgjerotiy509',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'})
}));


app.use(flash());


app.use((req, res, next)=>{
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});


//set up routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});

//get the sign up form
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/', (req, res, next) => {
    let user = new User(req.body);
    user.save()
    .then(()=>res.render('login'))
    .catch(err=>{
        console.log("SIGNUP ERROR");
        req.flash('error', 'Duplicate Email');
        res.redirect('./signup')
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
    //authenticate user's login request
    let email = req.body.email;
    let password = req.body.password;
    //get the user that matches the email
    User.findOne({email: email})
    .then(user=>{
        if(user) {
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You logged in!');
                    res.redirect('/profile');
                } else {
                    console.log('wrong password');
                    req.flash('error', 'Wrong Password');
                    res.redirect('/login');
                }
            })
        } else {
            console.log('wrong email address');
            req.flash('error', 'Wrong email address');
            res.redirect('/login');
        }
    })
    .catch(err=>next(err));
})

app.get('/profile', (req, res, next)=>{
    let id = req.session.user;
    console.log(req.flash());
    User.findById(id)
    .then(user=>res.render('profile', {user}))
    .catch(err=>next(err));
});

app.get('/logout', (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    })
});



app.use('/stories', storyRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next)=>{
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
}); 
