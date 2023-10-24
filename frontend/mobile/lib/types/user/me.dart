class UserMe {
  final String id;
  final bool isAdmin;
  final String email;
  final String createdDate;

  UserMe({
    required this.id,
    required this.isAdmin,
    required this.email,
    required this.createdDate,
  });

  factory UserMe.fromJson(Map<String, dynamic> json) {
    final UserMe userMe = UserMe(
      id: json['id'],
      isAdmin: json['isAdmin'],
      email: json['email'],
      createdDate: json['createdAt'],
    );
    return userMe;
  }
}
