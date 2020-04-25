const Clarifai = require('clarifai');

//acquired a unique api key from clarifai
const app = new Clarifai.App({
  apiKey: '0cb35b8aa39e4c0d8b703226455d5f31'
}
);
//making api call on the backend, security feature to hide api key
const apiCallHandler = (req, res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json('Cannot reach API'))
}



//image controller
const imageHandler = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
  }



module.exports = {
    imageHandler,
    apiCallHandler
}