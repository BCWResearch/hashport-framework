class FetchError extends Error {
    response: unknown;
    constructor(message?: string, response?: unknown, name = 'FetchError') {
        super(message);
        super.name = name;
        this.response = response;
    }
}

export class Fetcher<
    TResponse = never,
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TReturnVal = TResponse,
> {
    protected url: string;
    protected params?: TParams;
    protected signal?: AbortSignal;
    protected headers: Record<string, string>;
    protected responseTransformer?: (data: TResponse) => TReturnVal;
    protected fetch: typeof fetch;

    constructor(
        url: string,
        config?: {
            params?: TParams;
            headers?: Record<string, string>;
            responseTransformer?: (data: TResponse) => TReturnVal;
        },
    ) {
        this.url = url;
        this.params = config?.params;
        this.headers = config?.headers ?? {};
        this.responseTransformer = config?.responseTransformer;
        if (typeof window === 'undefined') {
            this.fetch = async (...args) => await (await import('cross-fetch')).fetch(...args);
        } else {
            this.fetch = fetch.bind(window);
        }
    }

    then(
        onfulfilled?: ((value: TReturnVal) => TReturnVal) | null | undefined,
        onrejected?: ((reason: unknown) => PromiseLike<never>) | null | undefined,
    ) {
        return this.dispatchRequest().then(onfulfilled, onrejected);
    }

    catch<TResult = never>(
        onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null,
    ): Promise<TReturnVal | TResult> {
        return this.dispatchRequest().catch(onrejected);
    }

    finally(onfinally?: (() => void) | undefined | null): Promise<TReturnVal> {
        return this.dispatchRequest().finally(onfinally);
    }

    private async dispatchRequest(): Promise<TReturnVal> {
        const requestUrl = new URL(this.url);
        for (const [key, value] of Object.entries(this.params ?? {})) {
            if (!value) continue;
            requestUrl.searchParams.append(key, value.toString());
        }
        const response = await this.fetch(requestUrl, {
            signal: this.signal,
            headers: this.headers,
        });

        if (response.ok) {
            const data = await response.json();
            if (this.responseTransformer) {
                return this.responseTransformer(data);
            }
            return data as TReturnVal;
        } else {
            const payload = await response.json().catch(() => null);
            const message = typeof payload === 'object' && 'message' in payload && payload.message;
            const error = new FetchError(message || response.statusText);
            error.response = response;
            throw error;
        }
    }

    addAbortSignal(signal?: AbortSignal) {
        this.signal = signal;
        return this.dispatchRequest();
    }
}
