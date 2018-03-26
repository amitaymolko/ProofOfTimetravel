# ProofOfTimeTravel
ProofOfTimeTravel - Proof of Time-Travel on the blockchain

## Develop
Download and run [Ganache](http://truffleframework.com/ganache/)  
Then deploy the smart contracts to Ganache with `truffle migrate`  
Then run `npm start` to start the webserver

## Production
To create a production build run `npm run build`  
To test the production build install pushstate-server: `yarn global add pushstate-server`  
Then run `pushstate-server build_webpack` an open localhost:9000

