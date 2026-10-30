import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MusicBoxPlayer } from '../../utils/birthdayAudio';

export const MusicPlayer = React.memo(function MusicPlayer({ baseUrl = '/' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const usingSynthRef = useRef(false);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const audioSrc = `${cleanBase}music/happy-birthday.mp3`;

  // Initialize HTML5 Audio and Web Audio fallback synthesizer
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.65;
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

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.src = '';
      synth.stop();
    };
  }, [audioSrc]);

  // Start music
  const startMusic = useCallback(() => {
    if (usingSynthRef.current) {
      if (synthRef.current) {
        synthRef.current.start();
        setIsPlaying(true);
        setShowPrompt(false);
      }
      return;
    }

    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = 0;

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
          // Smooth volume ramp
          let vol = 0;
          const ramp = setInterval(() => {
            vol += 0.05;
            if (vol >= 0.65) {
              audio.volume = 0.65;
              clearInterval(ramp);
            } else {
              audio.volume = vol;
            }
          }, 35);
        })
        .catch((err) => {
          console.warn('Autoplay prevented or error, falling back to MusicBox synth:', err);
          usingSynthRef.current = true;
          if (synthRef.current) {
            synthRef.current.start();
            setIsPlaying(true);
            setShowPrompt(false);
          }
        });
    }
  }, []);

  // Stop / pause music
  const stopMusic = useCallback(() => {
    if (usingSynthRef.current && synthRef.current) {
      synthRef.current.stop();
      setIsPlaying(false);
      return;
    }

    if (!audioRef.current) return;
    const audio = audioRef.current;
    let vol = audio.volume;
    const ramp = setInterval(() => {
      vol -= 0.1;
      if (vol <= 0.05) {
        audio.volume = 0;
        audio.pause();
        clearInterval(ramp);
        setIsPlaying(false);
      } else {
        audio.volume = vol;
      }
    }, 25);
  }, []);

  // Toggle button click
  const handleToggle = useCallback((e) => {
    if (e) e.stopPropagation();
    setUserInteracted(true);
    setShowPrompt(false);

    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  // Autoplay on first touch/click anywhere on page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userInteracted && !isPlaying) {
        startMusic();
        setUserInteracted(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [userInteracted, isPlaying, startMusic]);

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
        title={isPlaying ? 'Tạm dừng nhạc chúc mừng sinh nhật' : 'Bật nhạc chúc mừng sinh nhật'}
        aria-label={isPlaying ? 'Tạm dừng nhạc sinh nhật' : 'Bật nhạc sinh nhật'}
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
          {isPlaying ? 'Nhạc sinh nhật' : 'Bật nhạc'}
        </span>
      </button>

      {/* First-time prompt bubble */}
      {!isPlaying && showPrompt && (
        <div className="music-prompt-tooltip" onClick={handleToggle}>
          <span className="prompt-text">Chạm để bật nhạc sinh nhật 🎵</span>
          <span className="prompt-arrow" />
        </div>
      )}
    </div>
  );
});
