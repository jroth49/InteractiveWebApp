const model = require('../models/story');
const rsvpModel = require('../models/rsvp');

exports.index = (req, res, next)=>{
    //res.send('send all stories');
    model.find()
    .then(stories=>res.render('./index2', {stories}))
    .catch(err=>next(err));
    
};

exports.new = (req, res)=>{
    res.render('./new');
};

exports.create = (req, res, next)=>{
    //res.send('Created a new story');
    let story = new model(req.body);
    story.author = req.session.user;
    story.save()//insert document to database
    .then(story=> res.redirect('/stories'))
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    //validates id

    model.findById(id).populate('author', 'firstName lastName')
    .then(story=>{
        if(story){
            return res.render('./show', {story});
        } else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;

    //validates id


    model.findById(id)
    .then(story=>{
        if(story){
            return res.render('./edit', {story});
        } else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let story = req.body;
    let id = req.params.id;

    //validates id

    model.findByIdAndUpdate(id, story, {useFindAndModify: false, runValidators: true})
    .then(story=>{
        if(story){
            res.redirect('/stories/'+id);
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    //validates id

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(story=>{
        if(story) {
            res.redirect('/stories');
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};


exports.rsvp = (req, res, next) => {
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.find({story: id}).then(rsvp=>{
        if (rsvp) {
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp: req.body.rsvp}, {useFindAndModify: false, runValidators: true})
            .then(rsvp=>{
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('back');
            })
            .catch(err=>{
                console.log(err);
                if(err.name === 'ValidationError') {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                next(err);});
        } else {
            let rsvp = new rsvpModel({
                story: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp=>{
                req.flash('success', 'Successfully saved RSVP')
                res.redirect('back');
            })
            .catch(err=>{
                req.flash('error', err.message);
                next(err)
            });
        }
    })
}