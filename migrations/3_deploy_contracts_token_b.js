const EnzoToken = artifacts.require('./EnzoToken.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x8087300524FB758a3092046D9E975cd0f6D8a521";
    var admin = "0x5a8C89E24417ee83F1b5B07a1608F7C0eF12E6E2";
    deployer.deploy(EnzoToken, owner, admin);
};
