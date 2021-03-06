module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer, erc721base } = await getNamedAccounts();

  let baseAddress = erc721base;
  // Deploy in testnet or when no base is deployed
  if (!baseAddress) {
    baseAddress = (await deployments.get("TestBase")).address;
  }

  await deploy("BadBunnyVirus", {
    from: deployer,
    args: [baseAddress],
    log: true,
  });
};
module.exports.tags = ["BadBunnyVirus"];
module.exports.dependencies = ["TestBase"];
