export { };

const query = process.argv[2];
if (query == null) throw new Error('A query must be specified!');

await Bun.$`bun wrangler d1 execute adapt-resources --file=${{ raw: import.meta.dir + '/queries/' + query + '.sql' }} ${process.argv.slice(4)}`;
