// export function from here and import into index.js
// pass app to functio
// will have access to app here
const passport = require('passport');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
// module.exports = function (app) {
//   app.get('/', (req, res, next) => {
//       // req is request; incoming http requrest
//       // res is response we create and respond
//       //next is most for error handling
//       res.send(['lamp', 'phone', 'drone']);
//   });
//   // expecting get request to come in
// };
//interceptor or middleware between incoming request and route handler
// use jwt strategy, and don't create session for them,
// passport want to create a cookie based session and we don't want so false

const requireAuth = passport.authenticate('jwt', { sesssion: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  app.get('/', requireAuth, function (req, res) {
    // when user requests root route first take them through requiredAuth
    // if they get through, run function to handle request
    res.send({ hi: 'You are authenticated' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
