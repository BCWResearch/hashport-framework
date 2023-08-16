import {
    useBridgeParams,
    useHashportClient,
    useMinAmount,
    useTokenList,
} from '@hashport/react-client';
import { parseUnits, isHex } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { balanceOfAbi } from 'constants/abi';

export const usePreflightCheck = () => {
    const hashportClient = useHashportClient();
    const chainId = hashportClient.evmSigner.getChainId();
    const evmAddress = hashportClient.evmSigner.getAddress();
    const hederaAccount = hashportClient.hederaSigner.accountId;
    const { sourceAssetId, sourceNetworkId, amount } = useBridgeParams();
    const { data: tokens, isLoading: isLoadingTokens, isError: isErrorTokens } = useTokenList();
    const {
        data: minAmount,
        isLoading: isLoadingMinAmount,
        isError: isErrorMinAmount,
    } = useMinAmount();
    const {
        data: balanceOfSourceAsset,
        isError: isErrorBalance,
        isLoading: isLoadingBalance,
        error,
    } = useQuery({
        queryKey: ['balance', sourceAssetId, chainId, evmAddress, hederaAccount],
        queryFn: async () => {
            if (!sourceAssetId || !sourceNetworkId) throw 'Please select an asset';
            if (isHex(sourceAssetId)) {
                if (chainId !== +sourceNetworkId) throw 'Wrong EVM network';
                const contract = hashportClient.evmSigner.getContract(balanceOfAbi, sourceAssetId);
                // TODO: must handle wrong network
                const [balance] = await contract.read<[bigint]>([
                    { functionName: 'balanceOf', args: [evmAddress] },
                ]);
                return balance;
            } else {
                const { balances } = await hashportClient.mirrorNodeClient.getBalances({
                    'account.id': hederaAccount,
                });
                const balance =
                    sourceAssetId === 'HBAR'
                        ? balances[0]?.balance
                        : balances[0]?.tokens.find(({ token_id }) => token_id === sourceAssetId)
                              ?.balance;
                return BigInt(balance ?? 0);
            }
        },
    });
    // TODO: make use of useQueries or something
    if (isLoadingMinAmount || isLoadingMinAmount || isLoadingBalance || isLoadingTokens) {
        return { isLoading: true, message: undefined, isError: false } as const;
    } else if (isErrorBalance || isErrorMinAmount || isErrorTokens) {
        const message = error instanceof Error ? error.message : 'Failed preflight check';
        return { isLoading: false, isError: true, message } as const;
    } else {
        const sourceId = `${sourceAssetId}-${+sourceNetworkId}` as const;
        const sourceAssetDecimals = tokens.fungible.get(sourceId)?.decimals;
        const minimumAmount = BigInt(minAmount);
        const formattedAmount = parseUnits(amount ?? '0', sourceAssetDecimals ?? 0);
        const message =
            minimumAmount > formattedAmount
                ? 'Must meet minimum'
                : formattedAmount > balanceOfSourceAsset
                ? 'Not enough balance'
                : undefined;
        return {
            isLoading: false,
            isError: false,
            message,
        };
    }
};
