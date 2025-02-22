import nothrow from '@/utils/nothrow';
import { pwdVerify } from '@/utils/pwd';
import query from '@/utils/query';
import { createSession } from '@/utils/session';
import router from 'zesti/adapter/cloudflare';

const selectAuthor = query('SELECT (pwd) FROM authors where name = ?');

export default router()
	.post('/', async (c) => {
		const form = await nothrow(c.req.formData());
		if (form != null) {
			const name = form.get('name');
			const pwd = form.get('pwd');

			if (typeof name === 'string' && typeof pwd === 'string') {
				const res = await nothrow(
					selectAuthor(name).first<{ pwd: string }>()
				);

				// Yay hash checking
				if (res != null && await pwdVerify(res.pwd, pwd)) {
					createSession(c, name);
					return c.send(null, 200);
				}
			}
		}

		return c.send(null, 404);
	});
