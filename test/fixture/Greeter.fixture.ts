import { viem, ignition } from 'hardhat';

import GreeterModule from '@/ignition/modules/greeter';
import { type WalletClient } from '@nomicfoundation/hardhat-viem/types';

export async function deployGreeterFixture() {
  const publicClient = await viem.getPublicClient();

  const greeting = 'Hello there!';
  const [owner, signer]: WalletClient[] = await viem.getWalletClients();

  const { greeter } = await ignition.deploy(GreeterModule, {
    parameters: { Greeter: { greeting } },
    defaultSender: owner.account.address,
  });

  return {
    publicClientMock: publicClient,
    greeterMock: greeter,
    greetingMock: greeting,
    ownerMock: owner,
    signerMock: signer,
  };
}
