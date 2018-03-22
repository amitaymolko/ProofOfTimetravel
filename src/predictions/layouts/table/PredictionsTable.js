import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from 'material-ui/Table';

import PredictionsRow from './PredictionsRow'

class PredictionsTable extends Component {
  render() {
    const {predictions} = this.props
    return(
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Address</TableHeaderColumn>
            <TableHeaderColumn>Block Number</TableHeaderColumn>
            <TableHeaderColumn>Hash</TableHeaderColumn>
            <TableHeaderColumn>Creation Block</TableHeaderColumn>
            <TableHeaderColumn>Proved Time Travel</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {predictions.map(prediction => 
            {
              const index = predictions.indexOf(prediction)
            const key = `${prediction[0]}-${prediction[1]}-${prediction[2]}-${prediction[3]}`
              return (
                <PredictionsRow key={key} prediction={prediction} />
              )
            }
          )}
        </TableBody>
      </Table>
    )
  }
}

export default PredictionsTable
