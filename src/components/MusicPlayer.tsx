import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Disc } from "lucide-react";

interface Track {
  id: number;
  title: string;
  url: string;
}

const AI_TRACKS: Track[] = [
  {
    id: 1,
    title: "SYNDICATE_PROTOCOL.wav",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "NEURAL_NET_PULSE.ogg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: 3,
    title: "VOID_TRANSMISSION.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = AI_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AI_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AI_TRACKS.length) % AI_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-[var(--color-magenta)] w-full max-w-sm glitch-border bg-black/60 backdrop-blur-sm z-10 screen-tear mt-4 shadow-[0_0_15px_var(--color-cyan)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleTrackEnded}
        className="hidden"
      />
      <div className="flex items-center gap-3 w-full border-b border-[var(--color-cyan)] pb-2 mb-2">
        <Disc className={`w-8 h-8 text-[var(--color-magenta)] ${isPlaying ? 'animate-spin' : ''}`} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-[10px] text-[var(--color-cyan)] uppercase opacity-70">CURRENT_PAYLOAD</span>
          <span 
            className="text-sm font-pixel truncate text-[var(--color-magenta)]" 
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          onClick={handlePrev}
          className="text-[var(--color-cyan)] hover:text-[var(--color-magenta)] hover:scale-110 transition-transform focus:outline-none"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[var(--color-magenta)] hover:text-[var(--color-cyan)] hover:scale-110 transition-transform focus:outline-none"
        >
          {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
        </button>
        <button
          onClick={handleNext}
          className="text-[var(--color-cyan)] hover:text-[var(--color-magenta)] hover:scale-110 transition-transform focus:outline-none"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full mt-4 flex items-center justify-between text-xs opacity-60">
        <span>STATUS: {isPlaying ? 'STREAMING...' : 'HALTED'}</span>
        <span className="animate-pulse">{isPlaying ? '||||||||' : '----'}</span>
      </div>
    </div>
  );
}
