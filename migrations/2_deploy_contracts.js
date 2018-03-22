
var ProofOfTimeTravel = artifacts.require("./ProofOfTimeTravel.sol");

module.exports = function(deployer) {
  deployer.deploy(ProofOfTimeTravel)
};
