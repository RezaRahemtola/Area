import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:uuid/v4.dart';

getEmptyEditorAction(String id) {
  return EditorWorkflowAction(id: id);
}

getEmptyEditorReaction(String previousId) {
  return EditorWorkflowReaction(
      id: const UuidV4().generate().toString(), previousAreaId: previousId);
}

EditorWorkflow getEmptyWorkflow() {
  var actionId = const UuidV4().generate().toString();

  return EditorWorkflow(
      name: "Untitled workflow",
      action: getEmptyEditorAction(actionId),
      reactions: [getEmptyEditorReaction(actionId)],
      active: false);
}

Map<String, dynamic> convertAreaParamsToWorkflowPayloadParams(
    List<AreaParameterWithValue> parameters) {
  Map<String, dynamic> result = {};
  for (var param in parameters) {
    Object? value = param.value;
    if (param.type == "integer") {
      value = int.parse(param.value as String);
    } else if (param.type == "text-array") {
      if (value == null) {
        value = [];
      } else {
        value = (value as String).split(",");
      }
    }
    result[param.name] = value;
  }
  return result;
}

Future<List<AreaParameterWithValue>>
    workflowParametersToEditorWorkflowParameters(String serviceId,
        String areaId, bool isAction, Map<String, dynamic> parameters) async {
  final areas = isAction
      ? await services.services.getServiceActions(serviceId)
      : await services.services.getServiceReactions(serviceId);
  final area = areas.data!.firstWhere((a) => a.id == areaId);

  return area.parametersFormFlow.map((formFlowParam) {
    var value = parameters[formFlowParam.name];
    if (formFlowParam.type == "text-array") {
      value = (value as List<dynamic>).join(",");
    } else if (formFlowParam.type == "integer") {
      value = value.toString();
    }
    return AreaParameterWithValue(
        name: formFlowParam.name,
        type: formFlowParam.type,
        required: formFlowParam.required,
        values: formFlowParam.values,
        value: value);
  }).toList();
}

Future<EditorWorkflow> convertWorkflowToEditorWorkflow(
    Workflow workflow) async {
  final actionImageUrl =
      await services.services.getOne(workflow.action.areaServiceId);

  return EditorWorkflow(
      id: workflow.id,
      name: workflow.name,
      action: EditorWorkflowAction(
          id: workflow.action.id,
          area: EditorWorkflowElementArea(
              id: workflow.action.areaId,
              parameters: await workflowParametersToEditorWorkflowParameters(
                  workflow.action.areaServiceId,
                  workflow.action.areaId,
                  true,
                  workflow.action.parameters)),
          areaService: EditorWorkflowElementService(
              id: workflow.action.areaServiceId,
              imageUrl: actionImageUrl.data!.imageUrl)),
      reactions: await Future.wait(workflow.reactions.map((baseReaction) async {
        final reactionService =
            await services.services.getOne(baseReaction.areaServiceId);

        return EditorWorkflowReaction(
            id: baseReaction.id,
            area: EditorWorkflowElementArea(
                id: baseReaction.areaId,
                parameters: await workflowParametersToEditorWorkflowParameters(
                    baseReaction.areaServiceId,
                    baseReaction.areaId,
                    false,
                    baseReaction.parameters)),
            areaService: EditorWorkflowElementService(
                id: baseReaction.areaServiceId,
                imageUrl: reactionService.data!.imageUrl),
            previousAreaId: baseReaction.previousAreaId);
      })),
      active: workflow.active);
}

List<T> getSortedReactions<T>(List<dynamic> reactions, String basePreviousId) {
  final sortedReactions = [];
  var previousId = basePreviousId;

  for (var _ in reactions) {
    final reaction =
        reactions.firstWhere((r) => r.previousAreaId == previousId);
    if (reaction == null) break;
    sortedReactions.add(reaction);
    previousId = reaction.id;
  }
  return sortedReactions as List<T>;
}
