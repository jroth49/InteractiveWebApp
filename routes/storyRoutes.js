const express = require('express');
const controller = require('../controllers/storyController');
const router = express.Router();
const {isLoggedIn, isAuthor, isNotAuthor} = require('../middlewares/auth');
const{validateId, validateStory} = require('../middlewares/validator');

//GET /stories: send all stories to the user
router.get('/', controller.index);

//GET /stories/new: send html form for creating a new story

router.get('/new', isLoggedIn, controller.new);
// POST /stories: send create a new story 

router.post('/', isLoggedIn, validateStory, controller.create);

//GET /stories/:id send details of story identified by id

router.get('/:id', controller.show);

//GET /stories/:id/edit send html for editing a story

router.get('/:id/edit', isLoggedIn, isAuthor, controller.edit);

//PUT /stories/:id update the story identified by ID

router.put('/:id',  isLoggedIn, isAuthor, validateStory, controller.update);

//DELETE /stories/:id delete the story identified by ID

router.delete('/:id', isLoggedIn, isAuthor, controller.delete);

router.post('/:id/rsvp', isLoggedIn, isNotAuthor, controller.rsvp);

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error',{error:err,message:err.message,url:req.url});
  });

module.exports = router;
