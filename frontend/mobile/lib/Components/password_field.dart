import 'package:flutter/material.dart';

class PasswordField extends StatelessWidget {
  const PasswordField({
    super.key,
    required this.passwordController,
  });

  final TextEditingController passwordController;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 25, right: 25, bottom: 25),
      child: TextFormField(
        obscureText: true,
        controller: passwordController,
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
          labelText: "Password",
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter your password.';
          }
          return null;
        },
      ),
    );
  }
}
