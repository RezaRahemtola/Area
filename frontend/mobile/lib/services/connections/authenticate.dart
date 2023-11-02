import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:dio/dio.dart';

Future<ServiceReturn<String>> authenticate(String serviceId) async {
  try {
    final response = await dio.get('/connections/$serviceId/authenticate');
    return ServiceReturn(data: response.data["oauthUrl"]);
  } catch (e) {
    print((e as DioException).response!.data);
    return ServiceReturn(error: e.toString());
  }
}
