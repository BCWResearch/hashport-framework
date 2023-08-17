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

###
