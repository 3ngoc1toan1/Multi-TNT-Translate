import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ApiKeyManager.css';

const API_KEY_CONFIGS = {
  google: {
    name: 'Google Translate API',
    description: 'translate.googleapis.com',
    instructions: [
      'Truy cập: https://console.cloud.google.com/',
      'Tạo project mới → Enable Google Translate API',
      'Tạo Service Account → Download JSON key',
      'Copy toàn bộ nội dung JSON vào đây'
    ],
    getKeyUrl: 'https://console.cloud.google.com/apis/credentials',
    pricing: 'Free: 500K chars/month, Then $15/1M chars',
    quota: 'Per month',
    documentation: 'https://cloud.google.com/translate/docs',
    icon: '🔤'
  },
  deepl: {
    name: 'DeepL API',
    description: 'DeepL Free Tier - 500K chars/month',
    instructions: [
      'Đăng ký tại: https://www.deepl.com/pro/account',
      'Chọn FREE plan (500K characters/month)',
      'Vào Account → Authentication key for DeepL API Free',
      'Copy API key vào đây'
    ],
    getKeyUrl: 'https://www.deepl.com/account/keys',
    pricing: 'Free: 500K chars/month, Pro: $9.99+/month',
    quota: 'Per month (resets on 1st)',
    documentation: 'https://www.deepl.com/docs',
    icon: '💎'
  },
  openai: {
    name: 'OpenAI (GPT-4o mini)',
    description: 'Dùng GPT-4o mini - nhanh & rẻ',
    instructions: [
      'Đăng ký: https://platform.openai.com/signup',
      'Vào: https://platform.openai.com/account/api-keys',
      'Click "Create new secret key"',
      'Copy key (chỉ hiển thị 1 lần!)',
      'Thêm payment method trong Billing',
      'ĐẶT USAGE LIMIT để an toàn (vd: $5/month)'
    ],
    getKeyUrl: 'https://platform.openai.com/account/api-keys',
    pricing: 'GPT-4o mini: $0.15/1M input tokens, $0.60/1M output',
    quota: 'Per usage (pay-as-you-go)',
    documentation: 'https://platform.openai.com/docs',
    icon: '🤖'
  },
  chatgpt: {
    name: 'ChatGPT Free',
    description: 'Fallback - Không cần API key',
    instructions: [
      'Đăng ký miễn phí: https://chat.openai.com',
      'Ứng dụng sẽ tự dùng khi các API khác hết',
      'Giới hạn: ~50 tin nhắn/3 giờ',
      'Khi hết sẽ chuyển sang LibreTranslate'
    ],
    getKeyUrl: 'https://chat.openai.com',
    pricing: 'Free: Khoảng 50 messages/3 hours',
    quota: 'Per 3 hours',
    documentation: 'https://openai.com/blog/chatgpt',
    icon: '💬'
  },
  libre: {
    name: 'LibreTranslate',
    description: 'Open-source - Fallback cuối cùng',
    instructions: [
      'Không cần API key - Dùng public API',
      'Hoặc chạy offline: docker run -d -p 5000:5000 libretranslate/libretranslate',
      'Config URL: http://localhost:5000',
      'Miễn phí 100%, hỗ trợ 20+ ngôn ngữ'
    ],
    getKeyUrl: 'https://github.com/LibreTranslate/LibreTranslate',
    pricing: 'Free - Hoàn toàn miễn phí',
    quota: 'Unlimited (self-hosted)',
    documentation: 'https://github.com/LibreTranslate/LibreTranslate',
    icon: '🌐'
  }
};

const ApiKeyManager = ({ service, onSave, onTest }) => {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'testing', 'success', 'error'
  const [testMessage, setTestMessage] = useState('');

  const config = API_KEY_CONFIGS[service];

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    // Toast notification here
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(service, apiKey);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleTest = async () => {
    setTestStatus('testing');
    try {
      await onTest(service, apiKey);
      setTestStatus('success');
      setTestMessage('✅ Kết nối thành công!');
      setTimeout(() => setTestStatus(null), 3000);
    } catch (error) {
      setTestStatus('error');
      setTestMessage(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="api-key-manager">
      {/* Header */}
      <div className="akm-header">
        <div className="akm-title">
          <span className="akm-icon">{config.icon}</span>
          <div>
            <h3>{config.name}</h3>
            <p className="akm-desc">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="akm-input-section">
        <label className="akm-label">API Key</label>
        <div className="akm-input-wrapper">
          <input
            type={isVisible ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste API key here..."
            className="akm-input"
          />
          <button
            onClick={handleToggleVisibility}
            className="akm-btn-icon"
            title={isVisible ? 'Hide' : 'Show'}
          >
            {isVisible ? '👁️' : '👁️‍🗨️'}
          </button>
          <button
            onClick={handleCopyKey}
            className="akm-btn-icon"
            title="Copy key"
            disabled={!apiKey}
          >
            📋
          </button>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="akm-instructions">
        <div className="akm-instructions-header">
          <h4>📋 Hướng dẫn lấy API Key</h4>
        </div>
        <ol className="akm-instructions-list">
          {config.instructions.map((instruction, index) => (
            <li key={index}>
              <span className="akm-step-number">{index + 1}</span>
              <span className="akm-step-text">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Pricing & Info Section */}
      <div className="akm-info-grid">
        <div className="akm-info-card">
          <h5>💰 Giá cả</h5>
          <p>{config.pricing}</p>
        </div>
        <div className="akm-info-card">
          <h5>📊 Quota</h5>
          <p>{config.quota}</p>
        </div>
      </div>

      {/* Quick Link */}
      <div className="akm-quick-link">
        <a
          href={config.getKeyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="akm-link-btn"
        >
          🔗 Lấy API Key ngay →
        </a>
        <a
          href={config.documentation}
          target="_blank"
          rel="noopener noreferrer"
          className="akm-link-btn akm-link-secondary"
        >
          📖 Tài liệu →
        </a>
      </div>

      {/* Action Buttons */}
      <div className="akm-actions">
        <button
          onClick={handleTest}
          className={`akm-btn akm-btn-secondary ${
            testStatus === 'testing' ? 'loading' : ''
          }`}
          disabled={!apiKey || testStatus === 'testing'}
        >
          {testStatus === 'testing' ? '⏳ Đang test...' : '🧪 Test kết nối'}
        </button>
        <button
          onClick={handleSave}
          className={`akm-btn akm-btn-primary ${
            isSaved ? 'success' : ''
          }`}
          disabled={!apiKey}
        >
          {isSaved ? '✅ Đã lưu!' : '💾 Lưu'}
        </button>
      </div>

      {/* Status Messages */}
      {testMessage && (
        <div className={`akm-status-message akm-status-${testStatus}`}>
          {testMessage}
        </div>
      )}

      {/* Warning */}
      {apiKey && (
        <div className="akm-warning">
          ⚠️ <strong>Lưu ý bảo mật:</strong> API key của bạn sẽ được lưu
          <strong> LOCAL</strong> trên máy. Không bao giờ chia sẻ key với ai.
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
