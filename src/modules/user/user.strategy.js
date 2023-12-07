const path = require('path');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const User = require(path.join(process.cwd(), 'src/modules/user/models/user.model'));
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

module.exports = () => {
  const cookieExtractor = req => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split('Bearer ')[1];
    }
    return token;
  };

  passport.use(
    'user-jwt',
    new Strategy(
      { secretOrKey: nodeCache.getValue('JWT_SECRET'), jwtFromRequest: cookieExtractor },
      async (payload, done) => {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      }
    )
  );
};
