# hashport React Client

The hashport React Client contains a set of React [contexts](https://react.dev/learn/passing-data-deeply-with-context) and [hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) that allows you to add hashport's bridging functionality to your React application. This package is meant for those who want to integrate the functionality into their native user interface. If you want a styled plug-and-play solution, please take a look at the Widget [here](../widget/README.d).

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

Type: `React.ReactNode`

---

### `HashportApiProvider`

`HashportApiProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass the hashport API and core network objects down to other components, so you need to make sure that `HashportApiProvider` is a parent of the components you are encapsulating to be able to consume these objects. `HashportApiProvider` also initializes `QueryClientProvider` from [@tanstack/react-query](https://tanstack.com/query/v3/docs/react/overview) to help simply data-fetching.

#### Props

```
children
```

The content of the component.

Type: `React.ReactNode`

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

Type: `React.ReactNode`

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

```
disconnectedAccountsFallback
```

A fallback React node to be displayed if either the EVM Signer or the Hedera Signer have become disconnected.

Type: `{ disconnectedAccountsFallback?: React.ReactNode }`

Default: `<p>Please connect signers for both EVM and Hedera networks</p>`

---

### `ProcessingTransactionProvider`

`ProcessingTransactionProvider` relies on the [context](https://react.dev/learn/passing-data-deeply-with-context) feature of React to pass the state of the current processing transaction to other components. This provider depends on an instance of the `HashportClient`, so be sure that `ProcessingTransactionProvider` is a child of the `HashportClientProvider`.

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

Type: `React.ReactNode`

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

Type: `React.ReactNode`

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

This packages comes with a number of convenience hooks that help perform a hashport bridging transaction. The recommended usage is to set bridging parameters with [`useBridgeParamsDispatch`](#usebridgeparamsdispatch), queue up the transaction with [`useQueueHashportTransaction`](#usequeuehashporttransaction), execute the transaction with [`useProcessingTransactionDispatch`](#useprocessingtransactiondispatch), and monitor the status with [`useProcessingTransaction`](#useprocessingtransaction). The hooks can be broken down into the following categories:

1. [Transaction Set Up Hooks](#transaction-set-up-hooks)
1. [Transaction Execution Hooks](#transaction-execution-hooks)
1. [Status Monitoring Hooks](#)

### Transaction Set Up Hooks

To set up a transaction, a user must define an amount, a recipient, a source asset, and a target asset. These parameters are then sent to the hashport API to obtain a list of steps that need to be executed in order to complete the transaction.

#### [useBridgeParams](./src/hooks/useBridgeParams.ts)

Returns a [BridgeParams](../sdk/lib/types/api/bridge.ts) object.

##### Usage

```tsx
const BridgeParamsDisplay = () => {
    const { amount, sourceNetworkId, sourceAssetId, targetNetworkId, recipient } =
        useBridgeParams();

    return (
        <div>
            <p>Bridging Amount: {amount}</p>
            <p>Source Chain id: {sourceNetworkId}</p>
            <p>Source Asset for brigding: {sourceAssetId}</p>
            <p>Target Chain id: {targetNetworkId}</p>
            <p>Receiving account: {recipient}</p>
        </div>
    );
};
```

#### [useBridgeParamsDispatch](./src/hooks/useBridgeParams.ts)

Returns dispatch functions to set fields in the `bridgeParams` object. Use with [`useTokenList`](#usetokenlist) for easy token selection.

##### Usage

```tsx
const SourceTokenSelection = () => {
    const { sourceAssetId } = useBridgeParams();
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();

    const handleChange = e => {
        const selectedToken = !tokens?.get(e.target.value);
        if (selectedToken) return;
        dispatch.setSourceAsset(selectedToken);
    };

    return tokens ? (
        <select value={sourceAssetId}>
            <option value="">--Select a token--</option>
            {Array.from(tokens.fungible.entries()).map(([id, token]) => {
                return (
                    <option key={id} value={id}>
                        {token.symbol}
                    </option>
                );
            })}
        </select>
    ) : (
        <p>Loading...</p>
    );
};
```

&#9888; Note: When setting the `amount` for bridging, it's important to take the token's decimal into account. While EVM-based tokens can have up to 18 decimal places, Hedera tokens can only have up to 8. By default, the `setAmount` dispatch function allows a maximum of 6 decimals. However, if a token has been selected, it will allow decimal precision as limited by the token. When the bridge params are submitted to the API, it is recommended to use the `useQueueHashportTransaction` hook because it converts the decimal amount to [wei](https://ethereum.org/gl/developers/docs/intro-to-ether/#denominations) or [tinybar](https://docs.hedera.com/hedera/sdks-and-apis/sdks/hbars#hbar-units), which is what the API expects.

#### [useTokenList](./src/hooks/useTokenList.ts)

Returns a [React Query result object](https://tanstack.com/query/latest/docs/react/guides/queries) where the data is an object that holds all supported assets on hashport, both fungible and nonfungible. Assets are stored as a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of the token's unique id to its respective [AssetInfo](./src/types/tokenList.ts).

&#9888; Note: The token's unique id takes the following format: `${tokenIdOrAddress}-${chainId}`.

This hooks also accepts an optional `onSelect` function that is run when the `handleSelect` function of an asset is called. It is recommended to use this hook with `useBridgeParamsDispatch` to allow a user to select a token.

##### Usage

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
            {Array.from(tokens.fungible.entries()).map(([uniqueId, {handleSelect, symbol, id, chainId}]) => (
                <button key={uniqueId} onClick={handleSelect}>{symbol}</button>
            ))}
        )
    }
}
```

#### [useQueueHashportTransaction](./src/hooks/useHashportClient.ts)

This hook depends on the state provided by the [`BridgeParamsProvider`](#bridgeparamsprovider). If all the proper bridge parameters have been set by the user, this hook will return a function that:

-   Converts the decimal amount to [wei](https://ethereum.org/gl/developers/docs/intro-to-ether/#denominations) or [tinybar](https://docs.hedera.com/hedera/sdks-and-apis/sdks/hbars#hbar-units).
-   Submits the `bridgeParams` to the API and queues up the steps for execution.

&#9888; Note: Be sure to add error handling to this function as it will throw an error if any of the parameters are set incorrectly.

If the function is called successfully, it will return a unique `id` that you can pass to the `execute` function on the `hashportClient` or the `executeTransaxtion` dispatch function from the [`useProcessingTransactionDispatch`](#useprocessingtransactiondispatch) hook.

##### Usage

```tsx
const QueueTransaction = () => {
    const queueTransaction = useQueueHashportTransaction();
    const [queuedIds, setQueuedIds] = useState([]);

    const handleQueueTransaction = async () => {
        if (!queueTransaction) return;
        const id = await queueTransaction();
        setQueuedIds(prev => [...prev, id]);
    };

    return (
        <div>
            <h1>Queued Transactions</h1>
            {queuedIds.map(id => {
                <p key={id}>Transaction: {id}</p>;
            })}
        </div>
    );
};
```

#### [useMinAmount](./src/hooks/useMinAmount.ts)

Hashport imposes a minimum amount in order to initiate a bridging operation. If a set of bridge parameters does not meet this minimum, the api will not return the steps required to perform the transaction. However, to give the user a better experience, it's good to display the minimum porting amount.

&#9888; Note: This hook adds a 10% buffer to the minimum amount. It's important to understand that the minimums are dynamic. If the prices change before a transaction reaches the validators, there is a chance that the transaction may fall below the minimum, which would result in a stuck transaction. As such, adding a buffer of an extra 10% help mitigate that risk.

This hook depends on the state provided by the [`BridgeParamsProvider`](#bridgeparamsprovider). It reads the `sourceAssetId` and `sourceNetworkId` of the bridge parameters, fetches the minimum bridging amount, and returns it as a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). If you want to display this number in its decimal form, you can get the `decimals` of the token from the [`useTokenList`](#usetokenlist) hook and use a function like viem's [`formatUnits`](https://viem.sh/docs/utilities/formatUnits.html) to convert it to a readable string.

##### Usage

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

This hook depends on the [`HashportClientProvider`](#hashportclientprovider) and the [`BridgeParamsProvider`](#bridgeparamsprovider). Use this hook to display the state of the user's bridging parameters and whether or not they will be able to execute the transaction. It checks the following:

-   Whether or not the user has enough balance to complete the transaction
-   Whether or not the user meets the minimum amounts

Returns `{isValidParams: boolean; message?: string}` where the `message` is only defined if `isValidParams` is `false`.

##### Usage

```tsx
const PreflightCheckMessage = () => {
    const preflightStatus = usePreflightCheck();

    return preflightStatus.isValidParams ? (
        <p>Ready to bridge!</p>
    ) : (
        <p>Error: {preflightStatus.message}</p>
    );
};
```

### Transaction Execution Hooks

Once you have set up the proper bridge parameters and queued the transaction, all that's left to do is execute the transaction. The recommended way is to use the `executeTransaction` callback provided by the [`useProcessingTransactionDispatch`](#useprocessingtransactiondispatch) hook. These functions update state that is useful for displaying the current state of a submitted transaction.

#### [useProcessingTransactionDispatch](./src/hooks/useProcessingTransaction.ts)

This hook returns a `executeTransaction` callback to be used with the [`useQueueHashportTransaction`](#usequeuehashporttransaction) hook. It also returns a `confirmCompletion` callback which is is helpful for cleaning up bridge parameter state.

#### Usage

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

If you prefer a more manual approach, you can also use this hook. It returns an instance of the [`hashportClient`](../sdk/lib/clients/hashportClient/index.ts) from the `@hashport/sdk`. It depends on the [`HashportClientProvider](#hashportclientprovider). It is recommended to use this with the [`useQueueHashportTransaction`](#usequeuehashporttransaction) hook.

&#9888; Note: Be sure to add error handling to this function in case there are network issues or if the user rejects a wallet interaction.

##### Usage

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

### Status Monitoring Hooks

There are a number of steps that must be completed in order to transfer assets across the hashport bridge. These steps may involve hedera transacitons, EVM transactions, waiting for block confirmations, etc. To help keep the user updated on the progress of their transaction, you can use the following hooks.

#### [useProcessingTransaction](./src/hooks/useProcessingTransaction.ts)

Returns a [`ProcessingTransactionState`](./src/contexts/processingTransaction.tsx) object. Statuses can be `'idle'`, `'processing'`, `'complete'`, or `'error'`. It also returns the `id` of the current transaction as well as the `currentTransaction` data related to that `id`.

##### Usage

<!-- TODO: -->

#### [useBlockConfirmations](./src/hooks/useBlockConfirmations.ts)

<!-- TODO: -->

##### Usage

<!-- TODO: -->

<!-- TODO: -->

useQueue
