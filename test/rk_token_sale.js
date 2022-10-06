const ContractTokenSale = artifacts.require("ContractTokenSale");
const ContractToken = artifacts.require("ContractToken");

contract("ContractTokenSale", function(accounts) {
  let tokenSaleInstance;
  let tokenInstance;
  const tokenPrice = 1000000000000000; // in wei
  const admin = accounts[0];
  const buyer = accounts[1];
  const tokensAvailable = 750000000;
  const numberOfTokens = 10;

  it('init the contract with correct values', function() {
    return ContractTokenSale.deployed().then(function(instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address;
    })
    .then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.tokenContract();
    })
    .then(function(address) {
      assert.notEqual(address, 0x0, 'has token contract address');
      return tokenSaleInstance.tokenPrice();
    })
    .then(function(price) {
      assert.equal(price, tokenPrice, 'token price is correct');
    });
  });

  it('facilitates token buying', function() {
    return ContractToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return ContractTokenSale.deployed();
    })
    .then(function (instance) {
      tokenSaleInstance = instance;
      // Provision 75% of all tokens to sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
    })
    .then(function (receipt) {
      const value = numberOfTokens * tokenPrice;
      return tokenSaleInstance.buy(numberOfTokens, {from: buyer, value: value});
    })
    .then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'trigger one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be "Sell" event');
      assert.equal(receipt.logs[0].args.buyer, buyer, 'logs the account purchased tokens');
      assert.equal(receipt.logs[0].args.amount, numberOfTokens, 'logs the number of purchased tokens');
      return tokenSaleInstance.sold();
    })
    .then(function (amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens');
      return tokenInstance.balanceOf(buyer);
    })
    .then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    })
    .then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      return tokenSaleInstance.buy(numberOfTokens, {from: buyer, value: 1});
    })
    .then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal numbers of tokens in wei')
      return tokenSaleInstance.buy(8000000000, { from: buyer, value: numberOfTokens * tokenPrice });
    })
    .then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more than tokens available');
    });
  });

  it('ends token sale', function() {
    return ContractToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return ContractTokenSale.deployed();
    })
    .then(function (instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.end({ from: buyer });
    })
    .then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'must be an admin');
        return tokenSaleInstance.end({ from: admin });
    })
    .then(function(receipt) {
      return tokenInstance.balanceOf(admin);
    })
    .then(function(balance) {
      assert.equal(balance.toNumber(), 9999999990, 'return all unsold tokens to admin');
      // check token price was reset after selfDestruct
      return web3.eth.getCode(admin)
    })
    .then(function(address) {
      assert.equal(address, '0x', 'has no token contract address after selfdestruct');
    });
  });
});