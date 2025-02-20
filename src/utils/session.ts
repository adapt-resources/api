import cookie from 'fast-crypt/cookie';
import * as opts from 'fast-crypt/cookie/options';

import { fn } from 'zesti';
import { Context } from 'zesti/types/route';

const MAX_AGE_SEC = 60 * 60 * 24 * 15; // 15 days
const MAX_AGE_MS = MAX_AGE_SEC * 1e3;

const sessions = new Map<string, {
	expires: number
}>();
const [extractToken, setTokenValue] = cookie(
	'token', opts.maxAge(MAX_AGE_SEC)
);

export const createSession = async (c: Context, value: string) => {
	c.headers.push(['Set-Cookie', setTokenValue(value)]);
	sessions.set(value, {
		expires: Date.now() + MAX_AGE_MS
	});
};
export const getSession = fn<{ session: string }>(async (next, c) => {
	const cookie = c.req.headers.get('Cookie');
	if (cookie !== null) {
		const id = extractToken(cookie);
		if (id != null) {
			const info = sessions.get(id);
			if (info != null && info.expires > Date.now()) {
				c.session = id;
				return next();
			}
		}
	}

	return c.send('Invalid token', 403);
});
export const revokeSession = (id: string) => {
	sessions.delete(id);
};
