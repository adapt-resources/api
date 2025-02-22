export default <T>(p: Promise<T>): Promise<T | void> => p.catch(() => { });
