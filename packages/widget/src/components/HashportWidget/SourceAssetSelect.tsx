import { useBridgeParams, useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from 'components/styled/Button';
import { ChangeEventHandler, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TokenSelectionModal } from '../TokenSelectionModal/TokenSelectionModal';

export const SourceAssetSelect = () => {
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens, isError, isLoading } = useTokenList();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;

    const handleSetSource: ChangeEventHandler<HTMLSelectElement> = e => {
        dispatch.setSourceAsset(tokens?.fungible.get(e.target.value as `${string}-${number}`));
    };

    if (isLoading) {
        return <CircularProgress />;
    } else if (isError) {
        return <p>Error Loading Assets</p>;
    } else {
        const sourceAsset = sourceId && tokens.fungible.get(sourceId);
        return (
            <>
                <Button onClick={() => setIsModalOpen(true)} endIcon={<ArrowDropDownIcon />}>
                    {sourceAsset?.symbol ?? 'Select'}
                </Button>
                <select value={sourceId ?? ''} onChange={handleSetSource}>
                    <option value="">Choose a source asset</option>
                    {Array.from(tokens.fungible)
                        .sort((a, b) => a[1].symbol.localeCompare(b[1].symbol))
                        .map(([id, token]) => {
                            return (
                                <option key={id} value={id}>
                                    {token.symbol}
                                </option>
                            );
                        })}
                </select>
                <TokenSelectionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </>
        );
    }
};
