import pbkdf2 from 'fast-crypt/web/hasher/pbkdf2';
import type { Hasher } from 'fast-crypt/web/hasher/types';

export let pwdHash: Hasher[0], pwdVerify: Hasher[1];
// Bypass cloudflare
export const initPassHasher = () => [pwdHash, pwdVerify] = pbkdf2();
