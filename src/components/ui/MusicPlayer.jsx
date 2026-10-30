import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MusicBoxPlayer } from '../../utils/birthdayAudio';

export const MusicPlayer = React.memo(function MusicPlayer({ baseUrl = '/' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const usingSynthRef = useRef(false);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const audioSrc = `${cleanBase}music/happy-birthday.mp3`;

  // Start music helper
  const startMusic = useCallback(() => {
    if (usingSynthRef.current && synthRef.current) {
      synthRef.current.start();
      setIsPlaying(true);
      setShowPrompt(false);
      return;
    }

    if (!audioRef.current) return;
    const audio = audioRef.current;

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        })
        .catch((err) => {
          // If blocked by browser autoplay policy, wait for user gesture
          if (err.name === 'NotAllowedError') {
            setIsPlaying(false);
            setShowPrompt(true);
          } else {
            console.warn('Audio play error, falling back to MusicBox synth:', err);
            usingSynthRef.current = true;
            if (synthRef.current) {
              synthRef.current.start();
              setIsPlaying(true);
              setShowPrompt(false);
            }
          }
        });
    }
  }, []);

  // Stop / pause music helper
  const stopMusic = useCallback(() => {
    if (usingSynthRef.current && synthRef.current) {
      synthRef.current.stop();
      setIsPlaying(false);
      return;
    }

    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  }, []);

  // Toggle button handler
  const handleToggle = useCallback((e) => {
    if (e) e.stopPropagation();
    setShowPrompt(false);

    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  // Initialize HTML5 Audio and Web Audio fallback synthesizer
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.75;
    audioRef.current = audio;

    const synth = new MusicBoxPlayer();
    synthRef.current = synth;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      if (!usingSynthRef.current) setIsPlaying(false);
    };

    const onError = () => {
      console.warn('MP3 file load failed, switching to MusicBox synthesizer fallback');
      usingSynthRef.current = true;
      if (isPlayingRef.current) {
        synth.start();
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    // 1. Attempt autoplay immediately on load
    const initialPlay = audio.play();
    if (initialPlay !== undefined) {
      initialPlay
        .then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        })
        .catch(() => {
          // Autoplay blocked by browser policy: prompt user and wait for any gesture
          setIsPlaying(false);
          setShowPrompt(true);
        });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.src = '';
      synth.stop();
    };
  }, [audioSrc]);

  // 2. Gesture listener: any touch, click, scroll or key on the page triggers playback immediately
  useEffect(() => {
    const handleGesture = () => {
      if (audioRef.current && audioRef.current.paused && !isPlayingRef.current) {
        startMusic();
      }
    };

    const events = ['pointerdown', 'touchstart', 'click', 'keydown'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { once: true, passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleGesture);
      });
    };
  }, [startMusic]);

  return (
    <div className="music-player-widget">
      {/* Floating note particles when playing */}
      {isPlaying && (
        <div className="music-floating-notes" aria-hidden="true">
          <span className="music-note-item note-1">🎵</span>
          <span className="music-note-item note-2">🎶</span>
          <span className="music-note-item note-3">✨</span>
        </div>
      )}

      {/* Floating action button */}
      <button
        id="birthday-music-btn"
        className={`music-fab-btn ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={handleToggle}
        title={isPlaying ? 'Tạm dừng: Khúc Hát Mừng Sinh Nhật' : 'Bật nhạc: Khúc Hát Mừng Sinh Nhật'}
        aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát khúc hát mừng sinh nhật'}
      >
        <span className="music-fab-icon">
          {isPlaying ? (
            <Volume2 size={20} className="icon-pulse" />
          ) : (
            <VolumeX size={20} />
          )}
        </span>

        {/* Animated equalizer waves */}
        {isPlaying && (
          <span className="equalizer-waves" aria-hidden="true">
            <span className="eq-bar bar-a" />
            <span className="eq-bar bar-b" />
            <span className="eq-bar bar-c" />
          </span>
        )}

        <span className="music-fab-text">
          {isPlaying ? 'Khúc Hát Mừng Sinh Nhật' : 'Bật nhạc sinh nhật'}
        </span>
      </button>

      {/* Invitation tooltip when autoplay was blocked by browser */}
      {!isPlaying && showPrompt && (
        <div className="music-prompt-tooltip" onClick={handleToggle}>
          <span className="prompt-text">Chạm màn hình để phát nhạc sinh nhật 🎵</span>
          <span className="prompt-arrow" />
        </div>
      )}
    </div>
  );
});
