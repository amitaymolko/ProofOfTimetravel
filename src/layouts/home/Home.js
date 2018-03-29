import React, { Component } from 'react'
// import { ContractData, ContractForm } from 'drizzle-react-components'
import timetravel from '../../timetravel.jpg'
import PredictionsTable from '../../predictions/layouts/table/PredictionsTable'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { GithubCircle } from 'mdi-material-ui'
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardActions, CardContent } from 'material-ui/Card';

import Button from 'material-ui/Button';
import Logo from '../../Logo'

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
    let getPredictionByAddressLength 
    if (account) {
      getPredictionByAddressLength = ProofOfTimeTravel.methods.getPredictionByAddressLength.cacheCall(account)
    }

    this.state = {
      web3,
      ProofOfTimeTravel,
      account,
      dataKeys: {
        timeTravelProven: ProofOfTimeTravel.methods.timeTravelProven.cacheCall(),
        getPredictionByAddressLength,
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
        message: '',
        autoHideDuration: null
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
            this.showAlert('Submitted prediction!', 4000)
            this.reloadData()
          } else {
            
            this.showAlert('Failed to submit prediction :(', 4000)
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
    return 'Not Yet'
  }

  // getPredictions() {
  //   console.log('this.props.ProofOfTimeTravel.getPredictionsLength', this.props.ProofOfTimeTravel.getPredictionsLength)
    
  //   if (this.state.dataKeys.getPredictionsLength in this.props.ProofOfTimeTravel.getPredictionsLength) {
  //     const predictionsLength = this.props.ProofOfTimeTravel.getPredictionsLength[this.state.dataKeys.getPredictionsLength].value
  //     console.log('predictionsLength', predictionsLength)
  //     for (let index = 0; index < predictionsLength; index++) {
  //       const getPrediction = this.state.dataKeys.getPrediction

  //       if (!(index in this.state.dataKeys.getPrediction)) {
  //         console.log('index', index)
          
  //         getPrediction[index] = this.state.ProofOfTimeTravel.methods.getPrediction.cacheCall(index)
          
  //         this.setState({
  //           dataKeys: {
  //             getPrediction
  //           }
  //         })
  //       } 
  //       const dataKey = getPrediction[index]
  //       if (dataKey in this.props.ProofOfTimeTravel.getPrediction) {
  //         const prediction = this.props.ProofOfTimeTravel.getPrediction[dataKey].value

  //         const predictions = this.state.predictions
          
  //         predictions[index] = prediction
  //         this.setState({
  //           predictions
  //         })          
  //       }
  //     }
  //   }
  // }

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

    this.showAlert('Submiting prediction... Please wait..')

  }

  showAlert = (message, autoHideDuration = null) => {
    const {alert} = this.state
    alert.open = true
    alert.message = message
    alert.autoHideDuration = autoHideDuration
    this.setState({ alert })
  }

  handleRequestClose = () => {
    const {alert} = this.state
    alert.open = false
    this.setState({ alert })
  }


  render() {
    const { predictions, accountPredictions, address, balance, blockNumber, alert, account} = this.state
    const timeTravelProvenString = this.getTimeTravelProvenString()
    const orderedPredictions = this.orderByBlockNumber(predictions)
    const pendingPredictions = this.filterPendingPredictions(orderedPredictions, blockNumber).slice(0, 10)
    // const firstPendingPrediction = pendingPredictions[0]
    // console.log('firstPendingPrediction', firstPendingPrediction)
    
    const accountPredictionsOrdered = this.orderByBlockNumber(accountPredictions)

    return (
      <main className="container">
        <AppBar position="static" color="default" className="appBar">
          <Toolbar className="toolbar">
            <Logo style={{ margin: 8 }}/>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Proof of Time-Travel
            </Typography>
            <a href="https://github.com/amitaymolko/ProofOfTimetravel" target="_blank">
              <IconButton>
                <GithubCircle style={{ color: 'black'}}/>
              </IconButton>
            </a>
          </Toolbar>
        </AppBar>
        <div className="">
          <div className=" header">
            <div style={{ backgroundImage: `url(${timetravel})` }} className="mainImage">
              <div className="mainImageContent">
                <h1>Proof of Time-Travel</h1>
                <p>Has anyone proven they are from the future? <br /> {timeTravelProvenString}</p>
              </div>
            </div>
            {/* <img src={timetravel} alt="timetravel-logo" className="mainImage" /> */}
            
          </div>
        </div>
        <div className="" className="mainContent">
          <Card className="card">
            <h2>Info:</h2>
            <p>There are those who walk this earth claiming to have time traveled, and unlike god and reincarnation we can use the blockchain to prove this.</p>
            <h2>How does it work?</h2>
            <p>A time traveler just needs to enter a future block number and its hash. <br />This will prove on the blockchain that the time traveler knew the hash before it was mined, therefore that they are from the future (or super extremely lucky). <br /> When a time traveler successfully proves that they time traveled they will be able to claim all the ETH in the smart contract.</p>
            <h2>Interested in learning more about time travelers? </h2>
            <p>Check out: <a href="https://www.youtube.com/playlist?list=PLfunr83g9NtF0Go48pxcr_kkEdeMsrEVn">ApexTX</a></p>
          </Card>

          <Card className="card">
            <h2>Donate:</h2>
            <p>Contract address: {address}</p>
            <p>Balance: {balance}</p>
            <p><a href="https://github.com/amitaymolko/ProofOfTimetravel/blob/master/contracts/ProofOfTimeTravel.sol" target="_blank">View Source Code</a></p>
          </Card>

          <Card className="card">
            <h2>Make Prediction: (Costs 0.001 ETH) </h2>

            {account &&
              <div>
                <TextField
                  id="blockNumber"
                  label="Block Number"
                  value={this.state.form.blockNumber}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <br />
                <TextField
                  id='blockHash'
                  label="Block Hash"
                  value={this.state.form.blockHash}
                  onChange={this.handleChange}
                />
                <br />
              <Button variant="raised" color="primary" onClick={this.makePrediction}  style={{marginTop: 8}}>
                  Submit
              </Button>
              </div>
            }
            {!account && 
              <div>
                Need to connect an account.
                <br/ >
                Please use <a href="https://github.com/ethereum/mist/releases" target="_blank"> Mist Browser</a> to connect an account
              </div>
            }
            <p>Last block: {blockNumber}</p>
            {account &&
              <div>
                <h2>Your Predictions</h2>
                <PredictionsTable predictions={accountPredictions} />
              </div>
            }
          </Card>


          <Card className="card">
            <h2>Pending Predictions (Next 10)</h2>
            <PredictionsTable predictions={pendingPredictions}/>
          </Card>
          <div className="footer">
            <span>
              Built with 🤡 by <a href="https://www.facebook.com/groups/1938583353046324/"> BlockchainJLM </a>
            </span>
          </div>
        </div>
        
        <Snackbar
          open={alert.open}
          message={alert.message}
          autoHideDuration={alert.autoHideDuration}
          onRequestClose={this.handleRequestClose}
        />
      </main>
    )
  }
}

export default Home
