class Activity {
  String id;
  String type;
  String createdAt;
  ActivityWorkflowArea workflowArea;
  ActivityWorkflow workflow;

  Activity(
      {required this.id,
      required this.type,
      required this.createdAt,
      required this.workflowArea,
      required this.workflow});

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      id: json['id'],
      type: json['type'],
      createdAt: json['createdAt'],
      workflowArea: ActivityWorkflowArea.fromJson(json['workflowArea']),
      workflow: ActivityWorkflow.fromJson(json['workflow']),
    );
  }
}

class ActivityWorkflowArea {
  String id;
  ActivityWorkflowArea area;

  ActivityWorkflowArea({
    required this.id,
    required this.area,
  });

  factory ActivityWorkflowArea.fromJson(Map<String, dynamic> json) {
    return ActivityWorkflowArea(
      id: json['id'],
      area: ActivityWorkflowArea.fromJson(json['area']),
    );
  }
}

class ActivityArea {
  String id;
  String serviceId;

  ActivityArea({required this.id, required this.serviceId});

  factory ActivityArea.fromJson(Map<String, dynamic> json) {
    return ActivityArea(
      id: json['id'],
      serviceId: json['serviceId'],
    );
  }
}

class ActivityWorkflow {
  String id;
  String name;

  ActivityWorkflow({required this.id, required this.name});

  factory ActivityWorkflow.fromJson(Map<String, dynamic> json) {
    return ActivityWorkflow(
      id: json['id'],
      name: json['name'],
    );
  }
}
