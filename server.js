// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const Meme = require('./models/Meme');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/memehub', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes

// Upload meme
app.post('/api/memes', auth, upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) return res.status(400).send("Image is required");
    if (!title) return res.status(400).send("Title is required");

    const newMeme = new Meme({
      title,
      imageUrl: '/uploads/' + req.file.filename,
      userId: req.user.userId,
      createdAt: new Date()
    });

    await newMeme.save();
    res.status(201).send("Meme uploaded");

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to upload meme");
  }
});

// Get all memes
app.get('/api/memes', async (req, res) => {
  const memes = await Meme.find().sort({ createdAt: -1 });
  res.json(memes);
});

// Fetch One Meme by ID
app.get('/api/memes/:id', auth, async (req, res) => {
  try {
    const meme = await Meme.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!meme) return res.status(404).json({ error: 'Meme not found' });
    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meme' });
  }
});

// Delete meme
app.delete('/api/memes/:id', auth, async (req, res) => {
  try {
    const meme = await Meme.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!meme) return res.status(404).send("Meme not found or unauthorized");

    await Meme.deleteOne({ _id: meme._id });
    res.send("Meme deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.put('/api/memes/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const meme = await Meme.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!meme) return res.status(404).json({ error: 'Meme not found' });

    meme.title = req.body.title;
    meme.tags = req.body.tags?.split(',').map(tag => tag.trim());

    if (req.file) {
      // Delete old image
      const oldPath = path.join(__dirname, meme.imageUrl);
      fs.unlink(oldPath, () => {});
      meme.imageUrl = '/uploads/' + req.file.filename;
    }

    await meme.save();
    res.json({ message: 'Meme updated successfully', meme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update meme' });
  }
});


// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.status(400).json({ error: 'Email already registered' });

  const existingUsername = await User.findOne({ username });
  if (existingUsername) return res.status(400).json({ error: 'Username already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, 'secret123');
  res.json({ token });
});

app.get('/api/auth/user/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ username: user.username });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
