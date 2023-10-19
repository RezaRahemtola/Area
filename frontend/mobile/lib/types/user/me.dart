class UserMe {
  final String id;
  final bool isVerified;
  final String email;
  final String avatar;
  final String token;

  UserMe({
    required this.id,
    required this.isVerified,
    required this.email,
    required this.avatar,
    required this.token,
  });

  factory UserMe.fromJson(Map<String, dynamic> json) {
    return UserMe(
      id: json['id'],
      isVerified: json['isVerified'],
      email: json['email'],
      avatar: json['avatar'],
      token: json['token'],
    );
  }
}
