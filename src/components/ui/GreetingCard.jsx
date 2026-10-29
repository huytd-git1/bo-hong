import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Check, Send } from 'lucide-react';

export const GreetingCard = React.memo(function GreetingCard({
  isOpen,
  onClose,
  recipient,
  setRecipient,
  message,
  setMessage,
  sender,
  setSender,
  onSave,
}) {
  const [savedBadge, setSavedBadge] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Trigger gentle romantic confetti when card opens
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a', '#e2e8f0'],
          shapes: ['circle'],
          ticks: 200,
          gravity: 0.8,
          scalar: 0.9,
        });
      } catch (e) {
        // Fallback silently if canvas-confetti is unavailable
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave();
    setSavedBadge(true);
    setIsEditing(false);
    setTimeout(() => setSavedBadge(false), 2400);
  };

  if (!isOpen) return null;

  return (
    <div className="card-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Thiệp chúc mừng">
      <div
        className="card-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="card-close-btn"
          onClick={onClose}
          aria-label="Đóng thiệp"
          id="close-card-button"
        >
          <X size={20} />
        </button>

        {/* Vintage romantic card frame */}
        <div className="card-inner">
          <div className="card-border-ornament">
            {/* Header floral accent */}
            <div className="card-header">
              <span className="card-seal">
                <Heart size={20} fill="#e11d48" color="#e11d48" />
              </span>
              <p className="card-cursive-title">Thân gửi</p>
            </div>

            {/* Content view / edit mode */}
            {isEditing ? (
              <div className="card-edit-form">
                <label className="card-input-label">
                  Tên người nhận:
                  <input
                    type="text"
                    id="recipient-input"
                    className="card-input"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Nhập tên người nhận..."
                    maxLength={60}
                  />
                </label>

                <label className="card-input-label">
                  Lời nhắn gửi:
                  <textarea
                    id="message-input"
                    className="card-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Viết những lời dịu dàng nhất..."
                    maxLength={300}
                  />
                </label>

                <label className="card-input-label">
                  Người gửi:
                  <input
                    type="text"
                    id="sender-input"
                    className="card-input"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Tên của bạn..."
                    maxLength={60}
                  />
                </label>

                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    id="save-card-button"
                  >
                    <Check size={16} /> Lưu lời chúc
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setIsEditing(false)}
                    id="cancel-edit-button"
                  >
                    Xem trước
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-view-content">
                <h3 className="card-recipient-text">
                  Gửi: <span className="highlight-name">{recipient || 'Người tôi thương'}</span>
                </h3>

                <div className="card-message-body">
                  <p className="card-quote">“</p>
                  <p className="card-message-text">{message}</p>
                  <p className="card-quote end">”</p>
                </div>

                <div className="card-signature">
                  <span className="signature-line"></span>
                  <p className="card-sender-text">
                    Thương mến, <br />
                    <strong>{sender || 'Một người thương'}</strong>
                  </p>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(true)}
                    id="edit-card-button"
                  >
                    <Sparkles size={16} /> Chỉnh sửa lời chúc
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={onClose}
                    id="card-done-button"
                  >
                    Ngắm hoa tiếp
                  </button>
                </div>
              </div>
            )}

            {savedBadge && (
              <div className="saved-toast">
                <Check size={14} /> Đã lưu vào trình duyệt!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
