import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Storage {
  static const _storage = FlutterSecureStorage();
  static const accessTokenKey = "accessToken";
  static const localeKey = "locale";
  static const themeKey = "theme";

  Future<void> setAccessToken(String token) {
    return _storage.write(key: accessTokenKey, value: token);
  }

  Future<String?> getAccessToken() {
    return _storage.read(key: accessTokenKey);
  }

  Future<void> removeAccessToken() {
    return _storage.delete(key: accessTokenKey);
  }

  Future<void> setLocale(String locale) {
    return _storage.write(key: localeKey, value: locale);
  }

  Future<String?> getLocale() {
    return _storage.read(key: localeKey);
  }

  Future<void> setTheme(String theme) {
    return _storage.write(key: themeKey, value: theme);
  }

  Future<String?> getTheme() {
    return _storage.read(key: themeKey);
  }
}

final storage = Storage();
