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

let longPrompt = mongoose.model('longPrompt', longPromptSchema);
let shortPrompt = mongoose.model('longPrompt', shortPromptSchema);

module.exports.longPrompt = longPrompt;
module.exports.shortPrompt = shortPrompt;