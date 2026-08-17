import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

class TranslationManager {
  constructor() {
    this.services = {
      google: null,
      deepl: null,
      openai: null,
      chatgpt: null,
      libre: null
    };
    this.serviceStatus = {};
  }

  async initializeServices(config) {
    // Initialize each service based on available keys
    if (config.googleKey) {
      this.services.google = new GoogleTranslateService(config.googleKey);
    }
    if (config.deeplKey) {
      this.services.deepl = new DeepLService(config.deeplKey);
    }
    if (config.openaiKey) {
      this.services.openai = new OpenAIService(config.openaiKey);
    }
    // ChatGPT Free and LibreTranslate don't need keys
    this.services.chatgpt = new ChatGPTFreeService();
    this.services.libre = new LibreTranslateService(config.libreUrl);
  }

  async translate(text, sourceLanguage, targetLanguage, preferredService = null) {
    // Check cache
    const cacheKey = `${text}:${sourceLanguage}:${targetLanguage}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let result = null;
    let error = null;

    // Try preferred service first
    if (preferredService && this.services[preferredService]) {
      try {
        result = await this.services[preferredService].translate(
          text,
          sourceLanguage,
          targetLanguage
        );
        cache.set(cacheKey, result);
        return result;
      } catch (e) {
        console.log(`${preferredService} failed:`, e.message);
        error = e;
      }
    }

    // Try services in priority order
    const priority = ['google', 'deepl', 'openai', 'chatgpt', 'libre'];
    for (const service of priority) {
      if (service === preferredService) continue; // Already tried
      if (!this.services[service]) continue;

      try {
        result = await this.services[service].translate(
          text,
          sourceLanguage,
          targetLanguage
        );
        cache.set(cacheKey, result);
        return result;
      } catch (e) {
        console.log(`${service} failed:`, e.message);
        error = e;
      }
    }

    throw new Error(
      `All translation services failed. Last error: ${error?.message}`
    );
  }

  async getServiceStatus() {
    const status = {};
    for (const [name, service] of Object.entries(this.services)) {
      if (!service) {
        status[name] = { available: false };
        continue;
      }

      try {
        status[name] = await service.getStatus();
      } catch (e) {
        status[name] = { available: false, error: e.message };
      }
    }
    return status;
  }
}

class GoogleTranslateService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://translation.googleapis.com/language/translate/v2';
  }

  async translate(text, sourceLanguage, targetLanguage) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          q: text,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          key: this.apiKey
        },
        { timeout: 10000 }
      );

      return {
        translatedText: response.data.data.translations[0].translatedText,
        service: 'google',
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Google Translate API error: ${error.message}`);
    }
  }

  async getStatus() {
    return {
      available: true,
      name: 'Google Translate API',
      quota: 'Pay-as-you-go ($15/1M characters)'
    };
  }
}

class DeepLService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api-free.deepl.com/v1/translate';
  }

  async translate(text, sourceLanguage, targetLanguage) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          text: [text],
          source_lang: sourceLanguage.toUpperCase(),
          target_lang: targetLanguage.toUpperCase(),
          auth_key: this.apiKey
        },
        { timeout: 10000 }
      );

      return {
        translatedText: response.data.translations[0].text,
        service: 'deepl',
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`DeepL API error: ${error.message}`);
    }
  }

  async getStatus() {
    return {
      available: true,
      name: 'DeepL Free',
      quota: '500K characters/month'
    };
  }
}

class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4o-mini'; // Cost-effective model
  }

  async translate(text, sourceLanguage, targetLanguage) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Return only the translated text, nothing else.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`
          },
          timeout: 15000
        }
      );

      return {
        translatedText: response.data.choices[0].message.content.trim(),
        service: 'openai',
        timestamp: new Date(),
        usage: response.data.usage
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async getStatus() {
    return {
      available: true,
      name: 'OpenAI (GPT-4o mini)',
      quota: 'Pay-as-you-go ($0.15/1M input tokens)'
    };
  }
}

class ChatGPTFreeService {
  async translate(text, sourceLanguage, targetLanguage) {
    // This would use browser automation or unofficial API
    // For now, return a placeholder
    console.log('ChatGPT Free translation not implemented');
    throw new Error('ChatGPT Free requires browser automation - not implemented yet');
  }

  async getStatus() {
    return {
      available: false,
      name: 'ChatGPT Free',
      quota: '~50 messages/3 hours',
      note: 'Fallback service'
    };
  }
}

class LibreTranslateService {
  constructor(url = 'https://libretranslate.de') {
    this.apiUrl = url;
  }

  async translate(text, sourceLanguage, targetLanguage) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/translate`,
        {
          q: text,
          source: sourceLanguage,
          target: targetLanguage
        },
        { timeout: 10000 }
      );

      return {
        translatedText: response.data.translatedText,
        service: 'libre',
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`LibreTranslate error: ${error.message}`);
    }
  }

  async getStatus() {
    return {
      available: true,
      name: 'LibreTranslate',
      quota: 'Unlimited (open-source)'
    };
  }
}

export default TranslationManager;
