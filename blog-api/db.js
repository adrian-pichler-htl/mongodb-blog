const { MongoClient } = require('mongodb');

// Connection URI
const uri = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017';
const client = new MongoClient(uri);

// Database Name
const dbName = 'blogDB';

let db;

async function connectToDatabase() {
  if (db) return db;
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

async function closeConnection() {
  await client.close();
  console.log('MongoDB connection closed.');
}

module.exports = { connectToDatabase, closeConnection, client };
