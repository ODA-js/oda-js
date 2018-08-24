import * as crypto from 'crypto';
import * as config from 'config';

export const hashPassword = password => {
  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto
    .pbkdf2Sync(
      password,
      salt + config.get('passport.salt2'),
      10000,
      512,
      'sha512',
    )
    .toString('base64');
  return { salt, hash };
};

export const verifyPasswordWithSalt = (password, salt, hash) => {
  return (
    hash ===
    crypto
      .pbkdf2Sync(
        password,
        salt + config.get('passport.salt2'),
        10000,
        512,
        'sha512',
      )
      .toString('base64')
  );
};
