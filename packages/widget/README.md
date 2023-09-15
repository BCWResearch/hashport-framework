<style>
    .hashport {
        filter: drop-shadow(-2px 1px 2px rgba(0,0,0,0.75));
    }
</style>
<p align="center">
    <a href="https://www.hashport.network/"><img class="hashport" width="300px" src="https://hashport.network/wp-content/uploads/hashport-logo-dark.svg" alt="hashport"></a>
</p>

# hashport Widget

This repository contains the components used to build the hashport Widget. This is a package that provides a user interface to interact with the hashport bridge. It comes complete with state management, styles, and wallet connectors.

&#9888; Note: `@hashport/widget` is a [React](https://reactjs.org/) library that uses components from [MUI](https://mui.com/).

## Quick Start

### Installation

Install the package and its peer dependencies.

```bash
npm install @hashport/widget @hashgraph/sdk hashconnect
```

&#9888; Note: The widget currently only supports Hedera wallet connections through [HashPack](https://www.hashpack.app/). EVM connections are handled by [RainbowKit](https://www.rainbowkit.com/).

#### Basic Usage

```tsx
import { HashportWidget } from '@hashport/widget';

const MyApp = () => {
    return <HashportWidget />;
};
```

## Lazy Loading

The hashport widget comes with a number of large packages. Because of this, using the `HashportWidget` directly can impact the load time of an application. To help alleviate this problem `@hashport/widget` provides the [LazyHashportWidget](./src/components/Widget/LazyHashportWidget.tsx). This component uses lazy loading and React [Suspense](https://react.dev/reference/react/Suspense) to load the widget only when a user requests it. Learn more about code splitting in React [here](https://react.dev/reference/react/lazy#suspense-for-code-splitting).
