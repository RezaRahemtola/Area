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
  final List<dynamic>? values;

  const FlowParams(
      {required this.name,
      required this.type,
      required this.required,
      this.values});

  factory FlowParams.fromJson(Map<String, dynamic> json) {
    return FlowParams(
        name: json['name'],
        type: json['type'],
        required: json['required'],
        values: json["values"]);
  }
}

class Area {
  final String id;
  final List<String> serviceScopesNeeded;
  final List<FlowParams> parametersFormFlow;
  final List<String> parametersReturnFlow;
  final String description;

  const Area(
      {required this.id,
      required this.serviceScopesNeeded,
      required this.parametersFormFlow,
      required this.parametersReturnFlow,
      required this.description});

  factory Area.fromJson(Map<String, dynamic> json) {
    final parametersFormFlowData = json['parametersFormFlow'] as List<dynamic>?;

    return Area(
        id: json['id'],
        serviceScopesNeeded: List<String>.from(json['serviceScopesNeeded']),
        parametersFormFlow: List<FlowParams>.from(
            parametersFormFlowData!.map((data) => FlowParams.fromJson(data))),
        parametersReturnFlow: List<String>.from(json["parametersReturnFlow"]),
        description: json['description']);
  }
}
