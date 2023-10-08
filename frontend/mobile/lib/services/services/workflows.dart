import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Workflow>>> getAllWorkflows() async {
  try {
    final response = await dio.get<List<Workflow>>('/workflows');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

// Future<ServiceReturn<Service>> getOne(String serviceId) async {
//   try {
//     final response = await dio.get<Service>('/services/$serviceId');
//     return ServiceReturn(data: response.data);
//   } catch (e) {
//     return ServiceReturn(error: e.toString());
//   }
// }
