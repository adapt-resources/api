import cookie from 'fast-crypt/cookie';
import * as opts from 'fast-crypt/cookie/options';

import { fn } from 'zesti';
import { Context } from 'zesti/types/route';

type SessionValue = string;

const MAX_AGE_SEC = 60 * 60 * 24 * 15; // 15 days
const MAX_AGE_MS = MAX_AGE_SEC * 1e3;

// I have 20 users
const sessions = new Map<string, [
	exp: number,
	value: SessionValue
]>();

const [extractToken, setTokenValue] = cookie(
	'token', opts.maxAge(MAX_AGE_SEC) + opts.httpOnly
);

// Storing username
export const createSession = async (c: Context, value: string) => {
	c.headers.push(['Set-Cookie', setTokenValue(value)]);
	sessions.set(value, [Date.now() + MAX_AGE_MS, value]);
};

export const getSession = fn<{ session: SessionValue }>(async (next, c) => {
	const cookie = c.req.headers.get('Cookie');
	if (cookie !== null) {
		const id = extractToken(cookie);
		if (id != null) {
			const info = sessions.get(id);
			if (info != null && info[0] > Date.now()) {
				c.session = info[1];
				return next();
			}
		}
	}

	return c.send('Invalid token', 403);
});

export const revokeSession = (id: string) => {
	sessions.delete(id);
};
