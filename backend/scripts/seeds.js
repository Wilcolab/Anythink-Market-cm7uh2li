const mongoose = require('mongoose');

// Set the database connection parameters
// const dbUrl = 'mongodb:172.18.0.2:27017';
// const dbName = 'anythink-market';

// Create a Mongoose connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
  };

  // Seed the database with users
  for (let i = 1; i <= 100; i++) {
    const randomNumber = getRandomInt(1000000); // Adjust the range as needed
    const username = `user${randomNumber}`;
    const email = `${username}@example.com`;
    const bio = `Bio for user ${randomNumber}`;
    const image = `Image for user ${randomNumber}`;
    const role = 'user';

    await User.create({ username, email, bio, image, role, hash: 'hashed_password', salt: 'salt' });
  }

  // Seed the database with items
  for (let i = 1; i <= 100; i++) {
    const randomNumber = getRandomInt(1000000); // Adjust the range as needed
    const title = `Item ${randomNumber}`;
    const description = `This is item ${randomNumber}`;
    const image = `Image for item ${randomNumber}`;
    const seller = await User.findOne().skip(getRandomInt(await User.countDocuments()) - 1); // get random seller
    const slug = `item-${Math.random().toString(36).substr(2, 9)}`; // generate a random slug

    await Item.create({ title, description, image, seller: seller._id, slug, tagList: [] });
  }

  // Seed the database with comments
  for (let i = 1; i <= 100; i++) {
    const randomNumber = getRandomInt(1000000); // Adjust the range as needed
    const body = `This is comment ${randomNumber}`;
    const seller = await User.findOne().skip(getRandomInt(await User.countDocuments()) - 1); // get random seller
    const item = await Item.findOne().skip(getRandomInt(await Item.countDocuments()) - 1); // get random item

    await Comment.create({ body, seller: seller._id, item: item._id });
  }

  console.log(`Data seeded successfully`);

  // Close the connection
  mongoose.disconnect();
});
