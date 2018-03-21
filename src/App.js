import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          {this.props.children}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App
