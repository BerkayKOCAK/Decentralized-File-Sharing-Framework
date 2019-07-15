/*const SimpleStorage1 = artifacts.require("./SimpleStorage.sol");
const SimpleStorage2 = artifacts.require("./SimpleStorage2.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage1, {gas: 4612388, from: "0x982614871696c23D209CDcfA7C89e002B48D8E46"});
  deployer.deploy(SimpleStorage2, {gas: 4612388, from: "0xc0C55406744183a7834A19cf7bFB197b767Be29F"});
  
};*/


const FirstContract = artifacts.require("./SimpleStorage.sol");
const SecondContract = artifacts.require("./SimpleStorage2.sol");
const InstuteContract = artifacts.require("./SimpleStorage3.sol");

module.exports = async function (deployer, helper, accounts)  {
  deployer.then(async () => {
    try {
      await deployer.deploy(FirstContract, {gas: 4612388, from: "0x708aF72f36f3D608e9Fa5C9714df8Ad4A28035fF"});
      let firstContract = await FirstContract.deployed();

      await deployer.deploy(SecondContract, {gas: 4612388, from: "0x01D195365f7f42E4B6925f7D954c79D634CE44F8"});
      let secondContract = await SecondContract.deployed();

      await deployer.deploy(InstuteContract, {gas: 4612388, from: "0x59cE9A3eCEE53c4171f86AEDd7f479004E2F8cc2"});
      let instuteContract = await InstuteContract.deployed();

      console.log(" deployed "+firstContract +" AND "+secondContract +" AND "+instuteContract);
      
    } catch (error) {
      console.log(error)

    }
  })
}