import { fn } from "zesti";

let secret: string;

export const changeAdminSecret = () => console.info('Admin secret:', secret = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24)))));
changeAdminSecret();

export const authorizeAdmin = fn(
	(next, c) => c.req.headers.get('Authorization') === secret
		? next()
		// Hide the endpoint
		: c.send(null, 404)
);
