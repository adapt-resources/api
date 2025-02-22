import { UTApi } from 'uploadthing/server';

let api: UTApi;

// @ts-ignore
export default api;

// Load UTApi on initialization request
export const createUTApi = (env: Env) => api = new UTApi({
	logLevel: 'Error',
	token: env.UT_TOKEN
});
