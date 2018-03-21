import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducer from './reducer'
import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'

Reactotron
  .configure()
  .use(reactotronRedux())
  .connect() 
  
// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(browserHistory)

const store = Reactotron.createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routingMiddleware
    )
  )
)

export default store
