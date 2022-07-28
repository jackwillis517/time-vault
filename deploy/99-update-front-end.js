const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../time-vault-frontend/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../time-vault-frontend/constants/abi.json"

module.exports = async function () {
    if(process.env.UPDATE_FRONT_END){
        updateContractAddresses()
        updateAbi()
    }
}

async function updateAbi() {
    const timeVault = await ethers.getContract("TimeVault")
    fs.writeFileSync(FRONT_END_ABI_FILE, timeVault.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const timeVault = await ethers.getContract("TimeVault")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"))
    if(chainId in currentAddresses){
        if(!currentAddresses[chainId].includes(timeVault.address)){
            currentAddresses[chainId].push(timeVault.address)
        }
    } else {
        currentAddresses[chainId] = [timeVault.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]