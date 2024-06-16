const MongoClient = require('mongodb').MongoClient;

// Set the database connection parameters
const dbUrl = 'mongodb://172.18.0.2:27017';
const dbName = 'anythink-market';

// Create a MongoDB client
MongoClient.connect(dbUrl, async function(err, client) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Connected to MongoDB`);

  const db = client.db(dbName);

  // Create the database if it doesn't exist
  await db.createCollection('users');
  await db.createCollection('products');
  await db.createCollection('comments');

  console.log(`Collections created: users, products, comments`);

//   Seed the database with users
  for (let i = 1; i <= 100; i++) {
    const username = `user${i}`;
    const email = `${username}@example.com`;
    const password = 'password';

    await db.collection('users').insertOne({ username, email, password });
  }

//   Seed the database with products
  for (let i = 1; i <= 100; i++) {
    const name = `product${i}`;
    const description = `This is product ${i}`;
    const price = i;

    await db.collection('products').insertOne({ name, description, price });
  }

    // Seed the database with products
    for (let i = 1; i <= 100; i++) {
        const name = `items${i}`;
        const description = `This is items ${i}`;
        const price = i;

        await db.collection('items').insertOne({ name, description, price });
        }
    

  // Seed the database with comments
  for (let i = 1; i <= 100; i++) {
    const userId = Math.floor(Math.random() * 100) + 1;
    const productId = Math.floor(Math.random() * 100) + 1;
    const comment = `This is comment ${i} for product ${productId}`;

    await db.collection('comments').insertOne({ userId, productId, comment });
  }

  console.log(`Data seeded successfully`);

  // Close the client
  client.close();
});