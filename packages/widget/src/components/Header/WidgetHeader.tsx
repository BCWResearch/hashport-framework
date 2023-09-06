import { HashportClientProviderWithRainbowKit, useHashConnect } from '@hashport/react-client';
import Stack from '@mui/material/Stack';
import { Row } from 'components/styled/Row';
import { ComponentProps, MouseEvent, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AccountButton } from './AccountButton';
import { NetworkSwitch } from './NetworkSwitch';
import { alpha } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import { Button } from 'components/styled/Button';
import PowerOffIcon from '@mui/icons-material/PowerOff';

const customEvmConnectButton: ComponentProps<typeof ConnectButton.Custom>['children'] = ({
    openConnectModal,
    account,
    chain,
    openAccountModal,
    mounted,
}) => {
    const isConnected = Boolean(account && chain && mounted);
    const handleClick = isConnected ? openAccountModal : () => openConnectModal?.();
    return (
        <>
            {isConnected && <NetworkSwitch />}
            <AccountButton account={account?.displayName} onClick={handleClick}>
                {account?.displayName ?? 'Connect EVM'}
            </AccountButton>
        </>
    );
};

export const renderWidgetHeader: (
    hashConnect: ReturnType<typeof useHashConnect>['hashConnect'],
) => ComponentProps<typeof HashportClientProviderWithRainbowKit>['renderConnectButton'] =
    hashConnect => (children, ConnectButton) => {
        const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
        const hederaId = hashConnect?.hcData.pairingData[0]?.accountIds[0];
        const topic = hashConnect?.hcData.pairingData[0]?.topic ?? '';

        const disconnect = async () => {
            hashConnect?.disconnect(topic);
            handleClose();
        };

        const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
            hederaId ? setAnchorEl(e.currentTarget) : hashConnect?.connectToLocalWallet();
        };

        const handleClose = () => setAnchorEl(null);

        return (
            <Stack>
                <Row
                    sx={({ palette, spacing }) => ({
                        padding: spacing(1),
                        borderRadius: spacing(1),
                        backgroundColor: alpha(palette.primary.main, 0.15),
                    })}
                    justifyContent="end"
                    mb={2}
                    gap={1.5}
                >
                    <ConnectButton.Custom>{customEvmConnectButton}</ConnectButton.Custom>
                    <AccountButton account={hederaId} onClick={handleClick}>
                        {hederaId ?? 'Connect HashPack'}
                    </AccountButton>
                    <Popover
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Button
                            sx={{ margin: 2 }}
                            color="error"
                            endIcon={<PowerOffIcon />}
                            onClick={disconnect}
                        >
                            Disconnect HashPack
                        </Button>
                    </Popover>
                </Row>
                {children}
            </Stack>
        );
    };
