const ProofOfTimeTravel = artifacts.require('ProofOfTimeTravel')

contract('ProofOfTimeTravel', (accounts) => {
  
  var account = accounts[0]

  describe('deploy and grab ProofOfTimeTravel', () => {
    it('deploy and grab', async () => {
      // Contract = await ProofOfTimeTravel.new()
      Contract = await ProofOfTimeTravel.deployed()
      console.log('Contract', Contract.address)
      // await Contract.send(web3.toWei(2, 'ether'))
    });


    it('fires InvestmentEvent', (done) => {
      const value = web3.toWei(1, 'ether')
      var event = Contract.InvestmentEvent();
      event.watch(function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('args ', result.args);
        console.log('value ', result.args.value.toNumber());
        event.stopWatching();
        done()
      });
      Contract.send(value)
    });

    it('makes predictions', async() => { 
      await Contract.makePrediction(5000, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57636)
      await Contract.makePrediction(5001, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57636)
      var prediction = await Contract.getPendingPredictionByAddress(account)
      console.log('prediction', prediction)
    });

    it('claim reward fails', async () => {
      var balance = web3.fromWei(await web3.eth.getBalance(account).toNumber(), 'ether')
      console.log('balance', balance)

      const index = await Contract.getPendingPredictionIndexByAddress(account)
      assert.isTrue(index >= 0)

      await Contract.claimReward(index)

      var balance2 = web3.fromWei(await web3.eth.getBalance(account).toNumber(), 'ether')
      console.log('balance2', balance2)
      assert.isTrue(balance > balance2)
      return 1
    });

  })
});
