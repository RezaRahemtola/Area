import 'package:area_mobile/services/auth/login.dart';
import 'package:area_mobile/services/auth/register.dart';
import 'package:area_mobile/types/services.dart';

class AuthService {
  final Future<ServiceReturn<String>> Function(String email, String password)
      register;
  final Future<ServiceReturn<String>> Function(String email, String password)
      login;

  const AuthService({required this.register, required this.login});
}

const authService = AuthService(register: register, login: login);
