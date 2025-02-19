import { authorizeAdmin } from '@/utils/admin';
import { pwdHash } from '@/utils/pwd';
import router from 'zesti/adapter/cloudflare';

export default router()
	.use(authorizeAdmin)
	// Format: "{name}.{password}"
	.post('/author/new', async (c) => {
		const parts = (await c.req.text()).split('.');
		if (parts.length !== 2) return c.send(null, 400);

		try {
			await c.env.db
				.prepare('INSERT INTO users (name, pwd) VALUES (?, ?)')
				.bind(
					parts[0],
					await pwdHash(parts[1])
				)
				.run();

			return c.send(null, 200);
		} catch (e) {
			console.error(e);
			return c.send(null, 500);
		}
	});
