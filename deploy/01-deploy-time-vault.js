const { network } = require("hardhat")
const { verify } = require("../utils/verify")

//hre = hardhat runtime enviroment

//Using hardhat-deploy for deployment

//Here instead of passing the hre object as an argument to this async function 
//and calling functions using . we just get the functions from hre with the following syntax

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const timeVault = await deploy("TimeVault", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //If we are deploying to mainnets or testnets we want to verify on Etherscan
    if(network.name != "localhost" && network.name != "hardhat" && process.env.ETHERSCAN_API_KEY){
        await verify(timeVault.address, timeVault.args)
    }

    log("----------------------------------------")
}

module.exports.tags = ["all", "timeVault"]