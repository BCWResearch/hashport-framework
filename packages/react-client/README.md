# hashport React Client

The hashport React Client contains a set of React [contexts](https://react.dev/learn/passing-data-deeply-with-context) and [hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) that allows you to add hashport's bridging functionality to your React application. This package is meant for those who want to integrate the functionality into their native user interface. If you want a styled plug-and-play solution, please take a look at the Widget [here](#).

## Quick Start

### Installation

```bash
npm install @hashport/react-client
```

&#9888; Note: hashport/react-client is a [React](https://reactjs.org/) library.

### Import

Import the client based on your existing application environment.

If your React app already has an EVM signer (e.g. [RainbowKit](https://www.rainbowkit.com/docs/introduction), [MetaMask](https://www.npmjs.com/package/metamask-react), [ethers](https://docs.ethers.org/v5/)) **AND** a Hedera signer (e.g. [Hashconnect](https://www.npmjs.com/package/hashconnect), [Hashgraph SDK](https://www.npmjs.com/package/@hashgraph/sdk)), please use the [`HashportClientProvider`](https://github.com/BCWResearch/hashport-framework/tree/react-client/init/packages/react-client#hashportclientprovider).

```javascript
import { HashportClientProvider } from `@hashport/react-client/contexts`;
```

If your React app **DOES NOT HAVE** an EVM signer but has a Hedera signer, please use the [`HashportClientAndRainbowKitProvider`](https://github.com/BCWResearch/hashport-framework/tree/react-client/init/packages/react-client#hashportclientandrainbowkitprovider).

```javascript
import { HashportClientAndRainbowKitProvider } from `@hashport/react-client/contexts`;
```

If your React app **DOES NOT HAVE EITHER SIGNERS**, please integrate a Hedera signer first, such as [Hashconnect](https://www.npmjs.com/package/hashconnect).

### Configure and Wrap Providers

Pass your EVM signer (if necessary) and Hedera signer as props to the provider that imported in the above step. Wrap your application with the configured provider.

```javascript
const App = () => {
    return (
        <HashportClientProvider evmSigner={evmSigner} hederaSigner={hederaSigner}>
            <YourApp />
        </HashportClientProvider>
    );
};
```

### Add Functionality

You can start building out the rest of hashport's functionality into your app using the provided [hooks documented below](https://github.com/BCWResearch/hashport-framework/tree/react-client/init/packages/react-client#hooks).

For more details, view the example we have created here.

## Contexts

### `BridgeParamsProvider`

`BridgeParamsProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass the necessary bridging parameters down to other components, so you need to make sure that `BridgeParamsProvider` is a parent of the components you are encapsulating as part of the bridging functionality.

#### Props

```
children
```

The content of the component.

Type: `node`

---

### `HashportApiProvider`

`HashportApiProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass the hashport API and core network objects down to other components, so you need to make sure that `HashportApiProvider` is a parent of the components you are encapsulating to be able to consume these objects. `HashportApiProvider` also initializes `QueryClientProvider` from [@tanstack/react-query](https://tanstack.com/query/v3/docs/react/overview) to help simply data-fetching.

#### Props

```
children
```

The content of the component.

Type: `node`

```
mode
```

The API environment that the provider will set.

Type: `'mainnet' | 'testnet'`

Default: `'mainnet'`

---

### `HashportClientProvider`

`HashportClientProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass core hashport functionality down to other components, so you need to make sure that `HashportClientProvider` is a parent of the components you are encapsulating to be able to consume these objects. `HashportClientProvider` also includes `HashportApiProvider` and `BridgeParamsProvider` to help simplify and improve your developer experience.

#### Props

```
children
```

The content of the component.

Type: `node`

```
evmSigner
```

An abstraction of an EVM Account, which can be used to sign messages and transactions and send signed transactions to the EVM Network.

Type: `EvmSigner | undefined`

```
hederaSigner
```

An abstraction of a Hedera Account, which can be used to sign messages and transactions and send signed transactions to the Hedera Network.

Type: `HederaSigner | undefined`

```
customMirrorNodeUrl
```

A URL to a custom Hedera mirror node service.

Type: `string | undefined`

Default: `'https://mainnet-public.mirrornode.hedera.com/api/v1'`

```
customMirrorNodeCredentials
```

Credentials to `customMirrorNodeUrl` (the custom Hedera mirror node service). The array indices should contain the following: `["your-x-api-key", "YOUR_API_KEY"]`.

&#9888; If `customMirrorNodeCredentials` is set without a `customMirrorNodeUrl` defined, the `HashportClientProvider` will not work.

Type: `[string, string] | undefined`

```
debug
```

If `true`, enables the logger.

Type: `boolean`

Default: `false`

```
mode
```

The API environment that the provider will set.

Type: `'mainnet' | 'testnet'`

Default: `'mainnet'`

```
persistOptions
```

Persistent storage options for ongoing transaction state. This allows users to continue their bridging process after an error.

Type: `{ persistKey?: string | undefined; storage?: StateStorage | undefined; } | undefined`

Default: `{ persistKey: 'hashportTransactionStore', storage: localStorage }`

---

### `ProcessingTransactionProvider`

`ProcessingTransactionProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass the state of the current processing transaction to other components. This provider depends on an instance of the `HashportClient`, so if you want to use the related hooks, be sure that `ProcessingTransactionProvider` is a child of the `HashportClientProvider`.

#### Props

```
children
```

The content of the component.

---

### `HashportClientAndRainbowKitProvider`

`HashportClientAndRainbowKitProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass core hashport functionality _and_ [RainbowKit](https://www.rainbowkit.com/docs/introduction) (Ethereum interface) down to other components, so you need to make sure that `HashportClientAndRainbowKitProvider` is a parent of the components you are encapsulating to be able to consume these objects. `HashportClientProvider` also includes `HashportApiProvider` and `BridgeParamsProvider` to help simplify and improve your developer experience.

#### Props

```
children
```

The content of the component.

Type: `node`

```
hederaSigner
```

An abstraction of a Hedera Account, which can be used to sign messages and transactions and send signed transactions to the Hedera Network.

Type: `HederaSigner | undefined`

```
customMirrorNodeUrl
```

A URL to a custom Hedera mirror node service.

Type: `string | undefined`

Default: `'https://mainnet-public.mirrornode.hedera.com/api/v1'`

```
customMirrorNodeCredentials
```

Credentials to `customMirrorNodeUrl` (the custom Hedera mirror node service). The array indices should contain the following: `["your-x-api-key", "YOUR_API_KEY"]`.

&#9888; If `customMirrorNodeCredentials` is set without a `customMirrorNodeUrl` defined, the `HashportClientProvider` will not work.

Type: `[string, string] | undefined`

```
debug
```

If `true`, enables the logger.

Type: `boolean`

Default: `false`

```
mode
```

The API environment that the provider will set.

Type: `'mainnet' | 'testnet'`

Default: `'mainnet'`

```
persistOptions
```

Persistent storage options for ongoing transaction state. This allows users to continue their bridging process after an error.

Type: `{ persistKey?: string | undefined; storage?: StateStorage | undefined; } | undefined`

Default: `{ persistKey: 'hashportTransactionStore', storage: localStorage }`

---

### `RainbowKitBoilerPlate`

`RainbowKitBoilerPlate` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to initialize and pass down Ethereum interfaces to other components, so you need to make sure that `RainbowKitBoilerPlate` is a parent of the components you are encapsulating to be able to consume these interfaces. A configured [`WagmiConfig`](https://wagmi.sh/react/WagmiConfig#configuration) and [`RainbowKitProvider`](https://www.rainbowkit.com/docs/installation#wrap-providers) is provided to help simplify and improve your developer experience.

#### Props

```
children
```

The content of the component.

Type: `node`

```
chains
```

An array of chain objects that reference different EVM-compatible chains. By default, hashport-supported chains are included in the array.

&#9888; Chain objects must adhere to the interface described [here](https://wagmi.sh/react/chains#build-your-own).

Type: `RainbowKitChain[]`

#### RainbowKit Props

Props of the [RainbowKit](https://www.rainbowkit.com/docs/introduction) component are also available.

---

## Hooks

This library comes with a number of conveniences hooks that help set up, execute, and monitor a hashport bridging operation.

### Hashport Transaction Set Up Hooks

The typical flow for setting up a transaction is as follows:

-   Choose the bridging parameters
-   Submit those parameters to the Hashport API to receive a list of steps
-   Execute those steps with a Hedera and EVM signer

To simplify this process, you can use the following hooks:

#### [useBridgeParams](./src/hooks/useBridgeParams.ts)

Call this hook to get the current bridge parameter state. You can view the definition for this object [here](../sdk/lib/types/api/bridge.ts).

#### [useBridgeParamsDispatch](./src/hooks/useBridgeParams.ts)

Call this hook to access a number of dispatch functions that will help you set the bridge parameters state.

&#9888; Note: When setting the `amount` to be bridged, it's important to take the token's decimal into account. While EVM based tokens can have up to 18 decimal places, Hedera tokens can only have up to 8. The `setAmount` dispatch function will default to allowing a maximum of 6 decimals being input. If a token has been selected, it will allow up to 8. When the bridge params are submitted to the api, it is recommended to use the `useQueueHashportTransaction` because it converts the decimal amount to the [wei](https://ethereum.org/gl/developers/docs/intro-to-ether/#denominations) or [tinybar](https://docs.hedera.com/hedera/sdks-and-apis/sdks/hbars#hbar-units) amount that is understood by the api.

#### [useTokenList](./src/hooks/useTokenList.ts)

This hook returns a [React Query result object](https://tanstack.com/query/latest/docs/react/guides/queries) where the data is an object that holds all supported assets on hashport, both fungible and nonfungible. Assets are stored as a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of the token's id to its respective [AssetInfo](./src/types/tokenList.ts).

This hooks also accepts an optional `onSelect` function that is run when the `handleSelect` function of an asset is called. It is recommended to use this hook with `useBridgeParamsDispatch` to allow a user to select a token.

##### Example Usage

```tsx
const TokenList = () => {
    const {setSourceAsset} = useBridgeParamsDispatch();
    const {data: tokens, isError, isLoading} = useTokenList({
        onSelect(token) {
            setSourceAsset(token);
        }
    })
    if (isLoading) {
        return <p>Loading...</p>;
    } else if (isError) {
        return <p>Error!</p>
    } else {
        return (
            {Array.from(tokens.fungible.values()).map(({handleSelect, symbol, id, chainId}) => (
                <button key={`${id}-${chainId}`} onClick={handleSelect}>{symbol}</button>
            ))}
        )
    }
}
```

#### [useQueueHashportTransaction](./src/hooks/useHashportClient.ts)

This hook depends on the state provided by the [`BridgeParamsProvider`](#bridgeparamsprovider). If all the proper bridge parameters have been set by the user, this hook will return a function that:

-   Converts the decimal amount to the respective [wei](https://ethereum.org/gl/developers/docs/intro-to-ether/#denominations) or [tinybar](https://docs.hedera.com/hedera/sdks-and-apis/sdks/hbars#hbar-units) token amount
-   Submits the params to the api to receive steps

&#9888; Note: Be sure to add error handling to this function as it will throw an error any of the parameters are set incorrectly.

If the function is successful, it will return a unique `id` that you can pass to the `execute` function on the `hashportClient` or the `executeTransaxtion` dispatch function from the [`useProcessingTransactionDispatch`](#useprocessingtransactiondispatch) hook.

#### [useMinAmount](./src/hooks/useMinAmount.ts)

Hashport imposes a minimum amount in order to initiate a bridging operation. If a set of bridge parameters does not meet this minimum, the api will not return the steps required to perform the transaction. However, to give the user a better experience, it's good to display the minimum porting amount.

&#9888; Note: This hook adds a 10% buffer to the minimum amount. It's important to understand that the minimums are dynamic. If the prices change before a transaction reaches the validators, there is a chance that the transaction may fall below the minimum, which would result in a stuck transaction. As such, adding a buffer of an extra 10% help mitigate that risk.

This hook depends on the state provided by the [`BridgeParamsProvider`](#bridgeparamsprovider). It reads the `sourceAssetId` and `sourceNetworkId` of the bridge parameters, fetches the minimum bridging amount, and returns it as a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). If you want to display this number in its decimal form, you can get the `decimals` of the token from the [`useTokenList`](#usetokenlist) hook and use a function like viem's [`formatUnits`](https://viem.sh/docs/utilities/formatUnits.html) to convert it to a readable string.

##### Example Usage

```tsx
import { formatUnits } from 'viem';

const MinimumAmountDisplay = () => {
    const { data: minAmount, isLoading, isError } = useMinAmount();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();
    const { data: tokens } = useTokenList();
    const selectedToken = tokens.fungible.get(`${sourceAssetId}-${sourceNetworkId}`);

    if (isLoading || !selectedToken) {
        return <p>Loading minimum amounts...</p>;
    } else if (isError) {
        return <p>Failed to get minimum amounts!</p>;
    } else if (minAmount === undefined) {
        return <p>Please select a token</p>;
    } else {
        return <p>Minimum bridging amount: {formatUnits(minAmount, selectedToken.decimals)}</p>;
    }
};
```

#### [usePreflightCheck](./src/hooks/usePreflightCheck.ts)

This hook is helpful for displaying the state of their bridging parameters and whether or not they can properly execute the transaction. It checks the following:

-   Whether or not the user has enough balance to complete the transaction
-   Whether or not the user meets the minimum amounts

It returns an object with an `isValidParams` boolean and a `message` in the event that `isValidParams` is `false`.

### Hashport Transaction Execution Hooks

Once you have set up the proper bridge parameters, all that's left is to actually execute the transaction. The recommended way is to use the dispatch functions provided by the `useProcessingTransactionDispatch` hook. These functions update state that is useful for displaying the current state of a submitted transaction.

#### [useProcessingTransactionDispatch](./src/hooks/useProcessingTransaction.ts)

This hook returns a `executeTransaction` callback to be used with the `useQueueHashportTransaction` hook. It also returns a `confirmCompletion` callback that resets state after completion. This is helpful for cleaning up bridge parameter state.

#### Example Usage

```tsx
const ExecuteButton = () => {
    const { executeTransaction } = useProcessingTransactionDispatch();
    const queueTransaction = useQueueHashportTransaction();

    const handleExecute = async () => {
        try {
            if (!queueTransaction) throw 'Set bridge parameters first';
            const id = await queueTransaction();
            const confirmation = await executeTransaction();
        } catch (error) {
            console.error(error);
        }
    };

    return <button onClick={handleExecute}>Execute</button>;
};
```

#### [useHashportClient](./src/hooks/useHashportClient.ts)

If you prefer a more manual approach, you can also use this hook. It returns an instance of the [`hashportClient`](../sdk/lib/clients/hashportClient/index.ts) from the `@hashport/sdk`. It depends on the [`HashportClientProvider](#hashportclientprovider) so be sure to call it within that. The best way to use the client for transaction execution is in conjunction with the [`useQueueHashportTransaction`](#usequeuehashporttransaction) hook.

&#9888; Note: Be sure to add error handling to this function in case there are network issues or if the user rejects an interaction.

##### Example Usage

```tsx
const ExecuteButton = () => {
    const hashportClient = useHashportClient();
    const queueTransaction = useQueueHashportTransaction();
    const [id, setId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleExecute = async () => {
        try {
            if (!queueTransaction) {
                setErrorMessage('Set bridge parameters first');
            }
            setErrorMessage('');
            let tempId = id;
            if (!tempId) {
                tempId = await queueTransaction();
                setId(tempId);
            }
            const confirmation = await hashportClient.execute(tempId);
            console.log('Completed transaction: ', confirmation);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            {errorMessage ? <p>{errorMessage}</p> : null}
            <button onClick={handleExecute} disabled={!queueTransaction}>
                Execute
            </button>
        </div>
    );
};
```

### Hashport Transaction Monitoring Hooks

TODO: useBlockConfirmations, useProcessingTransaction
