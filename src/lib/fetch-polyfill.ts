// Dummy fetch polyfill to prevent node-fetch from overwriting global fetch in browser
export const fetch = typeof window !== 'undefined' ? window.fetch.bind(window) : undefined;
export const Headers = typeof window !== 'undefined' ? window.Headers : undefined;
export const Request = typeof window !== 'undefined' ? window.Request : undefined;
export const Response = typeof window !== 'undefined' ? window.Response : undefined;
export default fetch;
