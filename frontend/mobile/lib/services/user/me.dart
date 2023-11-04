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

Future<ServiceReturn<void>> updateProfile(String language, String theme,
    {String? email}) async {
  try {
    var data = {"language": language, "theme": theme};
    if (email != null) data["email"] = email;

    await dio.patch("/me", data: data);
    return const ServiceReturn(data: null);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
