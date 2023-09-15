import en from 'locale/en.json';
import { BridgeStep } from '@hashport/sdk';

const STEP_STRINGS = {
    en,
} as const;

export const getStepDescription = (
    step: BridgeStep,
    isAssociating?: boolean,
    locale: 'en' = 'en',
) => {
    const stepStrings = STEP_STRINGS[locale];
    switch (step.type) {
        case 'Hedera': {
            const key =
                step.target === 'AccountBalanceQuery'
                    ? isAssociating
                        ? 'associating'
                        : 'checkAssociation'
                    : 'deposit';
            return stepStrings[step.type][key].replace('{hederaWallet}', 'your wallet');
        }
        case 'evm': {
            const { name } = JSON.parse(step.abi)[0] as { name: string };
            const functionName = name
                .replace(/([A-Z])/g, match => ` ${match}`)
                .toLowerCase()
                .trim();
            return stepStrings[step.type].send
                .replace('{functionName}', functionName)
                .replace('{evmWallet}', 'your wallet');
        }
        case 'poll': {
            return stepStrings[step.type][step.target.includes('transfers') ? 'verify' : 'confirm'];
        }
        default: {
            return 'Please wait...';
        }
    }
};
