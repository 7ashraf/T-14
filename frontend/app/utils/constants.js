import Land from '../contracts/artifacts/contracts/Land.sol/Land.json'
import Oracle from '../contracts/artifacts/contracts/Oracle.sol/Oracle.json'
import DAO from '../contracts/artifacts/contracts/Dao.sol/MainDao.json'
import SubDAOContract from '../contracts/artifacts/contracts/Dao.sol/SubDAOContract.json'
import LandMarket from '../contracts/artifacts/contracts/LandMarket.sol/LandMarketPlace.json'

export const landAbi = Land.abi;
export const landAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

export const oracleContractAbi = Oracle.abi;
export const oracleContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

export const daoContractAbi = DAO.abi;
export const daoContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

export const subDaoContractAbi = SubDAOContract.abi;
export const subDaoContractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

export const landMarketContractAbi = LandMarket.abi;
export const landMarketContractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'

