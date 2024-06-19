const mongoose = require('mongoose');

let longPromptSchema = mongoose.Schema({
  longPrompt: {type: String, required: true},
  Answer: {type: String, required: true},
  Date: {type: Date, required: true}
});

let shortPromptSchema = mongoose.Schema({
  shortPrompt: {type: String, required: true},
  Answer: {type: String, required: true}
});

let longPrompt = mongoose.model('longPrompt', longPromptSchema);
let shortPrompt = mongoose.model('shortPrompt', shortPromptSchema);

module.exports.longPrompt = longPrompt;
module.exports.shortPrompt = shortPrompt;