import React from 'react';
import Navigation from './AppComponents/Navigation/Navigation';
import Logo from './AppComponents/Logo/Logo';
import ImageLinkForm from './AppComponents/ImageLinkForm/ImageLinkForm';
import Rank from './AppComponents/Rank/Rank';
import './App.css';

function App() {
  return (
    <div className="App">
    <Navigation />
    <Logo />
    <Rank />
    <ImageLinkForm />
     {/*<FaceRecognition />*/}
    </div>
  );
}

export default App;
