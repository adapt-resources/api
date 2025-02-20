import { pwdHash } from '@/utils/pwd';
import { prepare } from '@/utils/query';
import { revokeSession } from '@/utils/session';
import router from 'zesti/adapter/cloudflare';

const insertAuthor = prepare('INSERT INTO authors (name, pwd) VALUES (?, ?)');

export default router()
	// Format: "{name}.{password}"
	.post('/new', async (c) => {
		const parts = (await c.req.text()).split('.');
		if (parts.length !== 2) return c.send(null, 400);

		try {
			await insertAuthor(c)
				.bind(parts[0], await pwdHash(parts[1]))
				.run();

			return c.send(null, 200);
		} catch (e) {
			console.error(e);
			return c.send(null, 500);
		}
	})
	// Revoke an user token
	.post('/revoke', async (c) => {
		revokeSession(await c.req.text());
		return c.send(null, 200);
	});
