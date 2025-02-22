import router from 'zesti/adapter/cloudflare';

import upload from './upload';
import get from './get';

export default router()
	.route('/upload', upload)
	.route('/get', get);
