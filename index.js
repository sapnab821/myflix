
const express = require('express');
const morgan= require('morgan');
const app = express();
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

 bodyParser = require('body-parser'),
 methodOverride = require('method-override');


app.use(morgan('common'));
app.use(bodyParser.json());

/*
let users = [
    {
        'id': 1,
        'name': 'Kim',
        'favoriteMovies': ['Mission Impossible']
    },
    {
        'id': 2,
        'name' : 'Bob',
        'favoriteMovies': []
    }

];

let movies = [
    {
        'title': 'Bridesmaids',
        'summary': 'Competition between the maid of honor and a bridesmaid, over   who is the brides best friend, threatens to upend the life of an out-of-work pastry chef.',
        'genre': {
            'name': 'Comedy',
            'description': 'A category of film which emphasizes on humor. These films are designed to make the audience laugh in amusement. Films in this style traditionally have a happy ending (dark comedy being an exception to this rule).',
            },
        'director': {
            'name': 'Paul Feig',
            'bio':' is an American film director, producer, screenwriter, actor, and comedian. He is known for directing films starring frequent collaborator Melissa McCarthy, including Bridesmaids (2011), The Heat (2013), Spy (2015), and Ghostbusters (2016). He also directed the black comedy mystery film A Simple Favor (2018) and the romantic comedy film Last Christmas (2019).',
            'birth': 1962.0
        },
        'imageURL': 'https://upload.wikimedia.org/wikipedia/en/d/df/BridesmaidsPoster.jpg'
    },
    {
        title: 'Silver Linings Playbook',
        summary: 'After a stint in a mental institution, former teacher Pat Solitano moves back in with his parents and tries to reconcile with his ex-wife. Things get more challenging when Pat meets Tiffany, a mysterious girl with problems of her own.'
    },
    {
        title: 'Shawshank Redemption',
        summary: 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.'
    },
    {
        title: 'Fight Club',
        summary: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.'
    },
    {
        title: 'Inception',
        summary: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.'
    },
    {
        title: 'Star Wars: Episode V The Empire Strikes Back',
        summary: 'After the Rebels are overpowered by the Empire, Luke Skywalker begins his Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader and bounty hunter Boba Fett.'
    },
    {
        title: 'The Matrix',
        summary: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.'
    },
    {
        title: 'The Green Mile',
        summary: 'A tale set on death row in a Southern jail, where gentle giant John possesses the mysterious power to heal peoples ailments. When the lead guard, Paul, recognizes Johns gift, he tries to help stave off the condemned mans execution.'
    },
    {
        title: 'Spirited Away',
        summary: 'During her familys move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, a world where humans are changed into beasts.'
    },
    {
        title: 'Wall-E',
        summary: 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.'
    }

]


app.post('/users', (req, res) => {
    const newUser= req.body;

    if(newUser.name){
        newUser.id= uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names.');
    }
});

app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id==id);

    if(user){
        user.name= updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user.');
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
    let user = users.find(user => user.id == id);

    if(user){
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(movieTitle + ' has been added to user ' + id + 's favorite movies');
    } else {
        res.status(400).send('no such user');
    }
});



app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/', (req, res) => {
    res.send('These are my top 10 movies');
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(methodOverride());


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else{ 
        res.status(400).send('no such movie.');
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName} = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if(genre){
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre.');
    }
});

app.get('/movies/director/:directorName', (req, res) => {
    const {directorName} = req.params;
    const Director = movies.find(movie => movie.director.name === directorName).director;

    if(Director){
        res.status(200).json(Director);
    } else{
        res.status(400).send('no such director');
    }
});

app.delete('/users/:id/:movieTitle', (req, res) => {
   
    const {id, movieTitle} = req.params;
    let user = users.find(users => users.id == id);
    
    if(user){
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).json(movieTitle + ' has been removed from user id ' + id);
    } else {
        res.status(400).send('no such user.')
    }
});

app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    let user = users.find(users => users.id == id);

    if(user){
        
        users = users.filter(users => users.id !== Number(id));
        res.status(200).json('user id ' + id + ' has been removed from users.');
    } else {
        res.status(400).send('no such user.');
    }
});
*/

// create new user
app.post('/users', async (req, res) => {
    await Users.findOne({Username: req.body.Username})
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else { 
            Users 
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
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
app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/users', async (req, res) => {
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
app.get('/movies/:Title', async (req, res) =>{
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
app.get('/movies/genre/:Name', async (req, res) => {
    await Movies.findOne({'Genre.Name': req.params.Name})
    .then((movie) => {
        res.status(200).json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get data on director by name
app.get('/movies/director/:Name', async (req, res)=> {
    await Movies.findOne({'Director.Name': req.params.Name})
    .then((movie) => {
        res.status(200).json(movie)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
})

//update user information
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username},
        {
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
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
app.post('/users/:Username/movies/:MovieID', async (req, res) =>{
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
app.delete('/users/:Username/movies/:MovieID', async (req, res) =>{
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
app.delete('/users/:Username', async (req, res) => {
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


app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

