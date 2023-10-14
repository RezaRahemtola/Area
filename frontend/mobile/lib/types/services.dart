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
  final String name;
  final String imageUrl;
  final List<String> scopes;

  const Service({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.scopes,
  });
}

/* essai pour résoudre l'erreur
class Service {
  String? id;
  String? name;
  String? imageUrl;
  List<String>? scopes;

  Service({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.scopes,
  });

  Service.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    imageUrl = json['active'];
    scopes = json['scopes'];
  }
}
*/

class Area {
  final String id;
  final String name;
  final List<String> serviceScopesNeeded;

  const Area(
      {required this.id,
      required this.name,
      required this.serviceScopesNeeded});
}

class Workflow {
  int? id;
  String? name;
  bool? active;

  Workflow({this.id, this.name, this.active});

  Workflow.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    active = json['active'];
  }
}
