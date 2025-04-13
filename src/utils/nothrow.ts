// @ts-ignore
export default <T>(p: Promise<T>): Promise<T | undefined> => p.catch(() => { });
