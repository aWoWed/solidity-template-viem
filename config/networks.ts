import {
  type HardhatNetworkUserConfig,
  type NetworkUserConfig,
} from 'hardhat/types';

import { gwei } from '@/config/constants';
import { type NetworkConfig, type Network } from '@/config/types';
import { env } from '@/env';

const { INFURA_API_KEY, MNEMONIC, MNEMONIC_DEV, PRIVATE_KEY } = env;

export const mnemonics: NetworkConfig<string> = {
  arbitrum: MNEMONIC,
  avalanche: MNEMONIC,
  avalanche_fuji: MNEMONIC_DEV,
  bsc: MNEMONIC,
  bsc_testnet: MNEMONIC_DEV,
  ethereum: MNEMONIC,
  fantom: MNEMONIC,
  fantom_testnet: MNEMONIC_DEV,
  hardhat: MNEMONIC_DEV,
  local: MNEMONIC_DEV,
  optimism: MNEMONIC,
  polygon: MNEMONIC,
  polygon_mumbai: MNEMONIC_DEV,
  sepolia: MNEMONIC_DEV,
  ultron: MNEMONIC,
  ultron_testnet: MNEMONIC_DEV,
};

export const chainIds: NetworkConfig<number> = {
  arbitrum: 42161,
  avalanche: 43114,
  avalanche_fuji: 433113,
  bsc: 56,
  bsc_testnet: 97,
  ethereum: 1,
  fantom: 250,
  fantom_testnet: 4002,
  hardhat: 31337,
  local: 31337,
  optimism: 10,
  polygon: 137,
  polygon_mumbai: 80001,
  sepolia: 11155111,
  ultron: 1231,
  ultron_testnet: 1230,
};

export const gasPrices: NetworkConfig<number> = {
  arbitrum: 10 * gwei,
  avalanche: 8 * gwei,
  avalanche_fuji: 8 * gwei,
  bsc: 1 * gwei,
  bsc_testnet: 5 * gwei,
  ethereum: 10 * gwei,
  fantom: 15 * gwei,
  fantom_testnet: 10 * gwei,
  hardhat: 10 * gwei,
  local: 10 * gwei,
  optimism: 10 * gwei,
  polygon: 15 * gwei,
  polygon_mumbai: 15 * gwei,
  sepolia: 10 * gwei,
  ultron: 20 * gwei,
  ultron_testnet: 10 * gwei,
};

export const rpcUrls: NetworkConfig<string> = {
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  avalanche_fuji: 'https://api.avax-test.network/ext/bc/C/rpc',
  bsc: 'https://binance.llamarpc.com',
  bsc_testnet: 'https://bsc-testnet-rpc.publicnode.com',
  ethereum: INFURA_API_KEY
    ? `https://eth-mainnet.alchemyapi.io/v2/${INFURA_API_KEY}`
    : `https://eth.llamarpc.com`,
  fantom: 'https://rpc.ftm.tools/',
  fantom_testnet: 'https://rpc.testnet.fantom.network/',
  hardhat: 'http://localhost:8545',
  local: 'http://localhost:8545',
  optimism: 'https://mainnet.optimism.io',
  polygon: 'https://polygon-rpc.com',
  polygon_mumbai: 'https://rpc-mumbai.matic.today',
  sepolia: INFURA_API_KEY
    ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
    : 'https://ethereum-sepolia-rpc.publicnode.com',
  ultron: 'https://ultron-rpc.net',
  ultron_testnet: 'https://ultron-dev.io',
};

export const forkingBlocks: NetworkConfig<number | undefined> = {
  arbitrum: 675724,
  avalanche: 49497854,
  avalanche_fuji: 25156420,
  bsc: 41534254,
  bsc_testnet: 43151229,
  ethereum: 20571159,
  fantom: 89481984,
  fantom_testnet: 26636787,
  hardhat: undefined,
  local: undefined,
  optimism: 124287743,
  polygon: 60828172,
  polygon_mumbai: 10957832,
  sepolia: 6538000,
  ultron: 16542895,
  ultron_testnet: 3809512,
};

export const getBaseNetworkConfig = (network: Network): NetworkUserConfig => ({
  accounts: mnemonics[network]
    ? { mnemonic: mnemonics[network] }
    : [PRIVATE_KEY],
  chainId: chainIds[network],
  gasPrice: gasPrices[network],
});

export const getNetworkConfig = (network: Network): NetworkUserConfig => ({
  ...getBaseNetworkConfig(network),
  url: rpcUrls[network],
});

export const getForkNetworkConfig = (
  network: string,
): HardhatNetworkUserConfig => ({
  ...getBaseNetworkConfig(network),
  chainId: chainIds.hardhat,
  accounts: {
    mnemonic: mnemonics[network],
  },
  forking: {
    url: rpcUrls[network],
    blockNumber: forkingBlocks[network],
    enabled: true,
  },
});

export const getHardhatNetworkConfig = (): HardhatNetworkUserConfig => ({
  ...getBaseNetworkConfig('hardhat'),
  accounts: mnemonics.hardhat ? { mnemonic: mnemonics.hardhat } : [PRIVATE_KEY],
});
