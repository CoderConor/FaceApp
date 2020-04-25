const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'conor',
        password: 'Coffee19862Coke',
        database: 'face-app'
    }
});

const app = express();

//app.use because body parser is a middleware
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '111',
            name: 'Stephen',
            email: 'ste@gmail.com',
            password: 'cocacola',
            entries: 0,
            joined: new Date()
        },
        {
            id: '222',
            name: 'Paul',
            email: 'paul@gmail.com',
            password: 'presser',
            entries: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

//using express method .json instead of .send, has extra features when sending json
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        //when user successfully registers, json response sent using knex
        .then(user => {
            res.json(user[0]);
        })
        //statement to catch any errors 
        .catch(err => res.status(400).json('Existing email, a different email'))
})

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
