import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPlaying(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying && !gameOver) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setIsPlaying(true);
      }
    }

    const { x, y } = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score));
    return () => clearInterval(gameInterval);
  }, [isPlaying, gameOver, food, generateFood, score]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  return (
    <div className="flex flex-col items-center">
      {/* HUD Info */}
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-1 text-sm md:text-base rgb-split">
        <div className="text-[var(--color-cyan)] uppercase">
          SCORE: <span className="font-pixel text-[var(--color-magenta)]">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-[var(--color-cyan)] uppercase">
          HI: <span className="font-pixel opacity-70">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative grid bg-black/80 glitch-border p-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'clamp(280px, 90vw, 400px)',
          height: 'clamp(280px, 90vw, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border border-black/30 ${
                isHead ? 'bg-[var(--color-magenta)] shadow-[0_0_10px_var(--color-magenta)] z-10' 
                : isSnake ? 'bg-[var(--color-cyan)] shadow-[0_0_5px_var(--color-cyan)] opacity-80' 
                : isFood ? 'bg-[#00FF00] animate-pulse shadow-[0_0_10px_#00FF00] rounded-sm'
                : 'bg-transparent'
              }`}
            />
          );
        })}

        {/* Overlay for start/game over */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 backdrop-blur-sm p-4 text-center">
            {gameOver ? (
              <>
                <h2 className="text-3xl text-[var(--color-magenta)] mb-2 glitch-text font-pixel" data-text="SYSTEM_FAILURE">
                  SYSTEM_FAILURE
                </h2>
                <p className="text-[var(--color-cyan)] mb-6 uppercase text-sm">Entity corrupted. Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] uppercase hover:bg-[var(--color-cyan)] hover:text-black transition-colors font-bold text-sm tracking-widest cursor-pointer"
                >
                  REBOOT_SEQUENCE
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl text-[var(--color-cyan)] mb-4 glitch-text font-pixel rgb-split" data-text="NEURO_SNAKE">
                  NEURO_SNAKE
                </h2>
                <p className="text-[var(--color-magenta)] opacity-80 text-xs uppercase text-center max-w-[80%] leading-relaxed">
                  INITIALIZE SUBROUTINE.<br/>USE W A S D OR ARROWS.<br/>CONSUME DATA PACKETS.
                </p>
                <button 
                  onClick={resetGame}
                  className="mt-6 px-6 py-2 border-2 border-[var(--color-magenta)] text-[var(--color-magenta)] uppercase hover:bg-[var(--color-magenta)] hover:text-black transition-colors font-bold text-sm tracking-widest cursor-pointer"
                >
                  EXECUTE
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
