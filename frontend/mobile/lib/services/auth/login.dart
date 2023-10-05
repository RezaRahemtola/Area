import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<String>> login(String email, String password) async {
  try {
    final response = await dio
        .post('/auth/login', data: {"email": email, "password": password});
    return ServiceReturn(data: response.data["accessToken"]);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
