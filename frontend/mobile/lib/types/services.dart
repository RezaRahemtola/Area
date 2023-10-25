class ServiceReturn<T> {
  final T? data;
  final String? error;

  const ServiceReturn({
    this.data,
    this.error,
  });
}

class Service {
  final String id;
  final String imageUrl;
  final List<String> scopes;

  Service({
    required this.id,
    required this.imageUrl,
    required this.scopes,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'],
      imageUrl: json['imageUrl'],
      scopes: List<String>.from(json['scopes']),
    );
  }
}

class FlowParams {
  final String name;
  final String type;
  final bool required;

  const FlowParams({
    required this.name,
    required this.type,
    required this.required,
  });

  factory FlowParams.fromJson(Map<String, dynamic> json) {
    return FlowParams(
      name: json['name'],
      type: json['type'],
      required: json['required'],
    );
  }
}

class Area {
  final String id;
  final List<String> serviceScopesNeeded;
  final List<FlowParams> parametersFormFlow;

  const Area(
      {required this.id,
      required this.serviceScopesNeeded,
      required this.parametersFormFlow});

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area(
        id: json['id'],
        serviceScopesNeeded: List<String>.from(json['serviceScopesNeeded']),
        parametersFormFlow: []);
  }
}

class AreaInWorkflow {
  final String id;
  final String areaId;
  final String areaServiceId;

  const AreaInWorkflow({
    required this.id,
    required this.areaId,
    required this.areaServiceId,
  });

  factory AreaInWorkflow.fromJson(Map<String, dynamic> json) {
    return AreaInWorkflow(
      id: json['id'],
      areaId: json['areaId'],
      areaServiceId: json['areaServiceId'],
    );
  }
}

class Workflow {
  final String id;
  final String name;
  final bool active;
  final AreaInWorkflow action;
  final List<AreaInWorkflow> reactions;

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
      action: AreaInWorkflow.fromJson(json['action']),
      reactions: List<AreaInWorkflow>.from(
          reactionsData!.map((data) => AreaInWorkflow.fromJson(data))),
    );
  }
}
