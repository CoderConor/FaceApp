const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

//path to register.js
const register = require('./controllers/register');


//connection to db using knex
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'conor',
        password: '',
        database: 'face-app'
    }
});

const app = express();

//app.use because body parser is a middleware
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send(database.users);
})
//sign in route
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
//using express method .json instead of .send, has extra features when sending json
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  })

//req res to recieve db and bcrypt, dependency injection for registerHandler
app.post('/register', (req, res) => { register.registerHandler(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('cannot retreive user'))

})

//user rank increases upon each image search
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
  })

app.listen(3000, () => {
    console.log('app is running on port 3000');
})


/* API plan notes
/ --> route directory, respond with this is working
/signin route, a POST request with JSON of user info. respond with either success or fail
/register, also a POST to add data to variable in server. return user object
/profile/:userId a GET = user
/image a PUT returning updtaed user object
*/