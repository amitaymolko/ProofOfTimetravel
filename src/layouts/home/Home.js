import React, { Component } from 'react'
import { ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../logo.png'

class Home extends Component {
  constructor(props, context) {
    super(props)
    this.web3 = context.drizzle.web3
    console.log('this.web3', this.web3)
    // const block = this.web3.eth.getBlock('latest')
    // console.log('block', block)
    
    // if (this.props.transactionStack[this.makeTxStackId]) {
    //   const txHash = this.props.transactionStack[this.makeTxStackId]
    //   console.log('txHash', txHash)
    //   const status = this.props.transactions[txHash].status
    //   console.log('status', status);

    // }   

    this.ProofOfTimeTravel = context.drizzle.contracts.ProofOfTimeTravel
    console.log('this.ProofOfTimeTravel', this.ProofOfTimeTravel)
    this.timeTravelProvenDataKey = this.ProofOfTimeTravel.methods.timeTravelProven.cacheCall()
    this.predictionsLengthDataKey = this.ProofOfTimeTravel.methods.getPredictionsLength.cacheCall()
    // this.makeTxStackId = this.ProofOfTimeTravel.methods.makePrediction.cacheSend(5000, '0xdec9baa88eaba16beada45c6bb941f18bb969eadecef0b0137fc718073c6cf88', { gas: 4700000})
  }

  getTimeTravelProvenString() {
    if (this.props.drizzleStatus.initialized) {
      if (this.timeTravelProvenDataKey in this.props.ProofOfTimeTravel.timeTravelProven) {
        const timeTravelProven = this.props.ProofOfTimeTravel.timeTravelProven[this.timeTravelProvenDataKey].value
        console.log('timeTravelProven', timeTravelProven)
      } else {
        // fetching
      }

      if (this.predictionsLengthDataKey in this.props.ProofOfTimeTravel.getPredictionsLength) {
        const predictionsLength = this.props.ProofOfTimeTravel.getPredictionsLength[this.predictionsLengthDataKey].value
        console.log('predictionsLength', predictionsLength)
      }
     
      // const predictionsLength = this.ProofOfTimeTravel.methods.getPredictionsLength.cacheCall()
    }
    return 'Not Yet :('
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Proof of Time-Travel</h1>
            <p>Has anyone proven they are from the future? {this.getTimeTravelProvenString()}</p>
            <br/><br/>
          </div>
        
          <div className="pure-u-1-1">
            <h2>SimpleStorage</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
            <p><strong>Stored Value</strong>: <ContractData contract="SimpleStorage" method="storedData" /></p>
            <ContractForm contract="SimpleStorage" method="set" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>TutorialToken</h2>
            <p>Here we have a form with custom, friendly labels. Also note the token symbol will not display a loading indicator. We've suppressed it with the <code>hideIndicator</code> prop because we know this variable is constant.</p>
            <p><strong>Total Supply</strong>: <ContractData contract="TutorialToken" method="totalSupply" methodArgs={[{from: this.props.accounts[0]}]} /> <ContractData contract="TutorialToken" method="symbol" hideIndicator /></p>
            <p><strong>My Balance</strong>: <ContractData contract="TutorialToken" method="balanceOf" methodArgs={[this.props.accounts[0]]} /></p>
            <h3>Send Tokens</h3>
            <ContractForm contract="TutorialToken" method="transfer" labels={['To Address', 'Amount to Send']} />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>ComplexStorage</h2>
            <p>Finally this contract shows data types with additional considerations. Note in the code the strings below are converted from bytes to UTF-8 strings and the device data struct is iterated as a list.</p>
            <p><strong>String 1</strong>: <ContractData contract="ComplexStorage" method="string1" toUtf8 /></p>
            <p><strong>String 2</strong>: <ContractData contract="ComplexStorage" method="string2" toUtf8 /></p>
            <strong>Single Device Data</strong>: <ContractData contract="ComplexStorage" method="singleDD" />

            <br/><br/>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
