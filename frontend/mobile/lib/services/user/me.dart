import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:dio/dio.dart';

Future<ServiceReturn<List<Service>>> getMe(String accessToken) async {
  try {
    final options = Options(headers: {'Authorization': 'Bearer $accessToken'});
    final response = await dio.get<List<dynamic>>('/me', options: options);

    return ServiceReturn(
        data: response.data!.map((e) => Service.fromJson(e)).toList());
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
