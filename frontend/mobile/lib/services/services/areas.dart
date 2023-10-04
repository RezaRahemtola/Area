import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Area>>> getServiceActions(String serviceId) async {
  try {
    final response = await dio.get<List<Area>>('/services/$serviceId/actions');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<List<Area>>> getServiceReactions(String serviceId) async {
  try {
    final response =
        await dio.get<List<Area>>('/services/$serviceId/reactions');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
