import React, { Component } from 'react'
// import { ContractData, ContractForm } from 'drizzle-react-components'
import timetravel from '../../timetravel.jpg'
import PredictionsTable from '../../predictions/layouts/table/PredictionsTable'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import { log } from 'util';

class Home extends Component {
  constructor(props, context) {
    super(props)
    const { web3 } = context.drizzle
    const { accounts } = props
    console.log('props', props)
    console.log('context.drizzle', context.drizzle)
    const account = accounts[0]
    const ProofOfTimeTravel = context.drizzle.contracts.ProofOfTimeTravel

    this.state = { 
      web3,
      ProofOfTimeTravel,
      dataKeys: {
        timeTravelProven: ProofOfTimeTravel.methods.timeTravelProven.cacheCall(),
        getPredictionsLength: ProofOfTimeTravel.methods.getPredictionsLength.cacheCall(),
        getPredictionByAddressLength: ProofOfTimeTravel.methods.getPredictionByAddressLength.cacheCall(account),
        // getBlockNumber: ProofOfTimeTravel.methods.getBlockNumber.cacheCall(),
        getPrediction: {}
      },
      predictions: [],
      address: ProofOfTimeTravel._address,
      blockNumber: 0,
      balance: 'loading...',
      form: {
        blockNumber: '',
        blockHash: ''
      },
      makePredictionStackIndex: null,
      makePredictionStackId: null,
      alert: {
        open: false,
        message: ''
      }
    }

    console.log('this.state.ProofOfTimeTravel', this.state.ProofOfTimeTravel)
    
    
    // const block = this.web3.eth.getBlock('latest')
    // console.log('block', block)
    
    // if (this.props.transactionStack[this.makeTxStackId]) {
    //   const txHash = this.props.transactionStack[this.makeTxStackId]
    //   console.log('txHash', txHash)
    //   const status = this.props.transactions[txHash].status
    //   console.log('status', status)

    // }   

    // this.makeTxStackId = this.state.ProofOfTimeTravel.methods.makePrediction.cacheSend(500, '0xdec9baa88eaba16beada45c6bb941f18bb969eadecef0b0137fc718073c6cf88', { gas: 4700000})
  }
  componentDidUpdate(prevProps, prevState) {    
    if (this.state.makePredictionStackIndex != null) {
      console.log('prevProps', prevProps)
      console.log('this.props', this.props)

      console.log('prevState', prevState)
      console.log('this.state', this.state)
      
      if (this.state.makePredictionStackId == null && this.state.makePredictionStackIndex in this.props.transactionStack) {
        const makePredictionStackId = this.props.transactionStack[this.state.makePredictionStackIndex]
        this.setState({ makePredictionStackId })
        console.log('makePredictionStackId', makePredictionStackId)
        
      } else if (this.state.makePredictionStackId != null && this.state.makePredictionStackId in this.props.transactions)  {
        const transaction = this.props.transactions[this.state.makePredictionStackId]
        console.log('transaction', transaction)
        const status = transaction.status
        if (status !== "pending") {
          const success = transaction.confirmations[0].status == 0x01
          console.log('success', success)

          this.setState({ makePredictionStackId: null, makePredictionStackIndex: null})

          if (success) {
            this.showAlert('Submitted prediction')
            this.reloadData()
          } else {
            
            this.showAlert('Failed to submit prediction')
            this.reloadData()
          }
        } 
      }
    }
  }

  reloadData() {
    this.setState({predictions: []})
    this.getPredictionsNoCache()
    this.loadContractBalance()
    this.getBlockNumber()
  }

  componentWillMount() {    
    this.reloadData()
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
        const dataKey = getPrediction[index]
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
    const predictions = this.state.predictions

    const predictionsLength = await this.state.ProofOfTimeTravel.methods.getPredictionsLength().call()
    console.log('predictionsLength', predictionsLength)
    
    for (let index = 0; index < predictionsLength; index++) {
      const prediction = await this.state.ProofOfTimeTravel.methods.getPrediction(index).call()
      console.log('prediction', prediction)
      
      predictions[index] = prediction  
    }
    console.log('predictions', predictions)
    
    this.setState({
      predictions
    })  
  }

  async getBlockNumber () {
    // if (this.state.dataKeys.getBlockNumber in this.props.ProofOfTimeTravel.getBlockNumber) {
    //   const getBlockNumber = this.props.ProofOfTimeTravel.getBlockNumber[this.state.dataKeys.getBlockNumber].value
    //   console.log('getBlockNumber', getBlockNumber)
      
    // } 
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

  handleChange = (event) => {
    const id = event.target.id
    const value = event.target.value
    const form = this.state.form
    form[id] = value
    this.setState({ form })
  }

  makePrediction = () => {
    const {form} = this.state
    const makePredictionStackIndex = this.state.ProofOfTimeTravel.methods.makePrediction.cacheSend(form.blockNumber, form.blockHash, { gas: 140000})
    this.setState({ makePredictionStackIndex})
    console.log('makePredictionStackIndex', makePredictionStackIndex)
  
    this.setState({
      form: {
        blockNumber: '',
        blockHash: ''
      }
    })
  }

  showAlert = (message) => {
    const {alert} = this.state
    alert.open = true
    alert.message = message
    this.setState({ alert })
  }

  handleRequestClose = () => {
    const {alert} = this.state
    alert.open = false
    this.setState({ alert })
  }


  render() {
    const { predictions, address, balance, blockNumber, alert} = this.state
    const timeTravelProvenString = this.getTimeTravelProvenString()
    const pendingPredictions = this.getPendingPredictions(predictions)

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
            <h2>Make Prediction:</h2>
            <TextField
              floatingLabelText="Block Number"
              id='blockNumber'
              value={this.state.form.blockNumber} 
              onChange={this.handleChange}
              />
            <br />
            <TextField
              floatingLabelText="Block Hash"
              id='blockHash'
              value={this.state.form.blockHash} 
              onChange={this.handleChange}
              />
            <br />
            <RaisedButton label="Sumbit" primary={true} style={{ margin: 12 }} onClick={this.makePrediction} />
      
          </div>

          <div className="pure-u-1-1">
            <h2>Pending Predictions (Next 10)</h2>
            <PredictionsTable predictions={pendingPredictions}/>
          </div>
        </div>
        <Snackbar
          open={alert.open}
          message={alert.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </main>
    )
  }
}

export default Home
