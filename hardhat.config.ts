import { type HardhatUserConfig } from 'hardhat/config';

import 'tsconfig-paths/register';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'hardhat-docgen';
import 'solidity-coverage';

import {
  getForkNetworkConfig,
  getHardhatNetworkConfig,
  getNetworkConfig,
} from '@/config/networks';
import { env } from '@/env';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.26',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: env.FORKING_NETWORK
      ? getForkNetworkConfig(env.FORKING_NETWORK)
      : getHardhatNetworkConfig(),
    arbitrum: getNetworkConfig('arbitrum'),
    avalanche: getNetworkConfig('avalanche'),
    avalanch_fuji: getNetworkConfig('avalanche_fuji'),
    bsc: getNetworkConfig('bsc'),
    bsc_testnet: getNetworkConfig('bsc_testnet'),
    fantom: getNetworkConfig('fantom'),
    fantom_testnet: getNetworkConfig('fantom_testnet'),
    ethereum: getNetworkConfig('ethereum'),
    local: getNetworkConfig('local'),
    optimism: getNetworkConfig('optimism'),
    polygon: getNetworkConfig('polygon'),
    polygon_mumbai: getNetworkConfig('polygon_mumbai'),
    sepolia: getNetworkConfig('sepolia'),
    ultron: getNetworkConfig('ultron'),
    ultron_testnet: getNetworkConfig('ultron_testnet'),
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
    excludeContracts: [],
    src: './contracts',
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: {
      arbitrumOne: env.ARBISCAN_API_KEY,
      avalanche: env.SNOWTRACE_API_KEY,
      avalancheFujiTestnet: env.SNOWTRACE_API_KEY,
      bsc: env.BSCSCAN_API_KEY,
      bscTestnet: env.BSCSCAN_API_KEY,
      opera: env.FANTOMSCAN_API_KEY,
      ftmTestnet: env.FANTOMSCAN_API_KEY,
      mainnet: env.ETHERSCAN_API_KEY,
      optimisticEthereum: env.OPTIMISM_API_KEY,
      polygon: env.POLYGONSCAN_API_KEY,
      polygonMumbai: env.POLYGONSCAN_API_KEY,
      sepolia: env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'rinkeby',
        chainId: 4,
        urls: {
          apiURL: 'https://api-rinkeby.etherscan.io/api',
          browserURL: 'https://rinkeby.etherscan.io',
        },
      },
    ],
  },
};

export default config;
