import 'package:area_mobile/types/workflows/workflows.dart';
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
