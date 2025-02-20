import pbkdf2 from 'fast-crypt/web/hasher/pbkdf2';

// Bypass cloudflare
export const [pwdHash, pwdVerify] = pbkdf2();
