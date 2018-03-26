import React, { Component } from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import PredictionsRow from './PredictionsRow'

class PredictionsTable extends Component {
  render() {
    const {predictions} = this.props
    return(
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Block Number</TableCell>
            <TableCell>Hash</TableCell>
            <TableCell>Creation Block</TableCell>
            <TableCell>Proved Time Travel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {predictions.map(prediction => 
            {
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
