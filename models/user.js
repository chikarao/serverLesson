const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// schema is what we use to tell mongoose what fields it has

//Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  // enforce uniqueness; but case sensitive, so use lowercase
  password: String
});

// On save hook, encrypt password
// Before saving model, run this function
userSchema.pre('save', function (next) {
  const user = this;
  // getting access to user model; now is instance of user model
  // has email, password

  // generate a salt, pass callback after salt created
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    //hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function (err, hash){
      if (err) { return next(err); }
      //overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

//methods obj says when create user object have access to any function we create
// candidatePassword is pw that user submits
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    //this.password is the hashed and salted password
      if (err) { return callback(err); }
      callback(null, isMatch);
  });
};

// create model class
const ModelClass = mongoose.model('user', userSchema);
// loads new schema to mongoose; get back madel
// export the model
module.exports = ModelClass;
// no support for ES6 in Node so can't use export default
