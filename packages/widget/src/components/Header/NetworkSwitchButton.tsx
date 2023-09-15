import { useBridgeParams } from '@hashport/react-client';
import Button from '@mui/material/Button';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const NetworkSwitchButton = () => {
    const { switchNetworkAsync } = useSwitchNetwork();
    const { chains } = useNetwork();
    const { sourceNetworkId, targetNetworkId } = useBridgeParams();
    const desiredNetwork = chains.find(c => c.id === +sourceNetworkId || c.id === +targetNetworkId);

    const handleClick = () => {
        if (switchNetworkAsync && desiredNetwork) {
            switchNetworkAsync(desiredNetwork.id).catch(e => console.log(e));
        }
    };

    return (
        <Button
            fullWidth
            sx={({ spacing }) => ({
                height: spacing(7),
                borderRadius: spacing(4),
            })}
            disabled={!switchNetworkAsync && !desiredNetwork}
            color="error"
            onClick={handleClick}
        >{`Switch to ${desiredNetwork?.name} network`}</Button>
    );
};
