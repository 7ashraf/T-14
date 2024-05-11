import Land from '../contracts/artifacts/contracts/Land.sol/Land.json'
import Oracle from '../contracts/artifacts/contracts/Oracle.sol/Oracle.json'
import DAO from '../contracts/artifacts/contracts/DAO.sol/MainDao.json'
import SubDAOContract from '../contracts/artifacts/contracts/Dao.sol/SubDAOContract.json'
import LandMarket from '../contracts/artifacts/contracts/LandMarket.sol/LandMarketPlace.json'

export const landAbi = Land.abi;
export const landAddress = '0x720472c8ce72c2A2D711333e064ABD3E6BbEAdd3'

export const oracleContractAbi = Oracle.abi;
export const oracleContractAddress = '0xAA292E8611aDF267e563f334Ee42320aC96D0463'

export const daoContractAbi = DAO.abi;
export const daoContractAddress = '0x5c74c94173F05dA1720953407cbb920F3DF9f887'

export const subDaoContractAbi = SubDAOContract.abi;
export const subDaoContractAddress = '0x5067457698Fd6Fa1C6964e416b3f42713513B3dD'

export const landMarketContractAbi = LandMarket.abi;
export const landMarketContractAddress = '0xe8D2A1E88c91DCd5433208d4152Cc4F399a7e91d'

