var EnzoToken = artifacts.require("./EnzoToken.sol");

var newTokenContract;
//var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
var maxTotalSupply = Number(21e27);
var OneTransferToken = web3.utils.toBN(10000);
//4000000000000000000

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

    it('verification balance contracts', async ()  => {
        var totalSupplyB = await newTokenContract.totalSupply.call();
        assert.equal( maxTotalSupply, Number(totalSupplyB));

        var balanceOwnerB = await newTokenContract.balanceOf(owner);
        assert.equal(Number(totalSupplyB), balanceOwnerB);
    });

    it('verification batchTransfer new token', async ()  => {
        console.log("owner", accounts[0]);
        console.log("wallet 2", accounts[2]);

        var balanceAccount2Before = await newTokenContract.balanceOf(accounts[2]);
        assert.equal(0, Number(balanceAccount2Before));

        var balanceAccount3Before = await newTokenContract.balanceOf(accounts[3]);
        assert.equal(0, Number(balanceAccount3Before));

        var balanceAccountOwnerBefore = await newTokenContract.balanceOf(accounts[0]);
        assert.equal(21e27, Number(balanceAccountOwnerBefore));
        console.log("balance owner", Number(balanceAccountOwnerBefore));

        var recipients = [accounts[2], accounts[3]];
        var values = [OneTransferToken*4, OneTransferToken*6];

        await newTokenContract.approve(newTokenContract.address, OneTransferToken*10);
        var result = await newTokenContract.batchTransfer(recipients, values);

        var balanceAccount2After = await newTokenContract.balanceOf(accounts[2]);
        assert.equal(OneTransferToken*4, Number(balanceAccount2After));
        console.log("balance wallet 2 after", Number(balanceAccount2After));

        var balanceAccount3After = await newTokenContract.balanceOf(accounts[3]);
        assert.equal(OneTransferToken*6, Number(balanceAccount3After));
        console.log("balance wallet 3 after", Number(balanceAccount3After));

//assert.equal(true, Number(balanceAccountOwnerAfterNewTokenContract) < Number(balanceAccountOwnerBeforeNewTokenContract));

        // await newTokenContract.hghghghg();
    });

});



