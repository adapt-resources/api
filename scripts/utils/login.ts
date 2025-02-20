import routes from '@/routes';
import client from 'zesti/client';

const form = new FormData();
form.set('name', prompt('Author name:')!);
form.set('pwd', prompt('Password:')!);

const res = await client<typeof routes>(
	'http://localhost:8787', ['post']
).post('/login', { body: form });

switch (res.status) {
	case 200:
		console.log('Login successfully!');
		console.log(res.headers.getSetCookie());
		break;
	case 404:
		console.log('Invalid username or password!');
		break;
}
