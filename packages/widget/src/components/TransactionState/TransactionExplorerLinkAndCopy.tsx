import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import MuiLink, { LinkProps } from '@mui/material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import { useRef } from 'react';
import { useExplorerUrls, useHashportClient } from '@hashport/react-client';
import { isHex } from 'viem';
import { Collapse } from 'components/styled/Collapse';

const StyledFieldset = styled(`fieldset`)(({ theme: { shape, palette, spacing, typography } }) => ({
    borderRadius: `calc(${shape.borderRadius}px - ${spacing(1)})`,
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

export const ViewConfirmationTransactionButton = ({
    confirmationId,
    ...props
}: LinkProps & { confirmationId: string | undefined }) => {
    const { data: explorers } = useExplorerUrls();
    const { evmSigner, mode } = useHashportClient();

    const getExplorerLink = () => {
        if (!explorers || !confirmationId) return '';
        if (isHex(confirmationId)) {
            return `${explorers[evmSigner.getChainId()]}tx/${confirmationId}`;
        } else {
            const hederaChain = mode === 'mainnet' ? 295 : 296;
            return `${explorers[hederaChain]}transaction/${confirmationId}`;
        }
    };
    return (
        <ExternalLink
            href={getExplorerLink()}
            {...props}
            underline="always"
            justifyContent="center"
            sx={({ palette, spacing, shape }) => ({
                textWrap: 'nowrap',
                borderRadius: shape.borderRadius,
                outline: `1px solid ${palette.primary.main}`,
                padding: spacing(1, 2),
            })}
        >
            View Transaction
        </ExternalLink>
    );
};

export const TransactionExplorerLinkAndCopy = ({
    txIdOrHash,
}: {
    txIdOrHash: string | undefined;
}) => {
    const { evmSigner, mode } = useHashportClient();
    const { data: explorers } = useExplorerUrls();
    const txIdOrHashRef = useRef('');
    if (txIdOrHash) txIdOrHashRef.current = txIdOrHash;
    const hashOrId = txIdOrHash ?? txIdOrHashRef.current;
    const formattedHashOrId = isHex(hashOrId)
        ? `${hashOrId.slice(0, 6)}...${hashOrId.slice(-4)}`
        : hashOrId;

    const getExplorerLink = () => {
        if (!explorers || !hashOrId) return '';
        if (isHex(hashOrId)) {
            return `${explorers[evmSigner.getChainId()]}tx/${hashOrId}`;
        } else {
            const hederaChain = mode === 'mainnet' ? 295 : 296;
            return `${explorers[hederaChain]}transaction/${hashOrId}`;
        }
    };

    return (
        <Collapse in={Boolean(txIdOrHash)}>
            <StyledFieldset>
                <legend>{isHex(hashOrId) ? 'Transaction Hash' : 'Hedera Transaction Id'}</legend>
                <Stack direction="row" justifyContent="center" spacing={1}>
                    <ExternalLink justifyContent="space-between" href={getExplorerLink()}>
                        {formattedHashOrId}
                    </ExternalLink>
                    <CopyButton copyText={txIdOrHash ?? txIdOrHashRef.current} />
                </Stack>
            </StyledFieldset>
        </Collapse>
    );
};
