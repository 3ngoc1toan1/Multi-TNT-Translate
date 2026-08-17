# API Keys Setup Guide - Multi TNT Translate

Hướng dẫn chi tiết cách lấy API keys để sử dụng các phiên bản **cao cấp** của các dịch vụ dịch thuật.

## 🎯 Chiến lược Dịch thuật

**Ưu tiên:**
1. **Google Translate API** (Miễn phí cơ bản)
2. **DeepL API Free Tier** (500K characters/tháng)
3. **OpenAI (GPT-4o mini)** (API Key - chất lượng cao)
4. **ChatGPT Free** (Fallback)
5. **LibreTranslate** (Cuối cùng)

**Hệ thống tự động:** Khi hết credit/quota → tự động chuyển sang công cụ tiếp theo

---

## 🔑 Google Translate API

### Lấy API Key

1. **Truy cập Google Cloud Console:**
   - URL: https://console.cloud.google.com/
   - Đăng nhập tài khoản Google

2. **Tạo Project:**
   - Ở góc trên trái, click dropdown "Select a project"
   - Click "NEW PROJECT"
   - Đặt tên: "Multi-TNT-Translate"
   - Click "CREATE"

3. **Enable Google Translate API:**
   - Ở Search bar, tìm "Translate API"
   - Click vào kết quả đầu tiên
   - Click nút "ENABLE"
   - Chờ 1-2 phút để activate

4. **Tạo Service Account Key:**
   - Menu ☰ → APIs & Services → Credentials
   - Click "+ CREATE CREDENTIALS" → "Service Account"
   - Điền thông tin:
     - Service account name: `multi-tnt-translate`
     - Click "CREATE AND CONTINUE"
   - Bỏ qua phần grant roles (click "CONTINUE")
   - Click "DONE"

5. **Tạo JSON Key:**
   - Trong danh sách Service Accounts, click vào account vừa tạo
   - Tab "KEYS"
   - "Add key" → "Create new key"
   - Chọn "JSON"
   - File sẽ download tự động

6. **Sao chép API Key:**
   - Mở file JSON vừa download
   - Copy toàn bộ nội dung
   - Dán vào ứng dụng trong phần "Google Translate"

**Chi phí:**
- Miễn phí: 500,000 ký tự/tháng
- Sau đó: $15 per 1 triệu ký tự (rẻ nhất)
- **Lưu ý:** Bạn cần thêm billing account, nhưng có thể đặt budget limit

**📍 Đường dẫn trực tiếp:**
- Tạo project: https://console.cloud.google.com/projectcreate
- Enable API: https://console.cloud.google.com/apis/library/translate.googleapis.com
- Lấy credentials: https://console.cloud.google.com/apis/credentials

---

## 💎 DeepL API (Free Tier)

### Lấy API Key

1. **Truy cập DeepL:**
   - URL: https://www.deepl.com/pro/account
   - Nếu chưa có tài khoản, click "Sign up"

2. **Tạo Tài khoản (Free):**
   - Nhập email
   - Tạo mật khẩu
   - Xác thực email
   - **Chọn FREE plan (500,000 characters/tháng)**

3. **Lấy API Key:**
   - Sau khi đăng nhập, vào: https://www.deepl.com/account/keys
   - Scroll xuống "Authentication key for DeepL API Free"
   - Click icon copy hoặc chọn & copy toàn bộ key

4. **Dán vào ứng dụng:**
   - Ứng dụng → Settings → API Keys → DeepL
   - Paste key vào
   - Click "Save & Test"

**Chi phí:**
- **FREE Plan:** 500,000 ký tự/tháng (đủ cho hầu hết users)
- Pro Plan: $9.99/tháng (3 triệu characters)
- Tính theo ký tự thực sử dụng

**Khi hết Free Tier:**
- Ứng dụng sẽ tự động chuyển sang Google Translate hoặc OpenAI
- Tháng sau, quota DeepL reset → quay lại dùng DeepL

**📍 Đường dẫn trực tiếp:**
- Đăng ký: https://www.deepl.com/pro/account
- Lấy API Key: https://www.deepl.com/account/keys

---

## 🤖 OpenAI (GPT-4o mini - Khuyến nghị)

### Tại sao chọn OpenAI?

