import React, { useState } from 'react';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import AdBanner, { DemoAd } from './components/AdBanner';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setNameSubmitted(true);
    }
  };

  const handleScoreUpdate = () => {
    setRefreshLeaderboard(prev => !prev);
  };

  if (!nameSubmitted) {
    return (
      <div className="app">
        <div className="game-container">
          <div className="player-name-input">
            <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
              Welcome to Runner Game!
            </h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                required
              />
              <button type="submit">Start Playing</button>
            </form>
          </div>
          <DemoAd />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-container">
        <h1 style={{ textAlign: 'center', color: '#ffd700', marginBottom: '20px' }}>
          🏃 Runner Game 🏃
        </h1>
        
        <div className="main-content">
          <div className="game-area">
            <Game playerName={playerName} onScoreUpdate={handleScoreUpdate} />
          </div>
          
          <div className="sidebar">
            <div className="score-board">
              <h2>Player: {playerName}</h2>
            </div>
            
            {/* Replace DemoAd with AdBanner when you have AdSense */}
            <DemoAd />
            {/* <AdBanner adSlot="1234567890" /> */}
            
            <Leaderboard refresh={refreshLeaderboard} />
          </div>
        </div>
        
        <div className="instructions" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>💡 Tip: The game saves your high scores! Press SPACE or click/tap to jump over obstacles.</p>
        </div>
      </div>
    </div>
  );
}

export default App;