import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

/*GAME CONSTANTS*/
const COLS = 10; // Width of the game grid
const ROWS = 20; // Height of the game grid

// Each array represents a Tetris piece. The first empty array is a placeholder.
// Numbers represent filled cells (1) and empty cells (0)
const SHAPES = [
  [],
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
];

const SPEED_LEVELS = [
  { threshold: 0, speed: 1000 },     // Initial speed: 1 piece per second
  { threshold: 1000, speed: 850 },   // Level 2: ~0.85s per piece
  { threshold: 2000, speed: 700 },   // Level 3: ~0.7s per piece
  { threshold: 4000, speed: 550 },   // Level 4: ~0.55s per piece
  { threshold: 6000, speed: 400 },   // Level 5: ~0.4s per piece
  { threshold: 8000, speed: 300 },   // Level 6: ~0.3s per piece
  { threshold: 10000, speed: 200 },  // Level 7: ~0.2s per piece
  { threshold: 15000, speed: 150 },  // Level 8: ~0.15s per piece
  { threshold: 20000, speed: 100 },  // Final level: ~0.1s per piece
];

// Scoring system for different actions and line clears
const POINTS = {
  SINGLE: 100,   //  1 line
  DOUBLE: 300,   //  2 lines
  TRIPLE: 500,   //  3 lines
  TETRIS: 800,   //  4 lines
  SOFT_DROP: 1,  // Points per cell for soft drop (down arrow)
  HARD_DROP: 2,  // Points per cell for hard drop (space bar)
};

/*UTILITY FUNCTIONS*/

// Creates an empty game grid
const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Generates a random piece and positions it at the top center of the grid
const randomShape = () => {
  const shapeIndex = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  return { shape: SHAPES[shapeIndex], x: COLS / 2 - 1, y: 0 };
};

/**
 * Checks if a piece can be placed at the specified position
 * @param {Array} shape - The piece's shape matrix
 * @param {number} x - Target X position
 * @param {number} y - Target Y position
 * @param {Array} grid - Current game grid
 * @returns {boolean} - Whether the move is valid
 */
const isValidMove = (shape, x, y, grid) => {
  return shape.every((row, dy) =>
    row.every((cell, dx) => {
      const newX = x + dx;
      const newY = y + dy;
      return (
        cell === 0 || // Empty cells can overlap anything
        (newX >= 0 && newX < COLS && // Within horizontal bounds
         newY < ROWS && newY >= 0 && // Within vertical bounds
         (!grid[newY] || grid[newY][newX] === 0)) // Target cell is empty
      );
    })
  );
};

/**
 * Combines a piece with the grid at specified coordinates
 * @param {Array} grid - Current game grid
 * @param {Array} shape - Piece shape to merge
 * @param {number} x - Piece X position
 * @param {number} y - Piece Y position
 * @returns {Array} - New grid with piece merged
 */
const mergePiece = (grid, shape, x, y) => {
  const newGrid = grid.map(row => [...row]);
  shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell) newGrid[y + dy][x + dx] = cell;
    });
  });
  return newGrid;
};

/**
 * Rotates a piece clockwise or counterclockwise
 * @param {Array} shape - Shape matrix to rotate
 * @param {boolean} clockwise - Direction of rotation
 * @returns {Array} - Rotated shape matrix
 */
const rotateShape = (shape, clockwise = true) => {
  if (clockwise) {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  }
  return shape[0].map((_, i) => shape.map(row => row[row.length - 1 - i]));
};

/*REACT COMPONENTS*/

// Individual cell
const Cell = ({ filled, ghost }) => (
  <div className={`tetris-cell ${filled ? "filled" : ""} ${ghost ? "ghost" : ""}`} />
);

