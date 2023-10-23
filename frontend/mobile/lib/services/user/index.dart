import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/services/user/me.dart';
import 'package:area_mobile/types/user/me.dart';

class UserService {
  final Future<ServiceReturn<UserMe>> Function() getMe;

  const UserService({
    required this.getMe,
  });
}

const userServices = UserService(
  getMe: getMe,
);
