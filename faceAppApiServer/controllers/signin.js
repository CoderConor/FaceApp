//signin controller linked to app.js
const signinHandler = (req, res, db, bcrypt) => {
    // sign in security
    if (!req.body.email || !req.body.password) {
        return res.status(400).json('incorrect form submission');
    }
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
  }

  module.exports = {
      signinHandler
  }