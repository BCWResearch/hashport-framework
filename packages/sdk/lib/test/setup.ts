import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/restServer.js';
import { fetch, Request, Response } from 'cross-fetch';

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;

beforeAll(() =>
    server.listen({
        onUnhandledRequest(req, print) {
            // TODO: figure out why this is being made
            if (req.url.href === 'http://localhost:3000/undefined') return;
            print.error();
        },
    }),
);

afterAll(() => server.close());

afterEach(() => server.resetHandlers());
