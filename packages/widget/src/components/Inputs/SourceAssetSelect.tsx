import { useSelectedTokens } from '@hashport/react-client';
import { Button } from 'components/styled/Button';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Modal } from '../styled/Modal';
import Typography from '@mui/material/Typography';
import { SelectSourceTokenList } from 'components/TokenSelectionModal/TokenList';
import { SelectionFilterProvider } from 'contexts/selectionFilterContext';
import Stack from '@mui/material/Stack';
import { TokenFilters } from 'components/TokenSelectionModal/TokenFilters';
import { TokenIcon } from 'components/TokenSelectionModal/TokenIcon';
import { alpha } from '@mui/material/styles';

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
    const { sourceAsset } = useSelectedTokens();

    const handleOpen = () => setIsModalOpen(true);

    const handleClose = () => setIsModalOpen(false);

    const icons = {
        endIcon: sourceAsset ? undefined : <ArrowDropDownIcon />,
        startIcon: sourceAsset ? <TokenIcon token={sourceAsset} /> : undefined,
    } as const;

    return (
        <>
            <Button
                sx={({ palette }) =>
                    sourceAsset
                        ? { backgroundColor: alpha(palette.primary.main, 0.2), color: 'white' }
                        : {}
                }
                onClick={handleOpen}
                {...icons}
            >
                {sourceAsset?.symbol ?? 'SELECT'}
            </Button>
            <SelectionFilterProvider>
                <Modal open={isModalOpen} onClose={handleClose} header={<ModalHeader />}>
                    <SelectSourceTokenList onSelect={handleClose} />
                </Modal>
            </SelectionFilterProvider>
        </>
    );
};
