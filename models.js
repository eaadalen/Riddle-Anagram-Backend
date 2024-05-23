const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  highScore: {type: Number, required: true}
});

let wordSchema = mongoose.Schema({
  Spelling: {type: String, required: true},
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let User = mongoose.model('User', userSchema);
let Word = mongoose.model('Word', wordSchema);

module.exports.User = User;
module.exports.Word = Word;