<style>
    .hashport {
        filter: drop-shadow(-2px 1px 2px rgba(0,0,0,0.75));
    }
</style>
<p align="center">
    <a href="https://www.hashport.network/"><img class="hashport" width="300px" src="https://hashport.network/wp-content/uploads/hashport-logo-dark.svg" alt="hashport"></a>
</p>

# hashport-framework
Utility packages for hashport and APIs

This repository contains the source code for the following packages:

- [@hashport/sdk](./packages/sdk) is a framework agnostic library that encapsulates all the logic of a hashport transaction into a single class
- [@hashport/react-client](./packages/react-client) utilizes the `@hashport/sdk` to simplify integrating hashport into React applications.
- [@hashport/widget](./packages/widget) is a styled component complete with all the functionality of the hashport bridge