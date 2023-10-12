import './polyfills';
import './App.css';
import {
    createHashPackSigner,
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    useHashConnect,
} from '@hashport/react-client';
import { SelectSource } from './components/SelectSource';
import { SelectTarget } from './components/SelectTarget';
import { AmountInput } from './components/AmountInput';
import { RecipientInput } from './components/RecipientInput';
import { ExecuteButton } from './components/ExecuteButton';
import { TransactionStatus } from './components/TransactionStatus';

function App() {
    const { hashConnect, pairingData } = useHashConnect({
        mode: 'testnet',
    });
    const hederaSigner = pairingData && createHashPackSigner(hashConnect, pairingData);
    const accountId = pairingData?.accountIds[0];

    return (
        <HashportClientProviderWithRainbowKit
            mode="testnet"
            hederaSigner={hederaSigner}
            renderConnectButton={(children, RainbowKitButton) => (
                <main>
                    <h1>hashport</h1>
                    <div className="button-group">
                        <RainbowKitButton />
                        <button onClick={() => hashConnect.connectToLocalWallet()}>
                            {accountId ?? 'Connect HashPack'}
                        </button>
                    </div>
                    {children}
                </main>
            )}
        >
            <ProcessingTransactionProvider>
                <div className="container">
                    <TransactionStatus />
                    <AmountInput />
                    <RecipientInput />
                    <SelectSource />
                    <SelectTarget />
                    <ExecuteButton />
                </div>
            </ProcessingTransactionProvider>
        </HashportClientProviderWithRainbowKit>
    );
}

export default App;
