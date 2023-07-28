import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/restServer.js';
import { fetch, Request, Response } from 'cross-fetch';

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

afterEach(() => server.resetHandlers());
