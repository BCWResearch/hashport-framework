import {
    useBlockConfirmations,
    useHashportClient,
    useProcessingTransaction,
} from '@hashport/react-client';
import { useBlockNumber, useWaitForTransaction } from 'wagmi';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { Collapse } from 'components/styled/Collapse';
import { isHex } from 'viem';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/InfoOutlined';

export const BlockConfirmations = () => {
    const { evmSigner } = useHashportClient();
    const chainId = evmSigner.getChainId();
    const { currentTransaction } = useProcessingTransaction();
    const { data: blockConfirmations = 5 } = useBlockConfirmations(chainId);
    const { data: txReceipt } = useWaitForTransaction({
        hash: currentTransaction?.state.evmTransactionHash,
    });
    const { data: currentBlock } = useBlockNumber({ watch: true });

    const isMissingData = Boolean(!txReceipt || !blockConfirmations || !currentBlock);
    const isOpen = isHex(currentTransaction?.params.sourceAssetId) && !isMissingData;

    const progress = currentBlock && txReceipt ? currentBlock - txReceipt.blockNumber : 0n;
    const blockConfirmsBn = BigInt(blockConfirmations);
    const progressValue = (progress * 100n) / blockConfirmsBn;

    return (
        <Collapse in={isOpen}>
            <Box sx={{ opacity: 0.5 }}>
                {progress > blockConfirmsBn ? (
                    <Typography fontWeight="light" align="center" color="white">
                        Please wait as we confirm that the transfer has been scheduled for
                        validation.
                    </Typography>
                ) : (
                    <Tooltip
                        arrow
                        placement="bottom"
                        title="Block confirmations indicate how many blocks have been created since your transaction. Waiting for the designated number of confirmations ensures that your transaction is processed accurately and securely."
                    >
                        <Typography
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            fontWeight="light"
                            color="white"
                            variant="subtitle2"
                        >
                            {`${progress.toString()} / ${blockConfirmations} Block Confirmations`}
                            <InfoIcon fontSize="small" />
                        </Typography>
                    </Tooltip>
                )}
            </Box>
            <LinearProgress
                sx={({ spacing }) => ({ borderRadius: spacing(1) })}
                variant="determinate"
                value={parseInt(progressValue.toString())}
            />
        </Collapse>
    );
};
