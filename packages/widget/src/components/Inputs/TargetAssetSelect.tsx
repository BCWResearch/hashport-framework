import {
    useBridgeParams,
    useBridgeParamsDispatch,
    useHashportClient,
    useSelectedTokens,
} from '@hashport/react-client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { TokenFilters } from 'components/TokenSelectionModal/TokenFilters';
import { TokenIcon } from 'components/TokenSelectionModal/TokenIcon';
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

export const TargetAssetSelect = ({ disabled, ...props }: ButtonProps) => {
    const hashportClient = useHashportClient();
    const dispatch = useBridgeParamsDispatch();
    const { targetAsset, sourceAsset } = useSelectedTokens();
    const { targetNetworkId } = useBridgeParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const icons = {
        endIcon: targetAsset ? undefined : <ArrowDropDownIcon />,
        startIcon: targetAsset ? <TokenIcon token={targetAsset} /> : undefined,
    } as const;

    return (
        <>
            <Button
                sx={({ palette }) =>
                    targetAsset
                        ? { backgroundColor: alpha(palette.primary.main, 0.2), color: 'white' }
                        : {}
                }
                {...props}
                disabled={!sourceAsset || disabled}
                onClick={handleOpen}
                {...icons}
            >
                {targetAsset?.symbol ?? 'SELECT'}
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
