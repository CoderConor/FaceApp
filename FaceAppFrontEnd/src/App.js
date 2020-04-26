import React, { Component } from 'react';
import Navigation from './AppComponents/Navigation/Navigation';
import FaceRecognition from './AppComponents/FaceRecognition/FaceRecognition';
import Signin from './AppComponents/Signin/Signin';
import Register from './AppComponents/Register/Register';
import Logo from './AppComponents/Logo/Logo';
import ImageLinkForm from './AppComponents/ImageLinkForm/ImageLinkForm';
import Rank from './AppComponents/Rank/Rank';
import './App.css';


//state of homepage on signin, each user will not see the image the other searched
const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }


//as you can see at the top, component was imported from react where it was predefined
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
    this.setState({box: box});
  }
  //event.target.value is how we get the value from the user input
  onInputChange = (event) => {
    //setState is an asynchronous react function being called
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://boiling-meadow-08475.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
      .then(response => {
        if (response) {
        fetch('https://boiling-meadow-08475.herokuapp.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log)

    }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
      //use the catch promise, es6.
      .catch(err => console.log(err));
  }

  //route change that occurs on sign out
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  //Different components linked to their individual js files
  render() {
    return (
      <div className="App">
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange ={this.onRouteChange} />
        { this.state.route === 'home'
        ? <div>
        <Logo />
        <Rank 
          name={this.state.user.name}
          entries={this.state.user.entries}
        />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
        :(
          this.state.route === 'signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
        }
      </div>
    );
  }
}

export default App;
