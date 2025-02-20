import router from 'zesti/adapter/cloudflare';
import { authorizeAdmin } from '@/utils/admin';

import author from './author';

export default router()
	.use(authorizeAdmin)
	.route('/author', author);
