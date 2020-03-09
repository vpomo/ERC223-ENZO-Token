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
    });

    it('get address contract Token B', async ()  => {
        assert.notEqual(undefined, newTokenContract.address);
    });

    it('init contracts Token A & Token B', async ()  => {
        await newTokenContract.setContractUser(oldTokenContract.address, true);
        await newTokenContract.initContractTokenA(oldTokenContract.address);
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

await newTokenContract.hghghghg();
    });

// it('verification burning a token A', async ()  => {
    //     var balanceAccountTwoBefore = await oldTokenContract.balanceOf(accounts[2]);
    //     var result = await oldTokenContract.transfer(accounts[2], OneTransferToken*4, {from:owner});
    //     //console.log(JSON.stringify(result));
    //     var balanceAccountTwoAfter = await oldTokenContract.balanceOf(accounts[2]);
    //     assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
    //     assert.equal(0, balanceAccountTwoBefore);
    //     assert.equal(OneTransferToken*4, balanceAccountTwoAfter);
    //
    //     balanceAccountTwoBeforenewTokenContract = await newTokenContract.balanceOf(accounts[2]);
    //     assert.equal(0, balanceAccountTwoBeforenewTokenContract);
    //
    //     await oldTokenContract.burn(OneTransferToken*2, {from:accounts[2]});
    //     balanceAccountTwoAfter = await oldTokenContract.balanceOf(accounts[2]);
    //     assert.equal(OneTransferToken*2, balanceAccountTwoAfter);
    //
    //     balanceAccountTwoAfternewTokenContract = await newTokenContract.balanceOf(accounts[2]);
    //     assert.equal(OneTransferToken*2, balanceAccountTwoAfternewTokenContract);
    // });

//     it('verification burning a token B', async ()  => {
//         var totalSupplyB = await newTokenContract.totalSupply.call();
//         assert.equal(OneTransferToken*2, totalSupplyB);
//         //console.log(JSON.stringify(totalSupplyB));
//
//         var arrayAddresses = [accounts[3], accounts[4], accounts[5]];
//         var balanceAccountTwoBefore = await newTokenContract.balanceOf(accounts[2]);
//         //console.log("balanceAccountTwoBefore = " + balanceAccountTwoBefore);
//         var result = await newTokenContract.burn.call(OneTransferToken*2, arrayAddresses, {from:accounts[2]});
//         //console.log("result = " + result);
//         await newTokenContract.burn(OneTransferToken*2, arrayAddresses, {from:accounts[2]});
//         var balanceAccountTwoAfter = await newTokenContract.balanceOf(accounts[2]);
//         //console.log("balanceAccountTwoAfter = " + balanceAccountTwoAfter);
//         assert.isTrue(balanceAccountTwoBefore > balanceAccountTwoAfter);
//
//         var remain = OneTransferToken*2 % 3;
//         assert.equal(remain, balanceAccountTwoAfter);
//         assert.equal(OneTransferToken*2, balanceAccountTwoBefore);
//
//         var balanceAccountThreeAfter = await oldTokenContract.balanceOf(accounts[3]);
//         //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
//         var withoutRemain = Number((OneTransferToken*2 - remain)/3);
//         //console.log("withoutRemain = " + withoutRemain);
//         assert.equal(withoutRemain, balanceAccountThreeAfter);
// });


});



