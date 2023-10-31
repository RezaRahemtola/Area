import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Service>>> getAll([String? has]) async {
  try {
    final query = has != null ? "?has=$has" : "";
    final response = await dio.get<List<dynamic>>('/services$query');
    return ServiceReturn(
        data: response.data!.map((e) => Service.fromJson(e)).toList());
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<Service>> getOne(String serviceId) async {
  try {
    final response = await dio.get<dynamic>('/services/$serviceId');
    return ServiceReturn(data: Service.fromJson(response.data));
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
