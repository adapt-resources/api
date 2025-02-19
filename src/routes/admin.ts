import { authorizeAdmin } from '@/utils/admin';
import { pwdHash } from '@/utils/pwd';
import router from 'zesti/adapter/cloudflare';

export default router()
	.use(authorizeAdmin)
	// Format: "{name}.{password}"
	.post('/author/new', async (c) => {
		const body = await c.req.text();

		// Check for missing fields
		const delim = body.indexOf('.');
		if (delim === -1) return c.send(null, 400);

		try {
			await c.env.db
				.prepare('INSERT INTO users (name, pwd) VALUES (?, ?)')
				.bind(
					body.substring(0, delim),
					await pwdHash(body.substring(delim + 1))
				)
				.run();

			return c.send(null, 200);
		} catch {
			return c.send(null, 500);
		}
	});
