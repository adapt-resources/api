import client from './client';

export const login = async () => {
	const form = new FormData();
	form.set('name', prompt('Author name:')!);
	form.set('pwd', prompt('Password:')!);

	const res = await client.post('/login', { body: form });

	switch (res.status) {
		case 200:
			console.log('Login successfully!');
			return res.headers.getSetCookie();
		case 404:
			throw new Error('Invalid username or password!');
	}
}

if (import.meta.main)
	console.log(await login());
