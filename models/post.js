const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user');
const Comment = require('./comment');

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);