class ServiceReturn<T> {
  final T? data;
  final String? error;

  const ServiceReturn({
    this.data,
    this.error,
  });
}
