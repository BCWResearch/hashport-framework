import Avatar from '@mui/material/Avatar';
import { useChainModal } from '@rainbow-me/rainbowkit';
import { Button } from 'components/styled/Button';
import { useNetwork } from 'wagmi';
import ErrorIcon from '@mui/icons-material/Error';

const NetworkIcon = ({ chainId }: { chainId: number }) => {
    return (
        <Avatar
            sx={{ width: 20, height: 20 }}
            alt="network"
            src={`https://cdn.hashport.network/${chainId}.svg`}
        />
    );
};

export const NetworkSwitch = () => {
    const { openChainModal } = useChainModal();
    const { chain } = useNetwork();
    const isUnsupported = chain?.unsupported;
    const networkName = chain?.name;
    const chainId = !isUnsupported ? chain?.id : undefined;
    return (
        <Button
            sx={({ palette }) => ({
                backgroundColor: palette[isUnsupported ? 'error' : 'primary'].dark,
                color: 'white',
                '&:hover': { backgroundColor: palette[isUnsupported ? 'error' : 'primary'].main },
            })}
            startIcon={chainId ? <NetworkIcon chainId={chainId} /> : undefined}
            onClick={openChainModal}
        >
            {isUnsupported ? <ErrorIcon /> : networkName}
        </Button>
    );
};
