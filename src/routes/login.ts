import { pwdVerify } from '@/utils/pwd';
import { prepare } from '@/utils/query';
import { createSession } from '@/utils/session';
import router from 'zesti/adapter/cloudflare';

const selectAuthor = prepare('SELECT (pwd) FROM authors where name = ?');

export default router()
	.post('/', async (c) => {
		try {
			const form = await c.req.formData();

			const name = form.get('name');
			const pwd = form.get('pwd');

			if (typeof name === 'string' && typeof pwd === 'string') {
				const res = await selectAuthor(c)
					.bind(name)
					.first<{ pwd: string }>();

				console.log(res);

				// Yay hash checking
				if (res !== null && await pwdVerify(res.pwd, pwd)) {
					createSession(c, name);
					return c.send(null, 200);
				}
			}
		} catch (e) {
			console.error(e);
		}

		return c.send(null, 404);
	});
