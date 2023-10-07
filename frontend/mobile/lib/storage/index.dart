import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Storage {
  static const _storage = FlutterSecureStorage();
  static const accessTokenKey = "accessToken";

  Future<void> setAccessToken(String token) {
    return _storage.write(key: accessTokenKey, value: token);
  }

  Future<String?> getAccessToken() {
    return _storage.read(key: accessTokenKey);
  }

  Future<void> removeAccessToken() {
    return _storage.delete(key: accessTokenKey);
  }
}

final storage = Storage();
