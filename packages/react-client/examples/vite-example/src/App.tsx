import './polyfills';
import './App.css';
import { ChangeEventHandler } from 'react';
import {
    AssetId,
    createHashPackSigner,
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    useBridgeParamsDispatch,
    useHashConnect,
    useProcessingTransaction,
    useProcessingTransactionDispatch,
    useQueueHashportTransaction,
    useSelectedTokens,
    useTokenList,
    useTargetTokens,
} from '@hashport/react-client';

const Interface = () => {
    const dispatch = useBridgeParamsDispatch();
    const queueTransaction = useQueueHashportTransaction();
    const { executeTransaction, confirmCompletion } = useProcessingTransactionDispatch();
    const processingTx = useProcessingTransaction();
    const { data: tokens } = useTokenList();
    const { sourceAsset, targetAsset } = useSelectedTokens();
    const targetTokens = useTargetTokens();

    const handleExecute = async () => {
        if (!queueTransaction) return;
        if (processingTx.status === 'complete') {
            confirmCompletion();
            return;
        }
        try {
            if (processingTx.id) {
                await executeTransaction(processingTx.id);
            } else {
                const id = await queueTransaction();
                await executeTransaction(id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAmount: ChangeEventHandler<HTMLInputElement> = e => {
        dispatch.setAmount({
            amount: e.target.value,
            sourceAssetDecimals: sourceAsset?.decimals,
            targetAssetDecimals: targetAsset?.decimals,
        });
    };

    const handleRecipient: ChangeEventHandler<HTMLInputElement> = e => {
        dispatch.setRecipient(e.target.value);
    };

    const handleChooseSource: ChangeEventHandler<HTMLSelectElement> = e => {
        const sourceAsset = tokens?.fungible.get(e.target.value as AssetId);
        sourceAsset && dispatch.setSourceAsset(sourceAsset);
    };

    const handleChooseTarget: ChangeEventHandler<HTMLSelectElement> = e => {
        const targetAsset = tokens?.fungible.get(e.target.value as AssetId);
        targetAsset && dispatch.setTargetAsset(targetAsset);
    };

    if (!tokens) return <p>loading tokens...</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
            <h5>
                Transaction Status: <span>{processingTx.status}</span>
            </h5>
            <input placeholder="amount" onChange={handleAmount} />
            <input placeholder="recipient" onChange={handleRecipient} />
            <select onChange={handleChooseSource}>
                <option value="">--Choose source asset--</option>
                {Array.from(tokens.fungible.entries()).map(([id, token]) => (
                    <option key={id} value={id}>
                        {token.symbol}
                    </option>
                ))}
            </select>
            <select onChange={handleChooseTarget}>
                <option value={''}>--To--</option>
                {targetAsset?.bridgeableAssets.map(({ assetId }) => {
                    const asset = tokens?.fungible.get(assetId);
                    if (!asset) return;
                    return (
                        <option key={assetId} value={assetId}>
                            {asset.symbol}
                        </option>
                    );
                })}
                {targetTokens?.map(({ assetId, symbol }) => (
                    <option key={assetId} value={assetId}>
                        {symbol}
                    </option>
                ))}
            </select>
            <button
                disabled={!queueTransaction || processingTx.status === 'processing'}
                onClick={handleExecute}
            >
                {processingTx.status === 'processing'
                    ? 'In progress...'
                    : processingTx.status === 'complete'
                    ? 'Confirm'
                    : 'Execute'}
            </button>
        </div>
    );
};

function App() {
    const { hashConnect, pairingData } = useHashConnect({
        mode: 'testnet',
    });
    return hashConnect && pairingData ? (
        <HashportClientProviderWithRainbowKit
            mode="testnet"
            hederaSigner={createHashPackSigner(hashConnect, pairingData)}
            renderConnectButton={(children, Button) => (
                <main>
                    <div style={{ display: 'flex', gap: '0.5em' }}>
                        <Button />
                        <button onClick={() => hashConnect.connectToLocalWallet()}>
                            Connect Hashpack
                        </button>
                    </div>
                    {children}
                </main>
            )}
        >
            <h1>hashport</h1>
            <ProcessingTransactionProvider>
                <Interface />
            </ProcessingTransactionProvider>
        </HashportClientProviderWithRainbowKit>
    ) : (
        <p>connecting...</p>
    );
}

export default App;
