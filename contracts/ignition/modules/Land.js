const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const LandModule = buildModule("LandModule", (m) => {
    const land = m.contract("Land", ["testUri"]);
  
    return { land };
});
module.exports = LandModule;