import createHmac from 'fast-crypt/web/signer/hmac';
import { fn } from 'zesti';
import { Context } from 'zesti/types/route';

type TokenInfo = [exp: number];

// I have only 20 users lol
const sessions = new Map<string, TokenInfo>();

const TOKEN_PREFIX = 'token=';
const EXPIRE_TIME = 86400000 * 15; // Expire in 15 days

export const setToken = async (c: Context, value: string) => {
	c.headers.push(['Cookie', TOKEN_PREFIX + value]);
	sessions.set(value, [Date.now() + EXPIRE_TIME]);
};

export const validateToken = (info: TokenInfo | undefined) => typeof info !== 'undefined' && info[0] > Date.now();

export const getToken = fn<{ token: string }>(async (next, c) => {
	const cookie = c.req.headers.get('Cookie');
	if (cookie !== null) {
		const tokenIdx = cookie.indexOf(TOKEN_PREFIX) + 6;
		if (tokenIdx !== 5) {
			const delim = cookie.indexOf(';', tokenIdx);

			const token = delim === -1
				? cookie.substring(tokenIdx).trim()
				: cookie.substring(tokenIdx, delim).trim();

			if (validateToken(sessions.get(token))) {
				c.token = token;
				return next();
			}
		}
	}

	return c.send('Invalid token', 403);
});
