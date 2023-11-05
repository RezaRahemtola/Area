class AreaParameterWithValue {
  final String name;
  final String type;
  final bool required;
  final List<dynamic>? values;
  dynamic value;

  AreaParameterWithValue(
      {required this.name,
      required this.type,
      required this.required,
      this.values,
      this.value});
}

class EditorWorkflowElementArea {
  final String id;
  List<AreaParameterWithValue> parameters;

  EditorWorkflowElementArea({required this.id, required this.parameters});
}

class EditorWorkflowElementService {
  final String id;
  final String imageUrl;

  EditorWorkflowElementService({required this.id, required this.imageUrl});
}

class EditorWorkflowAction {
  final String id;
  EditorWorkflowElementArea? area;
  EditorWorkflowElementService? areaService;

  EditorWorkflowAction({required this.id, this.area, this.areaService});
}

class EditorWorkflowReaction {
  final String id;
  EditorWorkflowElementArea? area;
  EditorWorkflowElementService? areaService;
  final String previousId;

  EditorWorkflowReaction(
      {required this.id,
      this.area,
      this.areaService,
      required this.previousId});
}

class EditorWorkflow {
  final String? id;
  String name;
  bool active;
  EditorWorkflowAction action;
  List<EditorWorkflowReaction> reactions;

  EditorWorkflow({
    this.id,
    required this.name,
    this.active = false,
    required this.action,
    required this.reactions,
  });
}

enum EditorWorkflowStep { service, event, parameters }
