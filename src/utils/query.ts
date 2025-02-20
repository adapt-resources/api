import type { BaseContext } from 'zesti/adapter/cloudflare';

export const prepare = (query: string) => {
	let tmp: D1PreparedStatement;
	return (c: BaseContext) => tmp ??= c.env.db.prepare(query);
}
