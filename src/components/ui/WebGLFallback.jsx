import React from 'react';
import { AlertCircle } from 'lucide-react';

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export const WebGLFallback = React.memo(function WebGLFallback() {
  return (
    <div className="webgl-fallback-container">
      <div className="webgl-fallback-card">
        <AlertCircle size={44} color="#e11d48" />
        <h2>Trình duyệt chưa hỗ trợ WebGL</h2>
        <p>
          Để xem bó hoa 3D tương tác, vui lòng bật hỗ trợ tăng tốc phần cứng (Hardware Acceleration) 
          hoặc sử dụng trình duyệt hiện đại như Google Chrome, Microsoft Edge, Firefox hoặc Safari.
        </p>
      </div>
    </div>
  );
});

export const LoadingScreen = React.memo(function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner-flower">🌹</div>
      <p className="loading-text">Đang kết những bông hoa hồng tươi thắm nhất...</p>
    </div>
  );
});
