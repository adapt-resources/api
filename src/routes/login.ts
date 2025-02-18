import { setToken } from '@/utils/session';
import router from 'zesti/adapter/cloudflare';

export default router()
	.post('/login', async (c) => {
		try {
			const form = await c.req.formData();
			const name = form.get('name');
			const pwd = form.get('pwd');

			if (typeof name === 'string' && typeof pwd === 'string') {
				const res = await c.env.db
					.prepare('SELECT (pwd) FROM users where name = ?')
					.bind(name)
					.all<{ pwd: string }>();

				// TODO: password hashing
				if (res.results.length === 1 && pwd === res.results[0].pwd) {
					setToken(c, name);
					return c.send(null, 200);
				}
			}
		} catch {}

		return c.send('Invalid username or password', 404);
	});
