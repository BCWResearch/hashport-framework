import { parseUnits, isHex, formatUnits } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { balanceOfAbi } from 'constants/abi';
import { useHashportClient } from './useHashportClient';
import { useBridgeParams } from './useBridgeParams';
import { useTokenList } from './useTokenList';
import { useMinAmount } from './useMinAmount';

type PreflightStatus =
    | {
          isValidParams: true;
          message?: never;
      }
    | {
          isValidParams: false;
          message: string;
      };

export const usePreflightCheck = (): PreflightStatus => {
    const hashportClient = useHashportClient();
    const chainId = hashportClient.evmSigner.getChainId();
    const evmAddress = hashportClient.evmSigner.getAddress();
    const hederaAccount = hashportClient.hederaSigner.accountId;
    const { sourceAssetId, sourceNetworkId, amount } = useBridgeParams();
    const { data: tokens } = useTokenList();
    const {
        data: minAmount,
        isLoading: isLoadingMinAmount,
        isError: isErrorMinAmount,
        error: minAmountError,
    } = useMinAmount();
    const {
        data: sourceAssetBalance,
        isError: isErrorBalance,
        isLoading: isLoadingBalance,
        error: balanceError,
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

    if (isLoadingMinAmount || isLoadingBalance) {
        return {
            isValidParams: false,
            message: isLoadingMinAmount ? 'Fetching minimum amounts' : 'Fetching balances',
        };
    } else if (balanceError || minAmountError || !tokens || isErrorMinAmount || isErrorBalance) {
        const error = balanceError ?? minAmountError;
        const message = error instanceof Error ? error.message : 'Failed preflight check';
        return { isValidParams: false, message };
    } else {
        const sourceId = `${sourceAssetId}-${+sourceNetworkId}` as const;
        const sourceAssetDecimals = tokens.fungible.get(sourceId)?.decimals ?? 0;
        const formattedAmount = parseUnits(amount ?? '0', sourceAssetDecimals);
        if (formattedAmount < minAmount) {
            return {
                isValidParams: false,
                message: `Minimum amount is ${formatUnits(minAmount, sourceAssetDecimals)}`,
            };
        } else if (sourceAssetBalance < formattedAmount) {
            return { isValidParams: false, message: 'Not enough balance' };
        } else {
            return {
                isValidParams: true,
            };
        }
    }
};
