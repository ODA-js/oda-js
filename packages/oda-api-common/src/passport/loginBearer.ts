// Init passport
import config from 'config';
import { verifyPasswordWithSalt } from './utils';

import jwt from 'jsonwebtoken';

export const loginBearer = async (
  payload,
  password,
  salt,
  hash,
): Promise<string> => {
  if (!verifyPasswordWithSalt(password, salt, hash)) {
    return Promise.reject(new Error('failed'));
  }

  return jwt.sign(
    {
      data: payload,
    },
    config.get<string>('passport.secret'),
    { expiresIn: config.get<string>('passport.expiresIn') },
  );
};
