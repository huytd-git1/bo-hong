import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header = React.memo(function Header() {
  return (
    <header className="app-header">
      <div className="header-badge">
        <Sparkles size={13} className="header-sparkle-icon" />
        <span>Gửi trọn yêu thương</span>
      </div>
      <h1 className="header-title">Một chút dịu dàng dành cho bạn</h1>
      <p className="header-hint">
        Kéo để xoay &bull; Cuộn chuột hoặc chụm tay để phóng to/thu nhỏ
      </p>
    </header>
  );
});
