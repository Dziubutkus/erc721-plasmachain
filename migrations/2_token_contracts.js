const MyToken = artifacts.require('./MyToken.sol')

const gatewayAddress = '0xe754d9518bf4a9c63476891ef9AA7d91C8236A5D'

module.exports = function (deployer, network, accounts) {
  if (network === 'rinkeby') {
    return
  }

  deployer.then(async () => {
    await deployer.deploy(MyToken, gatewayAddress, "HOE", "HOE")
    const myTokenInstance = await MyToken.deployed()
        
    console.log('\n*************************************************************************\n')
    console.log(`MyToken Contract Address: ${myTokenInstance.address}`)
    console.log('\n*************************************************************************\n')
  })
}
