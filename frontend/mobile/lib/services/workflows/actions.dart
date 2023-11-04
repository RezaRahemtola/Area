import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

Future<ServiceReturn<int>> deleteOne(String workflowId) async {
  try {
    final response = await dio.delete<Workflow>('/workflows/$workflowId');
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<bool>> toggleOne(String workflowId, bool active) async {
  try {
    final response = await dio
        .patch('/workflows/toggle/$workflowId', data: {"newState": active});
    return ServiceReturn(data: response.data["newState"]);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<int>> rename(String workflowId, String newName) async {
  try {
    final response = await dio.patch<Workflow>('/workflows/$workflowId', data: {
      "name": newName,
    });
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
