import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import React,{Component} from 'react';

const INITIAL_STATE = {
      input : '',
      url : '',
      box: {},
      route: 'signin',
      isSignedIn:false,
      user: {
        id: '',
        name : '',
        email : '',
        entries : 0, 
        joined : '',
      }
    }

class  App extends Component 
{
  constructor(){
    super();
    this.state = INITIAL_STATE;
  }

  


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name : data.name,
        email : data.email,
        entries : data.entries, 
        joined : data.joined,
      }
    })
  } 

  onInputChange = (e) => {
    this.setState({
      input: e.target.value,
    })
  }

  onSubmit = ()=>{
    this.setState({
      url : this.state.input
    })

    fetch('https://powerful-beach-56801.herokuapp.com/image', {
      method: 'put',
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify ({ 
                id: this.state.user.id,
                image:this.state.url 
                
            })


    }).then(res => res.json())
      .then(data => {
      
      this.displayFaceBox(this.calculateFaceLocation(data));
      
    })
      .catch(err => console.log('err'));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(INITIAL_STATE);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render(){
    return (
      <div className="App">
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        
          {this.state.route === 'home'
          ?<div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
        
          <FaceRecognition box={this.state.box} url={this.state.url} />
          </div>
          :(
            this.state.route  === 'signin' ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
          
        
          }
        
      </div>
    );
    }
  
}

export default App;
