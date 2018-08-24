import { urlencoded } from 'body-parser';
import { Strategy as Anonymous } from './authenticateAsAnonymous';
import { Strategy as Query } from './queryAuthToken';
import { Strategy as Bearer } from 'passport-http-bearer';
import { verifyToken } from './verifyToken';

export default (
  express,
  passport,
  getUserById: (id: string) => Promise<{ enabled: boolean }>,
) => {
  passport.use(new Anonymous());
  passport.use(
    new Query((token, done) => {
      return verifyToken(getUserById, token)
        .then(u => done(null, u, token))
        .catch(e => done(e));
    }),
  );
  passport.use(
    new Bearer((token, done) => {
      return verifyToken(getUserById, token)
        .then(u => done(null, u, token))
        .catch(e => done(e));
    }),
  );
  express.use(urlencoded({ extended: false }));
  express.use(passport.initialize());
  express.use(
    passport.authenticate(
      ['bearer', 'authenticate-query-auth-token', 'authenticate-as-anonymous'],
      { session: false },
    ),
  );
};
