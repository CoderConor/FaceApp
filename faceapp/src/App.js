import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './AppComponents/Navigation/Navigation';
import FaceRecognition from './AppComponents/FaceRecognition/FaceRecognition';
import Logo from './AppComponents/Logo/Logo';
import ImageLinkForm from './AppComponents/ImageLinkForm/ImageLinkForm';
import Rank from './AppComponents/Rank/Rank';
import './App.css';

//acquired a unique api key from clarifai
const app = new Clarifai.App({
  apiKey: '0cb35b8aa39e4c0d8b703226455d5f31'
}
);

//as you can see at the top, component was imported from react where it was predefined
class App extends Component {
  /*Create a state, so app knows what value is entered, remembers it and updates it whenever it is changed*/
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }
  //event.target.value is how we get the value from the user input
  onInputChange = (event) => {
  this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.COLOR_MODEL,
      this.state.input
    )
      .then(
        function (response) {
          console.log(response);
        },
        function (err) {// there was an error
        }
      );
  }

  render() {
    return (
      <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
