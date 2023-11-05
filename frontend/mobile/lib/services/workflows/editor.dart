import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:area_mobile/utils/workflows.dart';

Future<ServiceReturn<int>> create(EditorWorkflow workflow) async {
  try {
    final response = await dio.post('/workflows', data: {
      "name": workflow.name,
      "active": workflow.active,
      "action": {
        "id": workflow.action.id,
        "parameters": convertAreaParamsToWorkflowPayloadParams(
            workflow.action.area!.parameters),
        "areaId": workflow.action.area?.id,
        "areaServiceId": workflow.action.areaService?.id,
      },
      "reactions": workflow.reactions
          .map((reaction) => ({
                "id": reaction.id,
                "parameters": convertAreaParamsToWorkflowPayloadParams(
                    reaction.area!.parameters),
                "areaId": reaction.area?.id,
                "areaServiceId": reaction.areaService?.id,
                "previousAreaId": reaction.previousAreaId,
              }))
          .toList(),
    });
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<int>> update(EditorWorkflow workflow) async {
  try {
    final response = await dio.patch('/workflows/${workflow.id}', data: {
      "name": workflow.name,
      "action": {
        "id": workflow.action.id,
        "parameters": convertAreaParamsToWorkflowPayloadParams(
            workflow.action.area!.parameters),
        "areaId": workflow.action.area?.id,
        "areaServiceId": workflow.action.areaService?.id,
      },
      "reactions": workflow.reactions
          .map((reaction) => ({
                "id": reaction.id,
                "parameters": convertAreaParamsToWorkflowPayloadParams(
                    reaction.area!.parameters),
                "areaId": reaction.area?.id,
                "areaServiceId": reaction.areaService?.id,
                "previousAreaId": reaction.previousAreaId,
              }))
          .toList(),
    });
    return ServiceReturn(data: response.statusCode);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