✅ **GPT-4o mini:** Nhanh, rẻ, chất lượng tốt
✅ **GPT-4o:** Chất lượng cao nhất (nếu muốn)
✅ Chi phí thấp: ~$0.15 per 1 triệu input tokens
✅ Dịch thông minh, hiểu ngữ cảnh tốt

### Lấy API Key

1. **Tạo tài khoản OpenAI:**
   - URL: https://platform.openai.com/signup
   - Đăng ký với email
   - Xác thực email

2. **Đến trang API Keys:**
   - URL: https://platform.openai.com/account/api-keys
   - Click "+ Create new secret key"
   - Đặt tên (vd: "Multi-TNT-Translate")
   - Click "Create secret key"

3. **Copy API Key:**
   - ⚠️ **QUAN TRỌNG:** Key chỉ hiển thị 1 lần!
   - Copy ngay, lưu đâu đó an toàn
   - Click "Done"

4. **Thêm Payment Method:**
   - Menu → Billing → Overview
   - "Set up paid account"
   - Thêm credit card hoặc tài khoản thanh toán
   - **Đặt usage limit để an toàn** (vd: $5/tháng)

5. **Dán vào ứng dụng:**
   - Ứng dụng → Settings → API Keys → OpenAI
   - Paste key
   - Chọn model: "GPT-4o mini" (rẻ nhất) hoặc "GPT-4o" (tốt nhất)
   - Click "Save & Test"

**Chi phí (GPT-4o mini):**
```
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

Ví dụ:
- Dịch 1 trang A4 (~2000 tokens): ~$0.001
- Dịch 100 trang: ~$0.10
- Dịch 1000 trang: ~$1.00
```

**Chi phí (GPT-4o - chất lượng cao):**
```
- Input: $5 per 1M tokens
- Output: $15 per 1M tokens
- Đắt hơn nhưng chất lượng tốt hơn
```

**Khuyến nghị:** Bắt đầu với GPT-4o mini, nếu muốn chất lượng cao hơn → GPT-4o

**Khi hết credit:**
- Nạp thêm tiền hoặc
- Ứng dụng tự động chuyển sang DeepL/Google

**📍 Đường dẫn trực tiếp:**
- Đăng ký: https://platform.openai.com/signup
- Lấy API Key: https://platform.openai.com/account/api-keys
- Billing: https://platform.openai.com/account/billing/overview
- Đặt limit: https://platform.openai.com/account/billing/limits

---

## 💬 ChatGPT Free (Fallback)

### Khi nào dùng?

- Khi tất cả API trên đã hết credit/quota
- Miễn phí nhưng giới hạn tin nhắn (khoảng 50/ngày)
- Không cần API key

### Cách setup:

1. **Tạo tài khoản ChatGPT Free:**
   - URL: https://chat.openai.com
   - Đăng ký hoặc đăng nhập

2. **Ứng dụng tự động dùng:**
   - Không cần config gì
   - Khi tất cả API khác hết → tự động chuyển sang ChatGPT Free

3. **Giới hạn:**
   - ~50 tin nhắn/3 giờ
   - Chỉ dùng khi cần fallback

**📍 Truy cập:** https://chat.openai.com

---

## 📚 LibreTranslate (Cuối cùng)

### Khi nào dùng?

- Fallback cuối cùng
- Hoàn toàn miễn phí
- Công khai API, không cần key

### Cách dùng:

**Option 1: Dùng Public API (Khuyến nghị)**
- Không cần config
- Ứng dụng sẽ tự dùng khi cần
- Tốc độ có thể chậm

**Option 2: Self-hosted (Advanced)**
```bash
# Cài Docker
# Chạy lệnh:
docker run -d -p 5000:5000 libretranslate/libretranslate

# Config ứng dụng:
# API URL: http://localhost:5000
```

**Ưu điểm Self-hosted:**
- Hoàn toàn offline
- Không giới hạn quota
- Tốc độ nhanh
- Riêng tư 100%

**📍 Tìm hiểu thêm:** https://github.com/LibreTranslate/LibreTranslate

---

## ⚙️ Cách cấu hình trong ứng dụng

### Desktop (Windows/Mac)

1. **Mở ứng dụng**
2. **Menu Settings → API Keys**
3. **Thêm từng API:**

