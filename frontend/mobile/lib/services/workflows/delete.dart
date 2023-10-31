import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

Future<ServiceReturn<int>> delete(Workflow old) async {
  try {
    final response = await dio.delete<Workflow>('/workflows/${old.id}');
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
