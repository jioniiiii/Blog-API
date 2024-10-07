const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('./models/post');
const Comment = require('./models/comment');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI);

async function seedDB() {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  const user1 = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123', 
    role: 'admin'
  });

  const user2 = new User({
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user'
  });

  await user1.save();
  await user2.save();

  const post1 = new Post({
    title: 'First Blog Post',
    body: 'This is the body of the first blog post.',
    author: user1._id,
    published: true
  });

  const post2 = new Post({
    title: 'Second Blog Post',
    body: 'This is the body of the second blog post.',
    author: user2._id,
    published: false
  });

  await post1.save();
  await post2.save();

  const comment1 = new Comment({
    text: 'Great post!',
    author: user2._id,
    post: post1._id
  });
  await comment1.save();

  post1.comments.push(comment1._id);
  await post1.save();

  console.log('Database seeded successfully');
  mongoose.connection.close();
}

seedDB();