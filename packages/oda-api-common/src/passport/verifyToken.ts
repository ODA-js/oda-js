// Init passport
import * as config from 'config';

import * as jwt from 'jsonwebtoken';

export const verifyToken = async (getUserById: (id: string) => Promise<{ enabled: boolean }>, token) => {
  return new Promise((res, rej) => {
    jwt.verify(token, config.get<string>('passport.secret'), async (jwtError, decoded) => {
      if (!jwtError) {
        let user = await getUserById(decoded.data as string);
        if (!user || (user && !user.enabled)) {
          return res(false);
        }
        return res(user);
      } else {
        return res(false);
      }
    });
  });
};
