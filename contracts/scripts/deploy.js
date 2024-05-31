const { ethers } = require("hardhat");

async function main() {
  // Deploy Lib contract
  const Lib = await ethers.getContractFactory("Lib");
  const lib = await Lib.deploy();
  await lib.waitForDeployment();

  console.log("Lib deployed to:",await  lib.getAddress());

  // Deploy Oracle contract
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();

  console.log("Oracle deployed to:",await  oracle.getAddress());

  // Deploy Dao contract
  const Dao = await ethers.getContractFactory("MainDAO");
  const dao = await Dao.deploy( oracle.getAddress());
  await dao.waitForDeployment();

  console.log("Dao deployed to:",await  dao.getAddress());

  // Deploy Land contract
  const Land = await ethers.getContractFactory("Land");
  const land = await Land.deploy();
  await land.waitForDeployment();

  console.log("Land deployed to:", await land.getAddress());

  // Deploy LandMarket contract
  const LandMarket = await ethers.getContractFactory("LandMarketplace");
  const landMarket = await LandMarket.deploy(await land.getAddress());
  await landMarket.waitForDeployment();

  console.log("LandMarket deployed to:",await  landMarket.getAddress());

  // Deploy SubDao contract
  const SubDao = await ethers.getContractFactory("SubDAOContract");
  const subDao = await SubDao.deploy(lib.getAddress(), dao.getAddress());
  await subDao.waitForDeployment();

  console.log("SubDao deployed to:",await  subDao.getAddress());

  // Set contract addresses in each other contracts
  await oracle.setNFTContractAddress(await land.getAddress());
  //await oracle.setDAOContractAddress(subDao.getAddress());
  //await oracle.setSubDAOContractAddress(await subDao.getAddress())
  const subDaoContractAddress = await subDao.getAddress();
  await oracle.setSubDAOContractAddress(subDaoContractAddress)


  await dao.setOracleAddress(await oracle.getAddress());
  //await dao.setLandMarketAddress(landMarket.getAddress());

  await subDao.setLandMarketAddress(await landMarket.getAddress());
  await subDao.setOracleAddress(await oracle.getAddress());

  await landMarket.setLandNFTContract(await land.getAddress());

  // await dao.setLandAddress(land.address);
  // await dao.setLandMarketAddress(landMarket.address);
  // await dao.setSubDaoAddress(subDao.address);
  // await land.setDaoAddress(dao.address);
  // await landMarket.setDaoAddress(dao.address);
  console.log("Contract addresses set successfully!");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
