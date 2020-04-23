import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './AppComponents/Navigation/Navigation';
import FaceRecognition from './AppComponents/FaceRecognition/FaceRecognition';
import Signin from './AppComponents/Signin/Signin';
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
      imageUrl: '',
      box: {},
      //setting the route to be the sign in page when the constructor is run
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      //this determines the points around the face in the image, which connect to form the bounding box
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }
  //event.target.value is how we get the value from the user input
  onInputChange = (event) => {
    //setState is an asynchronous react function being called
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input
    )
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      //use the catch promise, es6.
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Navigation onRouteChange ={this.onRouteChange} />
        { this.state.route === 'signin'
        ? <Signin onRouteChange={this.onRouteChange} />
        //if route is not signin, go to the following
        : <div>
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
        }
      </div>
    );
  }
}

export default App;
