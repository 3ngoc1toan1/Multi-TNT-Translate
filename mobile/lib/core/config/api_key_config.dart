import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ApiKeyConfig {
  final String id;
  final String name;
  final String description;
  final String icon;
  final List<String> instructions;
  final String getKeyUrl;
  final String pricing;
  final String quota;
  final String documentation;

  ApiKeyConfig({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.instructions,
    required this.getKeyUrl,
    required this.pricing,
    required this.quota,
    required this.documentation,
  });
}

final Map<String, ApiKeyConfig> API_KEY_CONFIGS = {
  'google': ApiKeyConfig(
    id: 'google',
    name: 'Google Translate API',
    description: 'translate.googleapis.com',
    icon: '🔴',
    instructions: [
      'Truy cập: https://console.cloud.google.com/',
      'Tạo project mới → Enable Google Translate API',
      'Tạo Service Account → Download JSON key',
      'Copy toàn bộ nội dung JSON vào đây'
    ],
    getKeyUrl: 'https://console.cloud.google.com/apis/credentials',
    pricing: 'Free: 500K chars/month, Then \$15/1M chars',
    quota: 'Per month',
    documentation: 'https://cloud.google.com/translate/docs',
  ),
  'deepl': ApiKeyConfig(
    id: 'deepl',
    name: 'DeepL API',
    description: 'DeepL Free Tier - 500K chars/month',
    icon: '💎',
    instructions: [
      'Đăng ký tại: https://www.deepl.com/pro/account',
      'Chọn FREE plan (500K characters/month)',
      'Vào Account → Authentication key for DeepL API Free',
      'Copy API key vào đây'
    ],
    getKeyUrl: 'https://www.deepl.com/account/keys',
    pricing: 'Free: 500K chars/month, Pro: \$9.99+/month',
    quota: 'Per month (resets on 1st)',
    documentation: 'https://www.deepl.com/docs',
  ),
  'openai': ApiKeyConfig(
    id: 'openai',
    name: 'OpenAI (GPT-4o mini)',
    description: 'Dùng GPT-4o mini - nhanh & rẻ',
    icon: '🤖',
    instructions: [
      'Đăng ký: https://platform.openai.com/signup',
      'Vào: https://platform.openai.com/account/api-keys',
      'Click "Create new secret key"',
      'Copy key (chỉ hiển thị 1 lần!)',
      'Thêm payment method trong Billing',
      'ĐẶT USAGE LIMIT để an toàn (vd: \$5/month)'
    ],
    getKeyUrl: 'https://platform.openai.com/account/api-keys',
    pricing: 'GPT-4o mini: \$0.15/1M input tokens, \$0.60/1M output',
    quota: 'Per usage (pay-as-you-go)',
    documentation: 'https://platform.openai.com/docs',
  ),
  'chatgpt': ApiKeyConfig(
    id: 'chatgpt',
    name: 'ChatGPT Free',
    description: 'Fallback - Không cần API key',
    icon: '💬',
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
  ),
  'libre': ApiKeyConfig(
    id: 'libre',
    name: 'LibreTranslate',
    description: 'Open-source - Fallback cuối cùng',
    icon: '🌐',
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
  )
};
