const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const LandMarketModule = buildModule("LandMarketModule", (m) => {
    const landMarktet = m.contract("LandMarketplace", [0x2969849031fA7796B9DF2CE0520324F3935C8BeE]);
  
    return { landMarktet };
});
module.exports = LandMarketModule;