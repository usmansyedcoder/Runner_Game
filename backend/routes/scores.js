const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Get top 10 scores
router.get('/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save new score
router.post('/save', async (req, res) => {
  try {
    const { playerName, score } = req.body;
    
    if (!playerName || score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newScore = new Score({ playerName, score });
    await newScore.save();
    
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player's best score
router.get('/player/:name', async (req, res) => {
  try {
    const bestScore = await Score.findOne({ playerName: req.params.name })
      .sort({ score: -1 });
    res.json(bestScore || { score: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;