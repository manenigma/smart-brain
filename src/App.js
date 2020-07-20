import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import Particles from 'react-particles-js';
import './App.css';

const particlesOption = {
  particles: {
    number: {
      value: 166,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  },
}

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [{topRow:'',rightCol:'',bottomRow:'',leftCol:''}],
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

  displayFaceBox = (boxes) => {
    // console.log(boxes);
    this.setState({boxes: boxes});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions;
    // console.log(clarifaiFace);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    const multiBox = clarifaiFace.map( face => ({
      topRow: face.region_info.bounding_box.top_row * height,
      leftCol: face.region_info.bounding_box.left_col * width,
      bottomRow: height - (face.region_info.bounding_box.bottom_row * height),
      rightCol: width - (face.region_info.bounding_box.right_col * width),
    }));
    // console.log(multiBox);
    return multiBox //array
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    // console.log(input);
  }

  onButtonSummit = () => {
    // console.log('click!')
    // this.setState({boxes: [{topRow:'',rightCol:'',bottomRow:'',leftCol:''}]});
    this.setState({imageUrl: this.state.input})
    fetch('https://salty-escarpment-78059.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({input: this.state.input})
      })
    .then(response => response.json())
    .then((response) => {
      fetch('https://salty-escarpment-78059.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({id: this.state.user.id})
      })
      .then(response => response.json())
      .then(count => this.setState(Object.assign(this.state.user, { entries: count })))
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(console.log);
  }

  onRouteChange = (route) => {
    if ( route === 'signin' ) {
      this.setState(initialState)
    } else if ( route === 'home' ) {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render () {
    const { isSignedIn, route, boxes, imageUrl, user } = this.state;
    return (
      <div className="App pa3">
        <Particles className='particles' params={particlesOption} />
        {
          route === 'home'
          ? <div>
              <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSummit={this.onButtonSummit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
          </div>
          : (
              route === 'signin' 
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            )
       }
      </div>
    );
  }
}

export default App;
