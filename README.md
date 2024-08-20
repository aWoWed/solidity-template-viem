# Solidity Template Viem
This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

## Preconditions

1. `.env`-file creation from `.env.example`:
    ```shell
    INFURA_API_KEY="zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"

    MNEMONIC="here is where your twelve words mnemonic should be put my friend"
    MNEMONIC_DEV="here is where your twelve words mnemonic should be put my friend"

    PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1

    FORKING_NETWORK="ethereum"

    # Block explorer API keys
    ARBISCAN_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    BSCSCAN_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    ETHERSCAN_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    FANTOMSCAN_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    OPTIMISM_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    POLYGONSCAN_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    SNOWTRACE_API_KEY="WTCGPYSJB78ZYQBZSKUQRQQ3BI83BQP2RF"
    ```
2. Install dependencies:
    ```shell
    npm ci
    ```

3. Compile smart contracts:
    ```shell
    npm run compile
    npx hardhat compile
    ```

## Development

### Tests running

```shell
npm run test
npx hardhat test
```

### Reporting coverage

```shell
npm run coverage
npx hardhat coverage --solcoverjs ./.solcover.json
```

### Deploying contracts

```shell
npm run deploy ./ignition/modules/greeter.ts --network <network-name> --parameters ./ignition/parameters.json
npx hardhat ignition deploy --network <network-name> --parameters ./ignition/parameters.json 
```

### Running code analyzers

```shell
npm run codestyle
```

### Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Fantom_Testnet.

In order to get FTM(native token of fantomTestnet) follow this [faucet link](https://faucet.fantom.network/)

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your node URL (eg from Alchemy), and the mnemonic of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract, input the `YOUR_GREETING` value to deploy your contract. If it is empty the default value `Hello world!` will be inserted:

```shell
npx hardhat deploy ./ignition/modules/greeter.ts --network fantom_testnet --greeting YOUR_GREETING
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS`, also you should import your constructor value `GREETING` in this command:
```shell
npx hardhat verify --network fantom_testnet DEPLOYED_CONTRACT_ADDRESS 'GREETING'
```

Here is a deployed instance of the contract on [fantomTestnetScan 0xDCf95202dEB5e8915A1c967e8aDBa57df1531DA4](https://testnet.ftmscan.com/address/0xDCf95202dEB5e8915A1c967e8aDBa57df1531DA4)
