import router from 'zesti/adapter/cloudflare';
import cors from 'zesti/utils/cors';
import login from './login';
import admin from './admin';

export default router()
	.use(
		cors('https://clubadapt.pages.dev', {
			allowCredentials: true
		})
	)
	.get('/', (c) => c.send('ADaPT resources API'))
	.route('/login', login)
	.route('/admin', admin);
