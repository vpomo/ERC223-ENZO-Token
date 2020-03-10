var OldToken = artifacts.require("./OldToken.sol");
var EnzoToken = artifacts.require("./EnzoToken.sol");

var oldTokenContract;
var newTokenContract;
//var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
var maxTotalSupply = Number(21e27);
var OneTransferToken = web3.utils.toBN(10000);
//4000000000000000000
contract('OldToken', (accounts) => {
    var owner = accounts[0];

    it('should deployed contract Token A', async ()  => {
        assert.equal(undefined, oldTokenContract);
        oldTokenContract = await OldToken.deployed();
        assert.notEqual(undefined, oldTokenContract);
    });

    it('get address contract Token A', async ()  => {
        assert.notEqual(undefined, oldTokenContract.address);
    });
});

contract('EnzoToken', (accounts) => {
    var owner = accounts[0];
    var accountTwo = accounts[2];

    it('should deployed contract Token B', async ()  => {
        assert.equal(undefined, newTokenContract);
        newTokenContract = await EnzoToken.deployed();
        assert.notEqual(undefined, newTokenContract);
        //await newTokenContract.hghghghg();
});

    it('get address contract Token B', async ()  => {
        assert.notEqual(undefined, newTokenContract.address);
    });

    it('init contracts Token A & Token B', async ()  => {
        await newTokenContract.initOldTokenContract(oldTokenContract.address);
    });

    it('verification balance contracts', async ()  => {
        var totalSupplyA = await oldTokenContract.totalSupply.call();
        // console.log(Number(totalSupplyA));
        assert.equal(maxTotalSupply, Number(totalSupplyA));

        var balanceOwnerA = await oldTokenContract.balanceOf(owner);
        //console.log("balanceOwnerA = " + balanceOwnerA);
        assert.equal(Number(totalSupplyA), balanceOwnerA);

        var totalSupplyB = await newTokenContract.totalSupply.call();
        assert.equal( maxTotalSupply, Number(totalSupplyB));

        var balanceOwnerB = await newTokenContract.balanceOf(owner);
        assert.equal(Number(totalSupplyB), balanceOwnerB);

    });

    it('verification exchange old token', async ()  => {
        console.log("owner", accounts[0]);
        console.log("wallet 2", accounts[2]);
        console.log("old contract", oldTokenContract.address);
        console.log("new contract", newTokenContract.address);

        var balanceAccountTwoBefore = await oldTokenContract.balanceOf(accounts[2]);
        // await oldTokenContract.transfer(accounts[2], Number(OneTransferToken*4), {from:owner});
        //console.log("OneTransferToken*4", OneTransferToken*4);

        await oldTokenContract.transfer(accounts[2], OneTransferToken*4, {from:accounts[0]});
        var balanceAccountTwoAfter = await oldTokenContract.balanceOf(accounts[2]);
        //console.log("balanceAccountTwoAfter", Number(balanceAccountTwoAfter));
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(OneTransferToken*4, balanceAccountTwoAfter);

        balanceAccountTwoBeforeNewTokenContract = await newTokenContract.balanceOf(accounts[2]);
        assert.equal(0, balanceAccountTwoBeforeNewTokenContract);

        var balanceAccountOwnerBeforeNewTokenContract = await newTokenContract.balanceOf(accounts[0]);

        await oldTokenContract.increaseApproval(newTokenContract.address, OneTransferToken, {from:accounts[2]})
        await newTokenContract.exchangeOldToken(OneTransferToken, {from:accounts[2]});

        balanceAccountTwoAfter = await oldTokenContract.balanceOf(accounts[2]);
        assert.equal(OneTransferToken*3, balanceAccountTwoAfter);

        var balanceAccountTwoAfterNewTokenContract = await newTokenContract.balanceOf(accounts[2]);
        assert.equal(OneTransferToken*1, Number(balanceAccountTwoAfterNewTokenContract));

        var balanceAccountOwnerAfterNewTokenContract = await newTokenContract.balanceOf(accounts[0]);
        console.log("balanceAccountOwnerBeforeNewTokenContract", Number(balanceAccountOwnerBeforeNewTokenContract));
        console.log("balanceAccountOwnerAfterNewTokenContract", Number(balanceAccountOwnerAfterNewTokenContract));
        console.log("diff", Number(balanceAccountOwnerBeforeNewTokenContract) - Number(balanceAccountOwnerAfterNewTokenContract));
        //assert.equal(true, Number(balanceAccountOwnerAfterNewTokenContract) < Number(balanceAccountOwnerBeforeNewTokenContract));

        // await newTokenContract.hghghghg();
    });

    it('verification claim tokens', async ()  => {
        var balanceAccountOneBefore = await newTokenContract.balanceOf(accounts[1]);
        assert.equal(0, balanceAccountOneBefore);
        await newTokenContract.transfer(accounts[1], OneTransferToken*5, {from:accounts[0]});
        var balanceAccountOneAfter = await newTokenContract.balanceOf(accounts[1]);
        //await newTokenContract.transfer(newTokenContract.address,balanceAccountOneAfter,{from:accounts[1]});
    });

});



