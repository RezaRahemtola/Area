// export type WorkflowAction = {
// 	id: string;
// 	parameters: Record<string, never>;
// 	areaId: string;
// 	areaServiceId: string;
// };

// export type WorkflowReaction = WorkflowAction & {
// 	previousAreaId: string;
// };

// export type Workflow = {
// 	id: string;
// 	name: string;
// 	action: WorkflowAction;
// 	reactions: WorkflowReaction[];
// 	active: boolean;
// };

class WorkflowAction {
  final String id;
  final String areaId;
  final String areaServiceId;
  final Map<String, dynamic> parameters;

  const WorkflowAction(
      {required this.id,
      required this.areaId,
      required this.areaServiceId,
      required this.parameters});

  factory WorkflowAction.fromJson(Map<String, dynamic> json) {
    return WorkflowAction(
        id: json['id'],
        areaId: json['areaId'],
        areaServiceId: json['areaServiceId'],
        parameters: json['parameters']);
  }
}

class WorkflowReaction {
  final String id;
  final String areaId;
  final String areaServiceId;
  final Map<String, dynamic> parameters;
  final String previousAreaId;

  const WorkflowReaction(
      {required this.id,
      required this.areaId,
      required this.areaServiceId,
      required this.parameters,
      required this.previousAreaId});

  factory WorkflowReaction.fromJson(Map<String, dynamic> json) {
    return WorkflowReaction(
        id: json['id'],
        areaId: json['areaId'],
        areaServiceId: json['areaServiceId'],
        parameters: json['parameters'],
        previousAreaId: json['previousAreaId']);
  }
}

class Workflow {
  final String id;
  final String name;
  final bool active;
  final WorkflowAction action;
  final List<WorkflowReaction> reactions;

  Workflow({
    required this.id,
    required this.name,
    required this.active,
    required this.action,
    required this.reactions,
  });

  factory Workflow.fromJson(Map<String, dynamic> json) {
    final reactionsData = json['reactions'] as List<dynamic>?;

    return Workflow(
      id: json['id'],
      name: json['name'],
      active: json['active'],
      action: WorkflowAction.fromJson(json['action']),
      reactions: List<WorkflowReaction>.from(
          reactionsData!.map((data) => WorkflowReaction.fromJson(data))),
    );
  }
}
