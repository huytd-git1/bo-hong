/**
 * Web Audio API Music Box Synthesizer for "Happy Birthday"
 * Crystal clear, dreamy music-box / kalimba bell tone.
 * Used as automatic fallback or standalone romantic chimes.
 */

const NOTE_FREQS = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
};

// Melody with notes, chords, and duration in beats (tempo ~105 bpm)
const MELODY = [
  // Happy Birthday to you
  { note: 'C4', dur: 0.75 },
  { note: 'C4', dur: 0.25 },
  { note: 'D4', dur: 1.0, bass: 'F4' },
  { note: 'C4', dur: 1.0 },
  { note: 'F4', dur: 1.0, bass: 'A4' },
  { note: 'E4', dur: 2.0, bass: 'C4' },

  // Happy Birthday to you
  { note: 'C4', dur: 0.75 },
  { note: 'C4', dur: 0.25 },
  { note: 'D4', dur: 1.0, bass: 'C4' },
  { note: 'C4', dur: 1.0 },
  { note: 'G4', dur: 1.0, bass: 'Bb4' },
  { note: 'F4', dur: 2.0, bass: 'A4' },

  // Happy Birthday dear you
  { note: 'C4', dur: 0.75 },
  { note: 'C4', dur: 0.25 },
  { note: 'C5', dur: 1.0, bass: 'F4' },
  { note: 'A4', dur: 1.0, bass: 'C5' },
  { note: 'F4', dur: 1.0, bass: 'A4' },
  { note: 'E4', dur: 1.0, bass: 'G4' },
  { note: 'D4', dur: 2.0, bass: 'F4' },

  // Happy Birthday to you!
  { note: 'Bb4', dur: 0.75, bass: 'D4' },
  { note: 'Bb4', dur: 0.25 },
  { note: 'A4', dur: 1.0, bass: 'F4' },
  { note: 'F4', dur: 1.0, bass: 'C5' },
  { note: 'G4', dur: 1.0, bass: 'C4' },
  { note: 'F4', dur: 2.8, bass: 'F4' },
];

export class MusicBoxPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timeouts = [];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single bell/music box chime note
  playChime(freq, time, volume = 0.25, pan = 0) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Primary bell tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    // Higher chime harmonic (sparkle)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.76, time); // slightly inharmonic bell overtone

    // Envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, time);
    gain2.gain.linearRampToValueAtTime(volume * 0.35, time + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);

    // Panner
    let dest = ctx.destination;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, time);
      gain.connect(panner);
      gain2.connect(panner);
      panner.connect(dest);
    } else {
      gain.connect(dest);
      gain2.connect(dest);
    }

    osc1.connect(gain);
    osc2.connect(gain2);

    osc1.start(time);
    osc2.start(time);

    osc1.stop(time + 2.0);
    osc2.stop(time + 0.8);
  }

  start() {
    this.init();
    if (!this.ctx) return;
    this.stop();
    this.isPlaying = true;

    const beatDuration = 0.58; // seconds per beat (~103 bpm)
    let currentTime = this.ctx.currentTime + 0.1;

    const scheduleLoop = () => {
      if (!this.isPlaying || !this.ctx) return;

      let loopDuration = 0;
      MELODY.forEach((item, index) => {
        const noteFreq = NOTE_FREQS[item.note];
        const pan = ((index % 5) - 2) * 0.25;

        // Schedule melody note
        const noteTime = currentTime + loopDuration;
        this.playChime(noteFreq, noteTime, 0.26, pan);

        // Schedule bass harmony note if defined
        if (item.bass && NOTE_FREQS[item.bass]) {
          const bassFreq = NOTE_FREQS[item.bass] * 0.5; // lower octave
          this.playChime(bassFreq, noteTime, 0.15, -pan * 0.5);
        }

        loopDuration += item.dur * beatDuration;
      });

      // Repeat loop after 2 seconds pause
      loopDuration += 2.0;
      currentTime += loopDuration;

      const tId = window.setTimeout(() => {
        if (this.isPlaying) scheduleLoop();
      }, (loopDuration - 0.5) * 1000);
      this.timeouts.push(tId);
    };

    scheduleLoop();
  }

  stop() {
    this.isPlaying = false;
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts = [];
  }
}
