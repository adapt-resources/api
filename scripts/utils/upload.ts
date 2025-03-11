import client from './client';
import { login } from './login';

const logSpan = async <T>(label: string, fn: () => T): Promise<Awaited<T>> => {
	const start = Bun.nanoseconds();
	const t = await fn();
	console.log(label + ':', ((Bun.nanoseconds() - start) / 1e6).toFixed(2) + 'ms');
	return t as any;
}

export const upload = async (name: string, paths: string[]) => {
	const cookies = await login();

	const form = await logSpan('Load files from memory', async () => {
		const form = new FormData();
		form.set('name', name);

		let untitledId = 1;
		for (const path of paths) {
			const lazyBlob = Bun.file(path);
			form.append('file', new File([await lazyBlob.arrayBuffer()], lazyBlob.name ?? `Untitled ${untitledId++}`));
		}

		return form;
	});

	const res = await logSpan('Upload files to UT', () =>
		client.post('/files/upload', {
			body: form,
			headers: cookies.map(
				(val) => ['Cookie', val.substring(0, val.indexOf(';') >>> 0)]
			)
		})
	);

	switch (res.status) {
		case 200:
			console.log('Upload successfully!');
			break;

		case 404:
			throw new Error('Unauthorized!');

		case 500:
			throw new Error('Error uploading files: ' + await res.text());
	}
}

if (import.meta.main) {
	const name = process.argv[2];
	if (name == null) throw new Error('Files topic must be specified');

	const files = process.argv.slice(3);
	if (files.length === 0) throw new Error('A file must be specified');

	await upload(name, files);
}
