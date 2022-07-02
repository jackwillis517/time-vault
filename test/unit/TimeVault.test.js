const { expect, assert } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("TimeVault", async function () {
    let timeVault
    let deployer
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async function () {
        //Get deployer from accounts so we have access to an account
        deployer = (await getNamedAccounts()).deployer

        //Deploy TimeVault contract using hardhat-deploy before testing
        await deployments.fixture(["all"])

        //Get the TimeVault contract with ethers
        timeVault = await ethers.getContract("TimeVault", deployer)
    })

    describe("deposit", async function () {
        it("Fails if you don't send ETH to lock up", async function () {
            await expect(timeVault.deposit()).to.be.revertedWith("You must deposit ETH.")
        })
        it("Updates the deposits mapping successfully", async function () {
            await timeVault.deposit({ value: sendValue })
            const response = await timeVault.deposits(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Accepts ETH from sender successfully", async function () {
            await timeVault.deposit({ value: sendValue })
            const response = await timeVault.provider.getBalance(timeVault.address)
            assert.equal(response.toString(), sendValue.toString())
        })
    })

    describe("increaseTime", async function () {
        it("Updates the time mapping successfully", async function () {
            const timeAdded = 10;
            await timeVault.deposit({ value: sendValue })
            const originalTime = await timeVault.times(deployer)
            await timeVault.increaseTime(timeAdded)
            const newTime = await timeVault.times(deployer)
            assert.equal(newTime - originalTime, timeAdded)
        })
    })

    describe("getDeposit", async function () {
        it("Gets the deposit of deployer successfully", async function () {
            await timeVault.deposit({ value: sendValue })
            const response = await timeVault.getDeposit()
            assert.equal(response.toString(), (sendValue / 1e18).toString())
        })
    })
})