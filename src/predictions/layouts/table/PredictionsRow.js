import React, { Component } from 'react'
import {
  TableRow,
  TableCell,
} from 'material-ui/Table';
import PropTypes from 'prop-types'

class PredictionsRow extends Component {
  constructor(props, context) {
    super(props)
    const { web3 } = context.drizzle
    this.state = {
      web3,
      blockNumber: 0
    }  
    this.getBlockNumber()
  }

  async getBlockNumber() {
    const block = await this.state.web3.eth.getBlock('latest')
    const blockNumber = block.number
    this.setState({ blockNumber })
  }

  getWinText(prediction) {
    if (prediction[4]) {
      return 'Won!'
    } else if (parseInt(prediction[1]) < this.state.blockNumber) {
      return 'Nope 😭'
    }

    return 'Not yet...';
  }

  render() {
    const {prediction} = this.props
    const winText = this.getWinText(prediction)
    return(
      <TableRow>
        <TableCell>{prediction[0]}</TableCell>
        <TableCell>{prediction[1]}</TableCell>
        <TableCell>{prediction[2]}</TableCell>
        <TableCell>{prediction[3]}</TableCell>
        <TableCell>{winText}</TableCell>
      </TableRow>
    )
  }
}

PredictionsRow.contextTypes = {
  drizzle: PropTypes.object
}

export default PredictionsRow
