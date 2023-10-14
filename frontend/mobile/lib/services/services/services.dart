import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Service>>> getAll() async {
  print("oh oh oh oh");
  try {
    print("ah ah ah ah");
    final response = await dio.get<List<Service>>('/services');
    print("print de debug");
    print(response.data);
    return ServiceReturn(data: response.data);
  } catch (e) {
    print("béh béh béh béh");
    print(e);
    print("... ... ... ...");
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<Service>> getOne(String serviceId) async {
  try {
    final response = await dio.get<Service>('/services/$serviceId');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
