import { type GetContractReturnType } from '@nomicfoundation/hardhat-viem/types';
import { type Abi } from 'viem';
import { z } from 'zod';

const networks = [
  'arbitrum',
  'avalanche',
  'avalanche_fuji',
  'bsc',
  'bsc_testnet',
  'ethereum',
  'fantom',
  'fantom_testnet',
  'hardhat',
  'local',
  'optimism',
  'polygon',
  'polygon_mumbai',
  'sepolia',
  'ultron',
  'ultron_testnet',
] as const;
export const networksEnum = z.enum(networks);

export type Network = z.infer<typeof networksEnum>;
export type RpcUrl = string;

export type Contract<
  T extends { abi: Abi | readonly unknown[] } = { abi: [] },
> = GetContractReturnType<T['abi']>;

export type NetworkConfig<T> = Record<Network, T>;
