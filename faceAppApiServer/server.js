const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//app.use because body parser is a middleware
app.use(bodyParser.json());
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
    res.send('this is working');
})

//using express method .json instead of .send, has extra features when sending json
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json('success');
        } else {
            res.status(400).json('error logging in');
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
