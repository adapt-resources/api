import nothrow from '@/utils/nothrow';
import { pwdHash } from '@/utils/pwd';
import query from '@/utils/query';
import { revokeSession } from '@/utils/session';
import router from 'zesti/adapter/cloudflare';

const insertAuthor = query('INSERT INTO authors (name, pwd) VALUES (?, ?)');

export default router()
	// Format: "{name}.{password}"
	.post('/new', async (c) => {
		const parts = (await c.req.text()).split('.');
		if (parts.length !== 2) return c.send(null, 400);

		return await nothrow(
			insertAuthor(parts[0], await pwdHash(parts[1])).run()
		) != null
			? c.send(null, 200)
			: c.send(null, 500);
	})

	// Revoke an user token
	.post('/revoke', async (c) => {
		revokeSession(await c.req.text());
		return c.send(null, 200);
	});
