pragma solidity ^0.4.17;

contract ProofOfTimeTravel {

    event InvestmentEvent(address investor, uint value, uint blockNumber);
    event PredictionEvent(address predictor, uint blockNumber, uint predictionIndex);
    event FailedProofOfTimeTravelEvent(address predictor, uint blockNumber, uint predictionIndex);
    event ProofOfTimeTravelEvent(address predictor, uint blockNumber, uint predictionIndex);
 
    struct Prediction {
        address predictor;
        uint predictedBlock;
        bytes32 predictedHash;
        uint creationBlock;
        bool won;
    }

    Prediction[] public predictions;
    uint[] public winningPredictionIndexes;

    modifier blockIsInfuture(uint _block) {
        require(_block > block.number);
        _;
    }
    
    modifier validValue() {
        require(msg.value >= 0.001 ether);
        _;
    }

    // function ProofOfTimeTravel() public {}

    function() public payable {
        InvestmentEvent(msg.sender, msg.value, block.number);
    }

    function makePrediction(uint _block, bytes32 _hash) 
    blockIsInfuture(_block)
    validValue
    payable
    public 
    {
        predictions.push(Prediction(msg.sender, _block, _hash, block.number, false));
        PredictionEvent(msg.sender, block.number, predictions.length);
        InvestmentEvent(msg.sender, msg.value, block.number);
    }

    function claimReward(uint _index) public {
        Prediction memory prediction = predictions[uint(_index)];

        if (!prediction.won && block.blockhash(prediction.predictedBlock) == prediction.predictedHash) {
            prediction.won = true;
            winningPredictionIndexes.push(_index);
            prediction.predictor.transfer(this.balance);
            ProofOfTimeTravelEvent(prediction.predictor, block.number, _index);
        } else {
            FailedProofOfTimeTravelEvent(prediction.predictor, block.number, _index);

        }
    }
    
    function getPendingPredictionByAddress(address _address) public view returns(address, uint, bytes32, uint) {
        int index = getPendingPredictionIndexByAddress(_address);
        if (index != -1) {
            Prediction memory prediction = predictions[uint(index)];
            return(prediction.predictor, prediction.predictedBlock, prediction.predictedHash, prediction.creationBlock);
        }
    }
    
    function getPendingPredictionIndexByAddress(address _address) public view returns(int) {
        for (uint index = 0; index < predictions.length; index++) {
            Prediction memory prediction = predictions[index];
            if (prediction.predictor == _address && !prediction.won) {
                return int(index);
            }
        }
        return -1;
    }

    function getPredictionByAddressLength(address _address) public view returns(uint) {
        uint count;
        for (uint index = 0; index < predictions.length; index++) {
            Prediction memory prediction = predictions[index];
            if (prediction.predictor == _address) {
                ++count;
            }
        }
        return count;
    }

    function getPredictionByAddressByIndex(address _address, uint _index) public view returns(address, uint, bytes32, uint, bool) {
        uint count;
        for (uint index = 0; index < predictions.length; index++) {
            Prediction memory prediction = predictions[index];
            if (prediction.predictor == _address ) {
                if (count == _index) {
                    return this.getPrediction(index);
                }
                ++count;
            }
        }
        revert();
    }
    
    function getPrediction(uint _index) public view returns(address, uint, bytes32, uint, bool) {
        Prediction memory prediction = predictions[_index];
        return(prediction.predictor, prediction.predictedBlock, prediction.predictedHash, prediction.creationBlock, prediction.won);
    }

    function getPredictionsLength() public view returns(uint) {
        return predictions.length;
    }

    function getWinningPrediction(uint _index) public view returns(address, uint, bytes32, uint, bool) {
        Prediction memory prediction = predictions[winningPredictionIndexes[_index]];
        return(prediction.predictor, prediction.predictedBlock, prediction.predictedHash, prediction.creationBlock, prediction.won);
    }

    function getWinningPredictionsLength() public view returns(uint) {
        return winningPredictionIndexes.length;
    }

    function timeTravelProven() public view returns(bool) {
        return this.getWinningPredictionsLength() > 0;
    }
}
