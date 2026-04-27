import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = ({ refresh }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = 'https://runner-game-mu4v.vercel.app';  
  useEffect(() => {
    fetchScores();
  }, [refresh]);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching scores from:', `${apiUrl}/api/scores/leaderboard`);
      
      const response = await axios.get(`${apiUrl}/api/scores/leaderboard`, {
        timeout: 5000 // 5 second timeout
      });
      
      console.log('Scores received:', response.data);
      setScores(response.data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
      
      // Set a user-friendly error message
      if (error.code === 'ECONNABORTED') {
        setError('Connection timeout. Make sure the backend server is running.');
      } else if (error.response) {
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('Cannot connect to backend. Please check if server is running on port 5000');
      } else {
        setError('Failed to load leaderboard');
      }
      
      setScores([]); // Reset scores on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <h3>🏆 Top Players 🏆</h3>
        <p>Loading scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <h3>🏆 Top Players 🏆</h3>
        <p style={{ color: '#ff8888' }}>⚠️ {error}</p>
        <button 
          onClick={fetchScores}
          style={{ 
            marginTop: '10px', 
            padding: '5px 10px', 
            fontSize: '12px',
            background: '#667eea'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Top Players 🏆</h3>
      {scores.length === 0 ? (
        <p>No scores yet. Be the first to play!</p>
      ) : (
        <ol>
          {scores.map((score, index) => (
            <li key={score._id || index}>
              {score.playerName} - {score.score} points
              {index === 0 && ' 👑'}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;