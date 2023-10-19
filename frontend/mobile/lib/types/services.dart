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

class Area {
  final String id;
  final String name;
  final List<String> serviceScopesNeeded;

  const Area(
      {required this.id,
      required this.name,
      required this.serviceScopesNeeded});
}
