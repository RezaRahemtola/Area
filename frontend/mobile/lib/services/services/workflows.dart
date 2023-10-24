import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

Future<ServiceReturn<List<Workflow>>> getAllWorkflow() async {
  try {
    final response = await dio.get<List<dynamic>>('/workflows');
    print("Success --------------------------------------------------");
    print(response);
    print("Success --------------------------------------------------");
    return ServiceReturn(
        data: response.data!.map((e) => Workflow.fromJson(e)).toList());
  } catch (e) {
    print("Error ----------------------------------------------------");
    print(e);
    print("Error ----------------------------------------------------");
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<Workflow>> getOneWorkflow(String workflowId) async {
  try {
    final response = await dio.get<Workflow>('/workflows/$workflowId');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
