const ERROR_CATEGORY = {
    PORTING_EXECUTION: 'PORTING_EXECUTION',
    USER_REJECTION: 'USER_REJECTION',
    NETWORK_ISSUE: 'NETWORK_ISSUE',
    INVALID_PARAMS: 'INVALID_PARAMS',
    INVALID_STATE: 'INVALID_STATE',
    PREFLIGHT_FAILURE: 'PREFLIGHT_FAILURE',
} as const;

type ErrorCategory = keyof typeof ERROR_CATEGORY;

export class HashportError extends Error {
    category: ErrorCategory;
    constructor(message: string, category: ErrorCategory) {
        super(message);
        this.name = 'HashportError';
        this.category = category;
    }
}
