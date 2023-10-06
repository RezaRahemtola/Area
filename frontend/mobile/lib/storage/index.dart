import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Storage {
  static const _storage = FlutterSecureStorage();

  Future<void> setAccessToken(String token) {
    return _storage.write(key: "accessToken", value: token);
  }

  Future<String?> getAccessToken() {
    return _storage.read(key: "accessToken");
  }
}

final storage = Storage();
