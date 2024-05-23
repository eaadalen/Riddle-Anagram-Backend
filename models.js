const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let longPromptSchema = mongoose.Schema({
  longPrompt: {type: String, required: true},
  Answer: {type: String, required: true}
});

let shortPromptSchema = mongoose.Schema({
  shortPrompt: {type: String, required: true},
  Answer: {type: String, required: true}
});

let longPrompt = mongoose.model('User', longPromptSchema);
let shortPrompt = mongoose.model('Word', shortPromptSchema);

module.exports.longPrompt = longPrompt;
module.exports.shortPrompt = shortPrompt;