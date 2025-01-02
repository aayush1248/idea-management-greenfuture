const mongoose = require('mongoose');

const ideaConfirmSchema = new mongoose.Schema({
  idea: { type: String, required: true },
  email: { type: String, required: true }, // Match 'email' field from frontend
  vote: { type: Number, default: 0 }, // Optional field with default value
});


const IdeaConfirm = mongoose.model('IdeaConfirm', ideaConfirmSchema);
module.exports = IdeaConfirm;