```
┌─────────────────────────────────────┐
│  🔑 GOOGLE TRANSLATE                │
├─────────────────────────────────────┤
│  API Key: [________________]  [Copy] │
│                                       │
│  📝 Hướng dẫn:                      │
│  1. Truy cập console.cloud.google.com│
│  2. Tạo Service Account              │
│  3. Download JSON key               │
│  4. Copy nội dung JSON vào đây      │
│                                       │
│  🔗 Lấy Key: https://goo.gl/[...]   │
│                                       │
│  [Test Connection] [Save]             │
└─────────────────────────────────────┘
```

4. **Làm tương tự cho DeepL, OpenAI, LibreTranslate**

### Mobile (iOS/Android)

1. **Mở ứng dụng**
2. **Menu Settings → Translation Services**
3. **Tap từng service để thêm key**
4. **Paste key → Save**

---

## 📊 Bảng so sánh

| Dịch vụ | API Key | Miễn phí | Chi phí | Chất lượng | Tốc độ |
|--------|---------|---------|---------|----------|--------|
| **Google Translate** | ✅ | 500K chars | $15/1M | ⭐⭐⭐ | ⚡⚡⚡ |
| **DeepL** | ✅ | 500K chars | $10/tháng | ⭐⭐⭐⭐ | ⚡⚡⚡ |
| **OpenAI (GPT-4o mini)** | ✅ | Không | $0.15/1M tokens | ⭐⭐⭐⭐ | ⚡⚡ |
| **ChatGPT Free** | ❌ | Có (50/ngày) | Không | ⭐⭐⭐⭐ | ⚡ |
| **LibreTranslate** | ❌ | Có | Không | ⭐⭐⭐ | ⚡⚡ |

---

## 💡 Chiến lược tiết kiệm chi phí

### Cho người dùng bình thường:
```
✅ Google Translate (miễn phí)
✅ DeepL Free (500K chars/tháng)
✅ ChatGPT Free (fallback)
✅ LibreTranslate (cuối cùng)

💰 Tổng chi phí: $0/tháng
```

### Cho người dùng nặng (1000+ trang/tháng):
```
✅ DeepL API ($9.99/tháng - 3M chars)
✅ Google Translate API (khi hết DeepL)
✅ OpenAI (GPT-4o mini - ~$1-5/tháng)
✅ ChatGPT Free (fallback)

💰 Tổng chi phí: $10-15/tháng
```

### Cho chất lượng cao:
```
✅ OpenAI (GPT-4o - $5-15/tháng)
✅ DeepL API ($9.99/tháng)
✅ Google Translate (backup)

💰 Tổng chi phí: $15-25/tháng
```

---

## 🚨 Lưu ý bảo mật

⚠️ **QUAN TRỌNG:**
- Không chia sẻ API keys với ai
- Không đăng keys lên GitHub public
- Nếu key bị leak → xóa ngay trên platform
- Ứng dụng lưu keys **local** trên máy bạn, không đâu

**Nếu API key bị leak:**
1. Xóa key trên platform ngay
2. Tạo key mới
3. Update trong ứng dụng

---

## ❓ FAQ

**Q: Nên bắt đầu từ đâu?**
A: 
1. Google Translate (miễn phí)
2. DeepL Free (500K/tháng)
3. ChatGPT Free (fallback)

**Q: Có cần tất cả các keys?**
A: Không bắt buộc. Tối thiểu cần 1-2. Nhiều keys = có backup khi 1 hết quota.

**Q: OpenAI rẻ không?**
A: Có! GPT-4o mini rẻ nhất (~$0.15/1M tokens). Rẻ hơn Google.

**Q: Có cách dịch offline?**
A: Có, dùng LibreTranslate self-hosted (Docker).

**Q: Tháng sau quota reset à?**
A: Có, tất cả quota/credit reset đầu tháng.

**Q: Làm sao biết hết quota?**
A: Ứng dụng sẽ báo lỗi → tự động chuyển sang API khác.

---

## 🔗 Tóm tắt Link

| Dịch vụ | Link |
|--------|------|
| Google Cloud | https://console.cloud.google.com/ |
| DeepL API Key | https://www.deepl.com/account/keys |
| OpenAI API Key | https://platform.openai.com/account/api-keys |
| OpenAI Billing | https://platform.openai.com/account/billing/overview |
| ChatGPT Free | https://chat.openai.com |
| LibreTranslate | https://github.com/LibreTranslate/LibreTranslate |

---

**Cần giúp? Tạo issue:** https://github.com/3ngoc1toan1/Multi-TNT-Translate/issues
