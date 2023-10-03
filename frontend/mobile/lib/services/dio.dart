import 'package:area_mobile/services/auth/index.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

final dio = Dio(BaseOptions(
    baseUrl: '${dotenv.env['API_URL']}',
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
    followRedirects: true));

class DioServices {
  final AuthService auth;

  const DioServices({required this.auth});
}

const services = DioServices(auth: authService);
