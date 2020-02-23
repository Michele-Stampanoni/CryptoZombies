
//import truffle assertions
const truffleAssert = require('truffle-assertions') 

// import the contract artifact
const ZombieFactory = artifacts.require('./ZombieFactory.sol')
const ZombieHelper = artifacts.require('./ZombieHelper.sol') 


// test starts here
contract('ZombieFactory', function (accounts) {
    // predefine the contract instance
    let ZombieFactoryInstance
  
// before each test, creates a new contract instance
   beforeEach(async function () {   
    ZombieFactoryInstance = await ZombieFactory.new()
    })  
    
// first test:
it('should create one zombie per address', async function () {
await ZombieFactoryInstance.createZombie
let ownerZombieCount = await ZombieFactoryInstance.accounts[0] 
assert.equal(ownerZombieCount = msg.sender, 1, 'more than one zombie can be created per address')
})

// second test:
 it('should not be able to create a second zombie from the same address', async function () {
await ZombieHelperInstance.address
let zombieToOwner = await ZombieHelperInstance.ownerZombieCount
assert.equal(zombieToOwner = owner, 'second zombie created')
})

//third test:
it('should set the correct zombie name', async function () {
 await ZombieHelperInstance.changeName
 let zombieId = await ZombieHelperInstance.onlyOwnerOf
 assert.equal(zombies[zombieId].name = newName, 'incorrect zombie name')
}) 
})