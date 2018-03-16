// centralize logic to check if user is logged in
// has credentials to access protected routes
// many many strategies for log in
// using plugins for passport
// Lec 79
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');
const LocalStrategy = require('passport-local');

//CREATE LOCAL Strategy
const localOptions = { usernameField: 'email' };
// using usernameField and telling it to use email in JSON post
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  //verify email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    //compare password -- is pw == user.password
    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err); }

      if (!isMatch) { return done(null, false); }

      return done(null, user);
      // done is passport; takes user model and assigns it req.user
    });
  });
});
// Setup options for JWT strategy
// need to tell where the key is
// can be in the url, body, header
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  //when request comes in need to look at request header called authorization to find token
  secretOrKey: config.secret
  // secret to use
};

//CREATE JWT STRATEGY
// See if user ID in the payload exists in database
// if it does, call 'done' with that
// otherwise, call done without a user object
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // second argument is fucntion we call when user tries login with JWT token
  //payload is decoded JWT token with sub and iat
  // done is a passport function callback depending on whether we are able to authenticate user
  User.findById(payload.sub, function (err, user) {
   // console.log('payload.sub: ', payload.sub);
//*********************************
  passport.serializeUser(function(user, done) {
  done(null, user);
  });
// user is saved in the session and later used to retrieve
// the entire cobject via the deserializeUser function
//https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
//https://github.com/jaredhanson/passport
  passport.deserializeUser(function (user, done) {
    done(null, user);
  }); //should this be here or when user logs out?
//**********************************
    if (err) { return done(err, false); }
    // err, false is user object we didnt find
    if (user) {
      done(null, user);
      // no error, we found user
    } else {
      done(null, false);
      // no error and false we didn't find user
    }
  });
});
// module.exports = function (app) {
//   app.use(passport.initialize());
//   app.use(passport.session());
//   // Tell passport to use this particular strategy defined above
//   app.passport.use(jwtLogin);
// };
passport.use(jwtLogin);
passport.use(localLogin);
