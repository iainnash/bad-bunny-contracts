import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";
import { ethers, deployments } from "hardhat";
import { ERC721Base, BadBunnyVirus__factory, TestBase, BadBunnyVirus } from "../typechain";

describe("BaseMetadataToken", () => {
  let signer: SignerWithAddress;
  let signer2: SignerWithAddress;
  let signerAddress: string;
  let signer2Address: string;
  let childNft: BadBunnyVirus;
  let baseNft: ERC721Base;

  beforeEach(async () => {
    const { BadBunnyVirus } = await deployments.fixture([
      "ERC721Base",
      "BadBunnyVirus",
    ]);

    childNft = (await ethers.getContractAt(
      "BadBunnyVirus",
      BadBunnyVirus.address
    )) as BadBunnyVirus;
    baseNft = (await ethers.getContractAt(
      "TestBase",
      BadBunnyVirus.address
    )) as TestBase;

    [signer, signer2] = await ethers.getSigners();
    [signerAddress, signer2Address] = [await signer.getAddress(), await signer2.getAddress()];
  });

  it('has minted', async () => {
    await childNft.mintOrigin();
    expect(await baseNft.ownerOf(0)).to.be.equal(signerAddress);
    await baseNft.transferFrom(signerAddress, signer2Address, 0);
    expect(await baseNft.balanceOf(signerAddress)).to.be.equal(1);
    expect(await baseNft.balanceOf(signer2Address)).to.be.equal(1);
    expect(await childNft.lastDepth(1)).to.be.equal(0);
    expect(await childNft.lastDepth(0)).to.be.equal(1);
    await baseNft.connect(signer2).transferFrom(signer2Address, signerAddress, 0);
    expect(await baseNft.balanceOf(signerAddress)).to.be.equal(2);
    expect(await baseNft.balanceOf(signer2Address)).to.be.equal(1);
    expect(await childNft.lastDepth(0)).to.be.equal(2);
    expect(await childNft.lastDepth(1)).to.be.equal(0);
    expect(await childNft.lastDepth(2)).to.be.equal(1);
  });
  it('only allows origin mint by admin', () => {

  });
});
