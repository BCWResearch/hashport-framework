import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const TermsAndPolicy = () => {
    return (
        <Typography color="white" variant="caption" align="center" display="block" mx="auto" pt={1}>
            By sliding, I have read, understand, and agree to hashport&apos;s{' '}
            <Link
                component="a"
                href="https://hashport.network/terms"
                target="_blank"
                rel="noopener"
            >
                Terms of Use
            </Link>
            &nbsp;and&nbsp;
            <Link
                component="a"
                href="https://hashport.network/privacy"
                target="_blank"
                rel="noopener"
            >
                Privacy Policy
            </Link>
            .
        </Typography>
    );
};
