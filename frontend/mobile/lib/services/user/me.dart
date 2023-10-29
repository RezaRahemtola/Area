import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/me.dart';

Future<ServiceReturn<UserMe>> getMe() async {
  try {
    final response = await dio.get<Map<String, dynamic>>('/me');

    final responseData = response.data;
    if (responseData != null) {
      return ServiceReturn(data: UserMe.fromJson(responseData));
    } else {
      return const ServiceReturn(error: "API response data is null");
    }
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<void>> updateProfile(
    String email, String language, String theme) async {
  try {
    await dio.patch("/me",
        data: {"email": email, "language": language, "theme": theme});
    return const ServiceReturn(data: null);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
