import React, { Component } from 'react'
import {
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class PredictionsRow extends Component {
  render() {
    const {prediction} = this.props
    return(
      <TableRow>
        <TableRowColumn>{prediction[0]}</TableRowColumn>
        <TableRowColumn>{prediction[1]}</TableRowColumn>
        <TableRowColumn>{prediction[2]}</TableRowColumn>
        <TableRowColumn>{prediction[3]}</TableRowColumn>
        <TableRowColumn>{prediction[4]? 'Won!':'Nope'}</TableRowColumn>
      </TableRow>
    )
  }
}

export default PredictionsRow