// Display area for the held piece
const HeldPiece = ({ piece }) => (
  <div className="hold-container">
    <h3>Hold</h3>
    <div className="held-piece">
      {piece?.shape.map((row, rowIndex) => (
        <div key={rowIndex} className="tetris-row">
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} filled={cell} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Score display panel showing current and high scores
const ScorePanel = ({ score, highScores }) => {
  const currentLevel = SPEED_LEVELS.findIndex(level => score < level.threshold) - 1;
  const level = currentLevel === -2 ? SPEED_LEVELS.length - 1 : Math.max(0, currentLevel);
  const nextThreshold = SPEED_LEVELS[level + 1]?.threshold || "MAX";
  
  return (
    <div className="score-container">
      <h3>Current Score: {score}</h3>
      <h3>Level: {level + 1}</h3>
      <h4>Next Level: {nextThreshold === "MAX" ? "MAX" : nextThreshold - score} points</h4>
      <h3>High Scores</h3>
      <div className="high-scores">
        {highScores.map((entry, index) => (
          <div key={index} className="high-score-entry">
            {index + 1}. {entry.score} - {entry.date}
          </div>
        ))}
      </div>
    </div>
  );
};

// Game over overlay displayed when the game ends
const GameOverlay = ({ score }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Final Score: {score}</p>
  </div>
);

/*MAIN GAME COMPONENT*/
const Project1 = () => {
  // Existing state
  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentPiece, setCurrentPiece] = useState(randomShape());
  const [ghostPiece, setGhostPiece] = useState({ ...currentPiece });
  const [heldPiece, setHeldPiece] = useState(null);
  const [hasSwapped, setHasSwapped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('tetrisHighScores');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  // Get current game speed based on score
  const getCurrentSpeed = useCallback((currentScore) => {
    const level = SPEED_LEVELS.findIndex(level => currentScore < level.threshold) - 1;
    if (level === -2) return SPEED_LEVELS[SPEED_LEVELS.length - 1].speed;
    return SPEED_LEVELS[Math.max(0, level)].speed;
  }, []);

  /**
   * Updates the ghost piece position to show where the current piece will land
   * Called whenever the current piece moves
   */
  const updateGhostPiece = useCallback((piece, grid) => {
    let ghostY = piece.y;
    while (isValidMove(piece.shape, piece.x, ghostY + 1, grid)) {
      ghostY++;
    }
    setGhostPiece({ ...piece, y: ghostY });
  }, []);

  /**
   * Checks for and clears completed rows, updates score accordingly
   * Returns the new grid state after clearing rows
   */

  const clearFullRows = useCallback((grid) => {
    let clearedRows = 0;
    const newGrid = grid.reduce((acc, row) => {
      if (row.every(cell => cell !== 0)) {
        clearedRows++;
        acc.unshift(Array(COLS).fill(0));
      } else {
        acc.push(row);
      }
      return acc;
    }, []);

    const points = [0, POINTS.SINGLE, POINTS.DOUBLE, POINTS.TRIPLE, POINTS.TETRIS][clearedRows] || 0;
    if (points > 0) {
      setScore(prev => prev + points);
    }

    return newGrid;
  }, []);

  /**
   * Updates high scores when game ends
   * Stores top 5 scores in localStorage
   */
  const updateHighScores = useCallback((newScore) => {
    const newHighScores = [...highScores, { score: newScore, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setHighScores(newHighScores);
    localStorage.setItem('tetrisHighScores', JSON.stringify(newHighScores));
  }, [highScores]);

  /*Handles piece movement, rotation, and collision*/
  const movePiece = useCallback((dx, dy, rotation = null) => {
    if (gameOver) return;
    
    let newShape = rotation ? rotation(currentPiece.shape) : currentPiece.shape;
    let newX = currentPiece.x + dx;
    let newY = currentPiece.y + dy;

    if (isValidMove(newShape, newX, newY, grid)) {
      const newPiece = { shape: newShape, x: newX, y: newY };
      setCurrentPiece(newPiece);
      updateGhostPiece(newPiece, grid);
      if (dy > 0) {
        setScore(prev => prev + POINTS.SOFT_DROP);
      }
    } else if (dy > 0) {
      if (currentPiece.y === 0) {
        setGameOver(true);
        updateHighScores(score);
      } else {
        const newGrid = mergePiece(grid, currentPiece.shape, currentPiece.x, currentPiece.y);
        const clearedGrid = clearFullRows(newGrid);
        setGrid(clearedGrid);
        const newPiece = randomShape();
        setCurrentPiece(newPiece);
        updateGhostPiece(newPiece, clearedGrid);
        setHasSwapped(false);
      }
    }
  }, [currentPiece, gameOver, grid, score, updateHighScores, clearFullRows, updateGhostPiece]);

  /**
   * Instantly drops the current piece to the ghost piece position
   * Awards points based on drop distance
   */
  const dropPiece = useCallback(() => {
    if (gameOver) return;
    let dropDistance = ghostPiece.y - currentPiece.y;
    if (dropDistance > 0) {
      setScore(prev => prev + (POINTS.HARD_DROP * dropDistance));
    }
    const newGrid = mergePiece(grid, currentPiece.shape, ghostPiece.x, ghostPiece.y);
    const clearedGrid = clearFullRows(newGrid);
    setGrid(clearedGrid);
    const newPiece = randomShape();
    setCurrentPiece(newPiece);
    updateGhostPiece(newPiece, clearedGrid);
    setHasSwapped(false);
  }, [gameOver, ghostPiece, currentPiece, grid, clearFullRows, updateGhostPiece]);

  /*Handles the hold/swap mechanism, used once per piece*/
  const holdPiece = useCallback(() => {
    if (!hasSwapped) {
      const pieceToHold = heldPiece || randomShape();
      const resetPiece = { shape: pieceToHold.shape, x: COLS / 2 - 1, y: 0 };
      setCurrentPiece(resetPiece);
      updateGhostPiece(resetPiece, grid);
      setHeldPiece(currentPiece);
      setHasSwapped(true);
    }
  }, [hasSwapped, heldPiece, currentPiece, grid, updateGhostPiece]);

  /*Maps keyboard input*/
  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;
    const keyActions = {
      ArrowLeft: () => movePiece(-1, 0),
      ArrowRight: () => movePiece(1, 0),
      ArrowDown: () => movePiece(0, 1),
      ArrowUp: () => movePiece(0, 0, shape => rotateShape(shape, true)),
      z: () => movePiece(0, 0, shape => rotateShape(shape, false)),
      x: () => movePiece(0, 0, shape => rotateShape(shape, true)),
      c: holdPiece,
      ' ': dropPiece,
      Spacebar: dropPiece,
    };
    if (keyActions[e.key]) {
      e.preventDefault();
      keyActions[e.key]();
    }
  }, [movePiece, holdPiece, dropPiece, gameOver]);

  // Game tick effect - moves piece down every second
  useEffect(() => {
    const speed = getCurrentSpeed(score);
    const interval = setInterval(() => movePiece(0, 1), speed);
    return () => clearInterval(interval);
  }, [movePiece, score, getCurrentSpeed]);

  // Keyboard event listener effect
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Update ghost piece whenever current piece or grid changes
  useEffect(() => {
    updateGhostPiece(currentPiece, grid);
  }, [currentPiece, grid, updateGhostPiece]);

  /**
   * Resets all game state to initial values
   */
  const resetGame = () => {
    const emptyGrid = createEmptyGrid();
    const newPiece = randomShape();
    setGrid(emptyGrid);
    setCurrentPiece(newPiece);
    updateGhostPiece(newPiece, emptyGrid);
    setHeldPiece(null);
    setHasSwapped(false);
    setGameOver(false);
    setScore(0);
  };

/**
   * Main render method
   * The UI is structured in two main sections:
   * 1. Control Panel (left side) - contains game controls and information
   * 2. Game Field (right side) - contains the actual Tetris grid
   */
return (
    <div className="tetris-container">
      {/* Left side control panel */}
      <div className="control-panel">
        {/* Navigation and game control buttons */}
        <button onClick={() => navigate('/')} className="tetris-button">Return Home</button>
        <button onClick={resetGame} className="tetris-button">Reset Game</button>
        
        {/* Hold piece display - shows the currently held piece */}
        <HeldPiece piece={heldPiece} />
        
        {/* Score panel - shows current score and high scores */}
        <ScorePanel score={score} highScores={highScores} />
      </div>

      {/* Main game field */}
      <div className="game-field">
        {gameOver ? (
          // Show game over overlay when game is finished
          <GameOverlay score={score} />
        ) : (
          // Game grid - renders each cell of the game
          <>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="tetris-row">
                {row.map((cell, colIndex) => {
                  // Check if the current piece occupies this cell
                  const isPieceFilled = currentPiece.shape.some(
                    (r, dy) => r.some(
                      (c, dx) => c && colIndex === currentPiece.x + dx && rowIndex === currentPiece.y + dy
                    )
                  );
                  
                  // Check if the ghost piece occupies this cell
                  // Only show ghost piece in cells not occupied by current piece
                  const isGhostFilled = !isPieceFilled && ghostPiece.shape.some(
                    (r, dy) => r.some(
                      (c, dx) => c && colIndex === ghostPiece.x + dx && rowIndex === ghostPiece.y + dy
                    )
                  );

                  // Render individual cell with appropriate styling
                  // - filled: either has a locked piece or is part of current piece
                  // - ghost: shows where current piece will land
                  return (
                    <Cell
                      key={colIndex}
                      filled={cell || isPieceFilled}
                      ghost={isGhostFilled}
                    />
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Project1;