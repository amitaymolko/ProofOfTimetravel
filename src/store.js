import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducer from './reducer'
import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'

// import blocksSaga from './blocksSaga'
import { log } from 'util';

const __DEV__ = process.env.NODE_ENV !== 'production'

Reactotron
  .configure()
  .use(reactotronRedux())

if (__DEV__) {
  Reactotron
    .connect() // let's connect!
}
// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(browserHistory)

const sagas = [
  // blocksSaga
]

function* rootSaga() {  
  yield all(sagas.map(saga => fork(saga)))
}

const sagaMiddleware = createSagaMiddleware()

const store = Reactotron.createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routingMiddleware,
      sagaMiddleware
    )
  )
)

sagaMiddleware.run(rootSaga)

export default store
