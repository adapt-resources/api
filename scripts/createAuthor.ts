import routes from '@/routes';
import client from 'zesti/client';

const secret = prompt('Admin secret:')!;

const res = await client<typeof routes>(
	'https://adapt-api.aquapi.workers.dev', ['post']
).post('/admin/author/new', {
	body: `${prompt('Author name:')}.${prompt('Password:')}`,
	headers: { Authorization: secret }
});

switch (res.status) {
	case 200:
		console.log('Created user successfully!');
		break;
	case 400:
		console.log('Invalid username or password!');
		break;
	case 500:
		console.log('Query error');
		break;
}
