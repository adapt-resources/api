export { };
await Bun.$`bun output-size`;

const DIR = import.meta.dir + '/../../.out/';
await Bun.$`bun js-beautify ${
	DIR + 'index.min.js'
} > ${Bun.file(DIR + 'index.beautified.js')}`;
