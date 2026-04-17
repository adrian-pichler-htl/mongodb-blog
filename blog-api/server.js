const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db');
const { ObjectId, Long } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let db;
connectToDatabase().then(database => {
  db = database;
  console.log('API successfully attached to Database');
}).catch(console.error);

// GET /api/entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await db.collection('entries').find().sort({ creationDate: -1 }).toArray();
    const formatted = entries.map(e => ({ ...e, id: e._id.toString() }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/entries/:id
app.get('/api/entries/:id', async (req, res) => {
  try {
    const entry = await db.collection('entries').findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ error: 'Not found' });

    await db.collection('entries').updateOne(
      { _id: entry._id },
      { $inc: { impressionCount: 1 } }
    );
    entry.impressionCount += 1;

    res.json({ ...entry, id: entry._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/entries (Upsert or Insert)
app.post('/api/entries', async (req, res) => {
  try {
    const entry = req.body;

    // 1. Ensure basics are present
    if (!entry.title) entry.title = "Untitled Post";
    if (!entry.description) entry.description = "No description provided.";
    
    // 2. Normalize Author structure (Schema requires an object with username)
    if (typeof entry.author === 'string') {
      entry.author = { username: entry.author, name: entry.author };
    } else if (!entry.author || !entry.author.username) {
      entry.author = { username: "admin", name: "Admin User" };
    }

    // 3. Set server-side managed fields (Schema requirements)
    entry.creationDate = new Date();
    entry.editDates = [];
    entry.impressionCount = Long.fromInt(0); // Must be BSON Long for validator

    if (entry.commentsAllowed === undefined) entry.commentsAllowed = true;
    if (!entry.category) entry.category = "General";
    if (!entry.comments) entry.comments = [];

    // 4. Tighten content structure
    if (typeof entry.content === 'string' || !entry.content) {
      entry.content = {
        text: entry.content || "",
        links: [],
        images: []
      };
    } else {
      if (!entry.content.text) entry.content.text = "";
      if (!entry.content.links) entry.content.links = [];
      if (!entry.content.images) entry.content.images = [];
    }

    const doc = await db.collection('entries').insertOne(entry);
    res.status(201).json({ id: doc.insertedId });
  } catch (err) {
    console.error("!!! DATABASE VALIDATION ERROR !!!");
    console.error(err.message);
    res.status(500).json({ error: "Document failed validation", detailedError: err.message });
  }
});

// POST /api/entries/:id/comments
app.post('/api/entries/:id/comments', async (req, res) => {
  try {
    const comment = req.body;
    comment.date = new Date();

    await db.collection('entries').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { comments: comment } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Blog API listening at http://localhost:${port}`);
});
