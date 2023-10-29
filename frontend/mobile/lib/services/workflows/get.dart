import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

Future<ServiceReturn<List<Workflow>>> getAll() async {
  try {
    final response = await dio.get<List<dynamic>>('/workflows');
    print(response.data);
    return ServiceReturn(
        data: response.data!.map((e) => Workflow.fromJson(e)).toList());
  } catch (e) {
    print(e.toString());
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<Workflow>> getOne(String workflowId) async {
  try {
    final response = await dio.get<Workflow>('/workflows/$workflowId');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
