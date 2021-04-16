import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { config } from '../config/deploy'

module.exports = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const { minToWithdraw, oracle } = config.FluxAggregatorSweeper

  const keeperSweeper = await ethers.getContract('KeeperSweeper')

  const sweeper = await deploy('FluxAggregatorSweeper', {
    from: deployer,
    log: true,
    args: [keeperSweeper.address, ethers.utils.parseEther(minToWithdraw.toString()), oracle],
  })

  const tx = await keeperSweeper.addSweeper(sweeper.address)
  await tx.wait()
}

module.exports.tags = ['FluxAggregatorSweeper']
