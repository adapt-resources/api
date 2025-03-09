export let env: Env;
const registers: ((env: Env) => any)[] = [];

export const loadEnv = (e: Env) => {
	env = e;
	for (const fn of registers) fn(e);
}

export const lazyLoad = (fn: (env: Env) => any) => {
	registers.push(fn);
}
