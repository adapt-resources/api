import { fn } from 'zesti';

let secret: string;

// Change admin secret on intervals
export const changeAdminSecret = () => console.info('Admin secret:', secret = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24)))));

export const authorizeAdmin = fn(
	(next, c) => c.req.headers.get('Authorization') === secret
		? next()
		// Hide the endpoint
		: c.send(null, 404)
);
