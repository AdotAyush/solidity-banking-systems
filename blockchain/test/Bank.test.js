const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank Contract", function () {
  let Bank;
  let bank;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await bank.owner()).to.equal(owner.address);
    });
  });

  describe("User Registration", function () {
    it("Should register a new user", async function () {
      await bank.connect(user1).registerUser(user1.address);
      expect(await bank.isRegistered(user1.address)).to.be.true;
    });

    it("Should emit UserRegistered event", async function () {
      await expect(bank.connect(user1).registerUser(user1.address))
        .to.emit(bank, "UserRegistered")
        .withArgs(user1.address, await ethers.provider.getBlockNumber());
    });

    it("Should not allow duplicate registration", async function () {
      await bank.connect(user1).registerUser(user1.address);
      await expect(
        bank.connect(user1).registerUser(user1.address)
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Deposits", function () {
    beforeEach(async function () {
      await bank.connect(user1).registerUser(user1.address);
    });

    it("Should allow deposit for registered user", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await expect(
        bank.connect(user1).deposit({ value: depositAmount })
      ).to.emit(bank, "Deposit");

      expect(await bank.getBalance(user1.address)).to.equal(depositAmount);
    });

    it("Should not allow deposit for unregistered user", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await expect(
        bank.connect(user2).deposit({ value: depositAmount })
      ).to.be.revertedWith("User not registered");
    });

    it("Should not allow zero deposit", async function () {
      await expect(
        bank.connect(user1).deposit({ value: 0 })
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await bank.connect(user1).registerUser(user1.address);
      await bank.connect(user1).deposit({ value: ethers.parseEther("2.0") });
    });

    it("Should allow withdrawal", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      await expect(
        bank.connect(user1).withdraw(withdrawAmount)
      ).to.emit(bank, "Withdraw");

      expect(await bank.getBalance(user1.address)).to.equal(
        ethers.parseEther("1.0")
      );
    });

    it("Should not allow withdrawal exceeding balance", async function () {
      const withdrawAmount = ethers.parseEther("3.0");
      await expect(
        bank.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should not allow zero withdrawal", async function () {
      await expect(
        bank.connect(user1).withdraw(0)
      ).to.be.revertedWith("Withdrawal amount must be greater than 0");
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      await bank.connect(user1).registerUser(user1.address);
      await bank.connect(user2).registerUser(user2.address);
      await bank.connect(user1).deposit({ value: ethers.parseEther("2.0") });
    });

    it("Should allow transfer between registered users", async function () {
      const transferAmount = ethers.parseEther("1.0");
      await expect(
        bank.connect(user1).transfer(user2.address, transferAmount)
      ).to.emit(bank, "Transfer");

      expect(await bank.getBalance(user1.address)).to.equal(
        ethers.parseEther("1.0")
      );
      expect(await bank.getBalance(user2.address)).to.equal(transferAmount);
    });

    it("Should not allow transfer to unregistered user", async function () {
      const [unregistered] = await ethers.getSigners();
      const transferAmount = ethers.parseEther("1.0");
      await expect(
        bank.connect(user1).transfer(unregistered.address, transferAmount)
      ).to.be.revertedWith("Recipient not registered");
    });

    it("Should not allow transfer exceeding balance", async function () {
      const transferAmount = ethers.parseEther("3.0");
      await expect(
        bank.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.revertedWith("Insufficient balance");
    });
  });
});

