import Loading from './Loading.js'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {  
  return {
    drizzleStatus: state.drizzleStatus,
    web3: state.web3
  }
}

Loading.contextTypes = {
  drizzle: PropTypes.object
}

const LoadingContainer = drizzleConnect(Loading, mapStateToProps);
export default LoadingContainer
