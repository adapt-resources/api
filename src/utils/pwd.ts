import pbkdf2 from 'fast-crypt/web/hasher/pbkdf2';

export const [pwdHash, pwdVerify] = pbkdf2();
