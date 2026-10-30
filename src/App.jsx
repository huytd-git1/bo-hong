import React, { useState, useEffect, useCallback, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { Scene } from './components/3d/Scene';
import { isWebGLAvailable, WebGLFallback, LoadingScreen } from './components/ui/WebGLFallback';
import { MusicPlayer } from './components/ui/MusicPlayer';
import './App.css';

const LOCAL_PHOTOS_KEY = 'rose_bouquet_custom_photos_v1';

class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Scene rendering error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="webgl-fallback-container">
          <div className="webgl-fallback-card">
            <h2>Đang tải lại bó hoa...</h2>
            <button
              className="btn btn-primary"
              onClick={() => this.setState({ hasError: false })}
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [hasWebGL, setHasWebGL] = useState(true);

  // Defaults as requested: Pink roses, 20 blooms
  const colorTheme = 'pink';
  const flowerCount = 20;

  // Auto-rotate bouquet
  const [autoRotate, setAutoRotate] = useState(true);

  // Photos of her pinned into the bouquet
  const [showPhotos, setShowPhotos] = useState(false);

  // Cache buster timestamp ensures newly replaced photos on disk load immediately
  const [photoVersion, setPhotoVersion] = useState(() => Date.now());

  // Custom photo data URLs (e.g. from drag & drop)
  const [customPhotos, setCustomPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PHOTOS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Optional enlarged preview when tapping a specific photo
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Accessibility: prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const motionListener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    return () => mediaQuery.removeEventListener('change', motionListener);
  }, []);

  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/';

  // Compute active photo URLs (either user-dropped photos or fresh disk files with cache buster)
  const activePhotoUrls = customPhotos && customPhotos.length >= 4
    ? customPhotos
    : [
        `${baseUrl}photos/photo1.jpg?v=${photoVersion}`,
        `${baseUrl}photos/photo2.jpg?v=${photoVersion}`,
        `${baseUrl}photos/photo3.jpg?v=${photoVersion}`,
        `${baseUrl}photos/photo4.jpg?v=${photoVersion}`,
      ];

  // Drag and drop image files support: user can drag 1-4 photos onto the window to instantly update them
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );

      if (files.length > 0) {
        const readers = files.slice(0, 4).map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readers).then((newUrls) => {
          setCustomPhotos((prev) => {
            const current = prev || [
              `/photos/photo1.jpg?v=${Date.now()}`,
              `/photos/photo2.jpg?v=${Date.now()}`,
              `/photos/photo3.jpg?v=${Date.now()}`,
              `/photos/photo4.jpg?v=${Date.now()}`,
            ];
            const updated = [...current];
            newUrls.forEach((url, i) => {
              updated[i] = url;
            });
            try {
              localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(updated));
            } catch (err) {
              // ignore
            }
            return updated;
          });
          setPhotoVersion(Date.now());
          setShowPhotos(true);
        });
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // When user taps/clicks on the bouquet, toggle the photos blooming up!
  const handleTogglePhotos = useCallback(() => {
    setShowPhotos((prev) => {
      const nextState = !prev;
      if (nextState) {
        // Trigger subtle romantic rose petal / heart confetti
        try {
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f472b6', '#ec4899', '#fda4af', '#fdf2f8'],
            shapes: ['circle'],
            ticks: 180,
            gravity: 0.7,
            scalar: 0.85,
          });
        } catch (e) {
          // ignore
        }
      }
      return nextState;
    });
  }, []);

  const handleUserInteract = useCallback(() => {
    setAutoRotate(false);
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <main className="app-viewport pure-screen">
      {/* Romantic Pink gradient background */}
      <div className={`app-background theme-${colorTheme}`} />

      {/* Subtle warm ambient glow behind the bouquet */}
      <div className="ambient-glow" />

      {/* Birthday Music Player floating widget */}
      <MusicPlayer baseUrl={baseUrl} />

      {/* 3D Scene: Clean, full screen without any text */}
      <SceneErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Scene
            flowerCount={flowerCount}
            colorTheme={colorTheme}
            autoRotate={autoRotate}
            onUserInteract={handleUserInteract}
            reducedMotion={reducedMotion}
            showPhotos={showPhotos}
            onTogglePhotos={handleTogglePhotos}
            onClickPhoto={(url) => setSelectedPhoto(url)}
            photoUrls={activePhotoUrls}
          />
        </Suspense>
      </SceneErrorBoundary>

      {/* Enlarged Photo View when tapping an individual photo (pure image, no text) */}
      {selectedPhoto && (
        <div
          className="photo-lightbox-backdrop"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="photo-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt="Kỷ niệm dịu dàng"
              className="photo-lightbox-img"
            />
          </div>
        </div>
      )}
    </main>
  );
}
