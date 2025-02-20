import config from '../wrangler.jsonc';

const db = process.argv[2];
const query = process.argv[3];
if (db == null) throw new Error('A database must be specified')
if (query == null) throw new Error('A query must be specified!');

await Bun.$`bun wrangler d1 execute ${db} --file=${{ raw: import.meta.dir + '/queries/' + query + '.sql' }} ${process.argv.slice(4)}`;
