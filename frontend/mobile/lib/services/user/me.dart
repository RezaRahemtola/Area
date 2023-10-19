import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Service>>> getMe() async {
  try {
    final response = await dio.get<List<dynamic>>('/me');
    return ServiceReturn(
        data: response.data!.map((e) => Service.fromJson(e)).toList());
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
