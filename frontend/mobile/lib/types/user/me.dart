import 'package:area_mobile/types/user/settings.dart';

class UserMe {
  final String id;

  final bool isAdmin;
  final String email;
  final String createdAt;
  final UserSettings settings;

  UserMe(
      {required this.id,
      required this.isAdmin,
      required this.email,
      required this.createdAt,
      required this.settings});

  factory UserMe.fromJson(Map<String, dynamic> json) {
    final UserMe userMe = UserMe(
        id: json['id'],
        isAdmin: json['isAdmin'],
        email: json['email'],
        createdAt: json['createdAt'],
        settings: UserSettings(
            language: json["settings"]["language"],
            theme: json["settings"]["theme"]));
    return userMe;
  }
}
