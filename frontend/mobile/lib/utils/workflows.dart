import 'package:area_mobile/types/workflows/editor.dart';
import 'package:uuid/v4.dart';

getEmptyEditorAction(String id) {
  return EditorWorkflowAction(id: id);
}

getEmptyEditorReaction(String previousId) {
  return EditorWorkflowReaction(
      id: const UuidV4().generate().toString(), previousId: previousId);
}

EditorWorkflow getEmptyWorkflow() {
  var actionId = const UuidV4().generate().toString();

  return EditorWorkflow(
      name: "Untitled workflow",
      action: getEmptyEditorAction(actionId),
      reactions: [getEmptyEditorReaction(actionId)],
      active: false);
}

Map<String, Object> convertAreaParamsToWorkflowPayloadParams(
    List<AreaParameterWithValue> parameters) {
  Map<String, Object> result = {};
  for (var param in parameters) {
    Object value = param.value ?? "";
    if (param.type == "integer") {
      value = int.parse(param.value as String);
    }
    result[param.name] = value;
  }
  return result;
}
