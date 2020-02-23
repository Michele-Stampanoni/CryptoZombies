
//import truffle assertions
const truffleAssert = require('truffle-assertions') 

// import the contract artifact
const ZombieFactory = artifacts.require('./ZombieFactory.sol')


// test starts here
contract('ZombieFactory', function (accounts) {
    // predefine the contract instance
    let ZombieFactoryInstance
  
// before each test, creates a new contract instance
    beforeEach(async function () {   
      ZombieFactoryInstance = await ZombieFactory.new()

// first test:
it('should create one zombie per address', async function () {
let onlyOwnerOf = await ZombieFactoryInstance.address
 assert.equal(ownerZombieCount = msg.sender, 1, 'more than one zombie can be created per address')
})

//second test:
it('should set the correct zombie name', async function () {
 let zombieId = await ZombieFactoryInstance.onlyOwnerOf
 assert.equal(zombies[zombieId].name = newName, 'incorrect zombie name')
}) 
 ))  
    
