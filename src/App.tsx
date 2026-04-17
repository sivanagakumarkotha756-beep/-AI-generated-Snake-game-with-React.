import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <main className="w-full h-screen relative scanlines crt-flicker flex flex-col items-center justify-center p-4">
      {/* Background purely aesthetic text */}
      <div className="absolute top-4 left-4 text-xs opacity-30 uppercase hidden md:block select-none pointer-events-none">
        sys.kernel.version: 9.4.2<br/>
        address_space: 0x000FF10A<br/>
        STATUS: OK
      </div>

      <div className="mb-6 lg:mb-10 text-center">
        <h1 className="text-xl md:text-3xl font-pixel glitch-text tracking-widest uppercase mb-1" data-text="NEURO_SNAKE_OS">
          NEURO_SNAKE_OS
        </h1>
        <p className="text-[10px] tracking-[0.3em] opacity-60">ENTERTAINMENT_SUBROUTINE v1.0</p>
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-16 z-10">
        <SnakeGame />
        <MusicPlayer />
      </div>

      <div className="absolute bottom-2 right-4 text-[10px] opacity-40 uppercase select-none pointer-events-none">
        // OVERRIDE: AUTHORIZED //
      </div>
    </main>
  );
}
