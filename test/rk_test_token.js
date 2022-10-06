const ContractToken = artifacts.require("ContractToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ContractToken", function (accounts) {
  let tokenInstance;
  it("should assert true", async function () {
    await ContractToken.deployed();
    return assert.isTrue(true);
  });

  it("init the contract with correct values", function() {
      return ContractToken.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.name();
      }).then(function(name) {
          assert.equal(name, 'RK Token', 'has correct name');
          return tokenInstance.symbol();
      }).then(function(symbol) {
        assert.equal(symbol, 'RKT', 'has correct symbol');
        return tokenInstance.version();
      }).then(function(version) {
        assert.equal(version, 'RK Token v1.0', 'has correct standart');
        return tokenInstance;
      });
  });

  it("allocates initial supply upon deployment", function() {
      return ContractToken.deployed()
          .then(function (instance) {
              tokenInstance = instance;
              return tokenInstance.totalSupply();
          })
          .then(function (totalSupply) {
              assert.equal(totalSupply.toNumber(), 10e9, 'sets the total supply to 1,000,000,000');
              return tokenInstance.balanceOf(accounts[0])
          })
          .then(function (balance) {
              assert.equal(balance.toNumber(), 10e9, 'it allocates initial supply to the admin balance');
          });
  });

  it("transfers token ownership", function() {
    return ContractToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        // check insufficient balance
        return tokenInstance.transfer.call(accounts[1], 10e10);
      })
      .then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
        return tokenInstance.transfer.call(accounts[1], 2500000, {from: accounts[0]});
      })
      .then(function(success) {
        assert.equal(success, true, 'should return true');
        return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, 'trigger one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be "Transfer" event');
        assert.equal(receipt.logs[0].args.from, accounts[0], 'logs the account tokens are transferred from');
        assert.equal(receipt.logs[0].args.to, accounts[1], 'logs the account tokens are transferred to');
        assert.equal(receipt.logs[0].args.value.toNumber(), 250000, 'logs the account tokens are transferred to');
        return tokenInstance.balanceOf(accounts[1])
      })
      .then(function(balance) {
          assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
          return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function(balance) {
          assert.equal(balance.toNumber(), 9999750000, 'deduct the amount from the sending account');
      });
    });

    it('approves tokens for delegated transfer', function() {
      return ContractToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
      })
      .then(function(success) {
        assert.equal(success, true, 'it returns true');
        return tokenInstance.approve(accounts[1], 100);
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, 'trigger one event');
        assert.equal(receipt.logs[0].event, 'Approval', 'should be "Approval" event');
        assert.equal(receipt.logs[0].args.owner, accounts[0], 'logs the account tokens are authorized by');
        assert.equal(receipt.logs[0].args.spender, accounts[1], 'logs the account tokens are authorized to');
        assert.equal(receipt.logs[0].args.value.toNumber(), 100, 'logs the transfer amount');
        return tokenInstance.allowance(accounts[0], accounts[1]);
      })
      .then(function(allowance) {
        assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer')
      })
    });

    it('handles delegated token transfers', function() {
      return ContractToken.deployed()
        .then(function(instance) {
          tokenInstance = instance;
          fromAccount = accounts[2];
          toAccount = accounts[3];
          spendingAccount = accounts[4];
          // transfer some tokens to fromAccount
          tokenInstance.transfer(fromAccount, 100, { from: accounts[0 ]});
        })
        .then(function (receipt) {
          // approve spendingAccount to spend 10 tokens from fromAccount
          return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        })
        .then(function (receipt) {
          // try transferring something larger than the sender's balance
          return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
        })
        .then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'cannot transfer value greater than balance');
          // try transferring something larger than approved amount
          return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        })
        .then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'cannot transfer value greater than approved amount');
          return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        })
        .then(function(success) {
          assert.equal(success, true);
          return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, 'trigger one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be "Transfer" event');
          assert.equal(receipt.logs[0].args.from, fromAccount, 'logs the account tokens are transferred from');
          assert.equal(receipt.logs[0].args.to, toAccount, 'logs the account tokens are transfered to');
          assert.equal(receipt.logs[0].args.value.toNumber(), 10, 'logs the transfer amount');
          return tokenInstance.balanceOf(fromAccount);
        })
        .then(function(balance) {
          assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
          return tokenInstance.balanceOf(toAccount);
        })
        .then(function(balance) {
          assert.equal(balance.toNumber(), 10, 'add the amount from the sending account');
          return tokenInstance.allowance(fromAccount, spendingAccount);
        })
        .then(function(allowance) {
          assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        })
    });
});
