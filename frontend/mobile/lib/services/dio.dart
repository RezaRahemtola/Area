import 'package:area_mobile/services/auth/index.dart';
import 'package:area_mobile/services/services/index.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

final dio = Dio(
  BaseOptions(
      baseUrl: '${dotenv.env['API_URL']}',
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 3),
      followRedirects: true),
)..interceptors.add(InterceptorsWrapper(onRequest: (options, handler) async {
    final token = await storage.getAccessToken();
    options.headers['Authorization'] = 'Bearer $token';
    return handler.next(options);
  }));

class DioServices {
  final AuthService auth;
  final ServicesService services;

  const DioServices({required this.auth, required this.services});
}

const services = DioServices(auth: authService, services: servicesService);
