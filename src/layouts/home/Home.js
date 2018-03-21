import React, { Component } from 'react'
import { ContractData, ContractForm } from 'drizzle-react-components'
import timetravel from '../../timetravel.jpg'
import PredictionsTable from '../../predictions/layouts/table/PredictionsTable'

class Home extends Component {
  constructor(props, context) {
    super(props)
    const web3 = context.drizzle.web3;
    console.log('context.drizzle', context.drizzle.store.getState())
    
    const ProofOfTimeTravel = context.drizzle.contracts.ProofOfTimeTravel

    this.state = { 
      web3,
      ProofOfTimeTravel,
      dataKeys: {
        timeTravelProven: ProofOfTimeTravel.methods.timeTravelProven.cacheCall(),
        getPredictionsLength: ProofOfTimeTravel.methods.getPredictionsLength.cacheCall(),
        getPrediction: {}
      },
      predictions: [],
      address: ProofOfTimeTravel._address,
      blockNumber: 0,
      balance: 'loading...'
    };

    console.log('this.state.ProofOfTimeTravel', this.state.ProofOfTimeTravel)
    
    
    // const block = this.web3.eth.getBlock('latest')
    // console.log('block', block)
    
    // if (this.props.transactionStack[this.makeTxStackId]) {
    //   const txHash = this.props.transactionStack[this.makeTxStackId]
    //   console.log('txHash', txHash)
    //   const status = this.props.transactions[txHash].status
    //   console.log('status', status);

    // }   

    // this.makeTxStackId = this.state.ProofOfTimeTravel.methods.makePrediction.cacheSend(500, '0xdec9baa88eaba16beada45c6bb941f18bb969eadecef0b0137fc718073c6cf88', { gas: 4700000})
  }

  componentWillMount() {    
    this.getPredictionsNoCache()
    this.loadContractBalance()
    this.getBlockNumber()
  }

  async loadContractBalance() {
    const weiBalance = await this.state.web3.eth.getBalance(this.state.address)
    const balance = this.state.web3.utils.fromWei(weiBalance.toString(), 'ether') + ' ETH'
    console.log('balance', balance)
    
    this.setState({balance})
  }

  getTimeTravelProvenString() {
    if (this.props.drizzleStatus.initialized) {
      if (this.state.dataKeys.timeTravelProven in this.props.ProofOfTimeTravel.timeTravelProven) {
        const timeTravelProven = this.props.ProofOfTimeTravel.timeTravelProven[this.state.dataKeys.timeTravelProven].value
        if (timeTravelProven) {
          return "OMG! YES!"
        }
      } else {
        // fetching
      }
    }
    return 'Not Yet :('
  }

  getPredictions() {
    console.log('this.props.ProofOfTimeTravel.getPredictionsLength', this.props.ProofOfTimeTravel.getPredictionsLength)
    
    if (this.state.dataKeys.getPredictionsLength in this.props.ProofOfTimeTravel.getPredictionsLength) {
      const predictionsLength = this.props.ProofOfTimeTravel.getPredictionsLength[this.state.dataKeys.getPredictionsLength].value
      console.log('predictionsLength', predictionsLength)
      for (let index = 0; index < predictionsLength; index++) {
        const getPrediction = this.state.dataKeys.getPrediction

        if (!(index in this.state.dataKeys.getPrediction)) {
          console.log('index', index)
          
          getPrediction[index] = this.state.ProofOfTimeTravel.methods.getPrediction.cacheCall(index)
          
          this.setState({
            dataKeys: {
              getPrediction
            }
          })
        } 
        const dataKey = getPrediction[index];
        if (dataKey in this.props.ProofOfTimeTravel.getPrediction) {
          const prediction = this.props.ProofOfTimeTravel.getPrediction[dataKey].value

          const predictions = this.state.predictions
          
          predictions[index] = prediction
          this.setState({
            predictions
          })          
        }
      }
    }
  }

  async getPredictionsNoCache () {
    const predictionsLength = await this.state.ProofOfTimeTravel.methods.getPredictionsLength().call()
    for (let index = 0; index < predictionsLength; index++) {
      const prediction = await this.state.ProofOfTimeTravel.methods.getPrediction(index).call()
      const predictions = this.state.predictions
      predictions[index] = prediction
      this.setState({
        predictions
      })            
    }
  }

  async getBlockNumber () {
    const block = await this.state.web3.eth.getBlock('latest')
    const blockNumber = block.number
    this.setState({ blockNumber})
  }

  orderByBlockNumber(predictions) {    
    return predictions.sort((a, b) => a[1] - b[1])
  }

  filterPendingPredictions(predictions, blocknumber) {
    return predictions.filter(prediction => (parseInt(prediction[1]) > blocknumber))
  }

  getPendingPredictions(predictions) {

    let pendingPredictions = this.filterPendingPredictions(this.orderByBlockNumber(predictions), this.state.blockNumber)
    pendingPredictions = pendingPredictions.slice(0, 10)
    return pendingPredictions
  }

  render() {
    const { predictions, address, balance, blockNumber} = this.state
    const timeTravelProvenString = this.getTimeTravelProvenString()
    const pendingPredictions = this.getPendingPredictions(predictions)
    // console.log('pendingPredictions', pendingPredictions)
    
    // this.getPredictions()

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={timetravel} alt="timetravel-logo" className="mainImage"/>
            <h1>Proof of Time-Travel</h1>
            <p>Has anyone proven they are from the future? {timeTravelProvenString}</p>
            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Contract address: {address}</h2>
            <p>Balance: {balance}</p>
            <p>Last block: {blockNumber}</p>
          </div>

          <div className="pure-u-1-1">
            <h2>Pending Predictions (Next 10)</h2>
            <PredictionsTable predictions={pendingPredictions}/>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
