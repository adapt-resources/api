import router from 'zesti/adapter/cloudflare';
import query from '@/utils/query';
import nothrow from '@/utils/nothrow';

const getFile = query('SELECT (url) FROM files WHERE rowid = ?');

export default router()
	.get('/*', async (params, c) => {
		const result = await nothrow(
			getFile(params[0]).first<{ url: string }>()
		);

		if (result != null) {
			c.headers.push(['Location', result.url]);
			return c.send(null, 302);
		}

		return c.send(null, 404);
	});
