import 'package:area_mobile/services/user/me.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/me.dart';

class UserService {
  final Future<ServiceReturn<UserMe>> Function() getMe;
  final Future<ServiceReturn<void>> Function(
      String email, String language, String theme) updateProfile;

  const UserService({
    required this.getMe,
    required this.updateProfile,
  });
}

const userServices = UserService(getMe: getMe, updateProfile: updateProfile);
