import {
    useBridgeParams,
    useBridgeParamsDispatch,
    useHashportClient,
    useTokenList,
} from '@hashport/react-client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TokenFilters } from 'components/TokenSelectionModal/TokenFilters';
import { SelectTargetTokenList } from 'components/TokenSelectionModal/TokenList';
import { Button } from 'components/styled/Button';
import { Modal } from 'components/styled/Modal';
import { SelectionFilterProvider } from 'contexts/selectionFilterContext';
import { useEffect, useState } from 'react';

const ModalHeader = () => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Select a token</Typography>
            <TokenFilters />
        </Stack>
    );
};

export const TargetAssetSelect = () => {
    const hashportClient = useHashportClient();
    const dispatch = useBridgeParamsDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: tokens } = useTokenList();

    const { sourceAssetId, sourceNetworkId, targetNetworkId } = useBridgeParams();
    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);
    const bridgeable = sourceAsset ? sourceAsset?.bridgeableAssets : null;
    const targetId = bridgeable?.find(({ chainId }) => chainId === +targetNetworkId)?.assetId;
    const targetAsset = targetId && tokens?.fungible.get(targetId);

    useEffect(() => {
        if (!targetNetworkId) {
            dispatch.setRecipient('');
            return;
        }
        const hederaId = hashportClient.hederaSigner.accountId;
        const evmAccount = hashportClient.evmSigner.getAddress();
        const hederaChains = [296, 295];
        dispatch.setRecipient(hederaChains.includes(+targetNetworkId) ? hederaId : evmAccount);
    }, [
        targetNetworkId,
        dispatch,
        hashportClient.evmSigner,
        hashportClient.hederaSigner.accountId,
    ]);

    const handleOpen = () => setIsModalOpen(true);

    return (
        <>
            <Button disabled={!sourceAsset} onClick={handleOpen} endIcon={<ArrowDropDownIcon />}>
                {targetAsset?.symbol ?? 'Select'}
            </Button>
            <SelectionFilterProvider>
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    header={<ModalHeader />}
                >
                    <SelectTargetTokenList onSelect={() => setIsModalOpen(false)} />
                </Modal>
            </SelectionFilterProvider>
        </>
    );
};
