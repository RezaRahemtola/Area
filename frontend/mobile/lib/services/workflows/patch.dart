import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:dio/dio.dart';

Future<ServiceReturn<int>> rename(Workflow old, String newName) async {
  print("name is");
  print(newName);
  try {
    final response = await dio.patch<Workflow>('/workflows/${old.id}',
        data: {
          "name": newName,
        },
        options: Options(contentType: Headers.jsonContentType));
    print("status code is :");
    print(response.statusCode);
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    print("error is :");
    print(e.toString());
    return ServiceReturn(error: e.toString());
  }
}
