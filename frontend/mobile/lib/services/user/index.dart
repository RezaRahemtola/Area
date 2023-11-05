import 'package:area_mobile/services/user/me.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/activity.dart';
import 'package:area_mobile/types/user/me.dart';

class UserService {
  final Future<ServiceReturn<UserMe>> Function() getMe;
  final Future<ServiceReturn<void>> Function(String language, String theme,
      {String? email}) updateProfile;
  final Future<ServiceReturn<List<Activity>>> Function(int page) getActivity;

  const UserService({
    required this.getMe,
    required this.getActivity,
    required this.updateProfile,
  });
}

const userServices = UserService(
    getMe: getMe, getActivity: getActivity, updateProfile: updateProfile);
