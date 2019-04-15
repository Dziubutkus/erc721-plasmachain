const MyRinkebyToken = artifacts.require('./MyRinkebyToken.sol')

module.exports = function (deployer, network, accounts) {
  if (network !== 'rinkeby') {
    return
  }

  deployer.then(async () => {
    await deployer.deploy(MyRinkebyToken, "HOE", "HOE")
    const myTokenInstance = await MyRinkebyToken.deployed()
        
    console.log('\n*************************************************************************\n')
    console.log(`MyRinkebyToken Contract Address: ${myTokenInstance.address}`)
    console.log('\n*************************************************************************\n')
  })
}
