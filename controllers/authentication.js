const User = require('../models/user');
const jwt = require('jwt-simple');

const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  // first arg is info we want to encode, second is secret to encrpt
  // encode user id since that does not change like email
  // sub is subject meaning who is this token for; jwt is convention;
  //iat is "issued at time"
}

exports.signin = function(req, res, next) {
  // User has already had their email and password authd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function (req, res, next) {
  // res.send({ success: 'true' });
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide an email and password' });
  }
  // see if user with the given email exists
User.findOne({ email: email }, function (err, existingUser) {
  // pass record to find; when search complete get call back
  //error if there is an existing User, null if fresh account
  if (err) { return next(err); }
  // if a user with email does exist, return an error
  if (existingUser) {
    return res.status(422).send({ error: 'A user with that email already exists' });
  }
  // if a user with email does not exist, create and save user record
  const user = new User({
    email: email,
    password: password
});

  user.save(function (err) {
    if (err) { return next(err); }
    // respond to request indicating the user was created
    res.json({ token: tokenForUser(user), iat: jwt.iat });
  });
});
};
