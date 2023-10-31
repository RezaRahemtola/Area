import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

Future<ServiceReturn<int>> rename(Workflow old, String newName) async {
  try {
    final response = await dio.patch<Workflow>('/workflows/${old.id}', data: {
      "name": newName,
    });
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
