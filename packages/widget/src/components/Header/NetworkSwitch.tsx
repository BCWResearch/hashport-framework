import Avatar from '@mui/material/Avatar';
import { useChainModal } from '@rainbow-me/rainbowkit';
import { Button } from 'components/styled/Button';
import { useNetwork } from 'wagmi';
import ErrorIcon from '@mui/icons-material/Error';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme } from '@mui/material';

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
    const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down(400));
    const isUnsupported = chain?.unsupported;
    const networkName = isXs ? null : chain?.name;
    const chainId = !isUnsupported ? chain?.id : undefined;
    return (
        <Button
            sx={({ palette }) => ({
                backgroundColor: palette[isUnsupported ? 'error' : 'primary'].dark,
                color: 'white',
                '&:hover': { backgroundColor: palette[isUnsupported ? 'error' : 'primary'].main },
                '& .MuiButton-startIcon': { marginRight: isXs ? 0 : 1 },
            })}
            startIcon={chainId ? <NetworkIcon chainId={chainId} /> : undefined}
            onClick={openChainModal}
        >
            {isUnsupported ? <ErrorIcon /> : networkName}
        </Button>
    );
};
