import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import 'typeface-roboto'

const theme = createMuiTheme({

});

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          {this.props.children}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App
