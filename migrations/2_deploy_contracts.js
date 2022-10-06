const ContractToken = artifacts.require("ContractToken");
const ContractTokenSale = artifacts.require("ContractTokenSale");


module.exports = function (deployer) {
  deployer.deploy(ContractToken, 10e9).then(function() {
    const tokenPrice = 1000000000000000; // in wei
    return deployer.deploy(ContractTokenSale, ContractToken.address, tokenPrice);
  });
};
