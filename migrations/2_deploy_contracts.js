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
      await deployer.deploy(FirstContract, {gas: 4612388, from: "0xEE36d99d9Af96F1EF2FC86a257d47f72a77dE51f"});
      let firstContract = await FirstContract.deployed();

      await deployer.deploy(SecondContract, {gas: 4612388, from: "0xB7476c61E9805Cf3a67256448BB5F700a4b1DAD7"});
      let secondContract = await SecondContract.deployed();

      await deployer.deploy(InstuteContract, {gas: 4612388, from: "0xD0cfd5e97650cD3b197E00fc91C267808A3447A5"});
      let instuteContract = await InstuteContract.deployed();

      console.log(" deployed "+firstContract +" AND "+secondContract +" AND "+instuteContract);
      
    } catch (error) {
      console.log(error)

    }
  })
}