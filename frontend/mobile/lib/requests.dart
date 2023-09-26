import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class Request {
  static final Request _instance = Request._internal();
  Request._internal();
  static Request get instance => _instance;

  // add base options
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'https://${dotenv.env['BACKIP']}',
      // you can keep this blank
      headers: {
        'Authorization': 'Bearer noToken',
      },
    ),
  )..interceptors.add(
      // add log interceptors to log the request headers
      LogInterceptor(
        requestHeader: true,
      ),
    );

  // make separate method for updating the token
  void updateSession(String updatedToken) {
    dio.options.headers = {
      'Authorization': 'Bearer $updatedToken',
    };
  }
}
