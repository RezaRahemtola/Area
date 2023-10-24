import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/me.dart';

Future<ServiceReturn<UserMe>> getMe() async {
  try {
    final response = await dio.get<Map<String, dynamic>>('/me');

    print("-------------------------------- SUCCESS");
    print(response.data);
    print("-------------------------------- SUCCESS");
    final responseData = response.data;
    if (responseData != null) {
      return ServiceReturn(data: UserMe.fromJson(responseData));
    } else {
      return const ServiceReturn(error: "API response data is null");
    }
  } catch (e) {
    print("-------------------------------- ERROR");
    print(e);
    print("-------------------------------- ERROR");
    return ServiceReturn(error: e.toString());
  }
}
