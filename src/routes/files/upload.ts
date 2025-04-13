import router from 'zesti/adapter/cloudflare';

import query, { batch } from '@/utils/query';
import { getSession } from '@/utils/session';
import ut from '@/utils/ut';
import nothrow from '@/utils/nothrow';

const uploadFile = query('INSERT INTO files (name, url, topic, owner) VALUES (?, ?, ?, ?)');

export default router()
	.use(getSession)
	.post('/', async (c) => {
		const form = await nothrow(c.req.formData());
		if (form != null) {
			const name = form.get('name');
			const topic = form.get('topic');
			const files = form.getAll('file');

			if (typeof name === 'string' && typeof topic === 'string' && files.every((file) => file instanceof File)) {
				const failedFiles: string[] = [];
				const uploadQueries: D1PreparedStatement[] = [];

				for (
					let i = 0, results = await ut.uploadFiles(files);
					i < results.length;
					i++
				) {
					const name = files[i].name;

					// No error then save it to the database
					const res = results[i];
					if (res.error === null) {
						uploadQueries.push(
							uploadFile(
								name,
								topic,
								res.data.ufsUrl,
								c.session
							)
						);

						continue;
					}

					failedFiles.push(name);
				}

				// If not all files failed then run the upload queries
				if (failedFiles.length < files.length && await nothrow(batch(uploadQueries)) == null)
					return c.send(null, 500);

				// Send failed to upload files
				return failedFiles.length === 0
					? c.send(null, 200)
					: c.send(failedFiles.join(':'), 500);
			}
		}

		return c.send(null, 404);
	});
