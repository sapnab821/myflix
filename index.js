
const express = require('express');
const morgan= require('morgan');
const app = express();

const bodyParser = require('body-parser'),
 methodOverride = require('method-override');

app.use(morgan('common'));

let topMovies = [
    {
        title: 'Bridesmaids',
        summary: 'Competition between the maid of honor and a bridesmaid, over   who is the brides best friend, threatens to upend the life of an out-of-work pastry chef.'
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

app.get('/movies', (req, res) => {
    res.json(topMovies);
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });