
const express = require('express');
const morgan= require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models');

const {check, validationResult} = require('express-validator');

const app = express(),
 Movies = Models.Movie,
 Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

 //bodyParser = require('body-parser'),
 methodOverride = require('method-override');


app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// create new user
app.post('/users', 
check('Username', 'Username is required').isLength({min: 5}),
check('Username', 'Username just be less than or equal to 12').isLength({max: 12}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail(), async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({Username: req.body.Username})
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else { 
            Users 
                .create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                    FavoriteMovies: req.body.FavoriteMovies
                })
                .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
             }
            })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
    });


// get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//get all users
app.get('/users', passport.authenticate('jwt', {session:false}), async (req, res) => {
    await Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get movie info from title of movie
app.get('/movies/:Title', passport.authenticate('jwt', {session:false}), async (req, res) =>{
    await Movies.findOne({Title: req.params.Title})
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get description of genre by the name of genre
app.get('/movies/genre/:Name', passport.authenticate('jwt', {session:false}), async (req, res) => {
    await Movies.findOne({'Genre.Name': req.params.Name})
    .then((movie) => {
        res.status(200).json(movie.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get data on director by name
app.get('/movies/director/:Name', passport.authenticate('jwt', {session:false}), async (req, res)=> {
    await Movies.findOne({'Director.Name': req.params.Name})
    .then((movie) => {
        res.status(200).json(movie.Director)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
})

//update user information
app.put('/users/:Username', 
check('Username', 'Username is required').isLength({min: 5}),
check('Username', 'Username just be less than or equal to 12').isLength({max: 12}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail(),
passport.authenticate('jwt', {session:false}), async (req, res) => {
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

    let hashedPassword = Users.hashPassword(req.body.Password);

    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({Username: req.params.Username},
        {
            $set: {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            },
        },
          {new: true})
          .then((updatedUser) => {
            res.json(updatedUser);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          })
        });

// add a movie to user's list of favorite movies
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session:false}), async (req, res) =>{
    await Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {FavoriteMovies: req.params.MovieID}
    }, 
    { new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// remove a movie from user's list of favorite movies
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session:false}), async (req, res) =>{
    await Users.findOneAndUpdate({Username: req.params.Username},
        {$pull: {FavoriteMovies: req.params.MovieID}})
    .then((updatedUser) => {
        res.status(200).send(req.params.MovieID + ' was removed');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
})

// delete user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session:false}), async (req, res) => {
    await Users.findOneAndDelete({Username: req.params.Username})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });


app.use(express.static('public'));

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});