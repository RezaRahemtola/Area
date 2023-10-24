import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Workflow>>> getAll() async {
  try {
    final response = await dio.get<List<dynamic>>('/services');
    return ServiceReturn(
        data: response.data!.map((e) => Workflow.fromJson(e)).toList());
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<Workflow>> getOne(String serviceId) async {
  try {
    final response = await dio.get<Workflow>('/services/$serviceId');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
