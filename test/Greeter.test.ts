import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { viem } from 'hardhat';
import { getAddress, GetContractReturnType } from 'viem';
import {
  type WalletClient,
  type PublicClient,
} from '@nomicfoundation/hardhat-viem/types';
import { deployGreeterFixture } from '@/test/fixture/Greeter.fixture';
import { Greeter$Type } from '@/artifacts/contracts/Greeter.sol/Greeter';

describe('Greeter', function () {
  let publicClient: PublicClient;
  let greeter: GetContractReturnType<Greeter$Type['abi']>;
  let greeting: string;
  let owner: WalletClient;
  let signer: WalletClient;

  beforeEach(async function () {
    const {
      publicClientMock,
      greeterMock,
      greetingMock,
      ownerMock,
      signerMock,
    } = await loadFixture(deployGreeterFixture);
    publicClient = publicClientMock;
    greeter = greeterMock;
    greeting = greetingMock;
    owner = ownerMock;
    signer = signerMock;
  });

  describe('Deployment', function () {
    it('Should set the right greeting', async function () {
      expect(await greeter.read.getGreeting()).to.equal(greeting);
    });
  });

  describe('Set Greeting', function () {
    it('Should revert with the right error if the same greeting', async function () {
      await expect(greeter.write.setGreeting([greeting])).to.be.rejectedWith(
        'ExactGreetingError()',
      );
    });

    it('Should set new greeting', async function () {
      // Increase the time in Hardhat Network
      const timestamp = BigInt((await time.latest()) + 1000);
      await time.increaseTo(timestamp);

      // Retrieve the contract with a different account
      const setGreeterAsSigner = await viem.getContractAt(
        'Greeter',
        greeter.address,
        { client: { wallet: signer } },
      );

      const newGreeting = 'Hello world';
      await setGreeterAsSigner.write.setGreeting([newGreeting]);
      expect(await setGreeterAsSigner.read.getGreeting()).to.equal(newGreeting);
    });
  });

  describe('Events', function () {
    it('Should emit an event on getGreeting', async function () {
      const newGreeting = 'Hello world';
      const hash = await greeter.write.setGreeting([newGreeting]);
      await publicClient.waitForTransactionReceipt({ hash });

      // get the setGreeting events in the latest block
      const setGreetingEvents = await greeter.getEvents.SetGreeting();
      expect(setGreetingEvents).to.have.lengthOf(1);
      expect(setGreetingEvents[0].args.caller).to.equal(
        getAddress(owner.account.address),
      );
      expect(setGreetingEvents[0].args.greeting).to.equal(newGreeting);
    });
  });
});
