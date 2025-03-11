export let env: Env;
const registers: [(env: Env) => any, label: string | undefined][] = [];

export const loadEnv = (e: Env) => {
	env = e;
	for (const fn of registers) {
		if (fn[1] != null) console.log(fn[1]);
		fn[0](e);
	}
}

export const lazyLoad = (fn: (env: Env) => any, label?: string) => {
	registers.push([fn, label]);
}
