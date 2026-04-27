import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Game = ({ playerName, onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const animationRef = useRef();
  const obstaclesRef = useRef([]);
  const frameRef = useRef(0);
const apiUrl = 'http://localhost:5000';
  // Game constants
  const GRAVITY = 0.8;
  const JUMP_POWER = -12;
  const GROUND_Y = 350;
  
  // Player object
  const playerRef = useRef({
    x: 100,
    y: GROUND_Y,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false
  });

  const saveScore = useCallback(async () => {
    if (!playerName || score === 0) return;
    
    try {
      await axios.post(`${apiUrl}/api/scores/save`, {
        playerName,
        score
      });
      onScoreUpdate();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }, [playerName, score, apiUrl, onScoreUpdate]);

  useEffect(() => {
    if (gameOver) {
      saveScore();
    }
  }, [gameOver, saveScore]);

  const drawPlayer = (ctx, player) => {
    // Draw runner
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 25, player.y + 10, 8, 8);
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 27, player.y + 12, 4, 4);
    
    // Draw cap
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x + 5, player.y - 5, 30, 8);
  };

  const drawObstacle = (ctx, obstacle) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    // Add some detail
    ctx.fillStyle = '#654321';
    ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, 5);
  };

  const drawGround = (ctx) => {
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, GROUND_Y + 40, ctx.canvas.width, 10);
    
    // Draw grass
    ctx.fillStyle = '#228B22';
    for(let i = 0; i < ctx.canvas.width; i += 20) {
      ctx.fillRect(i, GROUND_Y + 38, 5, 8);
    }
  };

  const drawScore = (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px "Courier New"';
    ctx.shadowBlur = 0;
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 50);
  };

  const updateGame = () => {
    if (!gameRunning) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const player = playerRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update player physics
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    
    // Ground collision
    if (player.y >= GROUND_Y) {
      player.y = GROUND_Y;
      player.velocityY = 0;
      player.isJumping = false;
    }
    
    // Ceiling collision
    if (player.y < 0) {
      player.y = 0;
      player.velocityY = 0;
    }
    
    // Generate obstacles
    if (frameRef.current % 90 === 0 && gameRunning) {
      obstaclesRef.current.push({
        x: canvas.width,
        y: GROUND_Y + 5,
        width: 30,
        height: 35
      });
    }
    
    // Update obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.x -= 5;
      
      // Collision detection
      if (player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y) {
        setGameRunning(false);
        setGameOver(true);
        return false;
      }
      
      // Score increment
      if (obstacle.x + obstacle.width < player.x && !obstacle.counted) {
        obstacle.counted = true;
        setScore(prev => prev + 10);
      }
      
      return obstacle.x + obstacle.width > 0;
    });
    
    // Draw everything
    drawGround(ctx);
    drawPlayer(ctx, player);
    obstaclesRef.current.forEach(obstacle => drawObstacle(ctx, obstacle));
    drawScore(ctx);
    
    // Draw clouds
    drawClouds(ctx);
    
    frameRef.current++;
    animationRef.current = requestAnimationFrame(updateGame);
  };

  const drawClouds = (ctx) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const time = Date.now() / 1000;
    for(let i = 0; i < 3; i++) {
      const x = (time * 20 + i * 300) % (ctx.canvas.width + 200) - 100;
      ctx.beginPath();
      ctx.arc(x, 50 + i * 80, 25, 0, Math.PI * 2);
      ctx.arc(x + 20, 40 + i * 80, 20, 0, Math.PI * 2);
      ctx.arc(x - 20, 40 + i * 80, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
    setScore(0);
    frameRef.current = 0;
    obstaclesRef.current = [];
    playerRef.current = {
      x: 100,
      y: GROUND_Y,
      width: 40,
      height: 40,
      velocityY: 0,
      isJumping: false
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(updateGame);
  };

  const jump = useCallback(() => {
    if (gameRunning && !playerRef.current.isJumping) {
      playerRef.current.velocityY = JUMP_POWER;
      playerRef.current.isJumping = true;
    }
  }, [gameRunning]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('click', jump);
    return () => canvas.removeEventListener('click', jump);
  }, [jump]);

  useEffect(() => {
    if (gameRunning) {
      animationRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameRunning]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        style={{ width: '100%', height: 'auto', maxWidth: '800px' }}
      />
      <div className="game-controls">
        {!gameRunning && !gameOver && (
          <button onClick={startGame}>Start Game</button>
        )}
        {gameOver && (
          <div className="game-over">
            <h3>Game Over! Final Score: {Math.floor(score)}</h3>
            <button onClick={startGame}>Play Again</button>
          </div>
        )}
        {gameRunning && (
          <div className="instructions">
            <p>🎮 Press SPACE or Click to Jump!</p>
            <p>🏃 Avoid the obstacles to get a high score!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;