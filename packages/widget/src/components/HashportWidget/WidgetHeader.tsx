import { HashportClientProviderWithRainbowKit, useHashConnect } from '@hashport/react-client';
import Stack from '@mui/material/Stack';
import { Row } from 'components/styled/Row';
import { ComponentProps } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AccountButton } from './AccountButton';
import { NetworkSwitch } from './NetworkSwitch';
import { alpha } from '@mui/material/styles';

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
    // TODO: maybe have hashconnect be optional? handle rendering only the evm network stuff
    hashConnect: ReturnType<typeof useHashConnect>['hashConnect'],
) => ComponentProps<typeof HashportClientProviderWithRainbowKit>['renderConnectButton'] =
    hashConnect => (children, ConnectButton) => {
        const connect = () => hashConnect?.connectToLocalWallet();
        const hederaId = hashConnect?.hcData.pairingData[0]?.accountIds[0];
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
                    {/* TODO: add popover that gives the option to disconnect */}
                    <AccountButton account={hederaId} onClick={connect}>
                        {hederaId ?? 'Connect Hashpack'}
                    </AccountButton>
                </Row>
                {children}
            </Stack>
        );
    };
