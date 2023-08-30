# hashport SDK

The hashport SDK is the easiest way to add hashport bridging functionality to your application. Supports both fungible and nonfungible transactions. Check out which tokens are supported [here](https://www.hashport.network/token-list/).

## Quick Start

### Installation
Install the SDK and its peer dependencies, [`@hashgraph/sdk`](https://www.npmjs.com/package/@hashgraph/sdk) and [`viem`](https://viem.sh/). Optionally install [`wagmi`](https://wagmi.sh/) and [`hashconnect`](https://www.npmjs.com/package/hashconnect) if you plan to develop with [`RainbowKit`](https://www.rainbowkit.com/docs/installation) and [`HashPack`](https://www.hashpack.app/), respectively.
```bash
npm install @hashport/sdk @hashgraph/sdk viem

# If using RainbowKit
npm install @hashport/sdk @hashgraph/sdk viem wagmi

# If using HashPack
npm install @hashport/sdk @hashgraph/sdk viem hashconnect

```

### Initialization

Initialize the client with a signer for Hedera and EVM networks. Type definitions for the both signers can be found [here](./lib/types/signers/). You can also check out the available options when initializing the `HashportClient` [here](./lib/types/index.ts).

> Note: The example below demonstrates how to initialize signers with private keys. This is only for demonstration purposes and should not be implemented on any client side code. Always keep your private keys hidden! For client side implementation, it is recommended to use wallets such as HashPack and Metamask to take care of signing. Skip to the section below for more information.

#### Initialization with Local Signers

```ts
import { createLocalEvmSigner, HederaSdkSigner, HashportClient } from '@hashport/sdk';
import { mainnet } from 'viem/chains';

const rpcUrl = process.env.YOUR_EVM_RPC_URL;
const evmPk = process.env.YOUR_EVM_PRIVATE_KEY; // IMPORTANT: NEVER expose your private key on the client side
const evmSigner = createLocalEvmSigner(mainnet, rpcUrl, evmPk);

const hederaAccount = process.env.YOUR_HEDERA_ACCOUNT_ID;
const hederaPk = process.env.YOUR_HEDERA_PRIVATE_KEY; // IMPORTANT: NEVER expose your private key on the client side
const hederaSigner = new HederaSdkSigner(hederaAccount, hederaPk, 'mainnet');

const client = new HashportClient({
    evmSigner,
    hederaSigner,
    mode: 'mainnet',
});
```

#### Initialization with Injected Wallet Signers

The hashport SDK comes with a number of adapters for different wallets. Refer to the respective wallet documentation on how to initialize a connection, then pass the connected instance to the adapter before initializing the Hashport Client. Here's a simple example using [Hashconnect](https://github.com/Hashpack/hashconnect) to integrate the HashPack extension.

```ts
import { createHashPackSigner } from '@hashport/sdk';
import { evmSigner } from './evmSigner';
import { appMetadata } from './hashpackMetadata';

const hashconnect = new HashConnect();

const initialize = async () => {
    await hashconnect.init(appMetadata, 'testnet', false);
    return new HashportClient({
        evmSigner,
        hederaSigner: createHashPackSigner(hashconnect, hashconnect.hcData.pairingData[0]),
        mode: 'testnet',
    });
};
```

### Submitting Transactions

After intializing the client, you can queue up transactions. If there are any invalid parameters, the function will throw a [hashport error](./lib/utils/error.ts) and the transaction will not be queued. This function will return a UUID that you can use to call `execute`. You can also call `executeAll` to submit each transaction in the queue one by one.

```ts
const id = await client.queueTransaction({
    sourceNetworkId: '295', // Hedera Network
    sourceAssetId: 'HBAR',
    targetNetworkId: '1', // Ethereum Mainnet
    amount: '100000000000',
    recipient: evmSigner.getAddress(),
});

// Execute one transaction
const receipt = await client.execute(id);

// Execute all transactions in the queue
const receipts = await client.executeAll();
```

## REST API Clients

The `@hashport/sdk` library comes with utilities for interacting with the [Hashport API](https://mainnet.api.hashport.network/swagger/index.html#/) and [Hedera Mirror Node REST API](https://docs.hedera.com/hedera/sdks-and-apis/rest-api). Each client is a collection of network reqeust methods for their respective REST API. Simple initialize with either `"mainnet"` or `"testnet"` to start making requests.

> Note: The mirror node client supports adding custom urls and headers for dedicated services such as [Arkhia](https://docs.arkhia.io/).

```ts
// Using the hashport API client
import { HashportApiClient } from '@hashport/sdk';

const hashportApiClient = new HashportApiClient('mainnet');

hashportApiClient.assets().then(networkAssets => console.log(networkAssets));

// Using the Hedera Mirror Node client
import { MirrorNodeClient } from '@hashport/sdk';

const mirrorNodeClient = new MirrorNodeClient('mainnet', 'YOUR_MIRROR_NODE_URL', [
    'x-api-key',
    'YOUR_API_KEY',
]);
mirrorNodeClient.getBalances().then(balances => console.log(balances));
```

### Canceling requests

All network requests can be canceled by calling `.addAbortSignal(signal)` on the request. Here's an example in React with TypeScript:

```ts
import { type NetworkAssets, HashportApiClient } from '@hashport/sdk';

const hashportApiClient = new HashportApiClient('mainnet');

const HashportTokenList = () => {
    const [assets, setAssets] = useState<NetworkAssets | null>(null);

    useEffect(() => {
        const conroller = new AbortController();

        const fetchAssets = async () => {
            try {
                // This cancels the request if the component unmounts before the request resolves.
                const { assets } = await hashportApiClient
                    .assets()
                    .addAbortSignal(controller.signal);
                setAssets(assets);
            } catch (e) {
                console.error(e);
            }
        };

        fetchAssets();

        return () => controller.abort();
    }, []);

    return (
        <ul>
            {Object.values(assets).map(asset => (
                <li key={asset.id}>{asset.symbol}</li>
            ))}
        </ul>
    );
};
```

## End to End Testing

To test the functionality of the SDK on testnet, duplicate the `.env.example` file and fill in the appropriate information. Some environment variables have already been filled out with Hedera Testnet and Ethereum Sepolia information.

_Requirements:_

-   Hedera Testnet account (create a new account [here](https://portal.hedera.com/register)). Testnet accounts are topped off with 10,000 testnet HBAR every 24 hours.
-   EVM Testnet account (a list of supported testnet chains can be found [here](https://testnet.api.hashport.network/swagger/index.html#/networks), with [Sepolia](https://sepolia.dev/) being the most recommended).
- EVM Testnet faucet funds for [gas fees](https://ethereum.org/en/developers/docs/gas/#what-is-gas). You can get Sepolia ETH from [Alchemy's faucet](https://sepoliafaucet.com/).
-   Sufficient balance for each test token _(Visit the [swagger documentation](https://testnet.api.hashport.network/swagger/index.html#/assets) to see what tokens are supported. Then visit the respective blockchain explorer and interact with the contract to mint some tokens to your testnet account(s).)_

> Note: The Hedera Testnet resets every quarter, which erases all previous data and tokens. You'll need to update the Hedera Testnet tokens each time there is a reset. Learn more [here](https://docs.hedera.com/hedera/networks/testnet#test-network-resets).

If you have the proper balance, run the following command:

```bash
npm run test:e2e
```

This can be done from either the root directory or within the `sdk` directory. This command will submit test transactions for `mint`, `burnWithPermit`, `lock`, `unlock`, `mintERC721`, and `burnERC721`. You can also supply command line arguments with a double hyphen (`--`) if you would only like to test a subset of transactions:

```bash
# Supported arguments: mint, burn, lock, unlock, mintERC721, burnERC721

# This command will only exectue the mint and burn methods
npm run test:e2e -- mint burn
```
