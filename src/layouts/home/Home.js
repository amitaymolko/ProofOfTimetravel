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
    // console.log('props', props)
    // console.log('context.drizzle', context.drizzle)
    const account = accounts[0]
    const ProofOfTimeTravel = context.drizzle.contracts.ProofOfTimeTravel

    this.state = { 
      web3,
      ProofOfTimeTravel,
      account,
      dataKeys: {
        timeTravelProven: ProofOfTimeTravel.methods.timeTravelProven.cacheCall(),
        // getPredictionsLength: ProofOfTimeTravel.methods.getPredictionsLength.cacheCall(),
        getPredictionByAddressLength: ProofOfTimeTravel.methods.getPredictionByAddressLength.cacheCall(account),
        getPrediction: {}
      },
      predictions: [],
      accountPredictions: [],
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
  }
  componentDidUpdate(prevProps, prevState) {    
    if (this.state.makePredictionStackIndex != null) {
      // console.log('prevProps', prevProps)
      // console.log('this.props', this.props)

      // console.log('prevState', prevState)
      // console.log('this.state', this.state)
      
      if (this.state.makePredictionStackId == null && this.state.makePredictionStackIndex in this.props.transactionStack) {
        const makePredictionStackId = this.props.transactionStack[this.state.makePredictionStackIndex]
        this.setState({ makePredictionStackId })        
      } else if (this.state.makePredictionStackId != null && this.state.makePredictionStackId in this.props.transactions)  {
        const transaction = this.props.transactions[this.state.makePredictionStackId]
        const status = transaction.status
        if (status !== "pending") {
          const success = transaction.confirmations[0].status == 0x01

          this.setState({ makePredictionStackId: null, makePredictionStackIndex: null})

          if (success) {
            this.showAlert('Submitted prediction!')
            this.reloadData()
          } else {
            
            this.showAlert('Failed to submit prediction :(')
            this.reloadData()
          }
        } 
      }
    }
  }

  reloadData() {
    this.getPredictionsNoCache()
    this.getAccountPredictionsNoCache(this.state.account)
    this.loadContractBalance()
  }

  componentWillMount() {    
    this.reloadData()
    this.startBlockLoader()
  }

  async loadContractBalance() {
    const weiBalance = await this.state.web3.eth.getBalance(this.state.address)
    const balance = this.state.web3.utils.fromWei(weiBalance.toString(), 'ether') + ' ETH'    
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
    const predictions = []
    
    const predictionsLength = await this.state.ProofOfTimeTravel.methods.getPredictionsLength().call()    
    for (let index = 0; index < predictionsLength; index++) {
      const prediction = await this.state.ProofOfTimeTravel.methods.getPrediction(index).call()      
      predictions[index] = prediction  
    }

    this.setState({
      predictions
    })  
  }

  async getAccountPredictionsNoCache (account) {
    const accountPredictions = []
    
    const predictionsLength = await this.state.ProofOfTimeTravel.methods.getPredictionByAddressLength(account).call()    
    for (let index = 0; index < predictionsLength; index++) {
      const prediction = await this.state.ProofOfTimeTravel.methods.getPredictionByAddressByIndex(account, index).call()      
      accountPredictions[index] = prediction  
    }

    this.setState({
      accountPredictions
    })  
  }

  async getBlockNumber () {
      const block = await this.state.web3.eth.getBlock('latest')
      const blockNumber = block.number
      this.setState({ blockNumber })
  }

  startBlockLoader() {
    this.getBlockNumber()
    setInterval(() => {
       this.getBlockNumber()
    }, 5 * 1000)
  }

  orderByBlockNumber(predictions) {    
    return predictions.sort((a, b) => a[1] - b[1])
  }

  filterPendingPredictions(predictions, blocknumber) {
    return predictions.filter(prediction => (parseInt(prediction[1]) > blocknumber))
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
    
    const value = this.state.web3.utils.toWei('0.001', 'ether').toString()
    const makePredictionStackIndex = this.state.ProofOfTimeTravel.methods.makePrediction.cacheSend(form.blockNumber, form.blockHash, { gas: 140000, value })
  
    this.setState({
      makePredictionStackIndex,
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
    const { predictions, accountPredictions, address, balance, blockNumber, alert} = this.state
    const timeTravelProvenString = this.getTimeTravelProvenString()
    const orderedPredictions = this.orderByBlockNumber(predictions)
    const pendingPredictions = this.filterPendingPredictions(orderedPredictions, blockNumber).slice(0, 10)
    const accountPredictionsOrdered = this.orderByBlockNumber(accountPredictions)

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
            <h2>Donate:</h2>
            <p>There are those who walk this earth claiming to have time traveled, and unlike god and reincarnation we can use the blockchain to prove this.</p>
            <p>Contract address: {address}</p>
            <p>Balance: {balance}</p>
            <p>Last block: {blockNumber}</p>
          </div>

          <div className="pure-u-1-1">
            <h2>Make Prediction: (Costs 0.001 ETH) </h2>
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
            <h2>Your Predictions</h2>
            <PredictionsTable predictions={accountPredictions} />
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
