import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import MuiLink, { LinkProps } from '@mui/material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import { useRef } from 'react';
import Collapse from '@mui/material/Collapse';
import { useExplorerUrls, useHashportClient } from '@hashport/react-client';
import { isHex } from 'viem';

const StyledFieldset = styled(`fieldset`)(({ theme: { shape, palette, spacing, typography } }) => ({
    borderRadius: shape.borderRadius,
    border: `1.5px solid ${palette.border.main}`,
    '& legend': {
        opacity: 0.75,
        paddingInline: spacing(1),
        color: palette.primary.main,
        ...typography.caption,
    },
}));

const ExternalLink = ({ children, ...props }: LinkProps) => {
    return (
        <MuiLink
            underline="hover"
            align="center"
            variant="body2"
            display="flex"
            alignItems="center"
            component="a"
            target="_blank"
            rel="noopener"
            justifyContent="space-between"
            flexGrow={1}
            textAlign={{
                xs: `center`,
                sm: `right`,
            }}
            {...props}
        >
            {children}
            <LaunchIcon fontSize="small" />
        </MuiLink>
    );
};

const CopyButton = ({ copyText }: { copyText: string }) => {
    const handleCopy = async () => {
        if (!navigator.clipboard) return;
        try {
            await navigator.clipboard.writeText(copyText);
        } catch (error) {
            console.warn(error);
        }
    };
    return (
        <IconButton onClick={handleCopy}>
            <ContentCopyIcon color="primary" fontSize="small" />
        </IconButton>
    );
};

export const TransactionExplorerLinkAndCopy = ({
    txIdOrHash,
}: {
    txIdOrHash: string | undefined;
}) => {
    const { evmSigner, mode } = useHashportClient();
    // TODO: fix CORS issue
    const { data: explorers } = useExplorerUrls();
    const txIdOrHashRef = useRef('');
    if (txIdOrHash) txIdOrHashRef.current = txIdOrHash;
    // use a utility function to get the block explorers

    const getExplorerLink = () => {
        const hash = txIdOrHash ?? txIdOrHashRef.current;
        if (!explorers || !hash) return '';
        if (isHex(txIdOrHash)) {
            return `${explorers[evmSigner.getChainId()]}${hash}`;
        } else {
            const hederaChain = mode === 'mainnet' ? 295 : 296;
            //TODO: format as {txIdSeconds}.{txIdNanos}
            return `${explorers[hederaChain]}${hash}`;
        }
    };

    return (
        <Collapse in={Boolean(txIdOrHash)}>
            <StyledFieldset>
                <legend>Hedera Transaction Id</legend>
                <Stack direction="row" justifyContent="center" spacing={1}>
                    <ExternalLink href={getExplorerLink()}>Link to example.com</ExternalLink>
                    <CopyButton copyText={txIdOrHash ?? txIdOrHashRef.current} />
                </Stack>
            </StyledFieldset>
        </Collapse>
    );
};
