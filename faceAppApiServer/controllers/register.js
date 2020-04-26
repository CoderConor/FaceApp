//register controller, linked to app.js
const registerHandler = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    //register security
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    console.log(email, password, name)
    const hash = bcrypt.hashSync(password);
    //trx to make code block a transaction, ie when you need to do more than 2 things at once
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email 
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        //if everything passes, commit
        .then(trx.commit)
        //rollback on failure
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json(err))
  }

  //exports to app.js
module.exports = {
      registerHandler
  };