import { AssetInfo } from '@hashport/react-client';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

export const TokenIcon = ({ token }: { token: AssetInfo }) => {
    return (
        <Badge
            overlap="circular"
            anchorOrigin={{
                vertical: `bottom`,
                horizontal: `right`,
            }}
            badgeContent={
                <Avatar
                    alt={`${token?.symbol} badge`}
                    src={`https://cdn.hashport.network/${token.chainId}.svg`}
                    imgProps={{
                        style: {
                            width: 20,
                            height: 20,
                            objectFit: `contain`,
                        },
                    }}
                />
            }
        >
            <Avatar
                alt={token.symbol}
                src={token.icon}
                imgProps={{
                    style: {
                        width: 32,
                        height: 32,
                    },
                }}
            />
        </Badge>
    );
};
