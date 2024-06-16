const mongoose = require('mongoose');

// Set the database connection parameters
const dbUrl = 'mongodb://mongodb-node:27017/anythink-market';
const dbName = 'anythink-market';

// Create a Mongoose connection
mongoose.connect(dbUrl + '/' + dbName, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log(`Connected to MongoDB`);

  // Define the models
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    bio: String,
    image: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hash: String,
    salt: String
  }, { timestamps: true });

  const itemSchema = new mongoose.Schema({
    slug: { type: String, lowercase: true, unique: true },
    title: {type: String, required: [true, "can't be blank"]},
    description: {type: String, required: [true, "can't be blank"]},
    image: String,
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    tagList: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }, { timestamps: true });

  const commentSchema = new mongoose.Schema({
    body: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }
  }, { timestamps: true });

  const User = mongoose.model('User', userSchema);
  const Item = mongoose.model('Item', itemSchema);
  const Comment = mongoose.model('Comment', commentSchema);

  // Clear existing data
  await User.deleteMany({});
  await Item.deleteMany({});
  await Comment.deleteMany({});

  console.log(`Existing data cleared`);

  // Seed the database with users
  for (let i = 1; i <= 100; i++) {
    const username = `user${i}`;
    const email = `${username}@example.com`;
    const bio = `Bio for user ${i}`;
    const image = `Image for user ${i}`;
    const role = 'user';

    await User.create({ username, email, bio, image, role, hash: 'hashed_password', salt: 'alt' });
  }

  // Seed the database with items
  for (let i = 1; i <= 100; i++) {
    const title = `Item ${i}`;
    const description = `This is item ${i}`;
    const image = `Image for item ${i}`;
    const seller = await User.findOne({ username: `user${Math.floor(Math.random() * 100) + 1}` });

    await Item.create({title, description, image, seller: seller._id, tagList: [] });
  }

  // Seed the database with comments
  for (let i = 1; i <= 100; i++) {
    const body = `This is comment ${i}`;
    const seller = await User.findOne({ username: `user${Math.floor(Math.random() * 100) + 1}` });
    const item = await Item.findOne({ title: `Item ${Math.floor(Math.random() * 100) + 1}` });

    await Comment.create({ body, seller: seller._id, item: item._id });
  }

  console.log(`Data seeded successfully`);

  // Close the connection
  mongoose.disconnect();
});