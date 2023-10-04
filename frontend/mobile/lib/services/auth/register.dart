import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

Future<ServiceReturn<String>> register(String email, String password) async {
  try {
    final response = await dio.post(
      '/auth/register',
      data: {"email": email, "password": password},
    );
    const FlutterSecureStorage()
        .write(key: 'jwt', value: response.data["accessToken"]);
    return ServiceReturn(data: response.data["accessToken"]);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
