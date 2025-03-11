import routes from '@/routes';
import client from 'zesti/client';

export default client<typeof routes>(
	'http://localhost:8787', ['get', 'post']
);
