import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/services/user/me.dart';

class UserService {
  final Future<ServiceReturn<List<Service>>> Function() getMe;

  const UserService({
    required this.getMe,
  });
}

const servicesService = UserService(
  getMe: getMe,
);
