import router from 'zesti/adapter/cloudflare';
import query from '@/utils/query';
import nothrow from '@/utils/nothrow';

const getFile = query('SELECT (url) FROM files WHERE rowid = ?');
const listFiles = query('SELECT (rowid AS id, name, topic) FROM files');

export default router()
	.get('/*', async (params, c) => {
		const result = await nothrow(
			getFile(params[0]).first<{ url: string }>()
		);

		if (result != null)
			return fetch(result.url);

		return c.send(null, 404);
	})
	.get('/list', async (c) => {
		const result = await nothrow(
			listFiles().all<{
				id: number,
				name: string,
				topic: string
			}>()
		);

		return result != null
			? c.json(result, 200)
			: c.send(null, 404);
	});
