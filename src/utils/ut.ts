import { UTApi } from 'uploadthing/server';
import { env } from 'cloudflare:workers';

export default new UTApi({
	logLevel: 'Error',
	token: env.UT_TOKEN
});
