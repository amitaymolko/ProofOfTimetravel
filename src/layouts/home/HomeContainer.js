import Home from './Home'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
    ProofOfTimeTravel: state.contracts.ProofOfTimeTravel,
    drizzleStatus: state.drizzleStatus
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

const HomeContainer = drizzleConnect(Home, mapStateToProps);
export default HomeContainer
