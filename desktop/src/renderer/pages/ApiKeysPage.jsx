import React, { useState } from 'react';
import ApiKeyManager from '../components/ApiKeyManager';
import './ApiKeysPage.css';

const TRANSLATION_SERVICES = [
  'google',
  'deepl',
  'openai',
  'chatgpt',
  'libre'
];

const ApiKeysPage = () => {
  const [savedKeys, setSavedKeys] = useState({});
  const [activeTab, setActiveTab] = useState('google');

  const handleSaveKey = (service, key) => {
    setSavedKeys(prev => ({
      ...prev,
      [service]: key
    }));
    // Save to local storage
    localStorage.setItem(`api_key_${service}`, key);
  };

  const handleTestKey = async (service, key) => {
    // Mock test - in real app, this would call backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (key.length > 10) {
          resolve({ success: true });
        } else {
          reject(new Error('Key quá ngắn hoặc không hợp lệ'));
        }
      }, 1500);
    });
  };

  return (
    <div className="api-keys-page">
      <div className="akp-container">
        {/* Header */}
        <div className="akp-header">
          <h1>⚙️ Cấu hình API Keys</h1>
          <p className="akp-subtitle">
            Thêm API keys từ các dịch vụ dịch thuật để sử dụng phiên bản cao cấp.
            Ứng dụng sẽ tự động chuyển đổi khi hết quota.
          </p>
        </div>

        {/* Tabs */}
        <div className="akp-tabs">
          {TRANSLATION_SERVICES.map(service => (
            <button
              key={service}
              onClick={() => setActiveTab(service)}
              className={`akp-tab ${activeTab === service ? 'active' : ''}`}
              title={`Configure ${service}`}
            >
              {service === 'google' && '🔤 Google'}
              {service === 'deepl' && '💎 DeepL'}
              {service === 'openai' && '🤖 OpenAI'}
              {service === 'chatgpt' && '💬 ChatGPT'}
              {service === 'libre' && '🌐 LibreTranslate'}
              {savedKeys[service] && <span className="akp-tab-badge">✓</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="akp-content">
          {TRANSLATION_SERVICES.map(service => (
            <div
              key={service}
              className={`akp-tab-content ${
                activeTab === service ? 'active' : ''
              }`}
            >
              <ApiKeyManager
                service={service}
                onSave={handleSaveKey}
                onTest={handleTestKey}
              />
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="akp-info-section">
          <h3>📌 Thông tin quan trọng</h3>
          <div className="akp-info-cards">
            <div className="akp-info-item">
              <h4>🔄 Tự động chuyển đổi</h4>
              <p>
                Khi API hiện tại hết quota/credit, ứng dụng sẽ tự động chuyển sang
                API khác mà bạn đã cấu hình.
              </p>
            </div>
            <div className="akp-info-item">
              <h4>🔐 Bảo mật</h4>
              <p>
                API keys được lưu cục bộ trên máy tính của bạn. Không bao giờ gửi
                lên server hoặc chia sẻ với ai.
              </p>
            </div>
            <div className="akp-info-item">
              <h4>💰 Chi phí</h4>
              <p>
                Bắt đầu với các API miễn phí. Khi có nhu cầu cao, nâng cấp lên
                phiên bản trả phí để có chất lượng tốt hơn.
              </p>
            </div>
            <div className="akp-info-item">
              <h4>⚡ Hiệu suất</h4>
              <p>
                Ứng dụng sẽ chọn API phù hợp nhất dựa vào tốc độ, chất lượng, và
                tình trạng quota của mỗi dịch vụ.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="akp-faq">
          <h3>❓ Câu hỏi thường gặp</h3>
          <details>
            <summary>Tôi phải cấu hình tất cả các API không?</summary>
            <p>
              Không bắt buộc. Tối thiểu bạn nên cấu hình 1-2 API. Cách đây càng
              nhiều API, bạn có càng nhiều backup khi 1 API hết quota.
            </p>
          </details>
          <details>
            <summary>API nào tốt nhất?</summary>
            <p>
              Tùy nhu cầu: Google Translate & DeepL Free cho người dùng bình thường
              (miễn phí). OpenAI (GPT-4o mini) cho chất lượng cao và giá rẻ.
            </p>
          </details>
          <details>
            <summary>Nếu tôi không thêm API key sẽ sao?</summary>
            <p>
              Ứng dụng vẫn dùng được với các API Free (Google, DeepL Free,
              ChatGPT Free). Bạn sẽ không cần thêm API key.
            </p>
          </details>
          <details>
            <summary>Làm sao biết hết quota?</summary>
            <p>
              Ứng dụng sẽ hiển thị cảnh báo khi API hiện tại gần hết quota. Bạn
              có thể xem thống kê sử dụng trong Settings.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysPage;
