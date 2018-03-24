import React, { Component, Children } from 'react'

class Loading extends Component {
  constructor(props, context) {
    super(props)       
    const { drizzle } = context 
    
    this.state = {
      drizzle
    }
  }

  render() {

    if (this.props.web3.status === 'failed')
    {
      return(
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>⚠️</h1>
              <p>This browser has no connection to the Ethereum network. Please use a dedicated Ethereum browser like Mist or Parity.</p>
            </div>
          </div>
        </main>
      )
    }

    if (this.state.drizzle.web3 && this.state.drizzle.web3.currentProvider) {      
      if (this.state.drizzle.web3.currentProvider.isMetaMask) {
        return (
          <main className="container loading-screen">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h1>⚠️</h1>
                <p>This browser is using MetaMask, unfortunately MetaMask doesn't support web3 v1.0 yet so it doesn't work with this dapp :( <br /> Please disable MetaMask to continue... <br /> <a href="https://github.com/MetaMask/metamask-extension/issues/2350">more info</a></p>
              </div>
            </div>
          </main>
        )
      }
    }

    if (this.props.drizzleStatus.initialized)
    {
      return Children.only(this.props.children)
    }

    return(
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>⚙️</h1>
            <p>Loading dapp...</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Loading
