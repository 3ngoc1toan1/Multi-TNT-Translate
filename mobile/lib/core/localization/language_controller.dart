import 'package:get/get.dart';
import 'translations.dart';

class LocalizationService extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
    'vi': {
      'app_name': 'Multi - TNT Translate',
      'welcome': 'Chào mừng',
      'settings': 'Cài đặt',
    },
    'en': {
      'app_name': 'Multi - TNT Translate',
      'welcome': 'Welcome',
      'settings': 'Settings',
    },
    'zh': {
      'app_name': 'Multi - TNT Translate',
      'welcome': '欢迎',
      'settings': '设置',
    },
  };
}

class LanguageController extends GetxController {
  var currentLanguage = 'en'.obs;

  void changeLanguage(String languageCode) {
    currentLanguage.value = languageCode;
    Get.updateLocale(Locale(languageCode));
  }

  String translate(String key) {
    return TranslationService.translate(key, locale: currentLanguage.value);
  }
}
