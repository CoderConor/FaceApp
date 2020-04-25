const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();


//path to register.js
const register = require('./controllers/register');
//path to signin register
const signin = require('./controllers/signin');
//path to profile register
const profile = require('./controllers/profile');
//path to image register
const image = require('./controllers/image');




//connection to db using knex
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_UEL,
        ssl: true,
    }
});


const app = express();

//app.use because body parser is a middleware
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {res.send('its working');})
//four server endpoints below
//sign in route linked to signin.js
app.post('/signin', (req, res) => { signin.signinHandler(req, res, db, bcrypt) })
//req res to recieve db and bcrypt, dependency injection for registerHandler
app.post('/register', (req, res) => { register.registerHandler(req, res, db, bcrypt) })
//link to profile controller
app.get('/profile/:id', (req, res) => { profile.profileHandlerGet(req, res, db) })
//user rank increases upon each image search
app.put('/image', (req, res) => { image.imageHandler(req, res, db) })
//api call endpoint
app.post('/imageurl', (req, res) => { image.apiCallHandler(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log('app is running on port ${process.env.PORT}');
})
