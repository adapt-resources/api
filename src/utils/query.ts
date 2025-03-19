import { env } from 'cloudflare:workers';

export const batch = (queries: D1PreparedStatement[]) => env.db.batch(queries);

export default (query: string) => {
	let q: D1PreparedStatement;
	return (...args: unknown[]) => (q ??= env.db.prepare(query)).bind(...args);
}
