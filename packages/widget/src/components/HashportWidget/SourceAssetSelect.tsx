import { useBridgeParams, useTokenList } from '@hashport/react-client';
import { Button } from 'components/styled/Button';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Modal } from '../styled/Modal';
import Typography from '@mui/material/Typography';
import { SelectSourceTokenList } from 'components/TokenSelectionModal/TokenList';
import { SelectionFilterProvider } from 'contexts/selectionFilterContext';
import Stack from '@mui/material/Stack';
import { TokenFilters } from 'components/TokenSelectionModal/TokenFilters';

const ModalHeader = () => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Select a token</Typography>
            <TokenFilters />
        </Stack>
    );
};

export const SourceAssetSelect = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: tokens } = useTokenList();

    const { sourceAssetId, sourceNetworkId } = useBridgeParams();
    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    return (
        <>
            <Button onClick={handleOpen} endIcon={<ArrowDropDownIcon />}>
                {sourceAsset?.symbol ?? 'Select'}
            </Button>
            <SelectionFilterProvider>
                <Modal open={isModalOpen} onClose={handleClose} header={<ModalHeader />}>
                    <SelectSourceTokenList onSelect={handleClose} />
                </Modal>
            </SelectionFilterProvider>
        </>
    );
};
