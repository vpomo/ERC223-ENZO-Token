var OldToken = artifacts.require("./OldToken.sol");
var EnzoToken = artifacts.require("./EnzoToken.sol");

var contractA;
var contractB;
//var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
var maxTotalSupply = 1e27;
var OneToken = 121;

contract('OldToken', (accounts) => {
    var owner = accounts[0];

    it('should deployed contract Token A', async ()  => {
        assert.equal(undefined, contractA);
        contractA = await OldToken.deployed();
        assert.notEqual(undefined, contractA);
    });

    it('get address contract Token A', async ()  => {
        assert.notEqual(undefined, contractA.address);
    });
});

contract('EnzoToken', (accounts) => {
    var owner = accounts[0];

    it('should deployed contract Token B', async ()  => {
        assert.equal(undefined, contractB);
        contractB = await EnzoToken.deployed();
        assert.notEqual(undefined, contractB);
    });

    it('get address contract Token B', async ()  => {
        assert.notEqual(undefined, contractB.address);
    });

    it('init contracts Token A & Token B', async ()  => {
        await contractB.setContractUser(contractA.address, true);
        await contractA.initContractTokenB(contractB.address);

        await contractA.setContractUser(contractB.address, true);
        await contractB.initContractTokenA(contractA.address);
    });

    it('verification balance contracts', async ()  => {
        var totalSupplyA = await contractA.totalSupply.call();
        //console.log(JSON.stringify(totalSupplyTest));
        assert.equal( 1e12, Number(totalSupplyA));

        var balanceOwnerA = await contractA.balanceOf(owner);
        //console.log("balanceOwnerA = " + balanceOwnerA);
        assert.equal(Number(totalSupplyA), balanceOwnerA);

        var totalSupplyB = await contractB.totalSupply.call();
        assert.equal( 0, Number(totalSupplyB));

        var balanceOwnerB = await contractB.balanceOf(owner);
        assert.equal(Number(totalSupplyB), balanceOwnerB);

    });

    it('verification burning a token A', async ()  => {
        var balanceAccountTwoBefore = await contractA.balanceOf(accounts[2]);
        var result = await contractA.transfer(accounts[2], OneToken*4, {from:owner});
        //console.log(JSON.stringify(result));
        var balanceAccountTwoAfter = await contractA.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(OneToken*4, balanceAccountTwoAfter);

        balanceAccountTwoBeforeContractB = await contractB.balanceOf(accounts[2]);
        assert.equal(0, balanceAccountTwoBeforeContractB);

        await contractA.burn(OneToken*2, {from:accounts[2]});
        balanceAccountTwoAfter = await contractA.balanceOf(accounts[2]);
        assert.equal(OneToken*2, balanceAccountTwoAfter);

        balanceAccountTwoAfterContractB = await contractB.balanceOf(accounts[2]);
        assert.equal(OneToken*2, balanceAccountTwoAfterContractB);
    });

    it('verification burning a token B', async ()  => {
        var totalSupplyB = await contractB.totalSupply.call();
        assert.equal(OneToken*2, totalSupplyB);
        //console.log(JSON.stringify(totalSupplyB));

        var arrayAddresses = [accounts[3], accounts[4], accounts[5]];
        var balanceAccountTwoBefore = await contractB.balanceOf(accounts[2]);
        //console.log("balanceAccountTwoBefore = " + balanceAccountTwoBefore);
        var result = await contractB.burn.call(OneToken*2, arrayAddresses, {from:accounts[2]});
        //console.log("result = " + result);
        await contractB.burn(OneToken*2, arrayAddresses, {from:accounts[2]});
        var balanceAccountTwoAfter = await contractB.balanceOf(accounts[2]);
        //console.log("balanceAccountTwoAfter = " + balanceAccountTwoAfter);
        assert.isTrue(balanceAccountTwoBefore > balanceAccountTwoAfter);

        var remain = OneToken*2 % 3;
        assert.equal(remain, balanceAccountTwoAfter);
        assert.equal(OneToken*2, balanceAccountTwoBefore);

        var balanceAccountThreeAfter = await contractA.balanceOf(accounts[3]);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        var withoutRemain = Number((OneToken*2 - remain)/3);
        //console.log("withoutRemain = " + withoutRemain);
        assert.equal(withoutRemain, balanceAccountThreeAfter);
});


});



