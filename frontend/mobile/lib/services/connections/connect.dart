import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:dio/dio.dart';

Future<ServiceReturn<String>> connect(
    String serviceId, List<String> scopes) async {
  if (scopes.isEmpty) {
    // Account doesn't need connection
    return const ServiceReturn(data: "");
  }
  try {
    final response = await dio.post('/connections/$serviceId/connect',
        data: {"scopes": scopes.toList()});
    return ServiceReturn(data: response.data["oauthUrl"]);
  } catch (e) {
    final error = e as DioException;
    if (error.response?.statusCode == 409) {
      // Account already exists with the necessary permissions
      return const ServiceReturn(data: null);
    }
    if (error.response?.statusCode == 403) {
      // Account doesn't need connection
      return const ServiceReturn(data: "");
    }
    return ServiceReturn(error: e.toString());
  }
}
