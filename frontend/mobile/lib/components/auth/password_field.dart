import 'package:flutter/material.dart';

class PasswordField extends StatelessWidget {
  final TextEditingController passwordController;
  final String label;
  final String placeholder;

  const PasswordField(
      {super.key,
      required this.passwordController,
      this.label = "Password",
      this.placeholder = "Please enter your password"});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 25, right: 25, bottom: 25),
      child: TextFormField(
        obscureText: true,
        controller: passwordController,
        decoration: InputDecoration(
          border: const OutlineInputBorder(),
          labelText: label,
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return placeholder;
          }
          return null;
        },
      ),
    );
  }
}
