import React from 'react';
import { RotateCw, RotateCcw, Mail, Sparkles, Palette, Layers } from 'lucide-react';

export const ControlBar = React.memo(function ControlBar({
  flowerCount,
  setFlowerCount,
  colorTheme,
  setColorTheme,
  autoRotate,
  setAutoRotate,
  onResetView,
  onOpenCard,
}) {
  const colors = [
    { id: 'red', name: 'Đỏ Ruby', hex: '#be123c' },
    { id: 'pink', name: 'Hồng Phấn', hex: '#f472b6' },
    { id: 'white', name: 'Trắng Tinh Khôi', hex: '#f8fafc' },
  ];

  const counts = [
    { value: 9, label: '9 bông', desc: 'Vĩnh cửu' },
    { value: 12, label: '12 bông', desc: 'Trọn vẹn' },
    { value: 20, label: '20 bông', desc: 'Chân thành' },
  ];

  return (
    <nav className="control-bar-wrapper" aria-label="Thanh điều khiển tương tác">
      <div className="control-bar-glass">
        {/* Section 1: Color selection */}
        <div className="control-group">
          <span className="control-group-title">
            <Palette size={14} className="control-icon" /> Màu hoa:
          </span>
          <div className="color-options-row">
            {colors.map((c) => (
              <button
                key={c.id}
                id={`color-btn-${c.id}`}
                className={`color-pill ${colorTheme === c.id ? 'active' : ''}`}
                onClick={() => setColorTheme(c.id)}
                title={`Đổi sang hoa màu ${c.name}`}
              >
                <span
                  className="color-dot"
                  style={{
                    backgroundColor: c.hex,
                    border: c.id === 'white' ? '1px solid #cbd5e1' : 'none',
                  }}
                />
                <span className="color-label">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="control-divider" />

        {/* Section 2: Count selection */}
        <div className="control-group">
          <span className="control-group-title">
            <Layers size={14} className="control-icon" /> Số lượng:
          </span>
          <div className="count-options-row">
            {counts.map((item) => (
              <button
                key={item.value}
                id={`count-btn-${item.value}`}
                className={`count-pill ${flowerCount === item.value ? 'active' : ''}`}
                onClick={() => setFlowerCount(item.value)}
                title={`${item.label} - Ý nghĩa: ${item.desc}`}
              >
                <span className="count-number">{item.value}</span>
                <span className="count-meaning">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="control-divider" />

        {/* Section 3: Action buttons */}
        <div className="control-actions-row">
          <button
            id="toggle-rotate-btn"
            className={`action-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Dừng tự xoay' : 'Bật tự xoay'}
          >
            <RotateCw size={16} className={autoRotate ? 'spinning' : ''} />
            <span className="action-btn-text">
              {autoRotate ? 'Đang xoay' : 'Tự xoay'}
            </span>
          </button>

          <button
            id="reset-camera-btn"
            className="action-btn"
            onClick={onResetView}
            title="Đặt lại góc nhìn mặc định"
          >
            <RotateCcw size={16} />
            <span className="action-btn-text">Đặt lại góc nhìn</span>
          </button>

          <button
            id="open-card-btn"
            className="action-btn action-btn-card"
            onClick={onOpenCard}
            title="Mở thiệp lời chúc"
          >
            <Mail size={16} />
            <span className="action-btn-text">Mở thiệp</span>
            <span className="card-badge-glow" />
          </button>
        </div>
      </div>
    </nav>
  );
});
