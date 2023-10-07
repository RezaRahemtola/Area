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

class Area {
  final String id;
  final String name;
  final List<String> serviceScopesNeeded;

  const Area(
      {required this.id,
      required this.name,
      required this.serviceScopesNeeded});
}
