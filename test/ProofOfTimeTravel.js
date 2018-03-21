const ProofOfTimeTravel = artifacts.require('ProofOfTimeTravel')

contract('ProofOfTimeTravel', (accounts) => {
  
  var account = accounts[0]

  it('deploy and grab', async () => {
    Contract = await ProofOfTimeTravel.new()
    // Contract = await ProofOfTimeTravel.at('0x488e9658bae7d527FC3A9303074e5AE05934C772')
    console.log('Contract', Contract.address)
    // await Contract.send(web3.toWei(2, 'ether'))
  })


  it('fires InvestmentEvent', (done) => {
    const value = web3.toWei(0.1, 'ether')
    var event = Contract.InvestmentEvent()
    event.watch(function (err, result) {
      if (err) {
        console.log(err)
        return
      }
      assert.isTrue(result.args.value.toString() === value)
      event.stopWatching()
      done()
    })
    Contract.send(value)
  })

  it('makes predictions', async() => { 
    const block = web3.eth.blockNumber
    
    await Contract.makePrediction(block + 2, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57636)
    await Contract.makePrediction(block + 3, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57637)
    
    const prediction = await Contract.getPendingPredictionByAddress(account)   
    assert.isTrue(prediction[1].toNumber() === block + 2)
  })

  it('claim reward fails', async () => {
    const balance = web3.fromWei(await web3.eth.getBalance(account).toNumber(), 'ether')

    const index = await Contract.getPendingPredictionIndexByAddress(account)
    assert.isTrue(index >= 0)

    await Contract.claimReward(index)

    var balance2 = web3.fromWei(await web3.eth.getBalance(account).toNumber(), 'ether')
    assert.isTrue(balance > balance2)
  })
})
