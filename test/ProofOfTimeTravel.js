const ProofOfTimeTravel = artifacts.require('ProofOfTimeTravel')

contract('ProofOfTimeTravel', (accounts) => {
  
  var account = accounts[0]
  const minValue = web3.toWei(0.001, 'ether')

  it('deploy and grab', async () => {
    Contract = await ProofOfTimeTravel.new()
    // Contract = await ProofOfTimeTravel.at('0x345cA3e014Aaf5dcA488057592ee47305D9B3e10')
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

  it('failes to make prediction without cash', async () => {
    try {
      const block = web3.eth.blockNumber

      const tx = await Contract.makePrediction(block + 2, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57636)

      console.log('tx', tx)
      throw new Error('unauthorized tx')
    } catch (err) {
      if (err.message == 'unauthorized tx') {
        throw err
      }
      return
    }
  })

  it('makes predictions', async() => { 
    const predictionLength = await Contract.getPredictionByAddressLength(account)   
    
    const block = web3.eth.blockNumber
    
    await Contract.makePrediction(block + 2, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57636, { value: minValue})
    await Contract.makePrediction(block + 3, 0xdcdff08e3b366e0dd2b7804423907220824e888a20d0b51302d1b12e76e57637, { value: minValue})
    
    const prediction = await Contract.getPredictionByAddressByIndex(account, predictionLength)   
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
