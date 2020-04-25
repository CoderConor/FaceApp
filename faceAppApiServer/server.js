const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'conor',
      password : '',
      database : 'face-app'
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

app.get('/', (req, res)=> {
    res.send(database.users);
})

//using express method .json instead of .send, has extra features when sending json
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users').insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(console.log)
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.listen(3000, ()=> {
console.log('app is running on port 3000');
})


/* API plan notes
/ --> route directory, respond with this is working
/signin route, a POST request with JSON of user info. respond with either success or fail
/register, also a POST to add data to variable in server. return user object
/profile/:userId a GET = user
/image a PUT returning updtaed user object
*/
