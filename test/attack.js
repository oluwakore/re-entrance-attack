const {expect} = require('chai')
const {BigNumber} = require('ethers')
const {parseEther} = require('ethers/lib/utils')
const { ethers } = require("hardhat")

describe("Attack", function() {
  it("Should empty the balance of the good contract", async function() {
    const goodContract = await ethers.getContractFactory("GoodContract");
    const deployedGoodContract = await goodContract.deploy();
    await deployedGoodContract.deployed();

    const badContract = await ethers.getContractFactory("BadContract");
    const deployedBadContract = await badContract.deploy(deployedGoodContract.address);
    await deployedBadContract.deployed();

    const [_, innocentAddress, attackerAddress] = await ethers.getSigners()

    // Innocent User deposits 10ETH into GoodContract
    let tx = await deployedGoodContract.connect(innocentAddress).addBalance({
      //convert to bigNumber from ether
      value: parseEther("10"),
    })

    await tx.wait()
      // check balance of good contract for 10 ETH
    let balanceETH = await ethers.provider.getBalance(deployedGoodContract.address)
    expect(balanceETH).to.equal(parseEther("10"))

    // Attacker calls the attack function on BadContract
    // and sends 1 ETH
    tx = await deployedBadContract.connect(attackerAddress).attack({
      value: parseEther("1")
    })

    await tx.wait()

    //Balance of the GoodContract is now zero
    balanceETH = await ethers.provider.getBalance(deployedGoodContract.address)
    expect(balanceETH).to.equal(BigNumber.from("0"))

    //Balance of BadContract is now 11 ETH
    balanceETH = await ethers.provider.getBalance(deployedBadContract.address)
    expect(balanceETH).to.equal(parseEther("11"))
  })
})