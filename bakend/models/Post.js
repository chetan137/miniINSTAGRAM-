

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, required: true },
  likes: { type: [String], default: [] },
  comments: { type: [String], default: [] },
});

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };
