import { UTApi } from 'uploadthing/server';
import { lazyLoad } from './cf/env';

let api: UTApi;

lazyLoad(
	(env) => api = new UTApi({
		logLevel: 'Error',
		token: env.UT_TOKEN
	})
);

// @ts-ignore
export default api;
