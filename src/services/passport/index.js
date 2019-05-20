import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../../models';
import { encrypt } from '../crypto/index';
import { ROLE } from '../../constants/codes';

const { User } = db;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, cb) => {
      try {
        const encryptedPassword = await encrypt(password);
        const user = await User.findOne({
          where: { email, password: encryptedPassword }
        });
        if (!user)
          cb(null, false, {
            message: '잘못된 이메일주소 혹은 비밀번호입니다.'
          });
        else cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromHeader('authorization')
    },
    async ({ id }, cb) => {
      try {
        const user = await User.findByPk(id);
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

export const token = ({ isRequired, roles = [ROLE.USER, ROLE.ADMIN] } = {}) => (
  req,
  res,
  next
) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (
      err ||
      (isRequired && !user) ||
      (isRequired && roles.indexOf(user.role) < 0)
    ) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }
    req.logIn(user, { session: false }, err => {
      if (err) return res.status(401).json({ message: '권한이 없습니다.' });
      next();
    });
  })(req, res, next);
};

export default passport;
