const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date,
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  comments: { type: [String], default: [] }
});

module.exports = mongoose.model('Meme', memeSchema);
