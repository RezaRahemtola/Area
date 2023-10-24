import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Area>>> getServiceActions(String serviceId) async {
  try {
    final response =
        await dio.get<List<dynamic>>('/services/$serviceId/actions');
    return ServiceReturn(
        data: response.data!.map((e) => Area.fromJson(e)).toList());
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<List<Area>>> getServiceReactions(String serviceId) async {
  try {
    final response =
        await dio.get<List<dynamic>>('/services/$serviceId/reactions');

    if (response.data != null) {
      return ServiceReturn(
        data: response.data!.map((e) => Area.fromJson(e)).toList(),
      );
    } else {
      return const ServiceReturn(error: "Response data is null");
    }
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
